import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Bell, Zap, Eye, AlertTriangle, ArrowUpRight, 
  ArrowDownRight, Plus, CheckCircle2, ShieldAlert, LineChart as ChartIcon,
  RefreshCw, DollarSign, ExternalLink, Activity
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { WATCHLIST_ITEMS, SAMPLE_CARDS } from '../../mockData/cards';
import { CardItem } from '../../types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-cyan-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[180px]">
        <div className="font-display font-bold text-slate-100 border-b border-slate-800 pb-1 flex justify-between items-center">
          <span>{label}</span>
          <span className="text-[10px] text-cyan-400">30D HISTORICAL</span>
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex justify-between items-center font-bold">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="text-slate-100">${Number(entry.value).toLocaleString()} CAD</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const MarketIntelligenceView: React.FC = () => {
  const [watchlist, setWatchlist] = useState(WATCHLIST_ITEMS);
  const [selectedCard, setSelectedCard] = useState<CardItem>(SAMPLE_CARDS[0]);
  const [showRawLine, setShowRawLine] = useState(true);
  const [showPsa9Line, setShowPsa9Line] = useState(true);
  const [showPsa10Line, setShowPsa10Line] = useState(true);
  const [apiScrapedData, setApiScrapedData] = useState<any>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // Fetch live market scraper data for the selected card
  useEffect(() => {
    const fetchPriceScraper = async () => {
      setIsLoadingApi(true);
      try {
        const res = await fetch(`/api/cards/prices?name=${encodeURIComponent(selectedCard.name)}&set=${encodeURIComponent(selectedCard.set)}&cardNumber=${encodeURIComponent(selectedCard.number)}&edition=${encodeURIComponent(selectedCard.variant)}`);
        const json = await res.json();
        if (json.success) {
          setApiScrapedData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch scraper price data:', err);
      } finally {
        setIsLoadingApi(false);
      }
    };

    fetchPriceScraper();
  }, [selectedCard]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
              VCA SIGNALS & MARKET INTELLIGENCE
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            30-DAY QUANT PRICE TRENDS, MULTI-SOURCE SCRAPER CONSENSUS & WATCHLIST
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>LIVE ENGINE: <strong className="text-cyan-300">POKÉMON-SCRAPER V2</strong></span>
        </div>
      </div>

      {/* CARD SELECTOR STRIP */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-bold text-slate-400 tracking-wider flex items-center justify-between">
          <span>SELECT CARD FOR 30-DAY PRICE TREND ANALYSIS:</span>
          <span className="text-cyan-400">{SAMPLE_CARDS.length} CARDS MONITORED</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_CARDS.map((card) => {
            const isSelected = card.id === selectedCard.id;
            return (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <img src={card.imageUrl} alt={card.name} className="w-10 h-14 object-cover rounded shadow" />
                <div className="truncate">
                  <div className={`font-display font-bold text-xs truncate ${isSelected ? 'text-cyan-300' : 'text-slate-100'}`}>
                    {card.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">{card.set}</div>
                  <div className="text-[11px] font-mono font-bold text-amber-300 mt-0.5">
                    PSA 10 ${card.psa10Price}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RECHARTS 30-DAY PRICE TREND CHART */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <img src={selectedCard.imageUrl} alt={selectedCard.name} className="w-10 h-14 object-cover rounded border border-slate-700" />
            <div>
              <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
                <span>{selectedCard.name}</span>
                <span className="text-xs font-mono font-normal text-slate-400">({selectedCard.set} #{selectedCard.number})</span>
              </h2>
              <div className="flex items-center gap-3 font-mono text-xs mt-1">
                <span className="text-slate-400">30D MOMENTUM:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +{selectedCard.consensus?.change30dPercent || 14.8}%
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">SIGNAL:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  {selectedCard.consensus?.marketSignal || 'STRONG BUY'}
                </span>
              </div>
            </div>
          </div>

          {/* Line Toggles */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-cyan-300 select-none">
              <input
                type="checkbox"
                checked={showRawLine}
                onChange={(e) => setShowRawLine(e.target.checked)}
                className="accent-cyan-400 rounded"
              />
              <span>RAW</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-purple-300 select-none">
              <input
                type="checkbox"
                checked={showPsa9Line}
                onChange={(e) => setShowPsa9Line(e.target.checked)}
                className="accent-purple-400 rounded"
              />
              <span>PSA 9</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-amber-300 select-none">
              <input
                type="checkbox"
                checked={showPsa10Line}
                onChange={(e) => setShowPsa10Line(e.target.checked)}
                className="accent-amber-400 rounded"
              />
              <span>PSA 10</span>
            </label>
          </div>
        </div>

        {/* Recharts Component */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={selectedCard.priceHistory || [
                { date: 'Jan 10', raw: 420, psa9: 1450, psa10: 8200 },
                { date: 'Jan 17', raw: 435, psa9: 1490, psa10: 8450 },
                { date: 'Jan 24', raw: 440, psa9: 1520, psa10: 8800 },
                { date: 'Jan 31', raw: 460, psa9: 1580, psa10: 9200 },
                { date: 'Feb 05', raw: 480, psa9: 1650, psa10: 9850 }
              ]}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} tickFormatter={(val) => `$${val}`} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '10px' }} />

              {showRawLine && (
                <Line
                  type="monotone"
                  dataKey="raw"
                  name="Raw NM Price"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#06b6d4' }}
                  activeDot={{ r: 6 }}
                />
              )}

              {showPsa9Line && (
                <Line
                  type="monotone"
                  dataKey="psa9"
                  name="PSA 9 Mint"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#a855f7' }}
                  activeDot={{ r: 6 }}
                />
              )}

              {showPsa10Line && (
                <Line
                  type="monotone"
                  dataKey="psa10"
                  name="PSA 10 Gem Mint"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#fbbf24' }}
                  activeDot={{ r: 8 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SCRAPED MARKET SOURCES BREAKDOWN */}
      {apiScrapedData && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>MULTI-SOURCE MARKET SCRAPER CONSENSUS (9 SOURCES)</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              CONFIDENCE: {apiScrapedData.totals.confidence}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {apiScrapedData.sources.map((src: any, idx: number) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-200 font-bold border-b border-slate-800 pb-1.5">
                  <span className="text-cyan-300">{src.sourceName}</span>
                  <a href={src.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">RAW:</span>
                    <span className="text-slate-200 font-bold">${src.rawPriceUSD} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PSA 9:</span>
                    <span className="text-purple-300 font-bold">${src.psa9PriceUSD} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PSA 10:</span>
                    <span className="text-amber-300 font-bold">${src.psa10PriceUSD} USD</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1 flex justify-between">
                  <span>SCORE: {src.reliabilityScore}%</span>
                  <span>{src.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WATCHLIST TABLE */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          <span>ACTIVE WATCHLIST & TARGET PRICE ALERTS</span>
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                <th className="p-3">CARD</th>
                <th className="p-3">CURRENT VALUE</th>
                <th className="p-3">TARGET ALERT</th>
                <th className="p-3">30D MOMENTUM</th>
                <th className="p-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {watchlist.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-slate-100 flex items-center gap-3">
                    <img src={item.card.imageUrl} alt={item.card.name} className="w-10 h-14 object-cover rounded" />
                    <div>
                      <div>{item.card.name}</div>
                      <div className="text-[10px] text-slate-400">{item.card.set}</div>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-cyan-300">${item.currentPriceCAD} CAD</td>
                  <td className="p-3 font-bold text-amber-300">${item.targetPriceCAD} CAD</td>
                  <td className="p-3 text-emerald-400 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{item.card.change30d}%</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      ACTIVE MONITORING
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

