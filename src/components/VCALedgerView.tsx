import React, { useState, useEffect } from 'react';
import { ShieldCheck, Layers, Lock, Hash, ArrowRight, ExternalLink } from 'lucide-react';
import { getAllLedgerEvents } from '../services/nfcLedgerService';
import { LedgerEvent } from '../types/vca';

export const VCALedgerView: React.FC = () => {
  const [events, setEvents] = useState<LedgerEvent[]>(getAllLedgerEvents());

  return (
    <div className="space-y-8 font-sans">
      
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-purple-400" />
          <h2 className="font-display font-black text-2xl text-white">VCA IMMUTABLE EVENT LEDGER</h2>
        </div>
        <p className="text-xs font-mono text-purple-400/80 mt-1">
          Cryptographically Hash-Chained Audit Trail • Scans, Gradings, NFC Pairings & Transfers
        </p>
      </div>

      <div className="space-y-4">
        {events.map((ev, index) => (
          <div key={ev.id} className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold uppercase text-[10px]">
                  BLOCK #{events.length - index}
                </span>
                <span className="font-bold text-white text-sm">{ev.eventType}</span>
              </div>
              <span className="text-slate-500 text-[10px]">{new Date(ev.timestamp).toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
              <div>
                <span className="text-slate-500 block">CARD ITEM:</span>
                <span className="text-cyan-300 font-bold">{ev.cardName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ACTOR / ACCOUNT:</span>
                <span className="text-slate-300">{ev.actor}</span>
              </div>
              <div>
                <span className="text-slate-500 block">SERIAL NO:</span>
                <span className="text-amber-300">{ev.serialNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">PREVIOUS STATE:</span>
                <span className="text-slate-400">{ev.previousState || 'Genesis'}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-1 text-[10px] text-slate-500 overflow-x-auto">
              <div>PREVIOUS BLOCK HASH: <span className="text-slate-400 font-mono">{ev.previousHash}</span></div>
              <div>CURRENT BLOCK HASH: <span className="text-purple-400 font-mono">{ev.currentHash}</span></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
