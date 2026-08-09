import React, { useState } from 'react';
import { Radio, X, Zap, ArrowUpRight, ArrowDownRight, Award, Flame, Tv } from 'lucide-react';
import { BREAKING_NEWS_ITEMS } from '../mockData/cards';

interface BreakingWireProps {
  onOpenNewsModal?: () => void;
}

export const BreakingWire: React.FC<BreakingWireProps> = ({ onOpenNewsModal }) => {
  const [dismissed, setDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-50 w-full bg-slate-950/90 border-b border-cyan-500/20 text-xs font-mono select-none overflow-hidden backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between gap-4">
        
        {/* Label Tag */}
        <button
          onClick={onOpenNewsModal}
          className="flex items-center gap-2 px-2.5 py-0.5 rounded bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold shrink-0 transition-all cursor-pointer group"
          title="Open CNN Pokémon News Broadcast"
        >
          <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="tracking-widest uppercase text-[10px] font-display">CNN • VCA WIRE</span>
          <Tv className="w-3 h-3 text-red-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Marquee Container */}
        <div 
          className="flex-1 overflow-hidden relative cursor-pointer"
          onClick={onOpenNewsModal}
        >
          <div className="animate-marquee-infinite gap-8 whitespace-nowrap py-0.5">
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
                <div key={`${item.id}-${index}`} className="inline-flex items-center gap-2 text-slate-300 hover:text-cyan-200 transition-colors pr-8">
                  {getIcon()}
                  <span className="text-[11px] font-medium tracking-tight">{item.text}</span>
                  <span className="text-slate-600 font-sans ml-2">•</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenNewsModal}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-bold hidden sm:inline cursor-pointer"
          >
            LIVE NEWS FEED
          </button>
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

