export type GradingTier = 'Standard' | 'Gem Mint' | 'Black Label' | 'Pristine';

export type VariantType = 
  | 'Unlimited'
  | '1st Edition'
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

export type CardCondition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';

export interface CardSubgrades {
  centering: number; // 0-100 or 1-10
  corners: number;
  edges: number;
  surface: number;
  overall: number; // 1-10 VGAS / VCA scale
}

export interface PriceSourceRecord {
  source: 'TCGPlayer' | 'Cardmarket' | 'eBay Sold' | 'PriceCharting' | 'VCA Index';
  rawPrice: number;
  psa9Price: number;
  psa10Price: number;
  currency: 'CAD' | 'USD' | 'EUR';
  updatedAt: string;
  reliabilityScore: number;
  salesVolume30d?: number;
}

export interface MarketConsensus {
  rawConsensus: number;
  psa9Consensus: number;
  psa10Consensus: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  marketSignal: 'STRONG BUY' | 'BUY' | 'HOLD' | 'WATCH' | 'SELL' | 'OVERVALUED' | 'UNDERVALUED';
  signalReason: string;
  change30dPercent: number;
  highestRecorded: number;
  lowestRecorded: number;
}

export interface PriceHistoryPoint {
  date: string;
  raw: number;
  psa9: number;
  psa10: number;
  volume?: number;
}

export interface CardItem {
  id: string;
  name: string;
  set: string;
  number: string;
  totalInSet?: string;
  rarity: string;
  language: string;
  variant: VariantType;
  releaseYear: number;
  artist?: string;
  hp?: number;
  supertype?: string;
  imageUrl: string;
  rawPrice: number;
  psa9Price: number;
  psa10Price: number;
  conditionPrices?: Record<CardCondition, number>;
  sources: PriceSourceRecord[];
  consensus: MarketConsensus;
  priceHistory: PriceHistoryPoint[];
}

export interface VCASlab {
  serialNumber: string; // e.g. VCA-000-000-001
  nfcUid: string;
  card: CardItem;
  overallGrade: number; // e.g. 10
  gradeLabel: 'GEM MINT' | 'PRISTINE' | 'MINT' | 'NEAR MINT';
  tier: GradingTier;
  subgrades: CardSubgrades;
  mintedAt: string;
  ownerUid: string;
  ownerName: string;
  ownerAddress?: string;
  signatureHistory: Array<{
    signedBy: string;
    signatureDataUrl: string;
    timestamp: string;
    txHash: string;
  }>;
  verificationHash: string;
  isAuthentic: boolean;
  tamperSealIntact: boolean;
  vaultValueCAD: number;
  images: string[];
}

export interface LedgerEvent {
  id: string;
  serialNumber: string;
  timestamp: string;
  eventType: 
    | 'CARD_SCANNED'
    | 'CARD_IDENTIFIED'
    | 'CARD_REGISTERED'
    | 'CARD_GRADED'
    | 'NFC_LINKED'
    | 'CERTIFICATE_CREATED'
    | 'SIGN_OWNER'
    | 'TRANSFER'
    | 'SOLD'
    | 'LISTED_FOR_AUCTION';
  actorUid: string;
  actorName: string;
  details: string;
  txHash: string;
  previousHash: string;
}

export interface SubmissionStep {
  stepIndex: number;
  title: string;
  description: string;
  completed: boolean;
  capturedImage?: string;
}

export interface MultiCardDetectionResult {
  boundingBox: { x: number; y: number; width: number; height: number };
  croppedImageBase64: string;
  candidateCard: CardItem;
  confidence: number;
}

export interface WatchlistItem {
  id: string;
  cardId: string;
  card: CardItem;
  targetPriceCAD: number;
  alertOnSignalChange: boolean;
  alertOnPriceDrop: boolean;
  addedAt: string;
}

export interface MarketplaceListing {
  id: string;
  slab: VCASlab;
  sellerUid: string;
  sellerName: string;
  type: 'BUY_NOW' | 'AUCTION';
  priceCAD: number;
  currentBidCAD?: number;
  bidsCount?: number;
  endsAt?: string;
  watchersCount: number;
  isVerifiedVCA: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  reputationScore: number;
  isVerifiedTrader: boolean;
  vaultValueCAD: number;
  totalSlabs: number;
  memberSince: string;
}
