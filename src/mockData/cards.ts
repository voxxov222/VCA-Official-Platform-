import { CardItem, VCASlab, LedgerEvent, MarketplaceListing, UserProfile } from '../types';

export const DEMO_USER: UserProfile = {
  uid: 'usr_vca_master_001',
  name: 'Alex Vance',
  email: 'alex.vance@vca-collectibles.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  reputationScore: 99.8,
  isVerifiedTrader: true,
  vaultValueCAD: 42850,
  totalSlabs: 14,
  memberSince: 'OCT 2024'
};

export const SAMPLE_CARDS: CardItem[] = [
  {
    id: 'base1-4',
    name: 'Charizard',
    set: 'Base Set',
    number: '4/102',
    totalInSet: '102',
    rarity: 'Holo Rare',
    language: 'English',
    variant: '1st Edition',
    releaseYear: 1999,
    artist: 'Mitsuhiro Arita',
    hp: 120,
    supertype: 'Pokémon',
    imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png',
    rawPrice: 480.00,
    psa9Price: 1650.00,
    psa10Price: 9850.00,
    conditionPrices: {
      NM: 480.00,
      LP: 310.00,
      MP: 190.00,
      HP: 110.00,
      DMG: 65.00
    },
    sources: [
      { source: 'TCGPlayer', rawPrice: 475.00, psa9Price: 1620.00, psa10Price: 9700.00, currency: 'CAD', updatedAt: '12 mins ago', reliabilityScore: 99, salesVolume30d: 42 },
      { source: 'Cardmarket', rawPrice: 485.00, psa9Price: 1680.00, psa10Price: 9900.00, currency: 'CAD', updatedAt: '25 mins ago', reliabilityScore: 97, salesVolume30d: 38 },
      { source: 'eBay Sold', rawPrice: 482.50, psa9Price: 1650.00, psa10Price: 10100.00, currency: 'CAD', updatedAt: '1 hour ago', reliabilityScore: 95, salesVolume30d: 89 },
      { source: 'PriceCharting', rawPrice: 478.00, psa9Price: 1640.00, psa10Price: 9800.00, currency: 'CAD', updatedAt: '2 hours ago', reliabilityScore: 94, salesVolume30d: 110 }
    ],
    consensus: {
      rawConsensus: 480.00,
      psa9Consensus: 1650.00,
      psa10Consensus: 9850.00,
      confidence: 'HIGH',
      marketSignal: 'STRONG BUY',
      signalReason: 'PSA 10 sales increased 21% over last 30 days while raw pricing increased 8%. Graded premium is expanding rapidly.',
      change30dPercent: 14.8,
      highestRecorded: 11200.00,
      lowestRecorded: 7900.00
    },
    priceHistory: [
      { date: 'Jan 10', raw: 420, psa9: 1450, psa10: 8200 },
      { date: 'Jan 17', raw: 435, psa9: 1490, psa10: 8450 },
      { date: 'Jan 24', raw: 440, psa9: 1520, psa10: 8800 },
      { date: 'Jan 31', raw: 460, psa9: 1580, psa10: 9200 },
      { date: 'Feb 05', raw: 480, psa9: 1650, psa10: 9850 }
    ]
  },
  {
    id: 'sv3pt5-173',
    name: 'Pikachu',
    set: '151 (Scarlet & Violet)',
    number: '173/165',
    totalInSet: '165',
    rarity: 'Illustration Rare',
    language: 'English',
    variant: 'Illustration Rare',
    releaseYear: 2023,
    artist: 'Hiroyuki Yamamoto',
    hp: 60,
    supertype: 'Pokémon',
    imageUrl: 'https://images.pokemontcg.io/sv3pt5/173_hires.png',
    rawPrice: 68.00,
    psa9Price: 115.00,
    psa10Price: 340.00,
    conditionPrices: {
      NM: 68.00,
      LP: 52.00,
      MP: 38.00,
      HP: 24.00,
      DMG: 14.00
    },
    sources: [
      { source: 'TCGPlayer', rawPrice: 67.50, psa9Price: 112.00, psa10Price: 335.00, currency: 'CAD', updatedAt: '5 mins ago', reliabilityScore: 99, salesVolume30d: 140 },
      { source: 'Cardmarket', rawPrice: 69.00, psa9Price: 118.00, psa10Price: 345.00, currency: 'CAD', updatedAt: '18 mins ago', reliabilityScore: 98, salesVolume30d: 95 },
      { source: 'eBay Sold', rawPrice: 68.00, psa9Price: 115.00, psa10Price: 342.00, currency: 'CAD', updatedAt: '45 mins ago', reliabilityScore: 96, salesVolume30d: 210 }
    ],
    consensus: {
      rawConsensus: 68.00,
      psa9Consensus: 115.00,
      psa10Consensus: 340.00,
      confidence: 'HIGH',
      marketSignal: 'BUY',
      signalReason: 'High demand from 151 set collectors. PSA 10 gem rate is low at 41%, maintaining high gem mint prices.',
      change30dPercent: 9.4,
      highestRecorded: 390.00,
      lowestRecorded: 260.00
    },
    priceHistory: [
      { date: 'Jan 10', raw: 58, psa9: 98, psa10: 290 },
      { date: 'Jan 17', raw: 61, psa9: 104, psa10: 305 },
      { date: 'Jan 24', raw: 64, psa9: 108, psa10: 320 },
      { date: 'Jan 31', raw: 66, psa9: 112, psa10: 332 },
      { date: 'Feb 05', raw: 68, psa9: 115, psa10: 340 }
    ]
  },
  {
    id: 'swsh7-215',
    name: 'Rayquaza VMAX',
    set: 'Evolving Skies',
    number: '215/203',
    totalInSet: '203',
    rarity: 'Secret Rare',
    language: 'English',
    variant: 'Alternate Art',
    releaseYear: 2021,
    artist: 'Ryota Murayama',
    hp: 320,
    supertype: 'Pokémon',
    imageUrl: 'https://images.pokemontcg.io/swsh7/215_hires.png',
    rawPrice: 380.00,
    psa9Price: 510.00,
    psa10Price: 1120.00,
    conditionPrices: {
      NM: 380.00,
      LP: 290.00,
      MP: 195.00,
      HP: 120.00,
      DMG: 80.00
    },
    sources: [
      { source: 'TCGPlayer', rawPrice: 375.00, psa9Price: 500.00, psa10Price: 1100.00, currency: 'CAD', updatedAt: '8 mins ago', reliabilityScore: 99 },
      { source: 'eBay Sold', rawPrice: 385.00, psa9Price: 520.00, psa10Price: 1140.00, currency: 'CAD', updatedAt: '30 mins ago', reliabilityScore: 97 }
    ],
    consensus: {
      rawConsensus: 380.00,
      psa9Consensus: 510.00,
      psa10Consensus: 1120.00,
      confidence: 'HIGH',
      marketSignal: 'STRONG BUY',
      signalReason: 'Premier Modern Alt Art Grail. Evolving Skies booster boxes surging, driving card valuation upwards.',
      change30dPercent: 18.2,
      highestRecorded: 1250.00,
      lowestRecorded: 820.00
    },
    priceHistory: [
      { date: 'Jan 10', raw: 310, psa9: 440, psa10: 920 },
      { date: 'Jan 17', raw: 330, psa9: 465, psa10: 980 },
      { date: 'Jan 24', raw: 350, psa9: 485, psa10: 1040 },
      { date: 'Jan 31', raw: 370, psa9: 500, psa10: 1090 },
      { date: 'Feb 05', raw: 380, psa9: 510, psa10: 1120 }
    ]
  },
  {
    id: 'swsh8-271',
    name: 'Gengar VMAX',
    set: 'Fusion Strike',
    number: '271/264',
    totalInSet: '264',
    rarity: 'Secret Rare',
    language: 'English',
    variant: 'Alternate Art',
    releaseYear: 2021,
    artist: 'Sowsow',
    hp: 320,
    supertype: 'Pokémon',
    imageUrl: 'https://images.pokemontcg.io/swsh8/271_hires.png',
    rawPrice: 245.00,
    psa9Price: 320.00,
    psa10Price: 780.00,
    sources: [
      { source: 'TCGPlayer', rawPrice: 240.00, psa9Price: 315.00, psa10Price: 770.00, currency: 'CAD', updatedAt: '15 mins ago', reliabilityScore: 98 }
    ],
    consensus: {
      rawConsensus: 245.00,
      psa9Consensus: 320.00,
      psa10Consensus: 780.00,
      confidence: 'HIGH',
      marketSignal: 'BUY',
      signalReason: 'Iconic artwork with consistent high buyer demand in Japanese & English.',
      change30dPercent: 12.1,
      highestRecorded: 840.00,
      lowestRecorded: 590.00
    },
    priceHistory: [
      { date: 'Jan 10', raw: 210, psa9: 280, psa10: 680 },
      { date: 'Jan 17', raw: 220, psa9: 295, psa10: 710 },
      { date: 'Jan 24', raw: 230, psa9: 305, psa10: 740 },
      { date: 'Jan 31', raw: 240, psa9: 315, psa10: 765 },
      { date: 'Feb 05', raw: 245, psa9: 320, psa10: 780 }
    ]
  }
];

export const INITIAL_SLABS: VCASlab[] = [
  {
    serialNumber: 'VCA-000-000-001',
    nfcUid: 'E0040150993B41C2',
    card: SAMPLE_CARDS[1], // 2023 Pikachu Illustration Rare #173
    overallGrade: 10,
    gradeLabel: 'GEM MINT',
    tier: 'Gem Mint',
    subgrades: {
      centering: 98,
      corners: 97,
      edges: 99,
      surface: 96,
      overall: 10
    },
    mintedAt: '2025-05-22T10:42:00Z',
    ownerUid: 'usr_vca_master_001',
    ownerName: 'Alex Vance',
    ownerAddress: '0x71C...39F1',
    signatureHistory: [
      {
        signedBy: 'Alex Vance',
        signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="35" font-family="cursive" font-size="28" fill="%2322d3ee">Alex Vance</text></svg>',
        timestamp: '2025-05-22T10:45:12Z',
        txHash: '0x8f2a9c417e8b3f1122a009d3b4f6e1189c10100f'
      }
    ],
    verificationHash: 'vca_sha256_e0040150993b41c2_000000001_gem10',
    isAuthentic: true,
    tamperSealIntact: true,
    vaultValueCAD: 2850.00,
    images: [
      'https://images.pokemontcg.io/sv3pt5/173_hires.png'
    ]
  },
  {
    serialNumber: 'VCA-000-000-002',
    nfcUid: 'E0040150993B88A1',
    card: SAMPLE_CARDS[0], // Charizard Base Set 4/102
    overallGrade: 9,
    gradeLabel: 'MINT',
    tier: 'Standard',
    subgrades: {
      centering: 92,
      corners: 94,
      edges: 95,
      surface: 90,
      overall: 9
    },
    mintedAt: '2025-06-14T14:18:00Z',
    ownerUid: 'usr_vca_master_001',
    ownerName: 'Alex Vance',
    ownerAddress: '0x71C...39F1',
    signatureHistory: [],
    verificationHash: 'vca_sha256_e0040150993b88a1_000000002_mint9',
    isAuthentic: true,
    tamperSealIntact: true,
    vaultValueCAD: 1650.00,
    images: [
      'https://images.pokemontcg.io/base1/4_hires.png'
    ]
  },
  {
    serialNumber: 'VCA-000-000-003',
    nfcUid: 'E0040150993C99F0',
    card: SAMPLE_CARDS[2], // Rayquaza VMAX
    overallGrade: 10,
    gradeLabel: 'PRISTINE',
    tier: 'Black Label',
    subgrades: {
      centering: 100,
      corners: 100,
      edges: 100,
      surface: 100,
      overall: 10
    },
    mintedAt: '2025-08-01T09:12:00Z',
    ownerUid: 'usr_vca_master_001',
    ownerName: 'Alex Vance',
    ownerAddress: '0x71C...39F1',
    signatureHistory: [],
    verificationHash: 'vca_sha256_e0040150993c99f0_000000003_bl10',
    isAuthentic: true,
    tamperSealIntact: true,
    vaultValueCAD: 1120.00,
    images: [
      'https://images.pokemontcg.io/swsh7/215_hires.png'
    ]
  }
];

export const INITIAL_LEDGER_EVENTS: LedgerEvent[] = [
  {
    id: 'evt_001',
    serialNumber: 'VCA-000-000-001',
    timestamp: '2025-05-22T10:40:00Z',
    eventType: 'CARD_SCANNED',
    actorUid: 'usr_vca_master_001',
    actorName: 'VScan AI System',
    details: 'Initial VScan AI multi-angle optical scan & condition capture',
    txHash: '0x1a8f9c20092e01',
    previousHash: '0x000000000000000000000000'
  },
  {
    id: 'evt_002',
    serialNumber: 'VCA-000-000-001',
    timestamp: '2025-05-22T10:41:00Z',
    eventType: 'CARD_IDENTIFIED',
    actorUid: 'usr_vca_master_001',
    actorName: 'VScan AI Neural Model',
    details: 'Matched to Pikachu 151 #173 Illustration Rare with 98.7% confidence',
    txHash: '0x2b90a31192e02',
    previousHash: '0x1a8f9c20092e01'
  },
  {
    id: 'evt_003',
    serialNumber: 'VCA-000-000-001',
    timestamp: '2025-05-22T10:42:00Z',
    eventType: 'CARD_GRADED',
    actorUid: 'usr_qc_inspector_04',
    actorName: 'QC Lead Inspector #04',
    details: 'Blind Human QC confirmed VGAS Grade 10 GEM MINT (Centering:98, Corners:97, Edges:99, Surface:96)',
    txHash: '0x3c01b42293e03',
    previousHash: '0x2b90a31192e02'
  },
  {
    id: 'evt_004',
    serialNumber: 'VCA-000-000-001',
    timestamp: '2025-05-22T10:43:00Z',
    eventType: 'NFC_LINKED',
    actorUid: 'usr_vca_vault_ops',
    actorName: 'Vault Security Machine',
    details: 'Bound NTAG424 DNA NFC chip UID E0040150993B41C2 with encrypted dynamic SUN/CMAC key',
    txHash: '0x4d12c53394e04',
    previousHash: '0x3c01b42293e03'
  },
  {
    id: 'evt_005',
    serialNumber: 'VCA-000-000-001',
    timestamp: '2025-05-22T10:45:12Z',
    eventType: 'SIGN_OWNER',
    actorUid: 'usr_vca_master_001',
    actorName: 'Alex Vance',
    details: 'Cryptographic owner signature appended by Alex Vance',
    txHash: '0x8f2a9c417e8b3f1122a009d3b4f6e1189c10100f',
    previousHash: '0x4d12c53394e04'
  }
];

export const INITIAL_MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'lst_001',
    slab: INITIAL_SLABS[0],
    sellerUid: 'usr_vca_master_001',
    sellerName: 'Alex Vance',
    type: 'AUCTION',
    priceCAD: 2850.00,
    currentBidCAD: 2920.00,
    bidsCount: 14,
    endsAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    watchersCount: 84,
    isVerifiedVCA: true
  },
  {
    id: 'lst_002',
    slab: INITIAL_SLABS[2],
    sellerUid: 'usr_collector_88',
    sellerName: 'Hyperion Vaults',
    type: 'BUY_NOW',
    priceCAD: 1150.00,
    watchersCount: 39,
    isVerifiedVCA: true
  }
];

export const MOCK_SLABS = INITIAL_SLABS;
export const MOCK_LISTINGS = INITIAL_MARKETPLACE_LISTINGS;
export const LEDGER_EVENTS = INITIAL_LEDGER_EVENTS;

export const PORTFOLIO_HISTORY = [
  { date: 'Jan 05', valueCAD: 32400 },
  { date: 'Jan 12', valueCAD: 34100 },
  { date: 'Jan 19', valueCAD: 36800 },
  { date: 'Jan 26', valueCAD: 39200 },
  { date: 'Feb 02', valueCAD: 41500 },
  { date: 'Feb 08', valueCAD: 42850 }
];

export const WATCHLIST_ITEMS = [
  {
    id: 'wl_001',
    card: SAMPLE_CARDS[0],
    currentPriceCAD: 480.00,
    targetPriceCAD: 420.00,
    alertOnHit: true
  },
  {
    id: 'wl_002',
    card: SAMPLE_CARDS[2],
    currentPriceCAD: 380.00,
    targetPriceCAD: 350.00,
    alertOnHit: true
  }
];

export const MOCK_AUCTIONS = [
  {
    id: 'auc_001',
    slab: INITIAL_SLABS[0],
    sellerUsername: 'Alex Vance',
    currentBidCAD: 2920.00,
    bidCount: 14,
    endsIn: '18h 42m',
    watchersCount: 84,
    recentBids: [
      { bidder: 'PikaCollector_CA', amountCAD: 2920.00, timestamp: '12m ago' },
      { bidder: 'VaultTrader_CA', amountCAD: 2850.00, timestamp: '1h ago' }
    ]
  },
  {
    id: 'auc_002',
    slab: INITIAL_SLABS[2],
    sellerUsername: 'Hyperion Vaults',
    currentBidCAD: 1120.00,
    bidCount: 9,
    endsIn: '04h 12m',
    watchersCount: 39,
    recentBids: [
      { bidder: 'EvoMaster99', amountCAD: 1120.00, timestamp: '34m ago' }
    ]
  }
];

export const BREAKING_NEWS_ITEMS = [
  { id: '1', text: '🟢 CHARIZARD BASE SET 1ST ED PSA 10 SURGES +14.8% TO $9,850 CAD FOLLOWING TOKYO AUCTION RECORD', type: 'price_up' },
  { id: '2', text: '🟣 VCA LABS: VCA MINTS SERIAL VCA-000-000-001 — NTAG424 DNA NFC SEAL AUTHENTICATED & LEDGER ANCHORED', type: 'grading' },
  { id: '3', text: '🟡 LIVE AUCTION: 2023 PIKACHU SPECIAL ILLUSTRATION RARE #173 VCA 10 GEM MINT ENDING IN 18 HOURS', type: 'auction' },
  { id: '4', text: '⚪ VSCAN AI V2.4 RELEASED: NEURAL VISION ENGINE ONLINE — MULTI-CARD ISOLATION & VARIANTS ACTIVE', type: 'news' },
  { id: '5', text: '🟢 MARKET ALERT: UMBREON VMAX ALT ART #215 (MOONBREON) BREAKS ALL-TIME HIGH AT $1,420 CAD (+22.1% 30D)', type: 'price_up' },
  { id: '6', text: '🟣 SUPPLIER DIRECT: POKÉMON 151 MASTER SET COMPLETE BINDER CASES NOW LIVE IN VCA WHOLESALE VAULT', type: 'grading' },
  { id: '7', text: '🔴 SECURITY ALERT: COUNTERFEIT SLABS INTERCEPTED IN VANCOUVER; VCA CMAC NFC CHECK PREVENTS FRAUD', type: 'price_down' },
  { id: '8', text: '🟡 GRADED INDEX: GOLD STAR RAYQUAZA EX DEOXYS #107 VCA 9.5 SELLS FOR $12,400 CAD IN PRIVATE TRADE', type: 'auction' },
  { id: '9', text: '⚪ COMMUNITY SLABBOOK: OVER 142,000+ VERIFIED COLLECTORS NOW TRADING ON SLABBOOK SOCIAL LEDGER', type: 'news' },
  { id: '10', text: '🟢 BREAKING WIRE: NINTENDO & THE POKÉMON COMPANY ANNOUNCE NEW SV9 HEAT WAVE ARENA EXPANSION SET', type: 'price_up' }
];

export const POKEMON_CARDS_DATABASE = SAMPLE_CARDS;



