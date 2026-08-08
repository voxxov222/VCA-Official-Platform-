import React, { useState } from 'react';
import { Radio, X, Zap, ArrowUpRight, ArrowDownRight, Award, Flame } from 'lucide-react';
import { BREAKING_NEWS_ITEMS } from '../mockData/cards';

export const BreakingWire: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-50 w-full bg-slate-950/90 border-b border-cyan-500/20 text-xs font-mono select-none overflow-hidden backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between gap-4">
        
        {/* Label Tag */}
        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold shrink-0">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="tracking-widest uppercase text-[10px] font-display">VCA WIRE</span>
        </div>

        {/* Marquee Container */}
        <div 
          className="flex-1 overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={`flex items-center gap-8 whitespace-nowrap transition-transform ${isPaused ? '' : 'animate-[marquee_30s_linear_infinite]'}`}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {BREAKING_NEWS_ITEMS.concat(BREAKING_NEWS_ITEMS).map((item, index) => {
              const getIcon = () => {
                switch (item.type) {
                  case 'price_up': return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
                  case 'price_down': return <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
                  case 'grading': return <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
                  case 'auction': return <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
                  default: return <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
                }
              };

              return (
                <div key={`${item.id}-${index}`} className="inline-flex items-center gap-2 text-slate-300 hover:text-cyan-200 transition-colors cursor-pointer">
                  {getIcon()}
                  <span className="text-[11px] font-medium tracking-tight">{item.text}</span>
                  <span className="text-slate-600 font-sans">•</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-slate-500 hidden sm:inline">LIVE FEED</span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Dismiss Wire"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
