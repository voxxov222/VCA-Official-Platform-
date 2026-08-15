export type VscanMarketQuote = {
  condition: 'RAW' | 'PSA_8' | 'PSA_9' | 'PSA_10';
  price: number | null;
  currency: string;
  source: string | null;
  marketType: 'MARKET' | 'LISTING' | 'UNAVAILABLE';
  observedAt: string | null;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  note?: string;
};

export type VscanMarketResult = {
  card: { name: string; set?: string; number?: string };
  quotes: VscanMarketQuote[];
  sourceWarnings: string[];
};

function unavailable(condition: VscanMarketQuote['condition'], note: string): VscanMarketQuote {
  return {
    condition,
    price: null,
    currency: 'USD',
    source: null,
    marketType: 'UNAVAILABLE',
    observedAt: null,
    status: 'UNAVAILABLE',
    note,
  };
}

async function tcgplayerRaw(name: string, set?: string, number?: string): Promise<VscanMarketQuote> {
  const apiKey = process.env.POKEMON_TCG_API_KEY;
  const params = new URLSearchParams();
  if (name) params.set('q', `name:"${name.replace(/"/g, '')}"`);
  params.set('pageSize', '20');

  const response = await fetch(`https://api.pokemontcg.io/v2/cards?${params.toString()}`, {
    headers: apiKey ? { 'X-Api-Key': apiKey } : {},
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`POKEMON_TCG_API_${response.status}`);

  const payload = await response.json() as { data?: any[] };
  const cards = payload.data ?? [];
  const exact = cards.find(card =>
    (!set || String(card.set?.name ?? '').toLowerCase() === set.toLowerCase()) &&
    (!number || String(card.number ?? '') === number)
  ) ?? cards[0];
  const prices = exact?.tcgplayer?.prices;
  if (!prices) throw new Error('RAW_PRICE_UNAVAILABLE');

  const candidates = Object.values(prices) as Array<{ market?: number; mid?: number; low?: number }>;
  const market = candidates.find(p => typeof p.market === 'number')?.market;
  if (typeof market !== 'number') throw new Error('RAW_MARKET_PRICE_UNAVAILABLE');

  return {
    condition: 'RAW',
    price: market,
    currency: 'USD',
    source: 'Pokémon TCG API / TCGplayer market price',
    marketType: 'MARKET',
    observedAt: new Date().toISOString(),
    status: 'AVAILABLE',
  };
}

export async function getVscanMarketData(name: string, set?: string, number?: string): Promise<VscanMarketResult> {
  const sourceWarnings: string[] = [];
  let raw: VscanMarketQuote;
  try {
    raw = await tcgplayerRaw(name, set, number);
  } catch (error) {
    sourceWarnings.push(error instanceof Error ? error.message : 'RAW_PROVIDER_ERROR');
    raw = unavailable('RAW', 'No verified raw market quote is currently available.');
  }

  const gradedNote = process.env.GRADED_MARKET_PROVIDER
    ? `Provider configured (${process.env.GRADED_MARKET_PROVIDER}) but its adapter is not enabled yet.`
    : 'PSA 8/9/10 requires a verified graded-market provider; VCA will not invent these values.';

  return {
    card: { name, set, number },
    quotes: [
      raw,
      unavailable('PSA_8', gradedNote),
      unavailable('PSA_9', gradedNote),
      unavailable('PSA_10', gradedNote),
    ],
    sourceWarnings,
  };
}
