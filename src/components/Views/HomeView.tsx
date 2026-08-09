import React from 'react';
import { 
  ShieldCheck, Cpu, TrendingUp, Lock, Camera, Sparkles, ArrowRight, 
  CheckCircle2, Layers, Award, Radio, Globe, Zap, ExternalLink
} from 'lucide-react';
import { Slab3DCanvas } from '../Slab3DCanvas';
import { HolographicLabel } from '../HolographicLabel';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenScanner: () => void;
  onOpenNfcModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenScanner,
  onOpenNfcModal
}) => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* CINEMATIC HERO SECTION */}
      <section className="relative pt-8 pb-12 overflow-hidden">
        
        {/* Glow Ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Holographic Badge Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>THE WORLD'S FIRST NFC-ENCRYPTED GRADING LEDGER</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-slate-100 tracking-tight leading-[1.1]">
              The Future of Collectible Trust is <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">Verified.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl">
              VCA combines optical AI condition scoring, NTAG424 CMAC encrypted NFC chips, and an immutable ledger to eliminate counterfeit trading card slabs and price manipulation forever.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenScanner}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-slate-950 font-display font-black text-sm tracking-wider shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_45px_rgba(34,211,238,0.8)] transition-all cursor-pointer flex items-center gap-3 active:scale-95"
              >
                <Camera className="w-5 h-5 text-slate-950" />
                <span>LAUNCH VSCAN AI CAMERA</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={onOpenNfcModal}
                className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 font-mono font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>SIMULATE NFC SLAB TAP</span>
              </button>

              <button
                onClick={() => onNavigate('card3d')}
                className="px-6 py-4 rounded-2xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>3D POP-OUT STUDIO</span>
              </button>
            </div>

            {/* Micro proof metrics */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 font-mono text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">TOTAL GRADED SLABS</div>
                <div className="text-slate-100 font-bold text-sm mt-0.5">142,850+</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">TOTAL VAULT VALUE</div>
                <div className="text-emerald-400 font-bold text-sm mt-0.5">$52.4M CAD</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">VERIFICATION ACCURACY</div>
                <div className="text-cyan-300 font-bold text-sm mt-0.5">99.98%</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Holographic Slab Stage */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm">
              <Slab3DCanvas
                cardImageUrl="https://images.pokemontcg.io/sv3pt5/173_hires.png"
                grade={10}
                gradeText="GEM MINT"
                serialNumber="VCA-000-000-001"
                className="w-full h-[460px] shadow-2xl"
              />
              
              {/* Floating Badge Tag on 3D stage */}
              <div className="absolute top-4 right-4 z-20">
                <HolographicLabel grade={10} gradeText="GEM MINT" serialNumber="VCA-000-000-001" size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR FEATURE PILLARS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 tracking-wider">
            THE FOUR PILLARS OF VCA TRUST
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered for institutional-grade security and transparency across every collectible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-100">Tamper-Evident Acrylic</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sonic-welded UV-blocking acrylic case with micro-channel tamper seals that fracture permanently if opened.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-purple-500/40 transition-all">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-100">NTAG424 DNA Encrypted</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamic SUN/CMAC cryptographic signatures generated on every smartphone tap to eliminate cloned slabs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-100">3-Tier Live Valuation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consensus valuation matrix comparing TCGPlayer, Cardmarket, eBay Sold, and PSA pop reports in real time.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-100">Immutable Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cryptographically signed ownership transfer logs and digital certificates of authenticity per slab.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: 4-STEP HORIZONTAL FLOW */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-xl text-slate-100 tracking-wider">
                HOW VCA WORKS: 4-STEP VERIFICATION
              </h2>
              <p className="text-xs text-slate-400">
                From physical tap to instant verified ledger record
              </p>
            </div>
            <button
              onClick={onOpenScanner}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs tracking-wider"
            >
              TRY VSCAN NOW
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              { num: '01', step: 'TAP', title: 'Tap Smart Slab', desc: 'Hold any NFC-enabled smartphone against the VCA label on the slab.' },
              { num: '02', step: 'VERIFY', title: 'CMAC Validation', desc: 'Cryptographically verifies the NTAG424 DNA chip against VCA Ledger.' },
              { num: '03', step: 'VIEW', title: '3D Slab & Subgrades', desc: 'Inspect high-res optical subgrades, historical sales & ownership history.' },
              { num: '04', step: 'TRUST', title: 'Sign & Trade', desc: 'Sign as verified owner or initiate zero-fraud P2P transfer.' }
            ].map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-2xl text-cyan-400/40">{s.num}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-slate-100">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl p-10 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/40 overflow-hidden text-center space-y-6 shadow-2xl">
          <div className="absolute inset-0 hud-scanlines pointer-events-none opacity-30" />
          
          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-100 tracking-wider">
              EVERY CARD. VERIFIED. EVERY TIME.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Join thousands of collectors and investors authenticating their portfolios with VCA.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenScanner}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-display font-extrabold text-sm tracking-wider shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-105 transition-all cursor-pointer"
            >
              SCAN YOUR FIRST CARD
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 font-mono font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
            >
              EXPLORE DEMO PORTFOLIO
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
