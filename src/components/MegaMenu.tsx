import React from 'react';
import { 
  Camera, 
  Briefcase, 
  TrendingUp, 
  Database, 
  ShoppingBag, 
  Award, 
  ShieldCheck, 
  Bell, 
  Sliders, 
  X, 
  Sparkles, 
  Radio 
} from 'lucide-react';
import { NavigationTab } from '../types/vca';

interface MegaMenuProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ activeTab, setActiveTab, onClose }) => {
  const categories = [
    {
      title: 'SCAN & GRADE',
      items: [
        { tab: 'dashboard' as NavigationTab, label: 'VScan AI Scanner', desc: 'Identify card & condition via camera', icon: Camera, color: 'text-cyan-400' },
        { tab: 'certificates' as NavigationTab, label: 'Digital Certificates', desc: 'Tamper-evident NTAG424 COAs', icon: Award, color: 'text-purple-400' }
      ]
    },
    {
      title: 'PORTFOLIO & VAULT',
      items: [
        { tab: 'portfolio' as NavigationTab, label: 'My Vault Portfolio', desc: 'Live valuation & asset tracking', icon: Briefcase, color: 'text-emerald-400' },
        { tab: 'watchlist' as NavigationTab, label: 'Watchlist & Alerts', desc: 'Price movement threshold triggers', icon: Bell, color: 'text-amber-400' }
      ]
    },
    {
      title: 'MARKET INTELLIGENCE',
      items: [
        { tab: 'market' as NavigationTab, label: 'Market Matrix', desc: 'Raw vs PSA 9 vs PSA 10 spread', icon: TrendingUp, color: 'text-teal-400' },
        { tab: 'database' as NavigationTab, label: 'Pokémon Card Database', desc: 'Global card & variant indexing', icon: Database, color: 'text-cyan-300' },
        { tab: 'marketplace' as NavigationTab, label: 'Live Marketplace', desc: 'Buy now & auction rooms', icon: ShoppingBag, color: 'text-amber-300' }
      ]
    },
    {
      title: 'COMMUNITY',
      items: [
        { tab: 'slabbook' as NavigationTab, label: 'Slabbook Social', desc: 'Facebook for Pokémon Collectors', icon: Sparkles, color: 'text-blue-400' },
      ]
    },
    {
      title: 'LEDGER & ADMIN',
      items: [
        { tab: 'ledger' as NavigationTab, label: 'VCA Event Ledger', desc: 'Immutable block event history', icon: ShieldCheck, color: 'text-purple-300' },
        { tab: 'admin' as NavigationTab, label: 'Admin Command Center', desc: 'Provider weight calibration', icon: Sliders, color: 'text-slate-400' }
      ]
    }
  ];

  return (
    <div className="bg-[#05070a]/95 border-b border-cyan-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-display font-bold text-sm text-white tracking-wider">VCA NAVIGATION & EXPLORE</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cat.title}</div>
              <div className="space-y-2">
                {cat.items.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => setActiveTab(item.tab)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group ${
                        activeTab === item.tab
                          ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${item.color}`} />
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">{item.label}</div>
                        <div className="text-[10px] text-slate-500 font-sans mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
