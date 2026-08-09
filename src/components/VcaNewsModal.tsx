import React, { useState } from 'react';
import { 
  Radio, 
  X, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  Award, 
  Flame, 
  Tv, 
  TrendingUp, 
  Newspaper, 
  Clock, 
  Globe, 
  ChevronRight,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

interface VcaNewsModalProps {
  onClose: () => void;
}

interface NewsArticle {
  id: string;
  category: 'LIVE PRICE' | 'POKÉMON TCG' | 'VCA NEWS' | 'AUCTION RECORD' | 'GRADING REPORT';
  title: string;
  summary: string;
  timestamp: string;
  impactScore: number;
  author: string;
  cardName?: string;
  priceChange?: string;
  currentPriceCAD?: string;
  badgeColor: string;
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-001',
    category: 'AUCTION RECORD',
    title: 'Japanese 1996 Base Set No-Rarity Charizard PSA 10 Closes at $385,000 USD in Heritage Auction',
    summary: 'A pristine no-rarity symbol 1st print Japanese Base Set Charizard set an all-time record tonight after a fierce 48-bid battle. Market analysts cite extreme scarcity and flawless surface centering.',
    timestamp: '12 mins ago',
    impactScore: 99,
    author: 'VCA Market Wire Service',
    cardName: 'Charizard No-Rarity 1996',
    priceChange: '+24.5%',
    currentPriceCAD: '$525,000 CAD',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'news-002',
    category: 'LIVE PRICE',
    title: 'Top Rare Price Surge: Base Set 1st Edition Charizard PSA 10 Climbs to $9,850 CAD',
    summary: 'Graded sales across eBay, Heritage, and VCA Vault indicate a 14.8% price expansion for Base Set #4/102. Gem Mint pop reports remain constrained at 122 copies globally.',
    timestamp: '25 mins ago',
    impactScore: 95,
    author: 'VCA Price Index Engine',
    cardName: 'Charizard 1st Ed #4/102',
    priceChange: '+14.8%',
    currentPriceCAD: '$9,850 CAD',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'news-003',
    category: 'VCA NEWS',
    title: 'VScan AI 2.0 Surface Defect Neural Model Live Across All Scanning Terminals',
    summary: 'VCA Engineering has deployed Sub-Pixel Surface Vision models offering 99.4% subgrade accuracy for centering, corner whitening, and foil scratch identification.',
    timestamp: '1 hour ago',
    impactScore: 92,
    author: 'VCA AI Research Team',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  },
  {
    id: 'news-004',
    category: 'POKÉMON TCG',
    title: 'Scarlet & Violet 151 Special Illustration Rares See Massive Buyouts in North America',
    summary: 'Pikachu #173/165 and Charizard ex #199/165 experience high volume sweeps on TCGPlayer and Cardmarket as collectors lock in Gem Mint raw candidates.',
    timestamp: '2 hours ago',
    impactScore: 88,
    author: 'Slabbook Market Watch',
    cardName: 'Pikachu 151 #173/165',
    priceChange: '+18.2%',
    currentPriceCAD: '$2,850 CAD',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  {
    id: 'news-005',
    category: 'LIVE PRICE',
    title: 'Evolving Skies Umbreon VMAX Alt Art #215/203 Surpasses $1,850 CAD Threshold',
    summary: 'Popularly known as "Moonbreon", PSA 10 copies reach new high-water mark with 42 recorded public sales in the past 30 days.',
    timestamp: '3 hours ago',
    impactScore: 90,
    author: 'VCA Index Feed',
    cardName: 'Umbreon VMAX Alt Art',
    priceChange: '+12.4%',
    currentPriceCAD: '$1,850 CAD',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'news-006',
    category: 'GRADING REPORT',
    title: 'NTAG424 CMAC Smart Slab Security Audit Confirms Zero Clone Instances Worldwide',
    summary: 'Cryptographic ledger check on 14,000+ VCA Slabs confirms 100% CMAC DNA seal integrity across all global vaults.',
    timestamp: '5 hours ago',
    impactScore: 94,
    author: 'VCA Cybersecurity Lab',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  }
];

export const VcaNewsModal: React.FC<VcaNewsModalProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', 'LIVE PRICE', 'POKÉMON TCG', 'VCA NEWS', 'AUCTION RECORD', 'GRADING REPORT'];

  const filteredNews = NEWS_ARTICLES.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn font-sans text-slate-100">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#05070A] border border-cyan-500/30 shadow-[0_0_60px_rgba(34,211,238,0.2)] overflow-hidden">
        
        {/* CNN STYLE LIVE BROADCAST HEADER */}
        <div className="p-5 bg-gradient-to-r from-red-950/80 via-slate-950 to-cyan-950/80 border-b border-red-500/30 flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <Tv className="w-5 h-5 text-red-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white font-mono font-black text-[10px] tracking-widest animate-pulse">
                  ● LIVE BROADCAST
                </span>
                <span className="font-display font-black text-lg text-white tracking-wider">
                  CNN • VCA POKÉMON NEWS WIRE
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Real-Time Streaming Pokémon TCG Market News & Top Rare Card Prices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH & CATEGORY BAR */}
        <div className="p-4 bg-slate-950 border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 font-mono text-xs">
          
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news or card..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

        </div>

        {/* ARTICLES LIVE STREAM CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans scrollbar-thin scrollbar-thumb-slate-800">
          
          {filteredNews.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              No matching news stories found for "{searchQuery}".
            </div>
          ) : (
            filteredNews.map((article) => (
              <div
                key={article.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
              >
                <div className="flex items-center justify-between gap-4 font-mono text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${article.badgeColor}`}>
                    {article.category}
                  </span>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {article.timestamp}
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">{article.author}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-base md:text-lg text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                  {article.summary}
                </p>

                {/* CARD PRICE BANNER IF APPLICABLE */}
                {article.cardName && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">{article.cardName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        {article.priceChange}
                      </span>
                      <span className="font-black text-cyan-300 font-display">
                        {article.currentPriceCAD}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

        </div>

        {/* FOOTER LIVE WIRE STATUS */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>CNN • VCA REAL-TIME POKÉMON MARKET FEED ACTIVE</span>
          </div>

          <div className="text-cyan-400 font-bold">
            LATENCY: 12ms • REFRESH: AUTO
          </div>
        </div>

      </div>
    </div>
  );
};
