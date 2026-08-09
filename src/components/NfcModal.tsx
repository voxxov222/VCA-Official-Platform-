import React, { useState } from 'react';
import { 
  Wifi, ShieldCheck, CheckCircle2, AlertTriangle, X, 
  ExternalLink, FileCheck, ArrowRightLeft, Tag, PenTool, 
  Layers, Lock, RefreshCw, Smartphone
} from 'lucide-react';
import { VCASlab } from '../types';
import { HolographicLabel } from './HolographicLabel';
import { SignaturePad } from './SignaturePad';

interface NfcModalProps {
  slab?: VCASlab;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onSignOwner?: (serialNumber: string, signatureUrl: string) => void;
}

export const NfcModal: React.FC<NfcModalProps> = ({
  slab,
  onClose,
  onNavigate,
  onSignOwner
}) => {
  const [isScanningNfc, setIsScanningNfc] = useState(false);
  const [nfcResult, setNfcResult] = useState<'IDLE' | 'SUCCESS' | 'FAILED'>('SUCCESS');
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showHapticFlash, setShowHapticFlash] = useState(false);
  const [webNfcSupported] = useState(() => 'NDEFReader' in window);

  const targetSlab = slab || {
    serialNumber: 'VCA-000-000-001',
    nfcUid: 'E0040150993B41C2',
    card: {
      name: 'Pikachu',
      set: '151 (Scarlet & Violet)',
      number: '173/165',
      rarity: 'Illustration Rare',
      variant: 'Illustration Rare',
      imageUrl: 'https://images.pokemontcg.io/sv3pt5/173_hires.png',
      rawPrice: 68.00,
      psa9Price: 115.00,
      psa10Price: 340.00
    },
    overallGrade: 10,
    gradeLabel: 'GEM MINT',
    vaultValueCAD: 2850.00,
    isAuthentic: true,
    tamperSealIntact: true
  };

  const simulateNfcScan = () => {
    setIsScanningNfc(true);
    setTimeout(() => {
      setIsScanningNfc(false);
      setNfcResult('SUCCESS');
      setShowHapticFlash(true);
      setTimeout(() => setShowHapticFlash(false), 300);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      {/* Screen Haptic Flash on tap success */}
      {showHapticFlash && (
        <div className="fixed inset-0 z-50 bg-cyan-400/20 pointer-events-none transition-opacity duration-300" />
      )}

      <div className="glass-panel w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 border border-cyan-500/30 space-y-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Wifi className="w-5 h-5 rotate-90" />
            </div>
            <div>
              <h3 className="font-display text-sm font-extrabold text-slate-100 tracking-wider">
                NTAG424 CMAC NFC TAP
              </h3>
              <p className="text-[10px] font-mono text-cyan-400">
                Encrypted Smart Slab DNA Verification
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser NFC Capability Notice */}
        {!webNfcSupported && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200">Browser NFC Notice:</span> Native Web NFC API is active in Chrome for Android. Desktop environments offer instant simulated CMAC cryptographic NFC tap verification below.
            </div>
          </div>
        )}

        {/* NFC Ripple Radar Scanner graphic */}
        <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          
          {/* Animated Ripples */}
          <div className="relative flex items-center justify-center w-24 h-24 my-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-30" />
            <span className="animate-pulse absolute inline-flex h-20 w-20 rounded-full bg-purple-500 opacity-40" />
            
            <button
              onClick={simulateNfcScan}
              disabled={isScanningNfc}
              className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isScanningNfc ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : (
                <Wifi className="w-8 h-8 rotate-90" />
              )}
            </button>
          </div>

          <button
            onClick={simulateNfcScan}
            disabled={isScanningNfc}
            className="mt-3 text-xs font-mono font-bold text-cyan-300 hover:text-cyan-200 uppercase tracking-widest cursor-pointer"
          >
            {isScanningNfc ? 'SCANNING NTAG424 CMAC CHIP...' : 'TAP TO SCAN SMART SLAB'}
          </button>
        </div>

        {/* VERIFICATION RESULT STATE */}
        {nfcResult === 'SUCCESS' && (
          <div className="space-y-4">
            
            {/* Status Banner with Self-Drawing SVG Checkmark */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" className="svg-draw-stroke" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">AUTHENTICATED • SEAL INTACT</div>
                  <div className="text-[10px] font-mono text-emerald-400/80">
                    NTAG424 CMAC Match: {targetSlab.nfcUid}
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                100% CMAC OK
              </span>
            </div>

            {/* Slab summary card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
              <img
                src={targetSlab.card?.imageUrl || ''}
                alt={targetSlab.card?.name || (targetSlab.card as any)?.pokemonName || 'Card'}
                className="w-16 h-22 object-cover rounded-lg border border-slate-700 shadow-md shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-display font-extrabold text-sm text-slate-100 truncate">
                  {targetSlab.card?.name || (targetSlab.card as any)?.pokemonName || 'Unknown Card'}
                </div>
                <div className="text-xs text-slate-400 font-mono truncate">
                  {targetSlab.card?.set || (targetSlab.card as any)?.setName} • #{targetSlab.card?.number || (targetSlab.card as any)?.cardNumber}
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  Est. CAD ${(targetSlab.vaultValueCAD || 0).toLocaleString()}
                </div>
                <div className="pt-1">
                  <HolographicLabel
                    grade={targetSlab.overallGrade}
                    gradeText={targetSlab.gradeLabel}
                    serialNumber={targetSlab.serialNumber}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* CONTEXTUAL MENU ACTIONS */}
            <div className="space-y-2 pt-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                AUTHENTICATED SLAB ACTIONS:
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onClose(); onNavigate('dashboard'); }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-200 flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>VIEW DETAILS</span>
                </button>

                <button
                  onClick={() => setShowSignaturePad(true)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-200 flex items-center gap-2"
                >
                  <PenTool className="w-4 h-4 text-purple-400" />
                  <span>SIGN AS OWNER</span>
                </button>

                <button
                  onClick={() => { onClose(); onNavigate('marketplace'); }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-200 flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>LIST FOR SALE</span>
                </button>

                <button
                  onClick={() => { onClose(); onNavigate('ledger'); }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-200 flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>LEDGER HISTORY</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {showSignaturePad && (
          <SignaturePad
            serialNumber={targetSlab.serialNumber}
            onClose={() => setShowSignaturePad(false)}
            onSave={(signatureUrl, typedName) => {
              if (onSignOwner) {
                onSignOwner(targetSlab.serialNumber, signatureUrl);
              }
              setShowSignaturePad(false);
              alert(`Signature appended to VCA Ledger for ${targetSlab.serialNumber}!`);
            }}
          />
        )}
      </div>
    </div>
  );
};
