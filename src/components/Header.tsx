import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Search, 
  Radio, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  Layers,
  Store,
  Zap,
  Sparkle,
  History,
  Settings,
  X,
  Menu,
  User,
  Bell,
  Flame
} from 'lucide-react';
import { getCurrentUser, subscribeAuth } from '../services/authService';
import { UserProfile } from '../types/vca';
import { BluePhoenixLogo } from './BluePhoenixLogo';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenScanner: () => void;
  onOpenNfcModal: () => void;
  onOpenAuthModal: () => void;
  onShowSplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenScanner,
  onOpenNfcModal,
  onOpenAuthModal,
  onShowSplash
}) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(getCurrentUser());

  useEffect(() => {
    const unsubscribe = subscribeAuth((u) => setUser(u));
    return unsubscribe;
  }, []);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'pack-ripper', label: '3D PACK RIPPER' },
    { id: 'card3d', label: '3D CARDS' },
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'vault', label: 'VAULT' },
    { id: 'marketplace', label: 'MARKETPLACE' },
    { id: 'market-intelligence', label: 'SIGNALS' },
    { id: 'watchlist', label: 'WATCHLIST' },
    { id: 'database', label: 'DATABASE' },
    { id: 'slabbook', label: 'SLABBOOK' },
    { id: 'profile', label: 'PROFILE' },
    { id: 'ledger', label: 'LEDGER' },
    { id: 'admin', label: 'ADMIN QC' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#03060c]/90 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Blue Phoenix Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            >
              <BluePhoenixLogo size="md" />
              <div>
                <div className="flex items-center gap-1.5 font-display text-lg font-black tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  VCA
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-1.5 py-0.2 rounded font-mono font-bold tracking-widest">
                    VERIFIED
                  </span>
                </div>
                <div className="text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase -mt-0.5">
                  Verified Card Authority
                </div>
              </div>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-[11px] font-bold">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentView === item.id
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {onShowSplash && (
              <button
                onClick={onShowSplash}
                className="px-2.5 py-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 transition-all cursor-pointer flex items-center gap-1"
                title="Replay Splash Opening Intro"
              >
                <Flame className="w-3 h-3 text-cyan-400" />
                <span>SPLASH</span>
              </button>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            
            {/* VScan AI Button */}
            <button
              onClick={onOpenScanner}
              className="relative group overflow-hidden bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 text-slate-950 font-display font-black text-xs px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span className="tracking-wider">VSCAN AI</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
            </button>

            {/* NFC Tap Button */}
            <button
              onClick={onOpenNfcModal}
              title="Tap VCA NFC Slab"
              className="px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-all flex items-center gap-1.5 font-mono text-xs font-bold cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
              <span className="hidden sm:inline">NFC TAP</span>
            </button>

            {/* Auth Profile / Sign In Button */}
            <button
              onClick={() => {
                if (user) {
                  onNavigate('profile');
                } else {
                  onOpenAuthModal();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 transition-all flex items-center gap-2 font-mono text-xs font-bold cursor-pointer"
              title={user ? `Logged in as ${user.displayName} - Click to view profile` : 'Sign In / Register'}
            >
              {user ? (
                <>
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.displayName}
                    className="w-5 h-5 rounded-full object-cover border border-cyan-400"
                  />
                  <span className="hidden sm:inline text-[11px] truncate max-w-[90px]">{user.displayName.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">SIGN IN</span>
                </>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 lg:hidden cursor-pointer"
            >
              {isMegaMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile / Mega Dropdown Menu */}
      {isMegaMenuOpen && (
        <div className="lg:hidden p-4 bg-slate-950 border-b border-slate-800 space-y-2 font-mono text-xs">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMegaMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold transition-all ${
                currentView === item.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

