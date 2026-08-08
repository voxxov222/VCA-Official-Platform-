import {
  PortfolioItem,
  WatchlistItem,
  MarketAlert,
  MarketplaceListing,
  NewsWireItem,
  ScanResult,
  CardRecord
} from '../types/vca';
import { INITIAL_CARDS_DATABASE } from './cardsDatabase';
import { SEED_SLAB_CERTIFICATE } from './nfcLedgerService';

// Seed Portfolio
export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-001',
    userId: 'user_vca_78901',
    card: INITIAL_CARDS_DATABASE[1], // Pikachu 151
    purchasePriceUSD: 24,
    purchaseDate: '2026-03-14',
    quantity: 1,
    condition: 'GRADED',
    userGrade: 10,
    serialNumber: 'VCA-000-000-001',
    nfcUid: SEED_SLAB_CERTIFICATE.nfcUid,
    certificateId: SEED_SLAB_CERTIFICATE.certificateId,
    notes: 'Vault centerpiece slab. Perfect centering.',
    isGraded: true,
    isAuthenticated: true,
    addedAt: '2026-03-14T10:00:00Z'
  },
  {
    id: 'port-002',
    userId: 'user_vca_78901',
    card: INITIAL_CARDS_DATABASE[0], // Charizard Base Set
    purchasePriceUSD: 280,
    purchaseDate: '2025-11-20',
    quantity: 1,
    condition: 'NM',
    notes: 'Pulled from binder collection. Submitting for VCA grading.',
    isGraded: false,
    isAuthenticated: false,
    addedAt: '2025-11-20T14:30:00Z'
  },
  {
    id: 'port-003',
    userId: 'user_vca_78901',
    card: INITIAL_CARDS_DATABASE[2], // Umbreon VMAX Alt Art
    purchasePriceUSD: 520,
    purchaseDate: '2026-01-10',
    quantity: 1,
    condition: 'NM',
    notes: 'Purchased raw at regional card show.',
    isGraded: false,
    isAuthenticated: false,
    addedAt: '2026-01-10T09:15:00Z'
  }
];

// Seed Watchlist
export const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    id: 'watch-001',
    userId: 'user_vca_78901',
    card: INITIAL_CARDS_DATABASE[3], // Lugia 1st Ed
    targetPriceUSD: 800,
    alertOnPriceDrop: true,
    alertOnPriceRise: true,
    alertOnSignalShift: true,
    alertOnPSA10Movement: true,
    addedAt: '2026-04-01T12:00:00Z',
    notes: 'Waiting for raw NM price dip below $800'
  },
  {
    id: 'watch-002',
    userId: 'user_vca_78901',
    card: INITIAL_CARDS_DATABASE[5], // Rayquaza Star
    targetPriceUSD: 2200,
    alertOnPriceDrop: true,
    alertOnPriceRise: true,
    alertOnSignalShift: true,
    alertOnPSA10Movement: true,
    addedAt: '2026-05-10T16:20:00Z',
    notes: 'Monitoring grail transaction movement'
  }
];

// Seed Alerts
export const INITIAL_ALERTS: MarketAlert[] = [
  {
    id: 'alert-101',
    cardId: 'base1-4',
    cardName: 'Charizard Base Set #4/102',
    type: 'PSA10_SPIKE',
    title: 'CHARIZARD PSA 10 MOVEMENT',
    message: 'PSA 10 sales reached $11,200 (+14.8% over 30 days). Strong collector demand.',
    timestamp: '20 mins ago',
    read: false
  },
  {
    id: 'alert-102',
    cardId: 'swsh7-215',
    cardName: 'Umbreon VMAX Alt Art #215/203',
    type: 'SIGNAL_SHIFT',
    title: 'MARKET SIGNAL SHIFT: STRONG BUY',
    message: 'Umbreon VMAX upgraded to STRONG BUY. Raw-to-PSA 10 spread provides $640+ upside.',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'alert-103',
    cardId: 'sv3pt5-173',
    cardName: 'Pikachu 151 #173/165',
    type: 'NFC_VERIFY',
    title: 'NFC VERIFICATION CONFIRMED',
    message: 'Slab VCA-000-000-001 NTAG424 SUN signature authenticated in vault scan.',
    timestamp: '3 hours ago',
    read: true
  }
];

// Seed Marketplace Listings
export const INITIAL_LISTINGS: MarketplaceListing[] = [
  {
    id: 'list-501',
    serialNumber: 'VCA-000-000-001',
    certificateId: SEED_SLAB_CERTIFICATE.certificateId,
    card: INITIAL_CARDS_DATABASE[1], // Pikachu
    grade: 10,
    gradeLabel: 'GEM MINT',
    sellerId: 'user_vca_78901',
    sellerName: 'Todd W. (Alpha Vault)',
    sellerRating: 4.98,
    listingType: 'AUCTION',
    priceUSD: 280,
    currentBidUSD: 245,
    bidsCount: 14,
    endsAt: '2026-08-08T22:00:00Z',
    isNfcVerified: true,
    createdAt: '2026-08-01T10:00:00Z',
    imageUrl: 'https://images.pokemontcg.io/sv3pt5/173_hires.png'
  },
  {
    id: 'list-502',
    serialNumber: 'VCA-000-000-002',
    certificateId: 'CERT-VCA-002',
    card: INITIAL_CARDS_DATABASE[2], // Umbreon VMAX
    grade: 10,
    gradeLabel: 'GEM MINT',
    sellerId: 'user_mario_99',
    sellerName: 'Tokyo Collectibles Pro',
    sellerRating: 5.0,
    listingType: 'BUY_NOW',
    priceUSD: 1350,
    isNfcVerified: true,
    createdAt: '2026-08-05T14:20:00Z',
    imageUrl: 'https://images.pokemontcg.io/swsh7/215_hires.png'
  },
  {
    id: 'list-503',
    serialNumber: 'VCA-000-000-003',
    certificateId: 'CERT-VCA-003',
    card: INITIAL_CARDS_DATABASE[3], // Lugia
    grade: 9,
    gradeLabel: 'MINT',
    sellerId: 'user_vintage_grails',
    sellerName: 'Heritage Card Vault',
    sellerRating: 4.95,
    listingType: 'ACCEPTING_OFFERS',
    priceUSD: 3100,
    isNfcVerified: true,
    createdAt: '2026-08-06T09:00:00Z',
    imageUrl: 'https://images.pokemontcg.io/neo1/9_hires.png'
  }
];

// Seed Ticker News Wire
export const INITIAL_NEWS_WIRE: NewsWireItem[] = [
  { id: 'w1', category: 'PRICE_UP', text: 'CHARIZARD BASE SET HOLO PSA 10 REACHES $11,200 (+14.8%) IN LATEST PUBLIC AUCTION', timestamp: '2m ago' },
  { id: 'w2', category: 'NEW_GRADING', text: 'VCA SLAB VCA-000-000-001 OFFICIALLY MINTED & NFC BOUND (#10 GEM MINT PIKACHU 151)', timestamp: '12m ago' },
  { id: 'w3', category: 'AUCTION_ALERT', text: 'LIVE AUCTION: UMBREON VMAX ALT ART PSA 10 ENDS IN 2 HOURS (CURRENT BID $1,350)', timestamp: '30m ago' },
  { id: 'w4', category: 'PRICE_UP', text: 'RAYQUAZA GOLD STAR EX DEOXYS SURGES +38.2% 1-YEAR VOLUME CONSENSUS', timestamp: '1h ago' },
  { id: 'w5', category: 'PLATFORM', text: 'VSCAN AI MULTI-CARD VISION ENGINE & NTAG424 ENCRYPTED LEDGER READY', timestamp: '2h ago' }
];

// State storage
let portfolio: PortfolioItem[] = [...INITIAL_PORTFOLIO];
let watchlist: WatchlistItem[] = [...INITIAL_WATCHLIST];
let alerts: MarketAlert[] = [...INITIAL_ALERTS];
let listings: MarketplaceListing[] = [...INITIAL_LISTINGS];
let newsWire: NewsWireItem[] = [...INITIAL_NEWS_WIRE];
let scanHistory: ScanResult[] = [];

// Listeners
const LISTENERS: Array<() => void> = [];
function notify() {
  LISTENERS.forEach(fn => fn());
}

export function subscribePortfolio(callback: () => void): () => void {
  LISTENERS.push(callback);
  return () => {
    const idx = LISTENERS.indexOf(callback);
    if (idx !== -1) LISTENERS.splice(idx, 1);
  };
}

// Portfolio getters & setters
export function getPortfolio(): PortfolioItem[] {
  return [...portfolio];
}

export function addToPortfolio(card: CardRecord, purchasePriceUSD: number, notes?: string): PortfolioItem {
  const newItem: PortfolioItem = {
    id: `port-${Date.now()}`,
    userId: 'user_vca_78901',
    card,
    purchasePriceUSD,
    purchaseDate: new Date().toISOString().split('T')[0],
    quantity: 1,
    condition: 'NM',
    notes,
    isGraded: false,
    isAuthenticated: false,
    addedAt: new Date().toISOString()
  };
  portfolio.unshift(newItem);
  notify();
  return newItem;
}

export function removeFromPortfolio(id: string): void {
  portfolio = portfolio.filter(p => p.id !== id);
  notify();
}

// Watchlist getters & setters
export function getWatchlist(): WatchlistItem[] {
  return [...watchlist];
}

export function addToWatchlist(card: CardRecord, targetPriceUSD?: number, notes?: string): WatchlistItem {
  const existing = watchlist.find(w => w.card.id === card.id);
  if (existing) return existing;

  const newItem: WatchlistItem = {
    id: `watch-${Date.now()}`,
    userId: 'user_vca_78901',
    card,
    targetPriceUSD: targetPriceUSD || card.market.rawPriceUSD,
    alertOnPriceDrop: true,
    alertOnPriceRise: true,
    alertOnSignalShift: true,
    alertOnPSA10Movement: true,
    addedAt: new Date().toISOString(),
    notes
  };
  watchlist.unshift(newItem);

  // Trigger notification alert
  addAlert({
    cardId: card.id,
    cardName: `${card.pokemonName} (${card.setName})`,
    type: 'SIGNAL_SHIFT',
    title: 'CARD ADDED TO WATCHLIST',
    message: `Monitoring ${card.pokemonName} #${card.cardNumber}. Real-time alerts activated for target $${newItem.targetPriceUSD}.`,
    timestamp: 'Just now',
    read: false
  });

  notify();
  return newItem;
}

export function removeFromWatchlist(id: string): void {
  watchlist = watchlist.filter(w => w.id !== id);
  notify();
}

// Alerts
export function getAlerts(): MarketAlert[] {
  return [...alerts];
}

export function addAlert(alert: Omit<MarketAlert, 'id'>): MarketAlert {
  const newAlert: MarketAlert = {
    id: `alert-${Date.now()}`,
    ...alert
  };
  alerts.unshift(newAlert);
  notify();
  return newAlert;
}

export function markAlertAsRead(id: string): void {
  const a = alerts.find(item => item.id === id);
  if (a) {
    a.read = true;
    notify();
  }
}

export function markAllAlertsAsRead(): void {
  alerts.forEach(a => a.read = true);
  notify();
}

// Marketplace
export function getMarketplaceListings(): MarketplaceListing[] {
  return [...listings];
}

export function placeAuctionBid(listingId: string, bidAmountUSD: number): boolean {
  const item = listings.find(l => l.id === listingId);
  if (item && item.listingType === 'AUCTION') {
    if (bidAmountUSD > (item.currentBidUSD || item.priceUSD)) {
      item.currentBidUSD = bidAmountUSD;
      item.bidsCount = (item.bidsCount || 0) + 1;
      
      addAlert({
        cardId: item.card.id,
        cardName: `${item.card.pokemonName} #${item.card.cardNumber}`,
        type: 'AUCTION_CLOSE',
        title: 'NEW HIGH BID PLACED',
        message: `Your bid of $${bidAmountUSD.toLocaleString()} is now highest for Slab ${item.serialNumber}.`,
        timestamp: 'Just now',
        read: false
      });

      notify();
      return true;
    }
  }
  return false;
}

// News Wire
export function getNewsWire(): NewsWireItem[] {
  return [...newsWire];
}

// Scan History
export function addScanToHistory(result: ScanResult): void {
  scanHistory.unshift(result);
  notify();
}

export function getScanHistory(): ScanResult[] {
  return [...scanHistory];
}
