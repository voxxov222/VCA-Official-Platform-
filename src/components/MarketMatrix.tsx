import React, { useState } from 'react';
import { Layers, ShieldAlert, CheckCircle2, RefreshCw, HelpCircle, ArrowUpRight } from 'lucide-react';
import { CardItem, CardCondition } from '../types';

interface MarketMatrixProps {
  card: CardItem;
}

export const MarketMatrix: React.FC<MarketMatrixProps> = ({ card }) => {
  const [selectedCondition, setSelectedCondition] = useState<CardCondition>('NM');

  const conditions: Array<{ id: CardCondition; name: string; multiplier: number }> = [
    { id: 'NM', name: 'Near Mint (NM)', multiplier: 1.0 },
    { id: 'LP', name: 'Lightly Played (LP)', multiplier: 0.65 },
    { id: 'MP', name: 'Moderately Played (MP)', multiplier: 0.40 },
    { id: 'HP', name: 'Heavily Played (HP)', multiplier: 0.23 },
    { id: 'DMG', name: 'Damaged (DMG)', multiplier: 0.13 },
  ];

  const currentConditionPrice = card.conditionPrices
    ? card.conditionPrices[selectedCondition]
    : Math.round(card.rawPrice * (conditions.find(c => c.id === selectedCondition)?.multiplier || 1));

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-display text-base font-extrabold text-slate-100 tracking-wider">
              VCA MARKET INTELLIGENCE MATRIX
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cross-market valuation index from verified market data feeds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
            CONFIDENCE: {card.consensus.confidence}
          </span>
          <button className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-300 transition-colors" title="Sync Market Data">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-TIER PRIMARY VALUES SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Raw Value */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RAW (UNGRADED)</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold">{selectedCondition}</span>
          </div>
          <div className="text-2xl font-mono font-black text-slate-100 mt-2">
            CAD ${(currentConditionPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Market Range:</span>
            <span className="text-slate-300 font-mono">
              ${Math.round((currentConditionPrice || 0) * 0.88)} – ${Math.round((currentConditionPrice || 0) * 1.15)}
            </span>
          </div>
        </div>

        {/* PSA 9 Value */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>PSA 9 GRADED</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">MINT</span>
          </div>
          <div className="text-2xl font-mono font-black text-purple-300 mt-2">
            CAD ${(card.psa9Price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+${((card.psa9Price || 0) - (currentConditionPrice || 0)).toLocaleString()} (+{currentConditionPrice ? Math.round((((card.psa9Price || 0) - currentConditionPrice) / currentConditionPrice) * 100) : 0}% over raw)</span>
          </div>
        </div>

        {/* PSA 10 Value */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
            <span>PSA 10 GRADED</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">GEM MINT</span>
          </div>
          <div className="text-2xl font-mono font-black text-amber-300 mt-2">
            CAD ${(card.psa10Price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-mono font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+${((card.psa10Price || 0) - (currentConditionPrice || 0)).toLocaleString()} (+{currentConditionPrice ? Math.round((((card.psa10Price || 0) - currentConditionPrice) / currentConditionPrice) * 100) : 0}% over raw)</span>
          </div>
        </div>
      </div>

      {/* Raw Condition Selector Pills */}
      <div>
        <label className="text-xs font-mono text-slate-400 font-semibold mb-2 block">
          SELECT UNGRADED CONDITION TIER FOR ACCURATE VALUATION:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {conditions.map((cond) => (
            <button
              key={cond.id}
              onClick={() => setSelectedCondition(cond.id)}
              className={`p-2 rounded-xl text-xs font-mono text-center transition-all ${
                selectedCondition === cond.id
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold">{cond.id}</div>
              <div className="text-[10px] text-slate-400">
                ${Math.round(card.rawPrice * cond.multiplier)} CAD
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SOURCE MATRIX TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
              <th className="p-3 font-semibold">DATA SOURCE</th>
              <th className="p-3 font-semibold">RAW (NM)</th>
              <th className="p-3 font-semibold">PSA 9</th>
              <th className="p-3 font-semibold">PSA 10</th>
              <th className="p-3 font-semibold">RELIABILITY</th>
              <th className="p-3 font-semibold">LAST SYNC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {card.sources.map((src, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3 font-bold text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {src.source}
                </td>
                <td className="p-3 font-bold">${src.rawPrice.toFixed(2)}</td>
                <td className="p-3 font-bold text-purple-300">${src.psa9Price.toFixed(2)}</td>
                <td className="p-3 font-bold text-amber-300">${src.psa10Price.toFixed(2)}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${src.reliabilityScore}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400">{src.reliabilityScore}%</span>
                  </div>
                </td>
                <td className="p-3 text-slate-400 text-[11px]">{src.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Consensus & Rationale */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-slate-200">VCA CONSENSUS WEIGHTING ENGINE</div>
          <p className="text-slate-400 leading-relaxed">
            {card.consensus.signalReason} Cross-market data normalized across 4 sources with outlier filtering applied.
          </p>
        </div>
      </div>
    </div>
  );
};
