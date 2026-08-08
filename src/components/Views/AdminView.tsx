import React, { useState } from 'react';
import { Settings, ShieldCheck, CheckCircle2, XCircle, RefreshCw, Layers } from 'lucide-react';
import { SAMPLE_CARDS } from '../../mockData/cards';

export const AdminView: React.FC = () => {
  const [queue, setQueue] = useState([
    {
      id: 'sub_001',
      card: SAMPLE_CARDS[0],
      aiScore: 10,
      confidence: 98.7,
      status: 'PENDING_HUMAN_QC'
    },
    {
      id: 'sub_002',
      card: SAMPLE_CARDS[1],
      aiScore: 9,
      confidence: 97.2,
      status: 'PENDING_HUMAN_QC'
    }
  ]);

  const handleApprove = (id: string) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'APPROVED & MINTED' } : q));
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
              BLIND HUMAN QC GRADING QUEUE
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            INTERNAL INSPECTOR VIEW • BLIND QC REVIEW VS OPTICAL AI PRE-GRADE
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider">
          PENDING QC SUBMISSIONS ({queue.length})
        </h2>

        <div className="space-y-4">
          {queue.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={item.card.imageUrl} alt={item.card.name} className="w-14 h-20 object-cover rounded border border-slate-700" />
                <div>
                  <div className="font-display font-bold text-sm text-slate-100">{item.card.name}</div>
                  <div className="text-xs font-mono text-slate-400">{item.card.set} • SUBMISSION {item.id}</div>
                  <div className="text-xs font-mono text-cyan-300 font-bold pt-1">
                    AI PRE-GRADE: VGAS #{item.aiScore} ({item.confidence}% CONFIDENCE)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.status === 'PENDING_HUMAN_QC' ? (
                  <>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>APPROVE & MINT SLAB</span>
                    </button>
                  </>
                ) : (
                  <span className="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                    ✅ {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
