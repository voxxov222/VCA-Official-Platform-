import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Camera, Radio, ShieldCheck, Zap, 
  ArrowRight, Flame, Trophy, Layers, Eye, Users, 
  Play, Volume2, VolumeX, CheckCircle2, ChevronRight
} from 'lucide-react';
import { BluePhoenixLogo } from './BluePhoenixLogo';
import { playRarePullFanfare, playTearSound } from '../utils/audioSynth';

interface SplashPageProps {
  onEnter: () => void;
  onNavigateToView?: (view: string) => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onEnter, onNavigateToView }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pulseCount, setPulseCount] = useState(0);
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount(prev => prev + 1);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setScanStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(stepTimer);
  }, []);

  const handleEnterPlatform = (targetView?: string) => {
    if (soundEnabled) {
      try {
        playRarePullFanfare();
      } catch (e) {
        // ignore audio block
      }
    }
    if (targetView && onNavigateToView) {
      onNavigateToView(targetView);
    }
    onEnter();
  };

  const steps = [
    { title: "NTAG424 DNA NFC ENCRYPTION", detail: "Tamper-evident physical slab binding" },
    { title: "GEMINI 2.5 MULTIMODAL VISION", detail: "Subgrade centering, corners, edges & surface AI" },
    { title: "REAL-TIME VCA THREE-TIER PRICING", detail: "Live Raw, PSA 9, PSA 10 consensus pricing" },
    { title: "SLABBOOK SOCIAL NETWORK", detail: "Connect, chat, trade & flex your authenticated vault" }
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#03060c] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans select-none z-50">
      
      {/* Background Holographic Grid & Blue Sapphire Particle Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/40 via-[#03060c] to-[#020408] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#03060c_1px,transparent_1px),linear-gradient(to_bottom,#03060c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Blue Laser Sweep Animation */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-[0_0_20px_#22d3ee] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BluePhoenixLogo size="md" />
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-black tracking-widest text-white">
              VCA <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded font-mono font-bold tracking-widest">PRO PLATFORM</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase">
              Verified Card Authority
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all font-mono text-xs flex items-center gap-2 cursor-pointer"
            title={soundEnabled ? "Audio Effects Enabled" : "Audio Muted"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span className="hidden sm:inline font-bold">{soundEnabled ? "AUDIO ON" : "MUTED"}</span>
          </button>

          <button
            onClick={() => handleEnterPlatform('home')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center gap-2 cursor-pointer"
          >
            <span>SKIP TO APP</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex-1 flex flex-col items-center justify-center text-center space-y-10">
        
        {/* Emblem Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.25)] text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase animate-pulse">
          <Flame className="w-4 h-4 text-cyan-400 fill-cyan-400" />
          <span>THE BLUE PHOENIX OF COLLECTIBLE AUTHENTICATION</span>
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>

        {/* Central Glowing Blue Phoenix Graphic */}
        <div className="relative group my-2 cursor-pointer" onClick={() => handleEnterPlatform('home')}>
          <BluePhoenixLogo size="hero" showGlow={true} />
          
          {/* Circular Holographic Orbit */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-spin-slow pointer-events-none scale-125" />
          <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-reverse-spin pointer-events-none scale-150" />
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
            VERIFIED CARD <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]">AUTHORITY</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg font-mono tracking-wide max-w-2xl mx-auto leading-relaxed">
            The world's most advanced AI-powered trading card scanner, NTAG424 NFC encryption slab network, 3D pack opening arcade, and real-time market consensus.
          </p>
        </div>

        {/* Live System Scanner Status Marquee */}
        <div className="w-full max-w-2xl bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_40px_rgba(34,211,238,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 animate-pulse">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">ACTIVE ENGINE SCANNER</div>
              <div className="text-slate-100 font-bold">{steps[scanStep].title}</div>
              <div className="text-slate-400 text-[11px]">{steps[scanStep].detail}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">ALL SYSTEMS LIVE</span>
          </div>
        </div>

        {/* Enter CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={() => handleEnterPlatform('home')}
            className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-black text-sm tracking-wider shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:shadow-[0_0_60px_rgba(34,211,238,0.8)] transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>ENTER VCA COMMAND CENTER</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>

          <button
            onClick={() => handleEnterPlatform('vscan')}
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>LAUNCH VSCAN AI</span>
          </button>
        </div>

        {/* Key Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left font-mono">
          {[
            {
              icon: Camera,
              color: 'text-cyan-400',
              title: 'VSCAN AI VISION',
              desc: 'Gemini 2.5 multimodal OCR & condition subgrade analysis.',
              view: 'vscan'
            },
            {
              icon: Radio,
              color: 'text-amber-400',
              title: 'NFC DNA SLABS',
              desc: 'Cryptographic NTAG424 SUN authentication & provenance.',
              view: 'ledger'
            },
            {
              icon: Layers,
              color: 'text-indigo-400',
              title: '3D PACK RIPPER',
              desc: 'Opening arcade with real 3D parallax holographic cards.',
              view: 'pack-ripper'
            },
            {
              icon: Users,
              color: 'text-rose-400',
              title: 'SLABBOOK SOCIAL',
              desc: 'Social feed, live messaging, trades & collector profiles.',
              view: 'slabbook'
            }
          ].map((feat, idx) => (
            <div
              key={idx}
              onClick={() => handleEnterPlatform(feat.view)}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all cursor-pointer group space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <feat.icon className={`w-6 h-6 ${feat.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[10px] text-slate-500 font-bold">0{idx + 1}</span>
              </div>
              <h3 className="font-display font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </main>

      {/* Footer Metrics */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
        <div className="flex items-center gap-6">
          <div><span className="text-slate-300 font-bold">$52B+</span> MARKET MONITORED</div>
          <div><span className="text-slate-300 font-bold">1,482,900+</span> GRADED SLABS</div>
          <div><span className="text-slate-300 font-bold">100%</span> TAMPER-PROOF</div>
        </div>

        <div>
          VCA PHOENIX ENGINE • VERIFIED CARD AUTHORITY © 2026
        </div>
      </footer>

    </div>
  );
};
