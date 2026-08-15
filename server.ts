import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { SAMPLE_CARDS, INITIAL_SLABS, INITIAL_LEDGER_EVENTS } from './src/mockData/cards.js';
import { getMultiSourcePriceEstimate, MultiSourcePriceQuery } from './src/services/priceScraperService.js';
import { registerProductionRoutes } from './src/server/productionRoutes.js';
import { registerVerificationRoutes } from './src/server/verificationRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Production persistence/auth/grading/verification API. Legacy prototype endpoints remain isolated below
// until their callers are migrated to PostgreSQL-backed services.
registerProductionRoutes(app);
registerVerificationRoutes(app);

let genAiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) console.warn('GEMINI_API_KEY is missing. VScan calls are unavailable.');
    genAiInstance = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-fallback', httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
  }
  return genAiInstance;
}

const activeSlabs = [...INITIAL_SLABS];
const activeLedgerEvents = [...INITIAL_LEDGER_EVENTS];

app.post('/api/vscan/identify', async (req: Request, res: Response) => {
  try {
    const { imageBase64, cardIdHint } = req.body;
    if (!process.env.GEMINI_API_KEY || !imageBase64) return res.status(503).json({ success: false, error: 'VSCAN_PROVIDER_UNAVAILABLE' });
    const ai = getGeminiClient();
    let imagePart: any;
    if (imageBase64.includes('base64,')) {
      const parts = imageBase64.split('base64,');
      const mime = imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';'));
      imagePart = { inlineData: { mimeType: mime || 'image/jpeg', data: parts[1] } };
    }
    const promptText = `Analyze this Pokémon trading card image in high detail for VScan AI. Identify exact Pokémon name, expansion set and release year, collector number, rarity, variant, language, visible condition indicators, visible flaws, and confidence. Return only structured JSON. Do not invent facts when the image is insufficient.`;
    const response = await ai.models.generateContent({ model: 'gemini-3.6-flash', contents: imagePart ? { parts: [imagePart, { text: promptText }] } : { parts: [{ text: promptText }] }, config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, set: { type: Type.STRING }, number: { type: Type.STRING }, rarity: { type: Type.STRING }, language: { type: Type.STRING }, variant: { type: Type.STRING }, releaseYear: { type: Type.INTEGER }, confidence: { type: Type.NUMBER }, visibleFlaws: { type: Type.ARRAY, items: { type: Type.STRING } } } } } });
    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, confidence: parsed.confidence ?? null, card: parsed, alternatives: [], aiCondition: { flaws: parsed.visibleFlaws || [] }, provider: 'gemini' });
  } catch (error) {
    console.error('VScan API Error:', error);
    res.status(503).json({ success: false, error: 'VSCAN_PROVIDER_ERROR' });
  }
});

app.post('/api/vscan/multi-scan', async (req: Request, res: Response) => {
  if (!process.env.GEMINI_API_KEY || !req.body?.imageBase64) return res.status(503).json({ success: false, error: 'VSCAN_PROVIDER_UNAVAILABLE' });
  try {
    const { imageBase64 } = req.body;
    const ai = getGeminiClient();
    const parts = imageBase64.split('base64,');
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: parts[1] || parts[0] } };
    const response = await ai.models.generateContent({ model: 'gemini-3.6-flash', contents: { parts: [imagePart, { text: 'Identify all Pokémon trading cards visible. Return JSON with cardsFound array; each item must contain name, set, number, confidence, x, y, width, height. If uncertain, lower confidence rather than inventing.' }] }, config: { responseMimeType: 'application/json' } });
    const parsed = JSON.parse(response.text || '{}');
    const detectedCards = (parsed.cardsFound || []).map((item: any) => ({ boundingBox: { x: item.x, y: item.y, width: item.width, height: item.height }, card: { name: item.name, set: item.set, number: item.number }, confidence: item.confidence }));
    return res.json({ success: true, detectedCards });
  } catch (error) {
    console.error('Multi-scan error:', error);
    return res.status(503).json({ success: false, error: 'VSCAN_PROVIDER_ERROR' });
  }
});

// Legacy prototype verification route retained only as an explicitly non-production fallback.
app.get('/api/certificates/verify/:serial', (req: Request, res: Response) => {
  const serial = req.params.serial;
  const slab = activeSlabs.find(s => s.serialNumber.toLowerCase() === serial.toLowerCase());
  if (!slab) return res.status(404).json({ success: false, message: 'VCA Serial Number not found in prototype verification data.' });
  const events = activeLedgerEvents.filter(e => e.serialNumber.toLowerCase() === serial.toLowerCase());
  res.json({ success: true, slab, ledgerEvents: events, verificationStatus: 'PROTOTYPE_DATA_ONLY' });
});

app.post('/api/slabs/mint', (_req: Request, res: Response) => res.status(410).json({ success: false, error: 'PROTOTYPE_ROUTE_DISABLED', message: 'Certificate minting must use the production submission/grading workflow.' }));

// Legacy price endpoints are intentionally retained during migration and are not certification truth.
app.get('/api/cards/prices', (req: Request, res: Response) => {
  const name = (req.query.name as string) || 'Charizard';
  const set = (req.query.set as string) || 'Base Set';
  const cardNumber = (req.query.cardNumber as string) || '4/102';
  const holo = (req.query.holo as string) || 'Holo';
  const edition = (req.query.edition as string) || 'Unlimited';
  const basePriceNum = req.query.basePrice ? parseFloat(req.query.basePrice as string) : 380;
  const query: MultiSourcePriceQuery = { name, set, cardNumber, holo, edition };
  const priceData = getMultiSourcePriceEstimate(query, basePriceNum);
  res.json({ success: true, engine: 'VCA-MultiSource-PriceScraper-v2', scrapedSourcesCount: priceData.sources.length, data: priceData, dataStatus: 'PROTOTYPE_ESTIMATE' });
});

app.post('/api/cards/prices', (req: Request, res: Response) => {
  const { name = 'Charizard', set = 'Base Set', cardNumber = '4/102', holo = 'Holo', edition = 'Unlimited', basePrice = 380 } = req.body;
  const query: MultiSourcePriceQuery = { name, set, cardNumber, holo, edition };
  const priceData = getMultiSourcePriceEstimate(query, basePrice);
  res.json({ success: true, engine: 'VCA-MultiSource-PriceScraper-v2', scrapedSourcesCount: priceData.sources.length, data: priceData, dataStatus: 'PROTOTYPE_ESTIMATE' });
});

app.post('/api/cards/estimate-collection', (req: Request, res: Response) => {
  const { cards = [] } = req.body;
  const list = cards.length > 0 ? cards : [];
  const estimations = list.map((c: any) => getMultiSourcePriceEstimate(c, c.basePrice || 250));
  const totalRawConsensus = estimations.reduce((sum, e) => sum + e.totals.rawConsensusUSD, 0);
  const totalPSA9Consensus = estimations.reduce((sum, e) => sum + e.totals.psa9ConsensusUSD, 0);
  const totalPSA10Consensus = estimations.reduce((sum, e) => sum + e.totals.psa10ConsensusUSD, 0);
  res.json({ success: true, totalCards: estimations.length, collectionTotals: { rawConsensusTotalUSD: totalRawConsensus, psa9ConsensusTotalUSD: totalPSA9Consensus, psa10ConsensusTotalUSD: totalPSA10Consensus }, items: estimations, dataStatus: 'PROTOTYPE_ESTIMATE' });
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

app.listen(PORT, () => console.log(`VCA Platform server running on http://0.0.0.0:${PORT}`));
