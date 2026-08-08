import React, { useState } from 'react';
import { Sliders, ShieldCheck, Activity, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [tcgWeight, setTcgWeight] = useState(40);
  const [ebayWeight, setEbayWeight] = useState(35);
  const [cmWeight, setCmWeight] = useState(25);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans">
      
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-6 h-6 text-slate-300" />
          <h2 className="font-display font-black text-2xl text-white">VCA ADMIN COMMAND CENTER</h2>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Market Data Provider Weights • Confidence Thresholds & Outlier Detection Calibration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
        
        {/* Provider Weights Calibration */}
        <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-6">
          <h3 className="font-display font-bold text-base text-white border-b border-slate-800 pb-3">MARKET PROVIDER WEIGHTING</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-bold">TCGplayer Feed Weight:</span>
                <span className="text-cyan-400 font-bold">{tcgWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tcgWeight}
                onChange={e => setTcgWeight(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-bold">eBay Sold Listings Weight:</span>
                <span className="text-amber-400 font-bold">{ebayWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={ebayWeight}
                onChange={e => setEbayWeight(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-bold">Cardmarket (EU) Weight:</span>
                <span className="text-purple-400 font-bold">{cmWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cmWeight}
                onChange={e => setCmWeight(Number(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all mt-4"
            >
              {saved ? 'WEIGHTS SAVED ✓' : 'SAVE CALIBRATION'}
            </button>
          </div>
        </div>

        {/* System Health Status */}
        <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-base text-white border-b border-slate-800 pb-3">API & LEDGER HEALTH STATUS</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-900">
              <span className="text-slate-300">TCGplayer API v2 Feed:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ONLINE (34ms)</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-900">
              <span className="text-slate-300">Gemini Vision OCR Engine:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ACTIVE</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-900">
              <span className="text-slate-300">NTAG424 SUN Verification:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>READY</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-900">
              <span className="text-slate-300">Ledger Block Generation:</span>
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SYNCED</span>
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
