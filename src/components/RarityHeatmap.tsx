import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SAMPLE_CARDS } from '../mockData/cards';
import { Layers, Sparkles, Filter, RefreshCw, AlertCircle } from 'lucide-react';

export interface HeatmapFilter {
  setName?: string;
  rarity?: string;
}

interface RarityHeatmapProps {
  onSelectFilter: (filter: HeatmapFilter) => void;
  activeFilter: HeatmapFilter;
}

interface HeatmapCellData {
  setName: string;
  rarity: string;
  count: number;
  avgPsa10USD: number;
  scarcityScore: number; // 1-100
}

const SETS = [
  'Base Set',
  '151 (Scarlet & Violet)',
  'Evolving Skies',
  'Fusion Strike',
  'Crown Zenith',
  'Paldea Evolved'
];

const RARITIES = [
  'Common',
  'Uncommon',
  'Holo Rare',
  'Illustration Rare',
  'Secret Rare',
  '1st Edition / Gold'
];

// Pre-computed scarcity matrix blending dataset + TCG population metrics
const MATRIX_DATA: HeatmapCellData[] = [
  // Base Set
  { setName: 'Base Set', rarity: 'Common', count: 32, avgPsa10USD: 85, scarcityScore: 25 },
  { setName: 'Base Set', rarity: 'Uncommon', count: 20, avgPsa10USD: 140, scarcityScore: 40 },
  { setName: 'Base Set', rarity: 'Holo Rare', count: 16, avgPsa10USD: 1850, scarcityScore: 88 },
  { setName: 'Base Set', rarity: 'Illustration Rare', count: 0, avgPsa10USD: 0, scarcityScore: 0 },
  { setName: 'Base Set', rarity: 'Secret Rare', count: 2, avgPsa10USD: 3400, scarcityScore: 94 },
  { setName: 'Base Set', rarity: '1st Edition / Gold', count: 16, avgPsa10USD: 9850, scarcityScore: 100 },

  // 151
  { setName: '151 (Scarlet & Violet)', rarity: 'Common', count: 68, avgPsa10USD: 25, scarcityScore: 15 },
  { setName: '151 (Scarlet & Violet)', rarity: 'Uncommon', count: 42, avgPsa10USD: 45, scarcityScore: 28 },
  { setName: '151 (Scarlet & Violet)', rarity: 'Holo Rare', count: 24, avgPsa10USD: 95, scarcityScore: 50 },
  { setName: '151 (Scarlet & Violet)', rarity: 'Illustration Rare', count: 18, avgPsa10USD: 340, scarcityScore: 78 },
  { setName: '151 (Scarlet & Violet)', rarity: 'Secret Rare', count: 12, avgPsa10USD: 620, scarcityScore: 85 },
  { setName: '151 (Scarlet & Violet)', rarity: '1st Edition / Gold', count: 3, avgPsa10USD: 280, scarcityScore: 72 },

  // Evolving Skies
  { setName: 'Evolving Skies', rarity: 'Common', count: 70, avgPsa10USD: 20, scarcityScore: 12 },
  { setName: 'Evolving Skies', rarity: 'Uncommon', count: 50, avgPsa10USD: 35, scarcityScore: 22 },
  { setName: 'Evolving Skies', rarity: 'Holo Rare', count: 30, avgPsa10USD: 80, scarcityScore: 45 },
  { setName: 'Evolving Skies', rarity: 'Illustration Rare', count: 15, avgPsa10USD: 420, scarcityScore: 82 },
  { setName: 'Evolving Skies', rarity: 'Secret Rare', count: 22, avgPsa10USD: 1120, scarcityScore: 92 },
  { setName: 'Evolving Skies', rarity: '1st Edition / Gold', count: 8, avgPsa10USD: 310, scarcityScore: 68 },

  // Fusion Strike
  { setName: 'Fusion Strike', rarity: 'Common', count: 80, avgPsa10USD: 18, scarcityScore: 10 },
  { setName: 'Fusion Strike', rarity: 'Uncommon', count: 55, avgPsa10USD: 30, scarcityScore: 18 },
  { setName: 'Fusion Strike', rarity: 'Holo Rare', count: 32, avgPsa10USD: 65, scarcityScore: 38 },
  { setName: 'Fusion Strike', rarity: 'Illustration Rare', count: 12, avgPsa10USD: 290, scarcityScore: 70 },
  { setName: 'Fusion Strike', rarity: 'Secret Rare', count: 18, avgPsa10USD: 780, scarcityScore: 86 },
  { setName: 'Fusion Strike', rarity: '1st Edition / Gold', count: 6, avgPsa10USD: 210, scarcityScore: 60 },

  // Crown Zenith
  { setName: 'Crown Zenith', rarity: 'Common', count: 60, avgPsa10USD: 22, scarcityScore: 14 },
  { setName: 'Crown Zenith', rarity: 'Uncommon', count: 40, avgPsa10USD: 38, scarcityScore: 25 },
  { setName: 'Crown Zenith', rarity: 'Holo Rare', count: 28, avgPsa10USD: 75, scarcityScore: 42 },
  { setName: 'Crown Zenith', rarity: 'Illustration Rare', count: 25, avgPsa10USD: 380, scarcityScore: 76 },
  { setName: 'Crown Zenith', rarity: 'Secret Rare', count: 14, avgPsa10USD: 890, scarcityScore: 89 },
  { setName: 'Crown Zenith', rarity: '1st Edition / Gold', count: 4, avgPsa10USD: 520, scarcityScore: 80 },

  // Paldea Evolved
  { setName: 'Paldea Evolved', rarity: 'Common', count: 75, avgPsa10USD: 18, scarcityScore: 11 },
  { setName: 'Paldea Evolved', rarity: 'Uncommon', count: 48, avgPsa10USD: 32, scarcityScore: 20 },
  { setName: 'Paldea Evolved', rarity: 'Holo Rare', count: 26, avgPsa10USD: 70, scarcityScore: 40 },
  { setName: 'Paldea Evolved', rarity: 'Illustration Rare', count: 16, avgPsa10USD: 310, scarcityScore: 72 },
  { setName: 'Paldea Evolved', rarity: 'Secret Rare', count: 15, avgPsa10USD: 650, scarcityScore: 84 },
  { setName: 'Paldea Evolved', rarity: '1st Edition / Gold', count: 5, avgPsa10USD: 240, scarcityScore: 62 }
];

export const RarityHeatmap: React.FC<RarityHeatmapProps> = ({ onSelectFilter, activeFilter }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredCell, setHoveredCell] = useState<HeatmapCellData | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 20, bottom: 60, left: 160 };
    const width = 720 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale (Rarities)
    const xScale = d3.scaleBand()
      .domain(RARITIES)
      .range([0, width])
      .padding(0.08);

    // Y Scale (Sets)
    const yScale = d3.scaleBand()
      .domain(SETS)
      .range([0, height])
      .padding(0.08);

    // Color Scale using D3 sequential interpolator (Dark Slate -> Cyan -> Indigo -> Amber/Gold)
    const colorScale = d3.scaleSequential()
      .domain([0, 100])
      .interpolator((t) => {
        if (t === 0) return '#0f172a'; // Empty / Zero
        if (t < 0.25) return d3.interpolateRgb('#1e293b', '#0284c7')(t * 4);
        if (t < 0.6) return d3.interpolateRgb('#0284c7', '#7c3aed')((t - 0.25) * 2.85);
        if (t < 0.85) return d3.interpolateRgb('#7c3aed', '#eab308')((t - 0.6) * 4);
        return d3.interpolateRgb('#eab308', '#fbbf24')((t - 0.85) * 6.66);
      });

    // Draw X Axis Labels
    g.append('g')
      .attr('transform', `translate(0, ${height + 10})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .select('.domain').remove();

    g.selectAll('.tick text')
      .style('fill', '#94a3b8')
      .style('font-size', '10px')
      .style('font-family', 'monospace')
      .style('font-weight', 'bold')
      .attr('transform', 'rotate(-15)')
      .style('text-anchor', 'end');

    // Draw Y Axis Labels
    g.append('g')
      .call(d3.axisLeft(yScale).tickSize(0))
      .select('.domain').remove();

    g.selectAll('.tick text')
      .style('fill', '#cbd5e1')
      .style('font-size', '11px')
      .style('font-family', 'sans-serif')
      .style('font-weight', '600');

    // Render Heatmap Cells
    g.selectAll('.cell')
      .data(MATRIX_DATA)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d) => xScale(d.rarity) || 0)
      .attr('y', (d) => yScale(d.setName) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 6)
      .attr('ry', 6)
      .style('fill', (d) => colorScale(d.scarcityScore))
      .style('stroke', (d) => {
        if (activeFilter.setName === d.setName && activeFilter.rarity === d.rarity) {
          return '#22d3ee'; // Cyan active border
        }
        return d.scarcityScore > 80 ? '#fbbf24' : '#1e293b';
      })
      .style('stroke-width', (d) => {
        if (activeFilter.setName === d.setName && activeFilter.rarity === d.rarity) {
          return '2.5px';
        }
        return '1px';
      })
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s ease')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .style('stroke', '#22d3ee')
          .style('stroke-width', '2px')
          .style('filter', 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))');
        
        setHoveredCell(d);
        const [x, y] = d3.pointer(event, svgRef.current);
        setMousePos({ x, y });
      })
      .on('mousemove', function (event) {
        const [x, y] = d3.pointer(event, svgRef.current);
        setMousePos({ x, y });
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .style('stroke', (activeFilter.setName === d.setName && activeFilter.rarity === d.rarity) ? '#22d3ee' : (d.scarcityScore > 80 ? '#fbbf24' : '#1e293b'))
          .style('stroke-width', (activeFilter.setName === d.setName && activeFilter.rarity === d.rarity) ? '2.5px' : '1px')
          .style('filter', 'none');

        setHoveredCell(null);
      })
      .on('click', function (event, d) {
        if (activeFilter.setName === d.setName && activeFilter.rarity === d.rarity) {
          onSelectFilter({}); // Toggle off
        } else {
          onSelectFilter({ setName: d.setName, rarity: d.rarity });
        }
      });

    // Cell Text Labels (showing count or avg price)
    g.selectAll('.cell-text')
      .data(MATRIX_DATA)
      .enter()
      .append('text')
      .attr('x', (d) => (xScale(d.rarity) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => (yScale(d.setName) || 0) + yScale.bandwidth() / 2 + 4)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-family', 'monospace')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .style('fill', (d) => (d.scarcityScore > 50 ? '#030712' : '#f8fafc'))
      .text((d) => (d.count > 0 ? `${d.scarcityScore}` : '—'));

  }, [activeFilter]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-base text-slate-100 tracking-wider">
              D3 SCARCITY & RARITY HEATMAP VISUALIZER
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            COLOR-CODED MATRIX INDICATING POPULATION DENSITY & HISTORICAL PSA 10 GEM MINT VALUATIONS
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <span>Low Scarcity</span>
          <div className="h-2.5 w-24 rounded-full bg-gradient-to-r from-slate-900 via-sky-600 via-purple-600 to-amber-400 border border-slate-700" />
          <span className="text-amber-300 font-bold">Ultra Rare</span>
        </div>
      </div>

      {/* Filter status banner if active */}
      {(activeFilter.setName || activeFilter.rarity) && (
        <div className="flex items-center justify-between bg-cyan-950/60 border border-cyan-500/40 rounded-xl px-4 py-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyan-300">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>
              FILTERED BY: <strong className="text-white">{activeFilter.setName || 'All Sets'}</strong> • <strong className="text-amber-300">{activeFilter.rarity || 'All Rarities'}</strong>
            </span>
          </div>
          <button
            onClick={() => onSelectFilter({})}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-bold border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            <span>RESET HEATMAP FILTER</span>
          </button>
        </div>
      )}

      {/* SVG Container */}
      <div className="overflow-x-auto flex justify-center py-2">
        <svg ref={svgRef} width={720} height={300} className="max-w-full" />
      </div>

      {/* Interactive Tooltip Overlay */}
      {hoveredCell && (
        <div
          style={{
            left: `${Math.min(mousePos.x + 15, 520)}px`,
            top: `${Math.max(mousePos.y - 10, 20)}px`
          }}
          className="absolute z-30 pointer-events-none bg-slate-950/95 border border-cyan-500/40 p-3.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md w-60 space-y-2 text-xs font-mono"
        >
          <div className="font-display font-bold text-slate-100 flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-cyan-300 truncate">{hoveredCell.setName}</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">
              {hoveredCell.rarity}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">SCARCITY INDEX</span>
              <span className="text-amber-400 font-black text-sm">{hoveredCell.scarcityScore} / 100</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">AVG PSA 10</span>
              <span className="text-emerald-400 font-black text-sm">
                {hoveredCell.avgPsa10USD > 0 ? `$${hoveredCell.avgPsa10USD}` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex justify-between items-center">
            <span>INDEXED CARDS: <strong className="text-slate-200">{hoveredCell.count}</strong></span>
            <span className="text-cyan-400 font-bold">CLICK TO FILTER</span>
          </div>
        </div>
      )}
    </div>
  );
};
