import React, { useState } from 'react';
import { BreakingWire } from './components/BreakingWire';
import { Header } from './components/Header';
import { SplashPage } from './components/SplashPage';
import { BluePhoenixLogo } from './components/BluePhoenixLogo';
import { VScanCameraScannerProduction } from './components/VScanCameraScannerProduction';
import { NfcModal } from './components/NfcModal';
import { GradingSubmissionWizard } from './components/GradingSubmissionWizard';
import { CardComparisonModal } from './components/CardComparisonModal';
import { AuthModal } from './components/AuthModal';
import { WatchlistView } from './components/WatchlistView';
import { VcaNewsModal } from './components/VcaNewsModal';
import { HomeView } from './components/Views/HomeView';
import { DashboardView } from './components/Views/DashboardView';
import { VaultView } from './components/Views/VaultView';
import { MarketplaceView } from './components/Views/MarketplaceView';
import { MarketIntelligenceView } from './components/Views/MarketIntelligenceView';
import { CardDatabaseView } from './components/Views/CardDatabaseView';
import { SlabbookView } from './components/Views/SlabbookView';
import { ProfileView } from './components/Views/ProfileView';
import { LedgerView } from './components/Views/LedgerView';
import { AdminView } from './components/Views/AdminView';
import { Card3DShowcaseView } from './components/Views/Card3DShowcaseView';
import { PackRipper3DView } from './components/Views/PackRipper3DView';
import { CardItem, VCASlab } from './types';
import { SAMPLE_CARDS } from './mockData/cards';
import { ShieldCheck, Twitter, Github, Disc as Discord, Flame } from 'lucide-react';

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>('home');
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [selectedNfcSlab, setSelectedNfcSlab] = useState<VCASlab | undefined>(undefined);
  const [showNfcModal, setShowNfcModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showNewsModal, setShowNewsModal] = useState<boolean>(false);
  const [wizardCard, setWizardCard] = useState<CardItem | null>(null);
  const [compareCard, setCompareCard] = useState<CardItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); };
  const handleAddToPortfolio = (card: CardItem, gradeEstimate?: number) => showToast(`Added ${card.name}${gradeEstimate ? ` (Grade #${gradeEstimate})` : ''} to your Vault Portfolio!`);

  if (showSplash) return <SplashPage onEnter={() => setShowSplash(false)} onNavigateToView={(view) => { setCurrentView(view); setShowSplash(false); }} />;

  return (
    <div className="min-h-screen bg-[#03060C] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <BreakingWire onOpenNewsModal={() => setShowNewsModal(true)} />
      <Header currentView={currentView} onNavigate={setCurrentView} onOpenScanner={() => setShowScanner(true)} onOpenNfcModal={() => { setSelectedNfcSlab(undefined); setShowNfcModal(true); }} onOpenAuthModal={() => setShowAuthModal(true)} onShowSplash={() => setShowSplash(true)} />
      {toastMessage && <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-2xl bg-slate-900 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold shadow-2xl flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400"/><span>{toastMessage}</span></div>}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-4">
        <div key={currentView} className="glitch-wipe-enter bg-hud-grid py-2 min-h-[80vh] rounded-2xl">
          {currentView === 'pack-ripper' && <PackRipper3DView onToast={showToast} onNavigate={setCurrentView} />}
          {currentView === 'card3d' && <Card3DShowcaseView onOpenNfcModal={(slab) => { setSelectedNfcSlab(slab as any); setShowNfcModal(true); }} onToast={showToast} />}
          {currentView === 'home' && <HomeView onNavigate={setCurrentView} onOpenScanner={() => setShowScanner(true)} onOpenNfcModal={() => { setSelectedNfcSlab(undefined); setShowNfcModal(true); }} />}
          {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} onOpenScanner={() => setShowScanner(true)} onOpenNfcModal={(slab) => { setSelectedNfcSlab(slab); setShowNfcModal(true); }} />}
          {currentView === 'vault' && <VaultView onOpenNfcModal={(slab) => { setSelectedNfcSlab(slab); setShowNfcModal(true); }} />}
          {currentView === 'marketplace' && <MarketplaceView />}
          {currentView === 'market-intelligence' && <MarketIntelligenceView />}
          {currentView === 'watchlist' && <WatchlistView onOpenScanner={() => setShowScanner(true)} onToast={showToast} />}
          {currentView === 'database' && <CardDatabaseView onOpenScanner={() => setShowScanner(true)} onSelectCard={(c) => setCompareCard(c)} />}
          {currentView === 'slabbook' && <SlabbookView />}
          {currentView === 'profile' && <ProfileView onNavigate={setCurrentView} onOpenNfcModal={(slab) => { setSelectedNfcSlab(slab); setShowNfcModal(true); }} onToast={showToast} />}
          {currentView === 'ledger' && <LedgerView />}
          {currentView === 'admin' && <AdminView />}
          {currentView === 'compare' && <CardComparisonModal initialCard={compareCard || SAMPLE_CARDS[0]} onClose={() => setCurrentView('home')} />}
        </div>
      </main>

      {showNewsModal && <VcaNewsModal onClose={() => setShowNewsModal(false)} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onToast={showToast} />}
      {showScanner && <VScanCameraScannerProduction onClose={() => setShowScanner(false)} onAddToPortfolio={(card, grade) => { handleAddToPortfolio(card, grade); setShowScanner(false); }} onStartGradingWizard={(card) => { setShowScanner(false); setWizardCard(card); }} onCompareCard={(card) => { setShowScanner(false); setCompareCard(card); setCurrentView('compare'); }} />}
      {showNfcModal && <NfcModal slab={selectedNfcSlab} onClose={() => setShowNfcModal(false)} onNavigate={(v) => { setShowNfcModal(false); setCurrentView(v); }} onSignOwner={(serial) => showToast(`Digital signature appended to VCA Ledger for ${serial}!`)} />}
      {wizardCard && <GradingSubmissionWizard card={wizardCard} onClose={() => setWizardCard(null)} onComplete={(newSlab) => { showToast(`Slab ${newSlab.serialNumber} Minted & NTAG424 Bound!`); setWizardCard(null); setCurrentView('vault'); }} />}
      {compareCard && currentView !== 'compare' && <CardComparisonModal initialCard={compareCard} onClose={() => setCompareCard(null)} />}

      <footer className="w-full bg-[#020408] border-t border-cyan-500/20 py-12 mt-auto text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3"><div className="flex items-center gap-3"><BluePhoenixLogo size="sm"/><span className="font-display font-black text-sm text-slate-100 tracking-wider">VCA PHOENIX AUTHORITY</span></div><p className="text-slate-400 text-[11px] leading-relaxed">Verified Card Authority — Powered by the Blue Phoenix engine. NFC-enabled trading card grading and verification.</p><button onClick={() => setShowSplash(true)} className="px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 font-bold text-[10px] flex items-center gap-1"><Flame className="w-3 h-3"/>REPLAY SPLASH INTRO</button><div className="text-[10px] text-cyan-400/80 font-bold">© 2026 VCA INC. ALL RIGHTS RESERVED.</div></div>
          <div className="space-y-2"><div className="text-slate-200 font-bold uppercase tracking-wider">PLATFORM SUITE</div><div className="flex flex-col space-y-1 text-slate-400"><button onClick={() => setShowScanner(true)} className="hover:text-cyan-300 text-left">VScan AI Camera</button><button onClick={() => setCurrentView('pack-ripper')} className="hover:text-cyan-300 text-left">3D Pack Opening Arcade</button><button onClick={() => setCurrentView('dashboard')} className="hover:text-cyan-300 text-left">Investment Dashboard</button><button onClick={() => setCurrentView('vault')} className="hover:text-cyan-300 text-left">Authenticated Vault</button><button onClick={() => setCurrentView('slabbook')} className="hover:text-cyan-300 text-left">Slabbook Social Network</button></div></div>
          <div className="space-y-2"><div className="text-slate-200 font-bold uppercase tracking-wider">SECURITY & SPEC</div><div className="flex flex-col space-y-1 text-slate-400"><span>NFC slab binding</span><span>VCA verification core</span><span>Vision AI identification</span><span>Configurable grading standard</span></div></div>
          <div className="space-y-2"><div className="text-slate-200 font-bold uppercase tracking-wider">CONNECT</div><div className="flex items-center gap-3 pt-1"><a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800"><Twitter className="w-4 h-4"/></a><a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800"><Discord className="w-4 h-4"/></a><a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800"><Github className="w-4 h-4"/></a></div></div>
        </div>
      </footer>
    </div>
  );
}

export default App;
