import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Camera, Cpu, ShieldCheck, Volume2, VolumeX, X } from 'lucide-react';
import { playRarePullFanfare } from '../utils/audioSynth';

interface SplashPageProps {
  onEnter: () => void;
  onNavigateToView?: (view: string) => void;
}

type Hotspot = 'vscan' | 'nfc' | 'tamper' | 'ledger';

export const SplashPage: React.FC<SplashPageProps> = ({ onEnter, onNavigateToView }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const enter = (view?: string) => {
    if (soundEnabled) {
      try { playRarePullFanfare(); } catch { /* browser audio policy */ }
    }
    if (view && onNavigateToView) onNavigateToView(view);
    onEnter();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) {
      const dx = event.clientX - lastPointer.current.x;
      const dy = event.clientY - lastPointer.current.y;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      setTilt(current => ({
        x: Math.max(-8, Math.min(8, current.x + dx * 0.045)),
        y: Math.max(-8, Math.min(8, current.y - dy * 0.045)),
      }));
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: x * 3.5, y: -y * 3.5 });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const releasePointer = () => {
    dragging.current = false;
    setTilt(current => ({ x: current.x * 0.35, y: current.y * 0.35 }));
  };

  const hotspotCopy: Record<Hotspot, { title: string; body: string; icon: React.ReactNode; action: string }> = {
    vscan: {
      title: 'VScan AI',
      body: 'Camera-first card capture and provider-backed identification. Market values remain unavailable until a real market provider is configured.',
      icon: <Camera className="h-5 w-5" />,
      action: 'Launch VScan',
    },
    nfc: {
      title: 'NFC Smart Slab',
      body: 'VCA supports NFC record binding and verification. Cryptographic authentication is only asserted when compatible secure hardware is actually configured.',
      icon: <Cpu className="h-5 w-5" />,
      action: 'Enter VCA',
    },
    tamper: {
      title: 'Tamper Evidence',
      body: 'The platform records supported tamper states and audit events. Hardware capabilities are never assumed from a basic NFC tag.',
      icon: <ShieldCheck className="h-5 w-5" />,
      action: 'Enter VCA',
    },
    ledger: {
      title: 'Verification Ledger',
      body: 'Certificate, ownership and trust-sensitive events are designed to remain auditable through the VCA data layer.',
      icon: <ShieldCheck className="h-5 w-5" />,
      action: 'Open Ledger',
    },
  };

  return (
    <main className="vca-splash relative min-h-screen w-full overflow-hidden bg-[#05070a] text-slate-100 select-none" aria-label="VCA Verified Card Authority splash presentation">
      <div className="absolute inset-0 vca-splash-grid opacity-70" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,.12),transparent_38%),radial-gradient(circle_at_80%_70%,rgba(139,92,246,.08),transparent_35%)]" aria-hidden="true" />

      <header className="relative z-30 flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="rounded-xl border border-cyan-400/25 bg-black/55 px-3 py-2 font-mono text-[10px] tracking-[0.22em] text-cyan-200 backdrop-blur-md">VCA / TRUST PRESENTATION</div>
        <button type="button" onClick={() => setSoundEnabled(v => !v)} className="rounded-xl border border-slate-700 bg-black/55 p-2.5 text-slate-300 backdrop-blur-md hover:border-cyan-400/50 hover:text-cyan-200" aria-label={soundEnabled ? 'Mute splash audio' : 'Enable splash audio'}>
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-3 pb-8 sm:px-6" onPointerMove={handlePointerMove} onPointerDown={handlePointerDown} onPointerUp={releasePointer} onPointerCancel={releasePointer} onPointerLeave={releasePointer} aria-label="Interactive VCA technology presentation">
        <div className="relative w-full max-w-4xl touch-none" style={{ transform: `perspective(1400px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transition: dragging.current ? 'none' : 'transform 180ms ease-out' }}>
          <div className="absolute -inset-3 rounded-[2rem] bg-cyan-400/10 blur-2xl animate-pulse" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[1.4rem] border border-cyan-300/25 bg-[#0b1118]/90 shadow-[0_0_70px_rgba(34,211,238,.14)]">
            <img src="/branding/vca-splash-screen.svg" alt="VCA: The Future of Collectible Trust — interactive technology presentation" className="block h-auto w-full" draggable={false} />
            <div className="pointer-events-none absolute inset-0 vca-scanline" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 vca-shimmer" aria-hidden="true" />
            <button type="button" onClick={(e) => { e.stopPropagation(); setActiveHotspot('vscan'); }} className="vca-hotspot left-[56%] top-[29%]" aria-label="Open VScan AI details"><Camera className="h-3 w-3" /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setActiveHotspot('nfc'); }} className="vca-hotspot left-[48%] top-[55%]" aria-label="Open NFC details"><Cpu className="h-3 w-3" /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setActiveHotspot('tamper'); }} className="vca-hotspot left-[48%] top-[68%]" aria-label="Open tamper details"><ShieldCheck className="h-3 w-3" /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setActiveHotspot('ledger'); }} className="vca-hotspot left-[54%] top-[86%]" aria-label="Open ledger details"><ShieldCheck className="h-3 w-3" /></button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="rounded-full border border-slate-700/80 bg-black/55 px-3 py-1.5 font-mono text-[9px] tracking-[0.16em] text-slate-400 backdrop-blur-md">{ready ? 'SYSTEM READY • DRAG TO EXPLORE' : 'INITIALIZING TRUST PRESENTATION'}</div>
            <div className="flex gap-2">
              <button type="button" onClick={(e) => { e.stopPropagation(); enter('vscan'); }} className="flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2.5 font-mono text-[10px] font-bold tracking-wider text-cyan-200 hover:bg-cyan-400/20"><Camera className="h-4 w-4" /> VSCAN</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); enter('home'); }} className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 font-display text-[10px] font-black tracking-wider text-slate-950 hover:bg-cyan-300">ENTER VCA <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </section>

      {activeHotspot && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label={hotspotCopy[activeHotspot].title}>
          <div className="w-full max-w-md rounded-3xl border border-cyan-400/30 bg-[#081018]/95 p-6 shadow-[0_0_60px_rgba(34,211,238,.18)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-cyan-300"><span className="rounded-xl border border-cyan-400/25 bg-cyan-400/10 p-2">{hotspotCopy[activeHotspot].icon}</span><div><div className="font-display text-sm font-black tracking-wider text-slate-100">{hotspotCopy[activeHotspot].title}</div><div className="font-mono text-[9px] tracking-[0.16em] text-cyan-400/70">VCA TECHNOLOGY LAYER</div></div></div>
              <button type="button" onClick={() => setActiveHotspot(null)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close technology details"><X className="h-4 w-4" /></button>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">{hotspotCopy[activeHotspot].body}</p>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setActiveHotspot(null)} className="flex-1 rounded-xl border border-slate-700 px-4 py-3 font-mono text-[10px] font-bold tracking-wider text-slate-300 hover:border-cyan-400/40">CLOSE</button>
              <button type="button" onClick={() => { const action = activeHotspot; setActiveHotspot(null); enter(action === 'vscan' ? 'vscan' : action === 'ledger' ? 'ledger' : 'home'); }} className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 font-display text-[10px] font-black tracking-wider text-slate-950 hover:bg-cyan-300">{hotspotCopy[activeHotspot].action}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
