import { CardRecord, MarketIntelligence } from '../types/vca';

export const INITIAL_CARDS_DATABASE: CardRecord[] = [
  {
    id: 'base1-4',
    pokemonName: 'Charizard',
    setName: 'Base Set',
    setId: 'base1',
    cardNumber: '4/102',
    rarity: 'Holo Rare',
    variant: 'Holo',
    language: 'English',
    releaseYear: 1999,
    illustrator: 'Mitsuhiro Arita',
    hp: 120,
    types: ['Fire'],
    attacks: [
      { name: 'Energy Burn', text: 'As often as you like during your turn, turn all Energy attached to Charizard into Fire Energy.' },
      { name: 'Fire Spin', damage: '100', text: 'Discard 2 Energy cards attached to Charizard in order to use this attack.' }
    ],
    imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png',
    market: {
      rawPriceUSD: 380,
      rawConditionPrices: { nm: 380, lp: 220, mp: 130, hp: 80, dmg: 45 },
      psa9PriceUSD: 1450,
      psa10PriceUSD: 11200,
      vcaConsensusUSD: 385,
      consensusConfidence: 'HIGH',
      priceSources: [
        { sourceName: 'TCGplayer', rawPriceUSD: 380, psa9PriceUSD: 1420, psa10PriceUSD: 11000, lastUpdated: '10 mins ago', confidenceScore: 98, salesCount: 14 },
        { sourceName: 'eBay Sold', rawPriceUSD: 395, psa9PriceUSD: 1480, psa10PriceUSD: 11500, lastUpdated: '2 hours ago', confidenceScore: 96, salesCount: 32 },
        { sourceName: 'Cardmarket', rawPriceUSD: 375, psa9PriceUSD: 1400, psa10PriceUSD: 10900, lastUpdated: '1 hour ago', confidenceScore: 92, salesCount: 9 },
        { sourceName: 'PriceCharting', rawPriceUSD: 385, psa9PriceUSD: 1450, psa10PriceUSD: 11200, lastUpdated: '3 hours ago', confidenceScore: 95, salesCount: 45 }
      ],
      marketSignal: 'STRONG BUY',
      marketSignalReason: 'PSA 10 sales increased +18.4% in the last 30 days while raw availability decreased. High collector demand spread.',
      change30dPercent: 14.8,
      change90dPercent: 28.2,
      change1yPercent: 42.5,
      salesVolume30d: 100,
      history: [
        { date: 'Jul 09', rawPrice: 320, psa9Price: 1250, psa10Price: 9800, volume: 12 },
        { date: 'Jul 16', rawPrice: 340, psa9Price: 1300, psa10Price: 10100, volume: 18 },
        { date: 'Jul 23', rawPrice: 355, psa9Price: 1380, psa10Price: 10500, volume: 22 },
        { date: 'Jul 30', rawPrice: 370, psa9Price: 1420, psa10Price: 10900, volume: 20 },
        { date: 'Aug 08', rawPrice: 380, psa9Price: 1450, psa10Price: 11200, volume: 28 }
      ],
      lastSyncedAt: '2026-08-08T12:00:00Z'
    }
  },
  {
    id: 'sv3pt5-173',
    pokemonName: 'Pikachu',
    setName: '151 (Special Illustration Rare)',
    setId: 'sv3pt5',
    cardNumber: '173/165',
    rarity: 'Illustration Rare',
    variant: 'Illustration Rare',
    language: 'English',
    releaseYear: 2023,
    illustrator: 'Hiroyuki Yamamoto',
    hp: 60,
    types: ['Lightning'],
    attacks: [
      { name: 'Charge', text: 'Search your deck for a Basic Lightning Energy card and attach it to this Pokémon.' },
      { name: 'Whiny Voice', damage: '20' }
    ],
    imageUrl: 'https://images.pokemontcg.io/sv3pt5/173_hires.png',
    market: {
      rawPriceUSD: 38.5,
      rawConditionPrices: { nm: 38.5, lp: 28, mp: 18, hp: 12, dmg: 8 },
      psa9PriceUSD: 72,
      psa10PriceUSD: 245,
      vcaConsensusUSD: 38.5,
      consensusConfidence: 'HIGH',
      priceSources: [
        { sourceName: 'TCGplayer', rawPriceUSD: 38, psa9PriceUSD: 70, psa10PriceUSD: 240, lastUpdated: '5 mins ago', confidenceScore: 99, salesCount: 88 },
        { sourceName: 'eBay Sold', rawPriceUSD: 39, psa9PriceUSD: 74, psa10PriceUSD: 250, lastUpdated: '1 hour ago', confidenceScore: 95, salesCount: 140 },
        { sourceName: 'Cardmarket', rawPriceUSD: 37.5, psa9PriceUSD: 68, psa10PriceUSD: 235, lastUpdated: '30 mins ago', confidenceScore: 94, salesCount: 60 }
      ],
      marketSignal: 'BUY',
      marketSignalReason: 'PSA 10 GEM MINT population is stabilizing. High liquidity with over 280 sales logged in 30 days.',
      change30dPercent: 8.2,
      change90dPercent: 15.6,
      change1yPercent: 34.0,
      salesVolume30d: 288,
      history: [
        { date: 'Jul 09', rawPrice: 32, psa9Price: 62, psa10Price: 210, volume: 50 },
        { date: 'Jul 16', rawPrice: 34, psa9Price: 65, psa10Price: 220, volume: 62 },
        { date: 'Jul 23', rawPrice: 36, psa9Price: 68, psa10Price: 230, volume: 70 },
        { date: 'Jul 30', rawPrice: 37.5, psa9Price: 70, psa10Price: 240, volume: 58 },
        { date: 'Aug 08', rawPrice: 38.5, psa9Price: 72, psa10Price: 245, volume: 48 }
      ],
      lastSyncedAt: '2026-08-08T12:05:00Z'
    }
  },
  {
    id: 'swsh7-215',
    pokemonName: 'Umbreon VMAX',
    setName: 'Evolving Skies',
    setId: 'swsh7',
    cardNumber: '215/203',
    rarity: 'Secret Rare',
    variant: 'Alternate Art',
    language: 'English',
    releaseYear: 2021,
    illustrator: 'KEIICHIRO ITO',
    hp: 310,
    types: ['Darkness'],
    attacks: [
      { name: 'Dark Signal', text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may switch 1 of your opponent’s Benched Pokémon with their Active Pokémon.' },
      { name: 'Max Darkness', damage: '160' }
    ],
    imageUrl: 'https://images.pokemontcg.io/swsh7/215_hires.png',
    market: {
      rawPriceUSD: 710,
      rawConditionPrices: { nm: 710, lp: 580, mp: 420, hp: 280, dmg: 180 },
      psa9PriceUSD: 820,
      psa10PriceUSD: 1350,
      vcaConsensusUSD: 710,
      consensusConfidence: 'HIGH',
      priceSources: [
        { sourceName: 'TCGplayer', rawPriceUSD: 700, psa9PriceUSD: 810, psa10PriceUSD: 1340, lastUpdated: '12 mins ago', confidenceScore: 98, salesCount: 22 },
        { sourceName: 'eBay Sold', rawPriceUSD: 720, psa9PriceUSD: 830, psa10PriceUSD: 1360, lastUpdated: '45 mins ago', confidenceScore: 97, salesCount: 38 },
        { sourceName: 'PriceCharting', rawPriceUSD: 710, psa9PriceUSD: 820, psa10PriceUSD: 1350, lastUpdated: '2 hours ago', confidenceScore: 96, salesCount: 60 }
      ],
      marketSignal: 'STRONG BUY',
      marketSignalReason: '"Moonbreon" remains the pinnacle modern chase card. Raw-to-PSA 10 spread provides $640+ gross grading upside.',
      change30dPercent: 12.5,
      change90dPercent: 24.1,
      change1yPercent: 62.0,
      salesVolume30d: 120,
      history: [
        { date: 'Jul 09', rawPrice: 620, psa9Price: 740, psa10Price: 1180, volume: 20 },
        { date: 'Jul 16', rawPrice: 650, psa9Price: 770, psa10Price: 1230, volume: 25 },
        { date: 'Jul 23', rawPrice: 680, psa9Price: 790, psa10Price: 1290, volume: 28 },
        { date: 'Jul 30', rawPrice: 700, psa9Price: 810, psa10Price: 1320, volume: 24 },
        { date: 'Aug 08', rawPrice: 710, psa9Price: 820, psa10Price: 1350, volume: 23 }
      ],
      lastSyncedAt: '2026-08-08T11:50:00Z'
    }
  },
  {
    id: 'neo1-9',
    pokemonName: 'Lugia',
    setName: 'Neo Genesis',
    setId: 'neo1',
    cardNumber: '9/111',
    rarity: 'Holo Rare',
    variant: '1st Edition',
    language: 'English',
    releaseYear: 2000,
    illustrator: 'Ken Sugimori',
    hp: 90,
    types: ['Colorless'],
    attacks: [
      { name: 'Elemental Blast', damage: '90', text: 'Discard 1 Fire Energy, 1 Water Energy, and 1 Lightning Energy attached to Lugia in order to use this attack.' }
    ],
    imageUrl: 'https://images.pokemontcg.io/neo1/9_hires.png',
    market: {
      rawPriceUSD: 850,
      rawConditionPrices: { nm: 850, lp: 480, mp: 320, hp: 200, dmg: 120 },
      psa9PriceUSD: 3100,
      psa10PriceUSD: 48000,
      vcaConsensusUSD: 850,
      consensusConfidence: 'HIGH',
      priceSources: [
        { sourceName: 'TCGplayer', rawPriceUSD: 840, psa9PriceUSD: 3000, psa10PriceUSD: 46000, lastUpdated: '1 hour ago', confidenceScore: 92, salesCount: 3 },
        { sourceName: 'eBay Sold', rawPriceUSD: 860, psa9PriceUSD: 3200, psa10PriceUSD: 50000, lastUpdated: '4 hours ago', confidenceScore: 95, salesCount: 8 }
      ],
      marketSignal: 'UNDERVALUED',
      marketSignalReason: 'Extremely notorious print defects make PSA 10 population legendary low (~45 globally). PSA 9 provides massive stability.',
      change30dPercent: 6.4,
      change90dPercent: 18.2,
      change1yPercent: 29.5,
      salesVolume30d: 11,
      history: [
        { date: 'Jul 09', rawPrice: 800, psa9Price: 2900, psa10Price: 45000, volume: 2 },
        { date: 'Jul 16', rawPrice: 815, psa9Price: 2950, psa10Price: 46000, volume: 2 },
        { date: 'Jul 23', rawPrice: 830, psa9Price: 3000, psa10Price: 47000, volume: 3 },
        { date: 'Jul 30', rawPrice: 840, psa9Price: 3050, psa10Price: 47500, volume: 2 },
        { date: 'Aug 08', rawPrice: 850, psa9Price: 3100, psa10Price: 48000, volume: 2 }
      ],
      lastSyncedAt: '2026-08-08T10:30:00Z'
    }
  },
  {
    id: 'sv1-252',
    pokemonName: 'Miriam',
    setName: 'Scarlet & Violet',
    setId: 'sv1',
    cardNumber: '252/198',
    rarity: 'Special Illustration Rare',
    variant: 'Special Illustration Rare',
    language: 'English',
    releaseYear: 2023,
    illustrator: 'Akira Komayama',
    imageUrl: 'https://images.pokemontcg.io/sv1/252_hires.png',
    market: {
      rawPriceUSD: 34.0,
      rawConditionPrices: { nm: 34, lp: 25, mp: 16, hp: 10, dmg: 6 },
      psa9PriceUSD: 52,
      psa10PriceUSD: 145,
      vcaConsensusUSD: 34.0,
      consensusConfidence: 'HIGH',
      priceSources: [
        { sourceName: 'TCGplayer', rawPriceUSD: 33.5, psa9PriceUSD: 50, psa10PriceUSD: 142, lastUpdated: '15 mins ago', confidenceScore: 98, salesCount: 52 },
        { sourceName: 'Cardmarket', rawPriceUSD: 34.5, psa9PriceUSD: 54, psa10PriceUSD: 148, lastUpdated: '1 hour ago', confidenceScore: 93, salesCount: 30 }
      ],
      marketSignal: 'HOLD',
      marketSignalReason: 'Price consolidation phase following initial launch surge. Consistent raw trade volume.',
      change30dPercent: -2.1,
      change90dPercent: 4.5,
      change1yPercent: -12.0,
      salesVolume30d: 82,
      history: [
        { date: 'Jul 09', rawPrice: 36, psa9Price: 56, psa10Price: 155, volume: 18 },
        { date: 'Jul 16', rawPrice: 35.5, psa9Price: 55, psa10Price: 150, volume: 15 },
        { date: 'Jul 23', rawPrice: 35, psa9Price: 54, psa10Price: 148, volume: 16 },
        { date: 'Jul 30', rawPrice: 34.5, psa9Price: 53, psa10Price: 146, volume: 18 },
        { date: 'Aug 08', rawPrice: 34, psa9Price: 52, psa10Price: 145, volume: 15 }
      ],
      lastSyncedAt: '2026-08-08T11:20:00Z'
    }
  },
  {
    id: 'ex10-100',
    pokemonName: 'Rayquaza Star',
    setName: 'EX Deoxys',
    setId: 'ex10',
    cardNumber: '100/107',
    rarity: 'Rare Holo Star',
    variant: 'Holo',
    language: 'English',
    releaseYear: 2005,
    illustrator: 'Masakazu Fukuda',
    hp: 90,
    types: ['Colorless'],
    imageUrl: 'https://images.pokemontcg.io/ex10/100_hires.png',
    market: {
      rawPriceUSD: 2400,
      rawConditionPrices: { nm: 2400, lp: 1500, mp: 950, hp: 600, dmg: 350 },
      psa9PriceUSD: 8500,
      psa10PriceUSD: 42000,
      vcaConsensusUSD: 2400,
      consensusConfidence: 'MEDIUM',
      priceSources: [
        { sourceName: 'TCGplayer', rawPriceUSD: 2350, psa9PriceUSD: 8300, psa10PriceUSD: 41000, lastUpdated: '3 hours ago', confidenceScore: 88, salesCount: 1 },
        { sourceName: 'eBay Sold', rawPriceUSD: 2450, psa9PriceUSD: 8700, psa10PriceUSD: 43000, lastUpdated: '1 day ago', confidenceScore: 92, salesCount: 4 }
      ],
      marketSignal: 'WATCH',
      marketSignalReason: 'Ultra-grail status Gold Star card. Low annual transaction volume; price jumps occur in large increments.',
      change30dPercent: 5.2,
      change90dPercent: 14.8,
      change1yPercent: 38.2,
      salesVolume30d: 5,
      history: [
        { date: 'Jul 09', rawPrice: 2280, psa9Price: 8100, psa10Price: 40000, volume: 1 },
        { date: 'Jul 16', rawPrice: 2320, psa9Price: 8200, psa10Price: 40500, volume: 1 },
        { date: 'Jul 23', rawPrice: 2350, psa9Price: 8350, psa10Price: 41000, volume: 1 },
        { date: 'Jul 30', rawPrice: 2380, psa9Price: 8450, psa10Price: 41500, volume: 1 },
        { date: 'Aug 08', rawPrice: 2400, psa9Price: 8500, psa10Price: 42000, volume: 1 }
      ],
      lastSyncedAt: '2026-08-08T09:15:00Z'
    }
  }
];

export function searchCards(query: string, setFilter?: string): CardRecord[] {
  let list = INITIAL_CARDS_DATABASE;
  if (setFilter && setFilter !== 'ALL') {
    list = list.filter(c => c.setName.toLowerCase().includes(setFilter.toLowerCase()));
  }
  if (!query || query.trim() === '') return list;

  const q = query.toLowerCase().trim();
  return list.filter(c => 
    c.pokemonName.toLowerCase().includes(q) ||
    c.setName.toLowerCase().includes(q) ||
    c.cardNumber.toLowerCase().includes(q) ||
    c.variant.toLowerCase().includes(q) ||
    c.illustrator.toLowerCase().includes(q)
  );
}

export function getCardById(id: string): CardRecord | undefined {
  return INITIAL_CARDS_DATABASE.find(c => c.id === id);
}
