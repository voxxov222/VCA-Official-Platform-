import React, { useState } from 'react';
import { Search, Layers, Camera, ArrowRight, Filter } from 'lucide-react';
import { SAMPLE_CARDS } from '../../mockData/cards';
import { CardItem } from '../../types';

interface CardDatabaseViewProps {
  onOpenScanner: () => void;
  onSelectCard: (card: CardItem) => void;
}

export const CardDatabaseView: React.FC<CardDatabaseViewProps> = ({
  onOpenScanner,
  onSelectCard
}) => {
  const [query, setQuery] = useState('');

  const filtered = SAMPLE_CARDS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.set.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
              POKÉMON TCG DATABASE
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            EXPLORE CARD SETS, VARIANTS, POP REPORTS & HISTORICAL COMPS INDEX
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs tracking-wider flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>VSCAN ANY PHYSICAL CARD</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search card name, set, card number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectCard(card)}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer space-y-3"
          >
            <img src={card.imageUrl} alt={card.name} className="w-full h-48 object-cover rounded-xl border border-slate-700 shadow-md" />
            <div>
              <div className="font-display font-bold text-sm text-slate-100 truncate">{card.name}</div>
              <div className="text-xs font-mono text-slate-400 truncate">{card.set} • #{card.number}</div>
              <div className="text-xs font-mono font-bold text-amber-300 pt-1">PSA 10 CAD ${card.psa10Price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
