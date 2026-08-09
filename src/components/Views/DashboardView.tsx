import React from 'react';
import { 
  TrendingUp, Layers, Award, Camera, Plus, ArrowUpRight, 
  ArrowDownRight, ShieldCheck, Sparkles, PieChart, LineChart as LineChartIcon
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { DEMO_USER, MOCK_SLABS, PORTFOLIO_HISTORY, SAMPLE_CARDS } from '../../mockData/cards';
import { HolographicLabel } from '../HolographicLabel';
import { HoloCardImage } from '../HoloCardImage';
import { VCASlab, CardItem } from '../../types';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenScanner: () => void;
  onOpenNfcModal: (slab?: VCASlab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenScanner,
  onOpenNfcModal
}) => {
  const pieData = [
    { name: '151 (Scarlet & Violet)', value: 12850, color: '#22d3ee' },
    { name: 'Evolving Skies', value: 8400, color: '#c084fc' },
    { name: 'Base Set (1999)', value: 18500, color: '#fbbf24' },
    { name: 'Crown Zenith', value: 4200, color: '#38bdf8' }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
              INVESTMENT DASHBOARD
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            COLLECTOR: <span className="text-cyan-300 font-bold">{DEMO_USER.name}</span> • VERIFIED VAULT ACCUMULATION
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('vault')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 hover:bg-slate-800 font-bold"
          >
            MY VAULT SLABS ({MOCK_SLABS.length})
          </button>
          <button
            onClick={onOpenScanner}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-display font-black text-xs tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-slate-950" />
            <span>SCAN NEW CARD</span>
          </button>
        </div>
      </div>

      {/* INVESTMENT METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400">TOTAL VAULT VALUE (CAD)</div>
          <div className="text-2xl font-mono font-black text-slate-100">
            ${(DEMO_USER?.vaultValueCAD || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-bold pt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+$3,450 CAD (+18.4% 30d)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400">AUTHENTICATED SLABS</div>
          <div className="text-2xl font-mono font-black text-cyan-300">
            {DEMO_USER.totalSlabs} SLABS
          </div>
          <div className="text-[11px] font-mono text-cyan-400/80 pt-1">
            100% CMAC NTAG424 Verified
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400">AVERAGE VAULT GRADE</div>
          <div className="text-2xl font-mono font-black text-amber-300">
            9.6 / 10
          </div>
          <div className="text-[11px] font-mono text-amber-400/80 pt-1">
            Gem Mint Ratio: 75%
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400">PENDING SUBMISSIONS</div>
          <div className="text-2xl font-mono font-black text-purple-300">
            2 IN QC
          </div>
          <div className="text-[11px] font-mono text-purple-400/80 pt-1">
            Stage 8 AI Pre-Grade Complete
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart: Portfolio Growth */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-bold text-sm text-slate-100 tracking-wider">
                30-DAY VAULT VALUATION CURVE (CAD)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Real-Time VCA Index Feed</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PORTFOLIO_HISTORY}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#05070a', borderColor: '#22d3ee', borderRadius: '12px', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                  formatter={(val: number) => [`$${(val || 0).toLocaleString()} CAD`, 'Vault Value']}
                />
                <Area type="monotone" dataKey="valueCAD" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              <h3 className="font-display font-bold text-sm text-slate-100 tracking-wider">
                SET ALLOCATION
              </h3>
            </div>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#05070a', borderColor: '#c084fc', borderRadius: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate max-w-[140px]">{item.name}</span>
                </div>
                <span className="text-slate-100 font-bold">${(item.value || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AUTHENTICATED VAULT SLABS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display font-bold text-lg text-slate-100 tracking-wider">
              VERIFIED VAULT SLABS
            </h2>
          </div>
          <button
            onClick={() => onNavigate('vault')}
            className="text-xs font-mono text-cyan-300 hover:underline font-bold"
          >
            VIEW ALL ({MOCK_SLABS.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SLABS.map((slab) => (
            <div key={slab.serialNumber} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all">
              
              <div className="flex items-start gap-4">
                <HoloCardImage
                  src={slab.card?.imageUrl || ''}
                  alt={slab.card?.name || (slab.card as any)?.pokemonName || 'Card'}
                  className="w-20 h-28 object-cover rounded-xl"
                  containerClassName="shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="font-display font-black text-base text-slate-100 truncate">
                    {slab.card?.name || (slab.card as any)?.pokemonName || 'Unknown Card'}
                  </div>
                  <div className="text-xs font-mono text-slate-400 truncate">
                    {slab.card?.set || (slab.card as any)?.setName} • #{slab.card?.number || (slab.card as any)?.cardNumber}
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-bold pt-1">
                    CAD ${(slab.vaultValueCAD || 0).toLocaleString()}
                  </div>
                  <div className="pt-1">
                    <HolographicLabel
                      grade={slab.overallGrade}
                      gradeText={slab.gradeLabel}
                      serialNumber={slab.serialNumber}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => onOpenNfcModal(slab)}
                  className="text-purple-300 font-bold hover:text-purple-200 flex items-center gap-1"
                >
                  <span>NFC TAP CHECK</span>
                </button>
                <button
                  onClick={() => onNavigate('vault')}
                  className="text-cyan-300 font-bold hover:underline"
                >
                  FULL SLAB PAGE →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
