import React from 'react';
import {
  ShieldCheck, Cpu, TrendingUp, Lock, Camera, Sparkles, ArrowRight,
  CheckCircle2, Layers, Award, Radio, Globe, Zap, ExternalLink, Flame
} from 'lucide-react';
import { Slab3DCanvas } from '../Slab3DCanvas';
import { HolographicLabel } from '../HolographicLabel';
import { BluePhoenixLogo } from '../BluePhoenixLogo';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenScanner: () => void;
  onOpenNfcModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenScanner, onOpenNfcModal }) => {
  return (
    <div className="space-y-20 pb-20">
      <section className="relative pt-4 pb-12 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10 overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 shadow-[0_0_45px_rgba(34,211,238,.12)]">
            <img
              src="/branding/vca-slab-label.svg"
              alt="VCA approved slab label branding"
              className="block h-auto w-full"
              loading="eager"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.25)]">
              <BluePhoenixLogo size="sm" showGlow={false} />
              <span>VERIFIED CARD AUTHORITY</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-slate-100 tracking-tight leading-[1.1]">
              The Future of Collectible Trust is <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Verified.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl">
              VCA combines camera-based card identification, transparent grading workflows, QR verification, NFC slab binding, and sourced market data into one auditable collector platform.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button onClick={onOpenScanner} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-slate-950 font-display font-black text-sm tracking-wider shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_45px_rgba(34,211,238,0.8)] transition-all cursor-pointer flex items-center gap-3 active:scale-95">
                <Camera className="w-5 h-5" />
                <span>LAUNCH VSCAN AI CAMERA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onOpenNfcModal} className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>VERIFY NFC SLAB</span>
              </button>
              <button onClick={() => onNavigate('pack-ripper')} className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] transition-all cursor-pointer active:scale-95">
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>3D PACK RIPPER ARCADE</span>
              </button>
              <button onClick={() => onNavigate('card3d')} className="px-6 py-4 rounded-2xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>3D POP-OUT STUDIO</span>
              </button>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 font-mono text-xs">
              <div><div className="text-slate-400 text-[10px]">VSCAN</div><div className="text-cyan-300 font-bold text-sm mt-0.5">CAMERA READY</div></div>
              <div><div className="text-slate-400 text-[10px]">VERIFICATION</div><div className="text-cyan-300 font-bold text-sm mt-0.5">QR + NFC</div></div>
              <div><div className="text-slate-400 text-[10px]">MARKET DATA</div><div className="text-slate-100 font-bold text-sm mt-0.5">SOURCE + TIME</div></div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm">
              <Slab3DCanvas
                cardImageUrl="https://images.pokemontcg.io/sv3pt5/173_hires.png"
                grade={10}
                gradeText="GEM MINT"
                serialNumber="VCA-000-000-001"
                className="w-full h-[460px] shadow-2xl"
              />
              <div className="absolute top-4 right-4 z-20">
                <HolographicLabel grade={10} gradeText="GEM MINT" serialNumber="VCA-000-000-001" size="sm" />
              </div>
              <img
                src="/branding/vca-slab-showcase.svg"
                alt="VCA verified slab showcase"
                className="mt-5 w-full rounded-2xl border border-cyan-400/20 opacity-90"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 tracking-wider">THE FOUR PILLARS OF VCA TRUST</h2>
          <p className="text-xs sm:text-sm text-slate-400">Engineered for security, transparency, auditability and collector usability.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all"><div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit"><ShieldCheck className="w-6 h-6" /></div><h3 className="font-display font-bold text-base text-slate-100">Tamper Evidence</h3><p className="text-xs text-slate-400 leading-relaxed">Physical tamper evidence and digital status are tracked separately so VCA never overstates hardware security.</p></div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-purple-500/40 transition-all"><div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit"><Cpu className="w-6 h-6" /></div><h3 className="font-display font-bold text-base text-slate-100">NFC Binding</h3><p className="text-xs text-slate-400 leading-relaxed">Unique NFC identifiers can be bound to a certificate and verified through the VCA API.</p></div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all"><div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit"><TrendingUp className="w-6 h-6" /></div><h3 className="font-display font-bold text-base text-slate-100">Sourced Valuation</h3><p className="text-xs text-slate-400 leading-relaxed">Raw and graded market indicators show provider, observation time and availability status.</p></div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all"><div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit"><Lock className="w-6 h-6" /></div><h3 className="font-display font-bold text-base text-slate-100">Audit Trail</h3><p className="text-xs text-slate-400 leading-relaxed">Certification and ownership events are designed to remain traceable rather than silently overwritten.</p></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div><h2 className="font-display font-extrabold text-xl text-slate-100 tracking-wider">HOW VCA VERIFICATION WORKS</h2><p className="text-xs text-slate-400">From physical card to auditable digital record.</p></div>
            <button onClick={onOpenScanner} className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs tracking-wider">TRY VSCAN NOW</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ num:'01',step:'CAPTURE',title:'Capture Card',desc:'Take a real photograph with your phone camera.'},{num:'02',step:'IDENTIFY',title:'Identify',desc:'Use a configured vision provider to identify the card and return confidence.'},{num:'03',step:'VALUE',title:'Value',desc:'Retrieve available raw and graded market indicators with source and timestamp.'},{num:'04',step:'VERIFY',title:'Verify',desc:'Use QR or NFC records to resolve a VCA certificate and its public status.'}].map((s,idx)=>(<div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"><div className="flex items-center justify-between"><span className="font-display font-black text-2xl text-cyan-400/40">{s.num}</span><span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono text-[10px] font-bold uppercase">{s.step}</span></div><h3 className="font-display font-bold text-sm text-slate-100">{s.title}</h3><p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p></div>))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl p-10 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/40 overflow-hidden text-center space-y-6 shadow-2xl">
          <div className="absolute inset-0 hud-scanlines pointer-events-none opacity-30" />
          <div className="relative z-10 space-y-3 max-w-2xl mx-auto"><h2 className="font-display font-black text-3xl sm:text-4xl text-slate-100 tracking-wider">EVERY CARD. VERIFIED. EVERY TIME.</h2><p className="text-xs sm:text-sm text-slate-300">Build the verification record first. Add market data and hardware integrations when their providers are configured.</p></div>
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4"><button onClick={onOpenScanner} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-display font-extrabold text-sm tracking-wider shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-105 transition-all cursor-pointer">SCAN YOUR FIRST CARD</button><button onClick={() => onNavigate('dashboard')} className="px-6 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 font-mono font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer">OPEN DASHBOARD</button></div>
        </div>
      </section>
    </div>
  );
};
