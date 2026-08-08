import React, { useState } from 'react';
import { 
  Store, Flame, Clock, Tag, Heart
} from 'lucide-react';
import { MOCK_AUCTIONS, MOCK_LISTINGS } from '../../mockData/cards';
import { HolographicLabel } from '../HolographicLabel';
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

export const MarketplaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'auctions' | 'fixed'>('auctions');
  const [biddingAuction, setBiddingAuction] = useState<AuctionItem | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [auctionsState, setAuctionsState] = useState<AuctionItem[]>(MOCK_AUCTIONS);

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

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
              VERIFIED VCA MARKETPLACE & LIVE AUCTIONS
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            NFC-VERIFIED SLABS ONLY • ZERO FRAUD ESCROW GUARANTEE
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('auctions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'auctions' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>LIVE AUCTION ROOMS ({auctionsState.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('fixed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'fixed' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
            }`}
          >
            <Tag className="w-4 h-4 text-cyan-400" />
            <span>BUY NOW LISTINGS ({MOCK_LISTINGS.length})</span>
          </button>
        </div>
      </div>

      {/* TAB: LIVE AUCTION ROOMS */}
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
                <img
                  src={auc.slab.card.imageUrl}
                  alt={auc.slab.card.name}
                  className="w-24 h-34 object-cover rounded-xl border border-slate-700 shadow-md shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-2">
                  <HolographicLabel
                    grade={auc.slab.overallGrade}
                    gradeText={auc.slab.gradeLabel}
                    serialNumber={auc.slab.serialNumber}
                    size="sm"
                  />
                  <h3 className="font-display font-black text-lg text-slate-100 truncate mt-1">
                    {auc.slab.card.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 truncate">
                    {auc.slab.card.set} • #{auc.slab.card.number}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">CURRENT HIGH BID</div>
                      <div className="text-xl font-mono font-black text-amber-300">
                        CAD ${auc.currentBidCAD.toLocaleString()}
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

      {/* TAB: FIXED BUY NOW */}
      {activeTab === 'fixed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LISTINGS.map((item) => (
            <div key={item.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all">
              <HolographicLabel
                grade={item.slab.overallGrade}
                gradeText={item.slab.gradeLabel}
                serialNumber={item.slab.serialNumber}
                size="sm"
              />

              <div className="flex items-start gap-4">
                <img src={item.slab.card.imageUrl} alt={item.slab.card.name} className="w-20 h-28 object-cover rounded-xl border border-slate-700 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-display font-bold text-base text-slate-100 truncate">{item.slab.card.name}</h3>
                  <div className="text-xs font-mono text-slate-400 truncate">{item.slab.card.set}</div>
                  <div className="text-xs font-mono text-slate-400">Seller: <span className="text-cyan-300">{item.sellerName}</span></div>
                  <div className="text-xl font-mono font-black text-emerald-400 pt-2">CAD ${item.priceCAD.toLocaleString()}</div>
                </div>
              </div>

              <button
                onClick={() => alert(`Purchased ${item.slab.card.name} for $${item.priceCAD} CAD! Slab moved to your Vault.`)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs tracking-wider"
              >
                BUY NOW WITH VCA ESCROW
              </button>
            </div>
          ))}
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
