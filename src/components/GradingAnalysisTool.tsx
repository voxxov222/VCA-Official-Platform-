import React, { useState } from 'react';
import { Award, Calculator, TrendingUp, AlertTriangle, ArrowRight, DollarSign, CheckCircle, HelpCircle } from 'lucide-react';
import { CardItem, CardSubgrades } from '../types';

interface GradingAnalysisToolProps {
  card: CardItem;
  aiSubgrades?: CardSubgrades;
}

export const GradingAnalysisTool: React.FC<GradingAnalysisToolProps> = ({
  card,
  aiSubgrades = { centering: 94, corners: 92, edges: 95, surface: 91, overall: 9 }
}) => {
  // Configurable grading costs
  const [gradingFeeCAD, setGradingFeeCAD] = useState(35.00);
  const [shippingFeeCAD, setShippingFeeCAD] = useState(25.00);
  const [insuranceFeeCAD, setInsuranceFeeCAD] = useState(10.00);

  const totalCost = gradingFeeCAD + shippingFeeCAD + insuranceFeeCAD;

  // Probability calculations based on optical subgrades
  const overallConditionScore = aiSubgrades.overall || 9;
  
  const probPsa10 = Math.min(0.85, Math.max(0.10, (overallConditionScore - 8.5) * 0.6));
  const probPsa9 = Math.min(0.80, 1 - probPsa10);
  const probPsa8OrLower = Math.max(0, 1 - probPsa10 - probPsa9);

  // Expected Value
  const expectedGrossValue = (card.psa10Price * probPsa10) + (card.psa9Price * probPsa9) + (card.rawPrice * 0.9 * probPsa8OrLower);
  const expectedNetProfit = expectedGrossValue - card.rawPrice - totalCost;
  const breakEvenPsa10Prob = ((card.rawPrice + totalCost) - card.psa9Price) / (card.psa10Price - card.psa9Price);
  const roiPercent = Math.round((expectedNetProfit / (card.rawPrice + totalCost)) * 100);

  // Decision logic
  let decision: 'GRADE' | 'MAYBE' | 'KEEP RAW' = 'KEEP RAW';
  let decisionBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  let explanation = '';

  if (expectedNetProfit > 120 && probPsa10 > 0.35) {
    decision = 'GRADE';
    decisionBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    explanation = `High expected net upside (+CAD $${Math.round(expectedNetProfit)}). Optical analysis confirms strong surface & edges (${aiSubgrades.surface}/100) favoring Gem Mint potential.`;
  } else if (expectedNetProfit > 20) {
    decision = 'MAYBE';
    decisionBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    explanation = `Moderate upside (+CAD $${Math.round(expectedNetProfit)}). Card requires careful pre-grading cleaning/wiping before submission.`;
  } else {
    decision = 'KEEP RAW';
    decisionBadgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
    explanation = `Grading fees ($${totalCost.toFixed(2)}) exceed projected value increase over raw market value ($${card.rawPrice.toFixed(2)}). Better kept raw or binder copy.`;
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-extrabold text-slate-100 tracking-wider">
              SHOULD I GRADE THIS CARD?
            </h3>
            <p className="text-xs text-slate-400">
              VCA Predictive Grading Upside & ROI Calculator
            </p>
          </div>
        </div>

        {/* DECISION BADGE */}
        <div className={`px-4 py-2 rounded-xl border text-sm font-display font-black tracking-widest uppercase ${decisionBadgeColor}`}>
          RECOMMENDATION: {decision}
        </div>
      </div>

      {/* Primary ROI & Upside Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-slate-400">EXPECTED NET PROFIT</div>
          <div className={`text-xl font-mono font-black mt-1 ${expectedNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${expectedNetProfit >= 0 ? '+' : ''}${Math.round(expectedNetProfit)} CAD
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Weighted across grade probabilities</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-slate-400">ESTIMATED ROI</div>
          <div className={`text-xl font-mono font-black mt-1 ${roiPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {roiPercent}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Return on raw card + fees</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-slate-400">GEM MINT 10 PROBABILITY</div>
          <div className="text-xl font-mono font-black text-amber-300 mt-1">
            {Math.round(probPsa10 * 100)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Based on optical AI subgrades</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-slate-400">TOTAL GRADING COST</div>
          <div className="text-xl font-mono font-black text-slate-200 mt-1">
            ${totalCost.toFixed(2)} CAD
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Fee + shipping + insurance</div>
        </div>
      </div>

      {/* Rationale explanation box */}
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed flex items-start gap-3">
        <Award className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-300 uppercase tracking-wide mr-2">VCA ANALYSIS RATIONALE:</span>
          <span>{explanation}</span>
        </div>
      </div>

      {/* Cost inputs adjustment */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="text-xs font-mono text-slate-300 font-bold flex items-center justify-between">
          <span>CONFIGURE ESTIMATED GRADING COSTS (CAD)</span>
          <span className="text-slate-500">Total: ${totalCost.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Grading Fee ($):</label>
            <input
              type="number"
              value={gradingFeeCAD}
              onChange={(e) => setGradingFeeCAD(Number(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Insured Shipping ($):</label>
            <input
              type="number"
              value={shippingFeeCAD}
              onChange={(e) => setShippingFeeCAD(Number(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Vault Insurance ($):</label>
            <input
              type="number"
              value={insuranceFeeCAD}
              onChange={(e) => setInsuranceFeeCAD(Number(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 font-mono italic text-center">
        *Disclaimer: The VCA Grading Analysis Tool provides statistical estimations based on market data and AI condition signals. It does not guarantee official third-party grades.
      </div>
    </div>
  );
};
