export type NavigationTab = 
  | 'dashboard'
  | 'vscan'
  | 'portfolio'
  | 'market'
  | 'database'
  | 'certificates'
  | 'ledger'
  | 'marketplace'
  | 'watchlist'
  | 'alerts'
  | 'settings'
  | 'slabbook'
  | 'admin';

export type CardVariant = 
  | '1st Edition'
  | 'Unlimited'
  | 'Shadowless'
  | 'Holo'
  | 'Reverse Holo'
  | 'Non-Holo'
  | 'Promo'
  | 'Secret Rare'
  | 'Illustration Rare'
  | 'Special Illustration Rare'
  | 'Full Art'
  | 'Alternate Art'
  | 'Gold'
  | 'Rainbow'
  | 'Japanese'
  | 'English'
  | 'Korean'
  | 'Chinese';

export type CardLanguage = 'English' | 'Japanese' | 'Korean' | 'Chinese' | 'German' | 'French' | 'Spanish';

export type MarketSignalType = 
  | 'STRONG BUY'
  | 'BUY'
  | 'WATCH'
  | 'HOLD'
  | 'SELL'
  | 'UNDERVALUED'
  | 'OVERVALUED';

export interface PriceSource {
  sourceName: 'TCGplayer' | 'eBay Sold' | 'Cardmarket' | 'PriceCharting' | 'VCA Vault Sales';
  rawPriceUSD: number;
  psa9PriceUSD: number;
  psa10PriceUSD: number;
  lastUpdated: string;
  confidenceScore: number; // 0 - 100
  salesCount: number;
  url?: string;
}

export interface RawConditionPrices {
  nm: number; // Near Mint
  lp: number; // Lightly Played
  mp: number; // Moderately Played
  hp: number; // Heavily Played
  dmg: number; // Damaged
}

export interface PriceHistoryPoint {
  date: string;
  rawPrice: number;
  psa9Price: number;
  psa10Price: number;
  volume: number;
}

export interface MarketIntelligence {
  rawPriceUSD: number;
  rawConditionPrices: RawConditionPrices;
  psa9PriceUSD: number;
  psa10PriceUSD: number;
  vcaConsensusUSD: number;
  consensusConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  priceSources: PriceSource[];
  marketSignal: MarketSignalType;
  marketSignalReason: string;
  change30dPercent: number;
  change90dPercent: number;
  change1yPercent: number;
  salesVolume30d: number;
  history: PriceHistoryPoint[];
  lastSyncedAt: string;
}

export interface AIConditionEstimate {
  centeringScore: number; // 0-100
  cornersScore: number; // 0-100
  edgesScore: number; // 0-100
  surfaceScore: number; // 0-100
  overallScore: number; // 0-100
  projectedGradeRange: string; // e.g. "PSA 8–9"
  flaggedDefects: string[];
  disclaimer: string;
}

export interface CardRecord {
  id: string;
  pokemonName: string;
  setName: string;
  setId: string;
  cardNumber: string; // e.g. "4/102"
  rarity: string;
  variant: CardVariant;
  language: CardLanguage;
  releaseYear: number;
  illustrator: string;
  hp?: number;
  types?: string[];
  attacks?: { name: string; damage?: string; text?: string }[];
  imageUrl: string;
  market: MarketIntelligence;
}

export interface MultiCardDetectionItem {
  id: string;
  bbox: { x: number; y: number; width: number; height: number }; // normalized 0-1
  card: CardRecord;
  confidence: number;
  aiCondition: AIConditionEstimate;
  possibleMatches?: { card: CardRecord; confidence: number }[];
}

export interface ScanResult {
  scanId: string;
  timestamp: string;
  capturedImageUrl: string;
  isMultiCard: boolean;
  cardsDetected: MultiCardDetectionItem[];
  overallConfidence: number;
  processingTimeMs: number;
}

export interface PortfolioItem {
  id: string;
  userId: string;
  card: CardRecord;
  purchasePriceUSD: number;
  purchaseDate: string;
  quantity: number;
  condition: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG' | 'GRADED';
  userGrade?: number; // 1 - 10
  serialNumber?: string; // e.g. "VCA-000-000-001"
  nfcUid?: string;
  certificateId?: string;
  notes?: string;
  customImages?: string[];
  isGraded: boolean;
  isAuthenticated: boolean;
  addedAt: string;
}

export interface SlabCertificate {
  certificateId: string;
  serialNumber: string; // e.g. "VCA-000-000-001"
  cardId: string;
  cardName: string;
  setName: string;
  cardNumber: string;
  variant: CardVariant;
  language: CardLanguage;
  overallGrade: number; // e.g. 10
  gradeLabel: string; // e.g. "GEM MINT"
  subgrades: {
    centering: number;
    corners: number;
    edges: number;
    surface: number;
  };
  nfcUid: string;
  nfcStatus: 'ACTIVE_SEAL_INTACT' | 'SECURITY_ALERT' | 'UNBOUND';
  ownerName: string;
  authenticatedAt: string;
  qrCodeUrl: string;
  cryptographicHash: string;
  ledgerTxHash: string;
  imageUrl: string;
}

export type LedgerEventType = 
  | 'CARD_SCANNED'
  | 'CARD_IDENTIFIED'
  | 'CARD_REGISTERED'
  | 'CARD_GRADED'
  | 'NFC_LINKED'
  | 'CERTIFICATE_CREATED'
  | 'OWNERSHIP_SIGNED'
  | 'CARD_TRANSFERRED'
  | 'CARD_LISTED'
  | 'CARD_SOLD'
  | 'CARD_VERIFIED';

export interface LedgerEvent {
  id: string;
  timestamp: string;
  eventType: LedgerEventType;
  serialNumber: string;
  cardName: string;
  actor: string;
  previousHash: string;
  currentHash: string;
  metadata: Record<string, any>;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  card: CardRecord;
  targetPriceUSD: number;
  alertOnPriceDrop: boolean;
  alertOnPriceRise: boolean;
  alertOnSignalShift: boolean;
  alertOnPSA10Movement: boolean;
  addedAt: string;
  notes?: string;
}

export interface MarketAlert {
  id: string;
  cardId: string;
  cardName: string;
  type: 'PRICE_DROP' | 'PRICE_RISE' | 'SIGNAL_SHIFT' | 'PSA10_SPIKE' | 'NFC_VERIFY' | 'AUCTION_CLOSE';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface MarketplaceListing {
  id: string;
  serialNumber: string;
  certificateId: string;
  card: CardRecord;
  grade: number;
  gradeLabel: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  listingType: 'BUY_NOW' | 'AUCTION' | 'ACCEPTING_OFFERS';
  priceUSD: number;
  currentBidUSD?: number;
  bidsCount?: number;
  endsAt?: string;
  isNfcVerified: boolean;
  createdAt: string;
  imageUrl: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  handle?: string;
  bio?: string;
  location?: string;
  favoritePokemon?: string;
  coverUrl?: string;
  followersCount?: number;
  followingCount?: number;
  role: 'COLLECTOR' | 'VERIFIED_PRO' | 'ADMIN';
  verifiedTraderBadge: boolean;
  joinedDate: string;
  totalVaultValueUSD: number;
  totalCardsCount: number;
}

export interface NewsWireItem {
  id: string;
  category: 'PRICE_UP' | 'PRICE_DOWN' | 'NEW_GRADING' | 'AUCTION_ALERT' | 'PLATFORM';
  text: string;
  timestamp: string;
}
