import React from 'react';
import { ShieldCheck, Radio, Award, ExternalLink, Github, Twitter, Layers } from 'lucide-react';
import { NavigationTab } from '../types/vca';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#030508] border-t border-cyan-500/20 text-slate-400 font-sans text-xs pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-holographic-brushed border border-cyan-400/40 p-0.5 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <span className="font-display font-black text-white tracking-wider text-base">VERIFIED CARD AUTHORITY</span>
                <span className="text-[10px] font-mono text-cyan-400 block uppercase">NTAG424 Encrypted Collectible Infrastructure</span>
              </div>
            </div>

            <p className="text-slate-400 font-mono text-[11px] leading-relaxed max-w-sm">
              Next-generation Pokémon trading card computer vision, multi-tier market intelligence, and cryptographic smart slab authentication.
            </p>

            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>VCA LEDGER NETWORK: OPERATIONAL (100% UPTIME)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 font-mono">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">PLATFORM MODULES</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-300 transition-colors">Dashboard</button></li>
              <li><button onClick={() => setActiveTab('portfolio')} className="hover:text-cyan-300 transition-colors">My Portfolio Vault</button></li>
              <li><button onClick={() => setActiveTab('market')} className="hover:text-cyan-300 transition-colors">Market Intelligence</button></li>
              <li><button onClick={() => setActiveTab('database')} className="hover:text-cyan-300 transition-colors">Pokémon Card Database</button></li>
              <li><button onClick={() => setActiveTab('certificates')} className="hover:text-cyan-300 transition-colors">Digital Certificates</button></li>
              <li><button onClick={() => setActiveTab('ledger')} className="hover:text-cyan-300 transition-colors">Cryptographic Ledger</button></li>
            </ul>
          </div>

          {/* Roadmap & Compliance */}
          <div className="md:col-span-4 space-y-3 font-mono">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">DISCLAIMER & TRANSPARENCY</h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              VCA AI condition scores are computer-vision estimates and do not constitute an official PSA, BGS, or CGC grading certificate. All pricing data is weighted from authorized feeds (TCGplayer, Cardmarket, eBay Sold) and updated continuously.
            </p>
            <div className="pt-2 text-[10px] text-cyan-400">
              © 2026 Verified Card Authority Inc. All rights reserved.
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
