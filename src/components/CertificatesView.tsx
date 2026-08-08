import React, { useState } from 'react';
import { Award, ShieldCheck, Radio, CheckCircle2, QrCode, ExternalLink, Lock } from 'lucide-react';
import { SEED_SLAB_CERTIFICATE } from '../services/nfcLedgerService';

interface CertificatesViewProps {
  onOpenNfcTap: () => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ onOpenNfcTap }) => {
  const [cert] = useState(SEED_SLAB_CERTIFICATE);

  return (
    <div className="space-y-8 font-sans">
      
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-400" />
            <h2 className="font-display font-black text-2xl text-white">VCA DIGITAL CERTIFICATE OF AUTHENTICITY</h2>
          </div>
          <p className="text-xs font-mono text-purple-400/80 mt-1">
            NTAG424 DNA Dynamic SUN/CMAC Signed • Cryptographic Immutable Ownership
          </p>
        </div>

        <button
          onClick={onOpenNfcTap}
          className="bg-slate-900 border border-cyan-500/30 text-cyan-300 font-mono text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all"
        >
          <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
          <span>TAP NFC PHYSICAL SLAB</span>
        </button>
      </div>

      {/* Certificate Card Display */}
      <div className="max-w-3xl mx-auto glass-panel p-8 rounded-3xl border border-purple-500/40 relative overflow-hidden space-y-6 shadow-[0_0_50px_rgba(167,139,250,0.15)]">
        <div className="hud-scanlines absolute inset-0 opacity-20 pointer-events-none"></div>

        {/* Certificate Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/30 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-holographic-brushed border border-cyan-400/40 p-1 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-cyan-300" />
            </div>
            <div>
              <div className="font-display font-black text-lg text-white tracking-widest">VERIFIED CARD AUTHORITY</div>
              <div className="text-[10px] font-mono text-purple-300 uppercase">OFFICIAL DIGITAL SLAB CERTIFICATE</div>
            </div>
          </div>

          <div className="font-mono text-right">
            <div className="text-amber-400 font-bold text-sm">{cert.serialNumber}</div>
            <div className="text-[10px] text-slate-400">Minted: {new Date(cert.authenticatedAt).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Main Certificate Content */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center font-mono">
          <div className="sm:col-span-5 flex justify-center">
            <div className="relative p-2 bg-slate-950 rounded-2xl border border-purple-500/30 shadow-[0_0_25px_rgba(167,139,250,0.2)]">
              <img src={cert.imageUrl} alt={cert.cardName} className="h-64 object-contain rounded-xl" />
              <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded">
                #{cert.overallGrade} GEM MINT
              </div>
            </div>
          </div>

          <div className="sm:col-span-7 space-y-4">
            <div>
              <h3 className="font-display font-black text-xl text-white">{cert.cardName}</h3>
              <div className="text-cyan-400 text-sm font-bold">{cert.setName} #{cert.cardNumber}</div>
              <div className="text-slate-400 text-xs mt-1">{cert.variant}</div>
            </div>

            {/* Subgrades Table */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="text-purple-300 font-bold uppercase tracking-wider text-[10px] mb-2">GRADED SUBGRADES</div>
              <div className="flex justify-between">
                <span className="text-slate-400">Centering:</span>
                <span className="font-bold text-emerald-400">{cert.subgrades.centering}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Corners:</span>
                <span className="font-bold text-emerald-400">{cert.subgrades.corners}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Edges:</span>
                <span className="font-bold text-emerald-400">{cert.subgrades.edges}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Surface:</span>
                <span className="font-bold text-emerald-400">{cert.subgrades.surface}/100</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 space-y-1">
              <div>Registered Owner: <span className="text-slate-300 font-bold">{cert.ownerName}</span></div>
              <div>NFC UID Hash: <span className="text-cyan-400 font-mono">{cert.nfcUid}</span></div>
              <div>Ledger Block Hash: <span className="text-purple-400 font-mono truncate block">{cert.ledgerBlockHash}</span></div>
            </div>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="pt-4 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>CRYPTOGRAPHICALLY SEALED & VERIFIED</span>
          </div>

          <div className="text-[10px] text-slate-500">
            Immutable VCA Block Verification ID: <span className="text-slate-300">#000-001-GENESIS</span>
          </div>
        </div>

      </div>

    </div>
  );
};
