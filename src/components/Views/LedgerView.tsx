import React from 'react';
import { History, ShieldCheck, Cpu, FileCheck, CheckCircle2, Lock, Key } from 'lucide-react';
import { LEDGER_EVENTS } from '../../mockData/cards';

export const LedgerView: React.FC = () => {
  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
              IMMUTABLE OWNERSHIP & SCAN LEDGER
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            CRYPTOGRAPHIC SHA-256 HASH-CHAINED RECORD AUDIT TRAIL
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
          <span className="text-cyan-300 font-bold">LATEST BLOCK HEIGHT: #1,048,291</span>
          <span className="text-emerald-400 font-bold">LEDGER STATUS: 100% INTACT & SYNCED</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                <th className="p-3">SERIAL</th>
                <th className="p-3">EVENT TYPE</th>
                <th className="p-3">ACTOR</th>
                <th className="p-3">SHA-256 TX HASH</th>
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {LEDGER_EVENTS.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-cyan-300">{evt.serialNumber}</td>
                  <td className="p-3 font-bold uppercase text-purple-300">{evt.eventType}</td>
                  <td className="p-3 text-slate-300">{evt.actorName}</td>
                  <td className="p-3 text-[10px] text-slate-400 font-mono font-bold truncate max-w-[180px]">{evt.txHash}</td>
                  <td className="p-3 text-slate-400">{evt.timestamp}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" />
                      VERIFIED
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
