import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  Camera, 
  Radio, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Bell, 
  ShoppingBag, 
  Sparkles, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { NavigationTab, CardRecord, PortfolioItem, MarketAlert, LedgerEvent } from '../types/vca';
import { getPortfolio, getAlerts, subscribePortfolio } from '../services/portfolioService';
import { getAllLedgerEvents, SEED_SLAB_CERTIFICATE } from '../services/nfcLedgerService';

interface DashboardViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenVScan: () => void;
  onOpenNfcTap: () => void;
  onOpenCertificate: (serial: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenVScan,
  onOpenNfcTap,
  onOpenCertificate
}) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(getPortfolio());
  const [alerts, setAlerts] = useState<MarketAlert[]>(getAlerts());
  const [ledgerEvents, setLedgerEvents] = useState<LedgerEvent[]>(getAllLedgerEvents());

  useEffect(() => {
    const unsub = subscribePortfolio(() => {
      setPortfolio(getPortfolio());
      setAlerts(getAlerts());
      setLedgerEvents(getAllLedgerEvents());
    });
    return unsub;
  }, []);

  // Portfolio calculations
  const totalValue = portfolio.reduce((sum, item) => {
    if (!item?.card?.market) return sum;
    const cardVal = item.isGraded && item.userGrade === 10
      ? (item.card.market.psa10PriceUSD || 0)
      : item.isGraded && item.userGrade === 9
      ? (item.card.market.psa9PriceUSD || 0)
      : (item.card.market.rawPriceUSD || 0);
    return sum + cardVal * (item.quantity || 1);
  }, 0);

  const totalCostBasis = portfolio.reduce((sum, item) => sum + item.purchasePriceUSD * item.quantity, 0);
  const totalProfit = totalValue - totalCostBasis;
  const roiPercent = totalCostBasis > 0 ? Math.round((totalProfit / totalCostBasis) * 100) : 0;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Hero Portfolio Stats Banner */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        <div className="hud-scanlines absolute inset-0 opacity-20 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Vault Value */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>TOTAL VAULT PORTFOLIO VALUE</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-4">
              <div className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
                ${totalValue.toLocaleString()} <span className="text-sm font-mono text-slate-400">USD</span>
              </div>
              <div className={`flex items-center font-mono text-sm font-bold px-2.5 py-1 rounded-lg ${
                totalProfit >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {totalProfit >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                <span>+${totalProfit.toLocaleString()} ({roiPercent}% ROI)</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Cost Basis: ${totalCostBasis.toLocaleString()} USD • {portfolio.length} Total Collectible Records in Vault
            </p>
          </div>

          {/* Quick Actions Panel */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenVScan}
              className="flex-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 text-slate-950 font-display font-bold text-xs p-4 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] transition-all flex flex-col items-center justify-center gap-2"
            >
              <Camera className="w-6 h-6 text-slate-950" />
              <span>LAUNCH VSCAN AI</span>
            </button>

            <button
              onClick={onOpenNfcTap}
              className="flex-1 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-mono text-xs p-4 rounded-2xl transition-all flex flex-col items-center justify-center gap-2"
            >
              <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span>TAP NFC SLAB</span>
            </button>
          </div>

        </div>
      </div>

      {/* Grid Section 1: Featured Scans & Vault Slabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Vault Slabs Carousel Preview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-bold text-base text-white">MY VAULT PORTFOLIO</h3>
            </div>
            <button
              onClick={() => setActiveTab('portfolio')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({portfolio.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {portfolio.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab('portfolio')}
                className="glass-panel-interactive p-4 rounded-2xl border-slate-800 cursor-pointer group flex flex-col justify-between h-[280px]"
              >
                <div className="relative flex justify-center mb-2">
                  <img
                    src={item.card?.imageUrl || 'https://images.pokemontcg.io/base1/4_hires.png'}
                    alt={item.card?.pokemonName || (item.card as any)?.name || 'Card'}
                    className="h-36 object-contain rounded-lg group-hover:scale-105 transition-transform"
                  />
                  {item.isGraded && (
                    <span className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-mono font-black text-[9px] px-1.5 py-0.5 rounded uppercase">
                      #{item.userGrade} GEM MINT
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-xs text-white truncate">{item.card?.pokemonName || (item.card as any)?.name || 'Unknown Card'}</div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">{item.card?.setName || (item.card as any)?.set || ''} #{item.card?.cardNumber || (item.card as any)?.number || ''}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-mono text-xs">
                    <span className="text-slate-500">Value:</span>
                    <span className="font-bold text-cyan-300">
                      ${((item.isGraded && item.userGrade === 10 ? item.card?.market?.psa10PriceUSD : item.card?.market?.rawPriceUSD) || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Alerts & Market Signals Feed */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="font-display font-bold text-base text-white">LIVE MARKET ALERTS</h3>
            </div>
            <button
              onClick={() => setActiveTab('watchlist')}
              className="text-xs font-mono text-amber-400 hover:underline"
            >
              Watchlist
            </button>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all font-mono text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-[11px]">{a.title}</span>
                  <span className="text-[9px] text-slate-500">{a.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans line-clamp-2">
                  {a.message}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid Section 2: VCA Ledger Activity & Seed Slab Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Seed Slab VCA-000-000-001 Banner */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span className="font-display font-bold text-sm text-white">GENESIS SEED SLAB #001</span>
            </div>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
              NTAG424 ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={SEED_SLAB_CERTIFICATE.imageUrl}
              alt="Pikachu 151"
              className="w-20 h-28 object-contain rounded-xl border border-cyan-500/30 bg-slate-950 p-1"
            />
            <div className="space-y-1 font-mono text-xs flex-1">
              <div className="font-bold text-sm text-white">{SEED_SLAB_CERTIFICATE.cardName}</div>
              <div className="text-cyan-400">{SEED_SLAB_CERTIFICATE.setName} #{SEED_SLAB_CERTIFICATE.cardNumber}</div>
              <div className="text-amber-300 font-bold">Grade: #{SEED_SLAB_CERTIFICATE.overallGrade} {SEED_SLAB_CERTIFICATE.gradeLabel}</div>
              <div className="text-[10px] text-slate-400 truncate">Serial: {SEED_SLAB_CERTIFICATE.serialNumber}</div>
            </div>
          </div>

          <button
            onClick={() => onOpenCertificate(SEED_SLAB_CERTIFICATE.serialNumber)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-mono text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>INSPECT DIGITAL CERTIFICATE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Ledger Events Feed */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span className="font-display font-bold text-sm text-white">VCA LEDGER STREAM</span>
            </div>
            <button
              onClick={() => setActiveTab('ledger')}
              className="text-xs font-mono text-purple-400 hover:underline"
            >
              Explorer
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {ledgerEvents.slice(0, 3).map((e) => (
              <div key={e.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-purple-300 font-bold">{e.eventType}</span>
                  <span className="text-slate-500">{new Date(e.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-[11px] text-slate-300">{e.cardName}</div>
                <div className="text-[9px] text-slate-500 truncate">{e.currentHash}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
