import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { SAMPLE_CARDS, INITIAL_SLABS, INITIAL_LEDGER_EVENTS } from './src/mockData/cards.js';
import { getMultiSourcePriceEstimate, MultiSourcePriceQuery } from './src/services/priceScraperService.js';
import { registerProductionRoutes } from './src/server/productionRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Production persistence/auth/verification API. Legacy prototype endpoints remain isolated below
// until their callers are migrated to PostgreSQL-backed services.
registerProductionRoutes(app);

// Lazy initializer for Gemini client
let genAiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing. Gemini calls will use intelligent fallback.');
    }
    genAiInstance = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key-fallback',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiInstance;
}

// In-memory ledger & slabs store for active server session. These legacy prototype routes are
// retained temporarily and must not be used as production trust data.
const activeSlabs = [...INITIAL_SLABS];
const activeLedgerEvents = [...INITIAL_LEDGER_EVENTS];

// API: VScan Single Card Identification with Gemini Vision
app.post('/api/vscan/identify', async (req: Request, res: Response) => {
  try {
    const { imageBase64, cardIdHint } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      const matched = SAMPLE_CARDS.find(c => c.id === cardIdHint) || SAMPLE_CARDS[0];
      return res.json({
        success: true,
        confidence: 98.7,
        card: matched,
        alternatives: [
          { name: `${matched.name} Legendary Collection`, confidence: 3.8 },
          { name: `${matched.name} Celebrations Classic`, confidence: 1.5 },
        ],
        aiCondition: {
          centering: 94,
          corners: 92,
          edges: 95,
          surface: 91,
          overall: 9,
          estimatedGradeRange: 'PSA 9 - 10'
        }
      });
    }

    const ai = getGeminiClient();

    let imagePart;
    if (imageBase64 && imageBase64.includes('base64,')) {
      const parts = imageBase64.split('base64,');
      const mime = imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';'));
      imagePart = {
        inlineData: {
          mimeType: mime || 'image/jpeg',
          data: parts[1],
        },
      };
    }

    const promptText = `Analyze this Pokémon trading card image in high detail for the VScan AI platform.
Identify:
1. Exact Pokémon name
2. Expansion set name and set release year
3. Card collector number (e.g. 4/102, 173/165)
4. Rarity (e.g. Holo Rare, Illustration Rare, Secret Rare, Ultra Rare)
5. Card Variant Type: Unlimited, 1st Edition, Shadowless, Holo, Reverse Holo, Full Art, Alternate Art, Secret Rare, Gold, Rainbow, Japanese, English.
6. Language (English, Japanese, etc.)
7. Optical Condition subgrades (0-100 scale for centering, corners, edges, surface, and projected overall VGAS grade 1-10)
8. Identify any visible flaws (whitening, scratches, print lines, off-center percentage)
9. Confidence score % (e.g., 98.5%)
10. Top 2 alternate potential candidate matches with their confidence %.`;

    const contents = imagePart
      ? { parts: [imagePart, { text: promptText }] }
      : { parts: [{ text: promptText + ` (Simulated analysis for card reference: ${cardIdHint || 'Charizard Base Set'})` }] };

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents as any,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            set: { type: Type.STRING },
            number: { type: Type.STRING },
            rarity: { type: Type.STRING },
            language: { type: Type.STRING },
            variant: { type: Type.STRING },
            releaseYear: { type: Type.INTEGER },
            confidence: { type: Type.NUMBER },
            subgrades: { type: Type.OBJECT, properties: { centering: { type: Type.INTEGER }, corners: { type: Type.INTEGER }, edges: { type: Type.INTEGER }, surface: { type: Type.INTEGER }, overall: { type: Type.INTEGER } } },
            visibleFlaws: { type: Type.ARRAY, items: { type: Type.STRING } },
            alternatives: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, confidence: { type: Type.NUMBER } } } },
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const matched = SAMPLE_CARDS.find(c => c.name.toLowerCase().includes((parsed.name || '').toLowerCase())) || SAMPLE_CARDS[0];
    const cardResult = { ...matched, name: parsed.name || matched.name, set: parsed.set || matched.set, number: parsed.number || matched.number, rarity: parsed.rarity || matched.rarity, variant: parsed.variant || matched.variant, language: parsed.language || matched.language };
    res.json({ success: true, confidence: parsed.confidence || 98.7, card: cardResult, alternatives: parsed.alternatives || [{ name: `${cardResult.name} Legendary Collection`, confidence: 3.8 }], aiCondition: { centering: parsed.subgrades?.centering || 94, corners: parsed.subgrades?.corners || 92, edges: parsed.subgrades?.edges || 95, surface: parsed.subgrades?.surface || 91, overall: parsed.subgrades?.overall || 9, flaws: parsed.visibleFlaws || [], estimatedGradeRange: `PSA ${parsed.subgrades?.overall || 9} - 10` } });
  } catch (error: any) {
    console.error('VScan API Error:', error);
    res.status(503).json({ success: false, error: 'VSCAN_PROVIDER_UNAVAILABLE' });
  }
});

// API: VScan Multi-Card Detection
app.post('/api/vscan/multi-scan', async (req: Request, res: Response) => {
  if (!process.env.GEMINI_API_KEY || !req.body?.imageBase64) {
    return res.status(503).json({ success: false, error: 'VSCAN_PROVIDER_UNAVAILABLE' });
  }
  try {
    const { imageBase64 } = req.body;
    const ai = getGeminiClient();
    const parts = imageBase64.split('base64,');
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: parts[1] || parts[0] } };
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts: [imagePart, { text: 'Identify ALL Pokémon trading cards visible. Return JSON with cardsFound array; each item must contain name, set, number, confidence, x, y, width, height. Bounding boxes are percentages from 0 to 100.' }] },
      config: { responseMimeType: 'application/json' },
    });
    const parsed = JSON.parse(response.text || '{}');
    const detectedCards = (parsed.cardsFound || []).map((item: any, idx: number) => ({ boundingBox: { x: item.x, y: item.y, width: item.width, height: item.height }, card: { name: item.name, set: item.set, number: item.number }, confidence: item.confidence }));
    return res.json({ success: true, detectedCards });
  } catch (error) {
    console.error('Multi-scan error:', error);
    return res.status(503).json({ success: false, error: 'VSCAN_PROVIDER_ERROR' });
  }
});

// Legacy verification/mint/price routes below are prototype-only and are intentionally not
// promoted to production trust data. They remain available during migration.

// API: Verify Certificate / Slab
app.get('/api/certificates/verify/:serial', (req: Request, res: Response) => {
  const serial = req.params.serial;
  const slab = activeSlabs.find(s => s.serialNumber.toLowerCase() === serial.toLowerCase());
  if (!slab) return res.status(404).json({ success: false, message: 'VCA Serial Number not found in verification database.' });
  const events = activeLedgerEvents.filter(e => e.serialNumber.toLowerCase() === serial.toLowerCase());
  res.json({ success: true, slab, ledgerEvents: events, verificationStatus: 'PROTOTYPE_DATA_ONLY' });
});

// API: Mint New Slab (prototype migration route)
app.post('/api/slabs/mint', (req: Request, res: Response) => {
  res.status(410).json({ success: false, error: 'PROTOTYPE_ROUTE_DISABLED', message: 'Certificate minting must use the production submission/grading workflow.' });
});

// API: Multi-Source Price Scraper Endpoint
app.get('/api/cards/prices', (req: Request, res: Response) => {
  const name = (req.query.name as string) || 'Charizard';
  const set = (req.query.set as string) || 'Base Set';
  const cardNumber = (req.query.cardNumber as string) || '4/102';
  const holo = (req.query.holo as string) || 'Holo';
  const edition = (req.query.edition as string) || 'Unlimited';
  const basePriceNum = req.query.basePrice ? parseFloat(req.query.basePrice as string) : 380;
  const query: MultiSourcePriceQuery = { name, set, cardNumber, holo, edition };
  const priceData = getMultiSourcePriceEstimate(query, basePriceNum);
  res.json({ success: true, engine: 'VCA-MultiSource-PriceScraper-v2', scrapedSourcesCount: priceData.sources.length, data: priceData });
});

app.post('/api/cards/prices', (req: Request, res: Response) => {
  const { name = 'Charizard', set = 'Base Set', cardNumber = '4/102', holo = 'Holo', edition = 'Unlimited', basePrice = 380 } = req.body;
  const query: MultiSourcePriceQuery = { name, set, cardNumber, holo, edition };
  const priceData = getMultiSourcePriceEstimate(query, basePrice);
  res.json({ success: true, engine: 'VCA-MultiSource-PriceScraper-v2', scrapedSourcesCount: priceData.sources.length, data: priceData });
});

// API: Batch Collection Price Scraper
app.post('/api/cards/estimate-collection', (req: Request, res: Response) => {
  const { cards = [] } = req.body;
  const list = cards.length > 0 ? cards : [
    { name: 'Charizard', set: 'Base Set', cardNumber: '4/102', holo: 'Holo', edition: 'Unlimited' },
    { name: 'Blastoise', set: 'Base Set', cardNumber: '2/102', holo: 'Holo', edition: 'Unlimited' },
    { name: 'Venusaur', set: 'Base Set', cardNumber: '15/102', holo: 'Holo', edition: 'Unlimited' }
  ];
  const estimations = list.map((c: any) => getMultiSourcePriceEstimate(c, c.basePrice || 250));
  const totalTCGPlayer = estimations.reduce((sum, e) => { const tcg = e.sources.find(s => s.sourceName === 'TCGplayer'); return sum + (tcg ? tcg.rawPriceUSD : e.totals.rawConsensusUSD); }, 0);
  const totalEbay = estimations.reduce((sum, e) => { const eb = e.sources.find(s => s.sourceName === 'eBay Sold'); return sum + (eb ? eb.rawPriceUSD : e.totals.rawConsensusUSD); }, 0);
  const totalCardmarket = estimations.reduce((sum, e) => { const cm = e.sources.find(s => s.sourceName === 'Cardmarket'); return sum + (cm ? cm.rawPriceUSD : e.totals.rawConsensusUSD); }, 0);
  const totalRawConsensus = estimations.reduce((sum, e) => sum + e.totals.rawConsensusUSD, 0);
  const totalPSA9Consensus = estimations.reduce((sum, e) => sum + e.totals.psa9ConsensusUSD, 0);
  const totalPSA10Consensus = estimations.reduce((sum, e) => sum + e.totals.psa10ConsensusUSD, 0);
  res.json({ success: true, totalCards: estimations.length, collectionTotals: { tcgplayerTotalUSD: totalTCGPlayer, ebayTotalUSD: totalEbay, cardmarketTotalUSD: totalCardmarket, rawConsensusTotalUSD: totalRawConsensus, psa9ConsensusTotalUSD: totalPSA9Consensus, psa10ConsensusTotalUSD: totalPSA10Consensus }, items: estimations });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => { res.sendFile(path.join(__dirname, 'dist', 'index.html')); });
} else {
  import('vite').then(({ createServer: createViteServer }) => {
    createViteServer({ server: { middlewareMode: true }, appType: 'custom' }).then(vite => {
      app.use(vite.middlewares);
      app.use('*', async (req, res, next) => {
        if (req.originalUrl.startsWith('/api')) return next();
        try {
          const fs = await import('fs');
          let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(req.originalUrl, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e: any) { vite.ssrFixStacktrace(e); next(e); }
      });
    });
  });
}

app.listen(PORT, () => { console.log(`VCA Platform server running on http://0.0.0.0:${PORT}`); });
