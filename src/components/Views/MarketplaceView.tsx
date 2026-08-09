import React, { useState } from 'react';
import { 
  Store, Flame, Clock, Tag, Heart, PlusCircle, PackageCheck, ShieldCheck, 
  Sparkles, Layers, DollarSign, CheckCircle2, Truck, Image as ImageIcon, Send
} from 'lucide-react';
import { MOCK_AUCTIONS, MOCK_LISTINGS, MOCK_SLABS } from '../../mockData/cards';
import { HolographicLabel } from '../HolographicLabel';
import { HoloCardImage } from '../HoloCardImage';
import { VCASlab } from '../../types';

interface AuctionItem {
  id: string;
  slab: VCASlab;
  sellerUsername: string;
  currentBidCAD: number;
  bidCount: number;
  endsIn: string;
  watchersCount: number;
  recentBids: { bidder: string; amountCAD: number; timestamp: string }[];
}

interface SupplierMasterSet {
  id: string;
  title: string;
  setGroup: string;
  totalCardsCount: number;
  priceCAD: number;
  supplierName: string;
  imageUrl: string;
  description: string;
  includesAlbum: boolean;
  includesReverseHolos: boolean;
  includesSIRs: boolean;
  stockCount: number;
}

const SUPPLIER_MASTER_SETS: SupplierMasterSet[] = [
  {
    id: 'set-151-master',
    title: 'Pokémon 151 Complete Master Set (207/165 Cards)',
    setGroup: 'Scarlet & Violet 151',
    totalCardsCount: 207,
    priceCAD: 1450,
    supplierName: 'Kanto Direct Wholesale Vaults',
    imageUrl: 'https://images.pokemontcg.io/sv3pt5/183_hires.png',
    description: '100% complete set including all 165 base cards, all Reverse Holos, all Full Arts, and all 12 Special Illustration Rares (Charizard, Blastoise, Venusaur ex). Housed in custom VCA Master Vault binder with individual ultra-clear sleeves.',
    includesAlbum: true,
    includesReverseHolos: true,
    includesSIRs: true,
    stockCount: 4
  },
  {
    id: 'set-base-1st-ed',
    title: 'Base Set 1st Edition 1999 Master Set (102/102 Complete)',
    setGroup: 'Base Set 1st Edition',
    totalCardsCount: 102,
    priceCAD: 18900,
    supplierName: 'VCA Institutional Reserve Vault',
    imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png',
    description: 'Ultra-rare complete 102/102 Shadowless 1st Edition Base Set. Includes 1st Edition Charizard #4, Blastoise #2, Venusaur #15. All holos slabbed or encapsulated with VCA High-Security Vault seal.',
    includesAlbum: true,
    includesReverseHolos: false,
    includesSIRs: false,
    stockCount: 1
  },
  {
    id: 'set-evolving-skies',
    title: 'Evolving Skies Complete Master Set (237/203 Cards)',
    setGroup: 'Sword & Shield Evolving Skies',
    totalCardsCount: 237,
    priceCAD: 3200,
    supplierName: 'Dragon Vault Distributors',
    imageUrl: 'https://images.pokemontcg.io/swsh7/215_hires.png',
    description: 'Complete Evolving Skies master set including Umbreon VMAX Alt Art (#215 Moonbreon), Rayquaza VMAX Alt Art, and all Eeveelution secret rares in Near Mint / Gem Mint condition.',
    includesAlbum: true,
    includesReverseHolos: true,
    includesSIRs: true,
    stockCount: 3
  },
  {
    id: 'set-crown-zenith',
    title: 'Crown Zenith + Galarian Gallery Complete Set (160/159 + GG70)',
    setGroup: 'Crown Zenith',
    totalCardsCount: 230,
    priceCAD: 890,
    supplierName: 'Galar Direct Trading Co.',
    imageUrl: 'https://images.pokemontcg.io/swsh12pt5/GG70_hires.png',
    description: '100% complete Crown Zenith set with full 70-card Galarian Gallery subset (Mewtwo VSTAR, Giratina VSTAR, Arceus VSTAR, Palkia & Dialga). Complete in VCA premium display album.',
    includesAlbum: true,
    includesReverseHolos: true,
    includesSIRs: true,
    stockCount: 8
  }
];

export const MarketplaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'auctions' | 'fixed' | 'suppliers'>('auctions');
  const [biddingAuction, setBiddingAuction] = useState<AuctionItem | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [auctionsState, setAuctionsState] = useState<AuctionItem[]>(MOCK_AUCTIONS);
  const [listingsState, setListingsState] = useState(MOCK_LISTINGS);

  // Post new item state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postType, setPostType] = useState<'FIXED' | 'AUCTION'>('FIXED');
  const [cardNameInput, setCardNameInput] = useState('');
  const [cardSetInput, setCardSetInput] = useState('Scarlet & Violet 151');
  const [cardNumberInput, setCardNumberInput] = useState('173/165');
  const [gradeInput, setGradeInput] = useState('10');
  const [priceInput, setPriceInput] = useState('450');
  const [imageUrlInput, setImageUrlInput] = useState('https://images.pokemontcg.io/sv3pt5/173_hires.png');
  const [descriptionInput, setDescriptionInput] = useState('VCA authenticated slab in flawless Gem Mint condition. Fast shipping!');

  // Supplier Purchase state
  const [selectedSetToBuy, setSelectedSetToBuy] = useState<SupplierMasterSet | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePlaceBid = (auction: AuctionItem) => {
    if (bidAmount <= auction.currentBidCAD) {
      alert(`Bid must exceed current bid of $${auction.currentBidCAD} CAD!`);
      return;
    }

    setAuctionsState(prev => prev.map(a => {
      if (a.id === auction.id) {
        return {
          ...a,
          currentBidCAD: bidAmount,
          bidCount: a.bidCount + 1,
          recentBids: [{ bidder: 'Alex Vance (You)', amountCAD: bidAmount, timestamp: 'Just now' }, ...a.recentBids]
        };
      }
      return a;
    }));

    setBiddingAuction(null);
    alert(`High Bid of CAD $${bidAmount} placed on ${auction.slab.card.name}!`);
  };

  const handleCreateUserListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNameInput.trim()) {
      alert('Please enter a card name!');
      return;
    }

    const newSlab: VCASlab = {
      serialNumber: `VCA-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
      nfcUid: `04:${Math.floor(10 + Math.random() * 80)}:A2:B3:C4:D5:E6`,
      overallGrade: Number(gradeInput) || 10,
      gradeLabel: Number(gradeInput) >= 10 ? 'GEM MINT' : 'MINT',
      tier: 'Gem Mint',
      subgrades: {
        centering: 10,
        corners: 9.5,
        edges: 10,
        surface: 10,
        overall: 10
      },
      card: {
        id: `custom-${Date.now()}`,
        name: cardNameInput,
        set: cardSetInput,
        number: cardNumberInput,
        rarity: 'Special Illustration Rare',
        variant: 'Full Art',
        language: 'English',
        releaseYear: 2024,
        imageUrl: imageUrlInput || 'https://images.pokemontcg.io/sv3pt5/173_hires.png',
        rawPrice: 180,
        psa9Price: 300,
        psa10Price: Number(priceInput) || 450,
        sources: [],
        consensus: {
          rawConsensus: 180,
          psa9Consensus: 300,
          psa10Consensus: Number(priceInput) || 450,
          confidence: 'HIGH',
          marketSignal: 'STRONG BUY',
          signalReason: 'Fresh user marketplace submission',
          change30dPercent: 12.5,
          highestRecorded: 500,
          lowestRecorded: 150
        },
        priceHistory: []
      },
      mintedAt: new Date().toISOString(),
      ownerUid: 'usr_vca_master_001',
      ownerName: 'Alex Vance',
      ownerAddress: '0x71C...392B',
      signatureHistory: [],
      verificationHash: `vca_sha256_${Date.now()}`,
      isAuthentic: true,
      tamperSealIntact: true,
      vaultValueCAD: Number(priceInput) || 450,
      images: [imageUrlInput || 'https://images.pokemontcg.io/sv3pt5/173_hires.png']
    };

    if (postType === 'FIXED') {
      const newListing = {
        id: `list-${Date.now()}`,
        slab: newSlab,
        sellerName: 'Alex Vance (You)',
        priceCAD: Number(priceInput) || 450,
        listedDate: 'Just now'
      };
      setListingsState([newListing, ...listingsState]);
      setActiveTab('fixed');
      alert(`Card "${cardNameInput}" successfully posted to Buy Now Marketplace!`);
    } else {
      const newAuction: AuctionItem = {
        id: `auc-${Date.now()}`,
        slab: newSlab,
        sellerUsername: 'Alex Vance (You)',
        currentBidCAD: Number(priceInput) || 100,
        bidCount: 1,
        endsIn: '3d 23h',
        watchersCount: 1,
        recentBids: [{ bidder: 'Alex Vance (Starting Bid)', amountCAD: Number(priceInput) || 100, timestamp: 'Just now' }]
      };
      setAuctionsState([newAuction, ...auctionsState]);
      setActiveTab('auctions');
      alert(`Auction for "${cardNameInput}" created successfully!`);
    }

    setIsPostModalOpen(false);
  };

  const handleConfirmSupplierOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setSelectedSetToBuy(null);
      alert('Order Confirmed! Your Master Set is scheduled for VCA Vault Insured Express Shipping.');
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Post Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
              VERIFIED VCA MARKETPLACE & SUPPLIER VAULT
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            NFC-VERIFIED SLABS & WHOLESALE MASTER SETS • ZERO FRAUD ESCROW GUARANTEE
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-amber-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>SELL / LIST CARD FOR SALE</span>
          </button>

          {/* Tab Switcher */}
          <div className="flex gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('auctions')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'auctions' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>LIVE AUCTIONS ({auctionsState.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('fixed')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'fixed' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              <Tag className="w-4 h-4 text-cyan-400" />
              <span>BUY NOW ({listingsState.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'suppliers' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400'
              }`}
            >
              <PackageCheck className="w-4 h-4 text-purple-400" />
              <span>FULL MASTER SETS ({SUPPLIER_MASTER_SETS.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE AUCTION ROOMS */}
      {activeTab === 'auctions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {auctionsState.map((auc) => (
            <div key={auc.id} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
              
              {/* Header bar with countdown timer */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>ENDS IN: {auc.endsIn}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{auc.watchersCount} Watchers</span>
                </div>
              </div>

              {/* Card info */}
              <div className="flex items-start gap-4">
                <HoloCardImage
                  src={auc.slab?.card?.imageUrl || 'https://images.pokemontcg.io/base1/4_hires.png'}
                  alt={auc.slab?.card?.name || (auc.slab?.card as any)?.pokemonName || 'Card'}
                  className="w-24 h-34 object-cover rounded-xl"
                  containerClassName="shrink-0"
                  onClick={() => {
                    setBiddingAuction(auc);
                    setBidAmount((auc.currentBidCAD || 0) + 25);
                  }}
                />
                <div className="flex-1 min-w-0 space-y-2">
                  {auc.slab && (
                    <HolographicLabel
                      grade={auc.slab.overallGrade}
                      gradeText={auc.slab.gradeLabel}
                      serialNumber={auc.slab.serialNumber}
                      size="sm"
                    />
                  )}
                  <h3 className="font-display font-black text-lg text-slate-100 truncate mt-1">
                    {auc.slab?.card?.name || (auc.slab?.card as any)?.pokemonName || 'Unknown Card'}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 truncate">
                    {auc.slab?.card?.set || (auc.slab?.card as any)?.setName} • #{auc.slab?.card?.number || (auc.slab?.card as any)?.cardNumber}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">CURRENT HIGH BID</div>
                      <div className="text-xl font-mono font-black text-amber-300">
                        CAD ${(auc.currentBidCAD || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-400">BIDS</div>
                      <div className="text-sm font-mono font-bold text-slate-200">{auc.bidCount} Bids</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bids Ticker */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="text-[10px] text-slate-500 font-bold">LIVE BID FEED:</div>
                {auc.recentBids.slice(0, 2).map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="truncate">{b.bidder}</span>
                    <span className="text-amber-300 font-bold">${b.amountCAD} CAD ({b.timestamp})</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  setBiddingAuction(auc);
                  setBidAmount(auc.currentBidCAD + 25);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-display font-black text-xs tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-[1.01] transition-all cursor-pointer"
              >
                PLACE HIGH BID
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: FIXED BUY NOW */}
      {activeTab === 'fixed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listingsState.map((item) => (
            <div key={item.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all">
              <HolographicLabel
                grade={item.slab.overallGrade}
                gradeText={item.slab.gradeLabel}
                serialNumber={item.slab.serialNumber}
                size="sm"
              />

              <div className="flex items-start gap-4">
                <HoloCardImage
                  src={item.slab?.card?.imageUrl || 'https://images.pokemontcg.io/base1/4_hires.png'}
                  alt={item.slab?.card?.name || (item.slab?.card as any)?.pokemonName || 'Card'}
                  className="w-20 h-28 object-cover rounded-xl"
                  containerClassName="shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-display font-bold text-base text-slate-100 truncate">{item.slab?.card?.name || (item.slab?.card as any)?.pokemonName || 'Unknown Card'}</h3>
                  <div className="text-xs font-mono text-slate-400 truncate">{item.slab?.card?.set || (item.slab?.card as any)?.setName}</div>
                  <div className="text-xs font-mono text-slate-400">Seller: <span className="text-cyan-300">{item.sellerName}</span></div>
                  <div className="text-xl font-mono font-black text-emerald-400 pt-2">CAD ${(item.priceCAD || 0).toLocaleString()}</div>
                </div>
              </div>

              <button
                onClick={() => alert(`Purchased ${item.slab?.card?.name || 'Card'} for $${item.priceCAD} CAD! Slab moved to your Vault.`)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs tracking-wider cursor-pointer"
              >
                BUY NOW WITH VCA ESCROW
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FULL MASTER SETS FROM SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/40 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-300 font-display font-bold text-lg">
                <PackageCheck className="w-5 h-5 text-purple-400" />
                <span>DIRECT SUPPLIER MASTER SETS & WHOLESALE VAULT</span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">
                Purchase 100% complete Pokémon master sets sourced directly from authorized wholesale distributors and institutional reserve vaults. Includes custom VCA display albums, Reverse Holos, and guaranteed VCA authenticity certificates.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>VCA DIRECT INSURED SHIPPING</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUPPLIER_MASTER_SETS.map((mSet) => (
              <div key={mSet.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-purple-500/40 transition-all">
                
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <HoloCardImage
                    src={mSet.imageUrl}
                    alt={mSet.title}
                    className="w-32 h-44 object-cover rounded-xl"
                    containerClassName="shrink-0 self-center sm:self-start"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold uppercase">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>100% COMPLETE MASTER SET</span>
                    </div>

                    <h3 className="font-display font-black text-lg text-slate-100">
                      {mSet.title}
                    </h3>

                    <div className="text-xs font-mono text-slate-400">
                      Supplier: <span className="text-cyan-300 font-bold">{mSet.supplierName}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {mSet.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                      <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        📦 {mSet.totalCardsCount} Cards Included
                      </span>
                      {mSet.includesAlbum && (
                        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                          📘 VCA Master Album
                        </span>
                      )}
                      {mSet.includesSIRs && (
                        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300">
                          ✨ All Alt Arts & SIRs Included
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">DIRECT WHOLESALE PRICE</div>
                    <div className="text-2xl font-mono font-black text-purple-300">
                      CAD ${(mSet.priceCAD || 0).toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSetToBuy(mSet)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-slate-950 font-display font-extrabold text-xs tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4 text-slate-950" />
                    <span>PURCHASE FULL SET FROM SUPPLIER</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: POST NEW CARD FOR SALE */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-cyan-500/40 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-lg text-slate-100">
                  LIST YOUR CARD FOR SALE / AUCTION
                </h3>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ CANCEL
              </button>
            </div>

            <form onSubmit={handleCreateUserListing} className="space-y-4 text-xs font-mono">
              
              {/* Listing Type */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">LISTING TYPE:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostType('FIXED')}
                    className={`py-2.5 rounded-xl font-bold transition-all ${
                      postType === 'FIXED' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    🏷️ BUY NOW (FIXED PRICE)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('AUCTION')}
                    className={`py-2.5 rounded-xl font-bold transition-all ${
                      postType === 'AUCTION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    🔥 LIVE AUCTION ROOM
                  </button>
                </div>
              </div>

              {/* Card Title */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">POKÉMON CARD NAME:</label>
                <input
                  type="text"
                  required
                  value={cardNameInput}
                  onChange={(e) => setCardNameInput(e.target.value)}
                  placeholder="e.g. Charizard ex Special Illustration Rare"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Set & Number */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">SET NAME:</label>
                  <input
                    type="text"
                    value={cardSetInput}
                    onChange={(e) => setCardSetInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">CARD NUMBER:</label>
                  <input
                    type="text"
                    value={cardNumberInput}
                    onChange={(e) => setCardNumberInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Price CAD & Grade */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">
                    {postType === 'FIXED' ? 'BUY NOW PRICE (CAD $):' : 'STARTING BID (CAD $):'}
                  </label>
                  <input
                    type="number"
                    required
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">VCA GRADE:</label>
                  <select
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="10">10 (GEM MINT)</option>
                    <option value="9.5">9.5 (MINT+)</option>
                    <option value="9">9 (MINT)</option>
                    <option value="8.5">8.5 (NM/MT+)</option>
                    <option value="8">8 (NM/MT)</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">CARD IMAGE URL:</label>
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">DESCRIPTION & CONDITION DETAILS:</label>
                <textarea
                  rows={2}
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-display font-black text-xs uppercase tracking-wider"
                >
                  PUBLISH LISTING NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPPLIER PURCHASE CHECKOUT MODAL */}
      {selectedSetToBuy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-purple-500/40 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-purple-400" />
                <h3 className="font-display font-bold text-lg text-slate-100">
                  SUPPLIER MASTER SET CHECKOUT
                </h3>
              </div>
              <button
                onClick={() => setSelectedSetToBuy(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ CANCEL
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-slate-100 font-bold text-sm">{selectedSetToBuy.title}</div>
                <div className="text-slate-400">Supplier: <span className="text-cyan-300">{selectedSetToBuy.supplierName}</span></div>
                <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-black">
                  <span className="text-slate-300">TOTAL PRICE:</span>
                  <span className="text-purple-300">CAD ${(selectedSetToBuy.priceCAD || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>VCA DIRECT VAULT ESCROW & INSURED SHIPPING INCLUDED</span>
                </div>
                <div>Your purchase is protected by 100% money-back supplier authenticity guarantee.</div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-slate-300 font-bold block">SELECT PAYMENT METHOD:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 px-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold text-center">
                    💳 Credit Card / Apple Pay
                  </button>
                  <button className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-center">
                    ⚡ Crypto (ETH / USDC)
                  </button>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  onClick={() => setSelectedSetToBuy(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleConfirmSupplierOrder}
                  disabled={orderSuccess}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {orderSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950 animate-bounce" />
                      <span>ORDER CONFIRMED!</span>
                    </>
                  ) : (
                    <span>CONFIRM & PLACE ORDER</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BIDDING MODAL */}
      {biddingAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-amber-500/40 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-slate-100">
              PLACE BID: {biddingAuction.slab.card.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Current High Bid: <span className="text-amber-300 font-bold">${biddingAuction.currentBidCAD} CAD</span>
            </p>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 block">YOUR BID AMOUNT (CAD $):</label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-lg font-mono text-amber-300 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setBiddingAuction(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
              >
                CANCEL
              </button>
              <button
                onClick={() => handlePlaceBid(biddingAuction)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-extrabold text-xs tracking-wider"
              >
                CONFIRM BID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

