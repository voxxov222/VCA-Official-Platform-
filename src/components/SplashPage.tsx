import React, { useEffect, useState } from 'react';
import { ArrowRight, Camera, Volume2, VolumeX } from 'lucide-react';
import { playRarePullFanfare } from '../utils/audioSynth';

interface SplashPageProps {
  onEnter: () => void;
  onNavigateToView?: (view: string) => void;
}

/** Production VCA splash screen using the approved branding artwork. */
export const SplashPage: React.FC<SplashPageProps> = ({ onEnter, onNavigateToView }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const enter = (view?: string) => {
    if (soundEnabled) {
      try { playRarePullFanfare(); } catch { /* browser audio policy */ }
    }
    if (view && onNavigateToView) onNavigateToView(view);
    onEnter();
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-[#030509] text-slate-100 select-none"
      aria-label="VCA Verified Card Authority"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/branding/vca-splash-screen.svg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#030509]/20" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-cyan-400 shadow-[0_0_22px_#22d3ee]" aria-hidden="true" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <div className="rounded-xl border border-cyan-400/25 bg-black/40 px-3 py-2 font-mono text-[10px] tracking-[0.22em] text-cyan-200 backdrop-blur-md">
          VCA / PRODUCTION
        </div>
        <button
          type="button"
          onClick={() => setSoundEnabled(v => !v)}
          className="rounded-xl border border-slate-700 bg-black/50 p-2.5 text-slate-300 backdrop-blur-md hover:border-cyan-400/50 hover:text-cyan-200"
          aria-label={soundEnabled ? 'Mute splash audio' : 'Enable splash audio'}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-88px)] items-end justify-center px-5 pb-10 sm:pb-14">
        <div className="w-full max-w-xl space-y-4 text-center">
          <div className="mx-auto w-fit rounded-full border border-cyan-400/30 bg-black/50 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] text-cyan-200 backdrop-blur-md">
            {ready ? 'AUTHENTICATION SYSTEM READY' : 'INITIALIZING VCA'}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => enter('home')}
              className="flex items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-7 py-4 font-display text-sm font-black tracking-wider text-slate-950 shadow-[0_0_35px_rgba(34,211,238,.45)] transition hover:bg-cyan-300 hover:shadow-[0_0_50px_rgba(34,211,238,.65)]"
            >
              ENTER VCA
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => enter('vscan')}
              className="flex items-center justify-center gap-3 rounded-2xl border border-cyan-400/40 bg-black/60 px-7 py-4 font-mono text-xs font-bold tracking-wider text-cyan-200 backdrop-blur-md transition hover:border-cyan-300 hover:text-white"
            >
              <Camera className="h-4 w-4" />
              LAUNCH VSCAN
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
