import React, { useState } from 'react';
import { 
  TrendingUp, Bell, Zap, Eye, AlertTriangle, ArrowUpRight, 
  ArrowDownRight, Plus, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { WATCHLIST_ITEMS, SAMPLE_CARDS } from '../../mockData/cards';

export const MarketIntelligenceView: React.FC = () => {
  const [watchlist, setWatchlist] = useState(WATCHLIST_ITEMS);
  const [targetAlertPrice, setTargetAlertPrice] = useState<number>(300);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
              VCA SIGNALS & WATCHLIST
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            THRESHOLD PRICE MOVEMENT ALERTS & QUANT MARKET SIGNALS
          </p>
        </div>
      </div>

      {/* WATCHLIST TABLE */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          <span>ACTIVE WATCHLIST & TARGET PRICE ALERTS</span>
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                <th className="p-3">CARD</th>
                <th className="p-3">CURRENT VALUE</th>
                <th className="p-3">TARGET ALERT</th>
                <th className="p-3">30D MOMENTUM</th>
                <th className="p-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {watchlist.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-slate-100 flex items-center gap-3">
                    <img src={item.card.imageUrl} alt={item.card.name} className="w-10 h-14 object-cover rounded" />
                    <div>
                      <div>{item.card.name}</div>
                      <div className="text-[10px] text-slate-400">{item.card.set}</div>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-cyan-300">${item.currentPriceCAD} CAD</td>
                  <td className="p-3 font-bold text-amber-300">${item.targetPriceCAD} CAD</td>
                  <td className="p-3 text-emerald-400 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{item.card.change30d}%</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      ACTIVE MONITORING
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
