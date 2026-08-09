import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Filter, Layers, Award, Cpu, FileCheck, 
  Download, Eye, ExternalLink, ArrowUpDown, ChevronRight, X
} from 'lucide-react';
import { MOCK_SLABS } from '../../mockData/cards';
import { HolographicLabel } from '../HolographicLabel';
import { Slab3DCanvas } from '../Slab3DCanvas';
import { HoloCardImage } from '../HoloCardImage';
import { VCASlab } from '../../types';

interface VaultViewProps {
  onOpenNfcModal: (slab?: VCASlab) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({ onOpenNfcModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSet, setSelectedSet] = useState('ALL');
  const [activeSlab, setActiveSlab] = useState<VCASlab | null>(null);

  const filteredSlabs = MOCK_SLABS.filter((s) => {
    const matchesSearch = s.card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSet = selectedSet === 'ALL' || s.card.set.includes(selectedSet);
    return matchesSearch && matchesSet;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
              MY AUTHENTICATED VAULT
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            NTAG424 CMAC DNA SECURED • IMMUTABLE ON-CHAIN LEDGER RECORD
          </p>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search serial or card name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={selectedSet}
            onChange={(e) => setSelectedSet(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">ALL SETS</option>
            <option value="151">Pokémon 151</option>
            <option value="Evolving Skies">Evolving Skies</option>
            <option value="Base Set">Base Set (1999)</option>
          </select>
        </div>
      </div>

      {/* SLABS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSlabs.map((slab) => (
          <div
            key={slab.serialNumber}
            className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-cyan-500/50 transition-all group"
          >
            {/* Holographic Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <HolographicLabel
                grade={slab.overallGrade}
                gradeText={slab.gradeLabel}
                serialNumber={slab.serialNumber}
                size="sm"
              />
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                100% CMAC OK
              </span>
            </div>

            {/* Card Content Body */}
            <div className="flex items-start gap-4">
              <HoloCardImage
                src={slab.card?.imageUrl || 'https://images.pokemontcg.io/base1/4_hires.png'}
                alt={slab.card?.name || (slab.card as any)?.pokemonName || 'Card'}
                className="w-24 h-34 object-cover rounded-xl"
                containerClassName="shrink-0"
                onClick={() => setActiveSlab(slab)}
              />
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <h3 className="font-display font-black text-base text-slate-100 truncate">
                    {slab.card?.name || (slab.card as any)?.pokemonName || 'Unknown Card'}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 truncate">
                    {slab.card?.set || (slab.card as any)?.setName} • #{slab.card?.number || (slab.card as any)?.cardNumber}
                  </div>
                  <div className="text-[11px] font-mono text-purple-300 truncate font-semibold">
                    {slab.card?.variant}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400">CURRENT VAULT VALUE</div>
                  <div className="text-base font-mono font-black text-emerald-400">
                    CAD ${(slab.vaultValueCAD || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenNfcModal(slab)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>NFC TAP</span>
              </button>

              <button
                onClick={() => setActiveSlab(slab)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs tracking-wider flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                <span>INSPECT 3D SLAB</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3D SLAB DETAIL MODAL INSPECTOR */}
      {activeSlab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl">
          <div className="glass-panel w-full max-w-4xl rounded-3xl p-6 border border-cyan-500/40 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{activeSlab.serialNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">AUTHENTICATED</span>
                </div>
                <h2 className="font-display font-black text-xl text-slate-100">{activeSlab.card.name}</h2>
              </div>
              <button onClick={() => setActiveSlab(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 3D Canvas View */}
              <div>
                <Slab3DCanvas
                  cardImageUrl={activeSlab.card.imageUrl}
                  grade={activeSlab.overallGrade}
                  gradeText={activeSlab.gradeLabel}
                  serialNumber={activeSlab.serialNumber}
                  className="w-full h-[380px]"
                />
              </div>

              {/* Subgrades & Ledger Info */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h3 className="font-display font-bold text-xs text-slate-300 tracking-wider uppercase">
                    OPTICAL SUBGRADE BREAKDOWN
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div>CENTERING: <span className="text-cyan-300 font-bold">{activeSlab.subgrades.centering}/100</span></div>
                    <div>CORNERS: <span className="text-cyan-300 font-bold">{activeSlab.subgrades.corners}/100</span></div>
                    <div>EDGES: <span className="text-cyan-300 font-bold">{activeSlab.subgrades.edges}/100</span></div>
                    <div>SURFACE: <span className="text-cyan-300 font-bold">{activeSlab.subgrades.surface}/100</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="text-slate-400">NTAG424 CMAC DNA CHIP UID:</div>
                  <div className="text-purple-300 font-bold">{activeSlab.nfcUid}</div>
                  <div className="text-slate-400 pt-2">MINTED TIMESTAMP:</div>
                  <div className="text-slate-200">{activeSlab.mintedAt}</div>
                  <div className="text-slate-400 pt-2">VERIFIED OWNER:</div>
                  <div className="text-emerald-400 font-bold">{activeSlab.ownerName}</div>
                </div>

                <button
                  onClick={() => alert(`Certificate PDF for ${activeSlab.serialNumber} generated & downloaded!`)}
                  className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD DIGITAL CERTIFICATE OF AUTHENTICITY</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
