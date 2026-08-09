import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, DollarSign, Award, Flame, Search, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { getMarketplaceListings, placeAuctionBid, subscribePortfolio } from '../services/portfolioService';
import { MarketplaceListing } from '../types/vca';

export const MarketplaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buy_now' | 'auctions'>('buy_now');
  const [listings, setListings] = useState<MarketplaceListing[]>(getMarketplaceListings());
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [purchasedId, setPurchasedId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribePortfolio(() => setListings(getMarketplaceListings()));
    return unsub;
  }, []);

  const buyNowListings = listings.filter(l => l.listingType === 'BUY_NOW' || l.listingType === 'ACCEPTING_OFFERS');
  const auctionListings = listings.filter(l => l.listingType === 'AUCTION');

  const handlePlaceBid = () => {
    if (!selectedListing) return;
    placeAuctionBid(selectedListing.id, bidAmount);
    setSelectedListing(null);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <h2 className="font-display font-black text-2xl text-white">VCA MARKETPLACE & LIVE AUCTIONS</h2>
          </div>
          <p className="text-xs font-mono text-amber-400/80 mt-1">
            Authenticated VCA Slabs • Guaranteed Cryptographic NTAG424 Ownership Transfer
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('buy_now')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'buy_now' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
            }`}
          >
            BUY NOW ({buyNowListings.length})
          </button>
          <button
            onClick={() => setActiveTab('auctions')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'auctions' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>LIVE AUCTIONS ({auctionListings.length})</span>
          </button>
        </div>
      </div>

      {/* Buy Now Section */}
      {activeTab === 'buy_now' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {buyNowListings.map(item => (
            <div key={item.id} className="glass-panel p-4 rounded-2xl border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="relative flex justify-center pt-2">
                <img src={item.card?.imageUrl || 'https://images.pokemontcg.io/base1/4_hires.png'} alt={item.card?.pokemonName || (item.card as any)?.name || 'Card'} className="h-44 object-contain rounded-xl" />
                <span className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-mono font-black text-[9px] px-2 py-0.5 rounded uppercase">
                  #{item.grade} GEM MINT
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{item.card?.pokemonName || (item.card as any)?.name || 'Unknown Card'}</div>
                  <div className="text-cyan-400">{item.card?.setName || (item.card as any)?.set} #{item.card?.cardNumber || (item.card as any)?.number}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Seller: {item.sellerName}</div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-display font-black text-amber-300 text-base">${item.priceUSD.toLocaleString()}</span>
                  <button
                    onClick={() => setPurchasedId(item.id)}
                    disabled={purchasedId === item.id}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
                  >
                    {purchasedId === item.id ? 'PURCHASED ✓' : 'BUY NOW'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Auctions Section */}
      {activeTab === 'auctions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {auctionListings.map(auc => (
            <div key={auc.id} className="glass-panel p-4 rounded-2xl border-rose-500/30 space-y-3 flex flex-col justify-between bg-rose-950/10">
              <div className="relative flex justify-center pt-2">
                <img src={auc.card?.imageUrl || 'https://images.pokemontcg.io/base1/4_hires.png'} alt={auc.card?.pokemonName || (auc.card as any)?.name || 'Card'} className="h-44 object-contain rounded-xl" />
                <span className="absolute top-0 right-0 bg-rose-500 text-slate-950 font-mono font-black text-[9px] px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  <span>#{auc.grade} GEM MINT</span>
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{auc.card?.pokemonName || (auc.card as any)?.name || 'Unknown Card'}</div>
                  <div className="text-cyan-400">{auc.card?.setName || (auc.card as any)?.set} #{auc.card?.cardNumber || (auc.card as any)?.number}</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">CURRENT HIGH BID:</span>
                    <span className="font-bold text-emerald-400">${(auc.currentBidUSD || auc.priceUSD).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TOTAL BIDS:</span>
                    <span className="text-slate-300">{auc.bidsCount || 0} bids</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ENDS AT:</span>
                    <span className="text-rose-400 font-bold">{new Date(auc.endsAt || '').toLocaleTimeString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedListing(auc);
                    setBidAmount((auc.currentBidUSD || auc.priceUSD) + 25);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-all"
                >
                  PLACE BID
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bid Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-[#030508]/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#070b12] border border-rose-500/40 rounded-3xl p-6 space-y-4 font-mono text-xs text-white">
            <h3 className="font-display font-bold text-base text-rose-300">PLACE LIVE AUCTION BID</h3>
            <p className="text-slate-400">{selectedListing.card.pokemonName} #{selectedListing.grade} Gem Mint</p>
            <div>
              <label className="text-slate-400 block mb-1">YOUR BID AMOUNT ($ USD)</label>
              <input
                type="number"
                value={bidAmount}
                onChange={e => setBidAmount(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-400 font-bold focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedListing(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceBid}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-slate-950 font-bold hover:bg-rose-400"
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
