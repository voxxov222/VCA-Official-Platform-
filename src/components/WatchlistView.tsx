import React, { useState, useEffect } from 'react';
import { 
  Bell, Eye, Plus, Trash2, ArrowUpRight, ArrowDownRight, ShieldCheck, 
  Sparkles, Sliders, CheckCircle2, AlertTriangle, RefreshCw, Filter, Search,
  Zap, TrendingUp, Layers, Check
} from 'lucide-react';
import { 
  getWatchlist, removeFromWatchlist, addToWatchlist, getAlerts, addAlert, 
  markAlertAsRead, markAllAlertsAsRead, subscribePortfolio 
} from '../services/portfolioService';
import { INITIAL_CARDS_DATABASE } from '../services/cardsDatabase';
import { WatchlistItem, MarketAlert, CardRecord } from '../types/vca';

interface WatchlistViewProps {
  onOpenScanner?: () => void;
  onSelectCard?: (card: CardRecord) => void;
  onToast?: (msg: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({ onOpenScanner, onSelectCard, onToast }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(getWatchlist());
  const [alerts, setAlerts] = useState<MarketAlert[]>(getAlerts());
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'ALERTS'>('ITEMS');

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardForWatch, setSelectedCardForWatch] = useState<CardRecord>(INITIAL_CARDS_DATABASE[0]);
  const [targetPrice, setTargetPrice] = useState<number>(INITIAL_CARDS_DATABASE[0].market.rawPriceUSD);
  const [notes, setNotes] = useState('');

  // Filter state for alerts
  const [alertFilter, setAlertFilter] = useState<string>('ALL');

  useEffect(() => {
    const unsubscribe = subscribePortfolio(() => {
      setWatchlist(getWatchlist());
      setAlerts(getAlerts());
    });
    return unsubscribe;
  }, []);

  const handleAddWatchlistItem = (e: React.FormEvent) => {
    e.preventDefault();
    addToWatchlist(selectedCardForWatch, targetPrice, notes);
    onToast?.(`Added ${selectedCardForWatch.pokemonName} #${selectedCardForWatch.cardNumber} to Watchlist!`);
    setShowAddModal(false);
    setNotes('');
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeFromWatchlist(id);
    onToast?.(`Removed ${name} from Watchlist.`);
  };

  // Simulate real-time price change & market signal shift alert trigger
  const handleSimulateAlert = () => {
    const randomCard = watchlist.length > 0 
      ? watchlist[Math.floor(Math.random() * watchlist.length)].card 
      : INITIAL_CARDS_DATABASE[Math.floor(Math.random() * INITIAL_CARDS_DATABASE.length)];

    const alertTypes: Array<{ type: MarketAlert['type']; title: string; message: string }> = [
      {
        type: 'PRICE_DROP',
        title: `PRICE DROP ALERT: ${randomCard.pokemonName.toUpperCase()}`,
        message: `Raw NM market price dropped to $${(randomCard.market.rawPriceUSD * 0.88).toFixed(2)} (-12.0%). Target threshold breached!`
      },
      {
        type: 'PSA10_SPIKE',
        title: `PSA 10 VALUE SPIKE: ${randomCard.pokemonName.toUpperCase()}`,
        message: `PSA 10 sales surged to $${(randomCard.market.psa10PriceUSD * 1.15).toFixed(2)} (+15.0%). Volume consensus spiking!`
      },
      {
        type: 'SIGNAL_SHIFT',
        title: `SIGNAL SHIFT: ${randomCard.pokemonName.toUpperCase()}`,
        message: `VCA consensus upgraded signal to STRONG BUY due to expanding raw-to-graded upside spread.`
      }
    ];

    const chosenAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];

    addAlert({
      cardId: randomCard.id,
      cardName: `${randomCard.pokemonName} #${randomCard.cardNumber}`,
      type: chosenAlert.type,
      title: chosenAlert.title,
      message: chosenAlert.message,
      timestamp: 'Just now',
      read: false
    });

    onToast?.(`🔔 Real-Time Alert Dispatched for ${randomCard.pokemonName}!`);
  };

  const filteredAlerts = alerts.filter(a => {
    if (alertFilter === 'ALL') return true;
    if (alertFilter === 'UNREAD') return !a.read;
    return a.type === alertFilter;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="hud-scanlines absolute inset-0 opacity-20 pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-2xl text-white">WATCHLIST & REAL-TIME ALERTS</h2>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-xs animate-bounce">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-400/80">
                Automated Price Movement Triggers • Market Signal Shifts • PSA 10 Arbitrage Alerts
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleSimulateAlert}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-950/40 transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>SIMULATE REAL-TIME ALERT</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-display font-extrabold text-xs tracking-wider hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>ADD CARD TO WATCHLIST</span>
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-bold">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('ITEMS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ITEMS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>WATCHED CARDS ({watchlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ALERTS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ALERTS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>REAL-TIME NOTIFICATION FEED ({alerts.length})</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>
        </div>

        {activeTab === 'ALERTS' && alerts.length > 0 && (
          <button
            onClick={() => markAllAlertsAsRead()}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>MARK ALL AS READ</span>
          </button>
        )}
      </div>

      {/* TAB 1: WATCHED CARDS */}
      {activeTab === 'ITEMS' && (
        <div className="space-y-4">
          {watchlist.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <Eye className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-300">NO CARDS ON WATCHLIST</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Add Pokémon cards to your watchlist to monitor live price drops, PSA 10 value spikes, and VCA consensus market signal upgrades.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                + ADD YOUR FIRST CARD
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlist.map(item => {
                const isUnderTarget = item.card?.market ? item.card.market.rawPriceUSD <= item.targetPriceUSD : false;
                return (
                  <div key={item.id} className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 relative group">
                    <div className="flex gap-4">
                      <img
                        src={item.card?.imageUrl || ''}
                        alt={item.card?.pokemonName || (item.card as any)?.name || 'Card'}
                        className="w-20 h-28 object-cover rounded-xl border border-amber-500/30 shadow-lg shrink-0"
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            {item.card?.variant}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id, item.card?.pokemonName || (item.card as any)?.name || '')}
                            className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                            title="Remove from watchlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="font-display font-bold text-sm text-white truncate">
                          {item.card?.pokemonName || (item.card as any)?.name || 'Unknown Card'}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {item.card?.setName || (item.card as any)?.set} • #{item.card?.cardNumber || (item.card as any)?.number}
                        </div>

                        {/* Price & Target */}
                        <div className="pt-2 space-y-0.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Current Raw:</span>
                            <span className="font-bold text-white">${(item.card?.market?.rawPriceUSD || 0).toFixed(2)} USD</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Target Trigger:</span>
                            <span className={`font-bold ${isUnderTarget ? 'text-emerald-400' : 'text-amber-300'}`}>
                              ${item.targetPriceUSD.toFixed(2)} USD
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alert Toggles Indicators */}
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] space-y-1.5">
                      <div className="text-slate-500 font-bold uppercase tracking-wider">ACTIVE TRIGGERS</div>
                      <div className="flex flex-wrap gap-1.5 text-slate-300">
                        {item.alertOnPriceDrop && <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">↓ Price Drop</span>}
                        {item.alertOnPriceRise && <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">↑ Price Spike</span>}
                        {item.alertOnSignalShift && <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">⚡ Signal Upgrade</span>}
                        {item.alertOnPSA10Movement && <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">💎 PSA 10 Arbitrage</span>}
                      </div>
                    </div>

                    {item.notes && (
                      <div className="text-[11px] text-slate-400 italic">"{item.notes}"</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALERTS FEED */}
      {activeTab === 'ALERTS' && (
        <div className="space-y-4">
          
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            {['ALL', 'UNREAD', 'PRICE_DROP', 'PSA10_SPIKE', 'SIGNAL_SHIFT', 'NFC_VERIFY'].map((f) => (
              <button
                key={f}
                onClick={() => setAlertFilter(f)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  alertFilter === f ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Alert Cards */}
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-500">
              No market alerts match your filter criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map(a => (
                <div
                  key={a.id}
                  onClick={() => markAlertAsRead(a.id)}
                  className={`glass-panel p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                    a.read ? 'border-slate-800 opacity-80' : 'border-amber-500/40 bg-amber-950/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {!a.read && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                      <span className="font-bold text-amber-300 text-sm">{a.title}</span>
                      <span className="text-[10px] text-slate-500">{a.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-xs font-sans leading-relaxed">{a.message}</p>
                  </div>

                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-bold uppercase shrink-0">
                    {a.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD CARD TO WATCHLIST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-amber-500/30 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-sm text-white">ADD CARD TO WATCHLIST</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWatchlistItem} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">SELECT POKÉMON CARD</label>
                <select
                  value={selectedCardForWatch.id}
                  onChange={(e) => {
                    const found = INITIAL_CARDS_DATABASE.find(c => c.id === e.target.value);
                    if (found) {
                      setSelectedCardForWatch(found);
                      setTargetPrice(found.market.rawPriceUSD);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-400"
                >
                  {INITIAL_CARDS_DATABASE.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.pokemonName} — {c.setName} (#{c.cardNumber}) • Current Raw: ${c.market.rawPriceUSD} USD
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">TARGET ALERT PRICE (USD)</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">CUSTOM WATCH NOTES</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Waiting for raw price dip under $800 before buying"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  ADD TO WATCHLIST
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
