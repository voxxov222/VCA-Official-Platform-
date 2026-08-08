import React, { useState } from 'react';
import { BreakingWire } from './components/BreakingWire';
import { Header } from './components/Header';
import { VScanScannerModal } from './components/VScanScannerModal';
import { NfcModal } from './components/NfcModal';
import { GradingSubmissionWizard } from './components/GradingSubmissionWizard';
import { CardComparisonModal } from './components/CardComparisonModal';
import { AuthModal } from './components/AuthModal';
import { WatchlistView } from './components/WatchlistView';

// Views
import { HomeView } from './components/Views/HomeView';
import { DashboardView } from './components/Views/DashboardView';
import { VaultView } from './components/Views/VaultView';
import { MarketplaceView } from './components/Views/MarketplaceView';
import { MarketIntelligenceView } from './components/Views/MarketIntelligenceView';
import { CardDatabaseView } from './components/Views/CardDatabaseView';
import { CommunityView } from './components/Views/CommunityView';
import { LedgerView } from './components/Views/LedgerView';
import { AdminView } from './components/Views/AdminView';

import { CardItem, VCASlab } from './types';
import { SAMPLE_CARDS } from './mockData/cards';
import { ShieldCheck, Twitter, Github, Disc as Discord } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  
  // Modals
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [selectedNfcSlab, setSelectedNfcSlab] = useState<VCASlab | undefined>(undefined);
  const [showNfcModal, setShowNfcModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [wizardCard, setWizardCard] = useState<CardItem | null>(null);
  const [compareCard, setCompareCard] = useState<CardItem | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToPortfolio = (card: CardItem, gradeEstimate = 10) => {
    showToast(`Added ${card.name} (Grade #${gradeEstimate}) to your Vault Portfolio!`);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      
      {/* Top Breaking Wire Ticker */}
      <BreakingWire />

      {/* Main Sticky Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenScanner={() => setShowScanner(true)}
        onOpenNfcModal={() => { setSelectedNfcSlab(undefined); setShowNfcModal(true); }}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Toast Alert Popup */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-2xl bg-slate-900 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Body View Switching */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-6">
        {currentView === 'home' && (
          <HomeView
            onNavigate={(v) => setCurrentView(v)}
            onOpenScanner={() => setShowScanner(true)}
            onOpenNfcModal={() => { setSelectedNfcSlab(undefined); setShowNfcModal(true); }}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            onNavigate={(v) => setCurrentView(v)}
            onOpenScanner={() => setShowScanner(true)}
            onOpenNfcModal={(slab) => { setSelectedNfcSlab(slab); setShowNfcModal(true); }}
          />
        )}

        {currentView === 'vault' && (
          <VaultView
            onOpenNfcModal={(slab) => { setSelectedNfcSlab(slab); setShowNfcModal(true); }}
          />
        )}

        {currentView === 'marketplace' && (
          <MarketplaceView />
        )}

        {currentView === 'market-intelligence' && (
          <MarketIntelligenceView />
        )}

        {currentView === 'watchlist' && (
          <WatchlistView
            onOpenScanner={() => setShowScanner(true)}
            onToast={(m) => showToast(m)}
          />
        )}

        {currentView === 'database' && (
          <CardDatabaseView
            onOpenScanner={() => setShowScanner(true)}
            onSelectCard={(c) => { setCompareCard(c); }}
          />
        )}

        {currentView === 'community' && (
          <CommunityView />
        )}

        {currentView === 'ledger' && (
          <LedgerView />
        )}

        {currentView === 'admin' && (
          <AdminView />
        )}

        {currentView === 'compare' && (
          <CardComparisonModal
            initialCard={compareCard || SAMPLE_CARDS[0]}
            onClose={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* MODALS */}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onToast={(m) => showToast(m)}
        />
      )}

      {/* VScan AI Camera Scanner */}
      {showScanner && (
        <VScanScannerModal
          onClose={() => setShowScanner(false)}
          onAddToPortfolio={(card, grade) => {
            handleAddToPortfolio(card, grade);
            setShowScanner(false);
          }}
          onStartGradingWizard={(card) => {
            setShowScanner(false);
            setWizardCard(card);
          }}
          onCompareCard={(card) => {
            setShowScanner(false);
            setCompareCard(card);
            setCurrentView('compare');
          }}
        />
      )}

      {/* NFC Tap Verification Modal */}
      {showNfcModal && (
        <NfcModal
          slab={selectedNfcSlab}
          onClose={() => setShowNfcModal(false)}
          onNavigate={(v) => { setShowNfcModal(false); setCurrentView(v); }}
          onSignOwner={(serial) => {
            showToast(`Digital signature appended to VCA Ledger for ${serial}!`);
          }}
        />
      )}

      {/* 10-Step Grading Submission Wizard */}
      {wizardCard && (
        <GradingSubmissionWizard
          card={wizardCard}
          onClose={() => setWizardCard(null)}
          onComplete={(newSlab) => {
            showToast(`Slab ${newSlab.serialNumber} Minted & NTAG424 Bound!`);
            setWizardCard(null);
            setCurrentView('vault');
          }}
        />
      )}

      {/* Compare Modal when triggered outside tab */}
      {compareCard && currentView !== 'compare' && (
        <CardComparisonModal
          initialCard={compareCard}
          onClose={() => setCompareCard(null)}
        />
      )}

      {/* FOOTER */}
      <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-12 mt-auto text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="font-display font-black text-sm text-slate-100">VCA AUTHORITY</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Verified Card Authority — NFC-encrypted trading card grading, AI condition scoring, and immutable collectible authentication ledger.
            </p>
            <div className="text-[10px] text-cyan-400 font-bold">
              © 2026 VCA INC. ALL RIGHTS RESERVED.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-slate-200 font-bold uppercase tracking-wider">PLATFORM SUITE</div>
            <div className="flex flex-col space-y-1 text-slate-400">
              <button onClick={() => setShowScanner(true)} className="hover:text-cyan-300 text-left cursor-pointer">VScan AI Camera</button>
              <button onClick={() => setCurrentView('dashboard')} className="hover:text-cyan-300 text-left cursor-pointer">Investment Dashboard</button>
              <button onClick={() => setCurrentView('vault')} className="hover:text-cyan-300 text-left cursor-pointer">Authenticated Vault</button>
              <button onClick={() => setCurrentView('marketplace')} className="hover:text-cyan-300 text-left cursor-pointer">Verified Marketplace</button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-slate-200 font-bold uppercase tracking-wider">SECURITY & SPEC</div>
            <div className="flex flex-col space-y-1 text-slate-400">
              <span>NTAG424 DNA CMAC Encryption</span>
              <span>SHA-256 Hash-Chained Ledger</span>
              <span>Gemini 3.6 Vision AI Engine</span>
              <span>VGAS 10-Point Condition Standard</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-slate-200 font-bold uppercase tracking-wider">CONNECT</div>
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800">
                <Discord className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
