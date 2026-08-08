import React, { useState } from 'react';
import { Scale, X, ArrowUpRight, ArrowDownRight, Award, Plus, Layers } from 'lucide-react';
import { CardItem } from '../types';
import { SAMPLE_CARDS } from '../mockData/cards';

interface CardComparisonModalProps {
  initialCard?: CardItem;
  onClose: () => void;
}

export const CardComparisonModal: React.FC<CardComparisonModalProps> = ({
  initialCard = SAMPLE_CARDS[0],
  onClose
}) => {
  const [card1] = useState<CardItem>(initialCard);
  const [card2, setCard2] = useState<CardItem>(SAMPLE_CARDS[1]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl rounded-3xl p-6 border border-cyan-500/30 space-y-6 shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-base font-extrabold text-slate-100 tracking-wider">
                VCA SIDE-BY-SIDE CARD COMPARISON ENGINE
              </h2>
              <p className="text-xs text-slate-400">
                Compare Raw, PSA 9, PSA 10 & Grading Upside metrics side-by-side
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comparison selector header */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-xs font-bold text-cyan-300">
            CARD A: {card1.name}
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-xs font-bold text-purple-300 flex items-center justify-between px-4">
            <span>CARD B: {card2.name}</span>
            <select
              value={card2.id}
              onChange={(e) => {
                const found = SAMPLE_CARDS.find(c => c.id === e.target.value);
                if (found) setCard2(found);
              }}
              className="bg-slate-950 text-xs font-mono text-slate-200 border border-slate-800 rounded px-2 py-1 focus:outline-none"
            >
              {SAMPLE_CARDS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* COMPARISON METRICS TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                <th className="p-4 font-semibold">METRIC</th>
                <th className="p-4 font-semibold text-cyan-300">{card1.name}</th>
                <th className="p-4 font-semibold text-purple-300">{card2.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              
              {/* Card Thumbnail */}
              <tr>
                <td className="p-4 font-bold text-slate-400">CARD IMAGE</td>
                <td className="p-4">
                  <img src={card1.imageUrl} alt={card1.name} className="w-20 h-28 object-cover rounded-lg border border-slate-700" />
                </td>
                <td className="p-4">
                  <img src={card2.imageUrl} alt={card2.name} className="w-20 h-28 object-cover rounded-lg border border-slate-700" />
                </td>
              </tr>

              {/* Set & Variant */}
              <tr>
                <td className="p-4 font-bold text-slate-400">SET & VARIANT</td>
                <td className="p-4 font-bold">{card1.set} ({card1.variant})</td>
                <td className="p-4 font-bold">{card2.set} ({card2.variant})</td>
              </tr>

              {/* Raw Price */}
              <tr>
                <td className="p-4 font-bold text-slate-400">RAW VALUE (CAD)</td>
                <td className="p-4 font-bold text-slate-100">${card1.rawPrice.toFixed(2)}</td>
                <td className="p-4 font-bold text-slate-100">${card2.rawPrice.toFixed(2)}</td>
              </tr>

              {/* PSA 9 Price */}
              <tr>
                <td className="p-4 font-bold text-slate-400">PSA 9 GRADED</td>
                <td className="p-4 font-bold text-purple-300">${card1.psa9Price.toFixed(2)}</td>
                <td className="p-4 font-bold text-purple-300">${card2.psa9Price.toFixed(2)}</td>
              </tr>

              {/* PSA 10 Price */}
              <tr>
                <td className="p-4 font-bold text-slate-400">PSA 10 GEM MINT</td>
                <td className="p-4 font-bold text-amber-300">${card1.psa10Price.toFixed(2)}</td>
                <td className="p-4 font-bold text-amber-300">${card2.psa10Price.toFixed(2)}</td>
              </tr>

              {/* PSA 10 Multiplier over Raw */}
              <tr>
                <td className="p-4 font-bold text-slate-400">PSA 10 MULTIPLIER</td>
                <td className="p-4 font-bold text-emerald-400">
                  {(card1.psa10Price / card1.rawPrice).toFixed(1)}x Raw
                </td>
                <td className="p-4 font-bold text-emerald-400">
                  {(card2.psa10Price / card2.rawPrice).toFixed(1)}x Raw
                </td>
              </tr>

              {/* 30-Day Change */}
              <tr>
                <td className="p-4 font-bold text-slate-400">30-DAY MOMENTUM</td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+{card1.change30d}%</span>
                </td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+{card2.change30d}%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
