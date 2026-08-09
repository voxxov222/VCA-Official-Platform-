import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Eye, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Sliders, 
  Box, 
  Maximize2, 
  DollarSign, 
  Plus, 
  Radio, 
  Share2,
  Info
} from 'lucide-react';
import { Card3DPopoutCanvas, POPULAR_3D_POKEMON, PokemonVariantData } from '../Card3DPopoutCanvas';
import { addCardToVault } from '../../services/vaultService';

interface Card3DShowcaseViewProps {
  onOpenNfcModal?: (slabData?: any) => void;
  onToast?: (msg: string) => void;
}

export const Card3DShowcaseView: React.FC<Card3DShowcaseViewProps> = ({
  onOpenNfcModal,
  onToast
}) => {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonVariantData>(POPULAR_3D_POKEMON[0]);
  const [variantType, setVariantType] = useState<'holo' | 'first_edition' | 'sir' | 'gold' | 'rainbow' | 'reverse'>('sir');
  const [popOutDepth, setPopOutDepth] = useState<number>(0.75);
  const [auraIntensity, setAuraIntensity] = useState<'off' | 'low' | 'high' | 'hyper'>('high');
  const [foilFinish, setFoilFinish] = useState<'prismatic' | 'gold_liquid' | 'diamond_star' | 'laser_rainbow'>('prismatic');
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [isSavedToVault, setIsSavedToVault] = useState<boolean>(false);

  const handleAddToVault = () => {
    addCardToVault({
      name: selectedPokemon.name,
      set: selectedPokemon.set,
      number: selectedPokemon.number,
      rarity: selectedPokemon.rarity,
      cardImageUrl: selectedPokemon.cardImageUrl,
      rawPrice: selectedPokemon.rawPrice,
      psa9Price: selectedPokemon.psa9Price,
      psa10Price: selectedPokemon.psa10Price
    });
    setIsSavedToVault(true);
    if (onToast) onToast(`Added ${selectedPokemon.name} 3D Digital Card to Vault!`);
    setTimeout(() => setIsSavedToVault(false), 3000);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'fire':
        return <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-mono font-bold flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> FIRE</span>;
      case 'electric':
        return <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs font-mono font-bold flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> ELECTRIC</span>;
      case 'psychic':
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> PSYCHIC</span>;
      case 'dragon':
        return <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-mono font-bold flex items-center gap-1"><Box className="w-3.5 h-3.5" /> DRAGON</span>;
      case 'dark':
        return <span className="px-2.5 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/40 text-xs font-mono font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> DARK</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> WATER</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
              <Box className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>3D DIGITAL CARD STUDIO • PARALLAX DEPTH ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-wide">
              3D Interactive Pop-Out Card Collection
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Experience Pokémon cards with multi-layered 3D depth extrusion, dynamic holographic foiling, elemental particle aura emitters, and real-time market index pricing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleAddToVault}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isSavedToVault
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{isSavedToVault ? 'SAVED TO VAULT!' : 'SAVE TO MY VAULT'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pokédex Card Selector Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider">SELECT POKÉMON DIGITAL CREATION</span>
          <span className="text-cyan-400 font-bold">{POPULAR_3D_POKEMON.length} Iconic Cards</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {POPULAR_3D_POKEMON.map((poke) => (
            <button
              key={poke.id}
              onClick={() => setSelectedPokemon(poke)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                selectedPokemon.id === poke.id
                  ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-slate-950 flex items-center justify-center p-1 border border-slate-800">
                <img
                  src={poke.cardImageUrl}
                  alt={poke.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="font-display font-black text-xs text-white truncate">{poke.name}</div>
              <div className="text-[10px] font-mono text-slate-400 truncate">{poke.set}</div>
              <div className="text-[11px] font-mono font-bold text-cyan-300 mt-1">${(poke.psa10Price || 0).toLocaleString()} CAD</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive 3D Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <Card3DPopoutCanvas
            card={selectedPokemon}
            variantType={variantType}
            popOutDepth={popOutDepth}
            auraIntensity={auraIntensity}
            foilFinish={foilFinish}
            showWireframe={showWireframe}
            className="w-full h-[520px]"
          />

          {/* Interactive controls prompt */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Hover cursor or drag touch to rotate in 3D parallax space</span>
            </div>
            <button
              onClick={() => setShowWireframe(!showWireframe)}
              className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                showWireframe ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {showWireframe ? 'WIREFRAME ON' : 'WIREFRAME OFF'}
            </button>
          </div>
        </div>

        {/* Right Column: Customizer Studio & Market Data */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Customizer Panel */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 font-display font-bold text-white text-base">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>3D POP-OUT CUSTOMIZER STUDIO</span>
              </div>
              {getTypeBadge(selectedPokemon.type)}
            </div>

            {/* Variant Type */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
                CARD VARIANT & FINISH
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs font-bold">
                {[
                  { id: 'sir', label: 'SIR Alt Art' },
                  { id: 'holo', label: '1st Ed Holo' },
                  { id: 'gold', label: 'Full Art Gold' },
                  { id: 'rainbow', label: 'Rainbow Secret' },
                  { id: 'reverse', label: 'Reverse Foil' }
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantType(v.id as any)}
                    className={`px-3 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                      variantType === v.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pop-Out Depth Extrusion Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase">3D POP-OUT EXTRUSION DEPTH</span>
                <span className="text-cyan-300 font-bold">{(popOutDepth * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.05"
                value={popOutDepth}
                onChange={(e) => setPopOutDepth(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Elemental Particle Aura Intensity */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
                ELEMENTAL AURA PARTICLES
              </label>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs font-bold">
                {['off', 'low', 'high', 'hyper'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setAuraIntensity(lvl as any)}
                    className={`px-2 py-2 rounded-xl border text-center uppercase transition-all cursor-pointer ${
                      auraIntensity === lvl
                        ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Holographic Sheen Finish */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
                HOLOGRAPHIC REFRACTION FINISH
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs font-bold">
                {[
                  { id: 'prismatic', label: 'Prismatic Star' },
                  { id: 'gold_liquid', label: 'Liquid Gold' },
                  { id: 'diamond_star', label: 'Crystal Diamond' },
                  { id: 'laser_rainbow', label: 'Laser Rainbow' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFoilFinish(f.id as any)}
                    className={`px-3 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                      foilFinish === f.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Real Market Comps & Pokédex Details */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-display font-bold text-white text-sm">REAL MARKET VALUATION (CAD)</div>
              <div className="text-xs font-mono text-slate-400">VCA Index Live</div>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">RAW MARKET</div>
                <div className="text-sm font-bold text-slate-200">${(selectedPokemon.rawPrice || 0).toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-1">
                <div className="text-[10px] text-cyan-400 font-bold">PSA 9 MINT</div>
                <div className="text-sm font-bold text-cyan-300">${(selectedPokemon.psa9Price || 0).toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-1">
                <div className="text-[10px] text-emerald-400 font-bold">PSA 10 GEM</div>
                <div className="text-sm font-bold text-emerald-300">${(selectedPokemon.psa10Price || 0).toLocaleString()}</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Info className="w-3.5 h-3.5" />
                <span>Pokédex Data Entry</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{selectedPokemon.pokedexEntry}</p>
              <div className="text-[10px] text-slate-500 pt-1">Illustrated by {selectedPokemon.artist} • {selectedPokemon.set}</div>
            </div>

            {/* Action CTA: Mint as Smart Slab */}
            <button
              onClick={() => {
                if (onOpenNfcModal) {
                  onOpenNfcModal({
                    serialNumber: `VCA-3D-${selectedPokemon.id.toUpperCase().slice(0, 6)}`,
                    cardName: selectedPokemon.name,
                    set: selectedPokemon.set,
                    grade: 10,
                    gradeText: 'GEM MINT 3D',
                    cardImageUrl: selectedPokemon.cardImageUrl
                  });
                }
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-display font-black text-xs tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
              <span>MINT AS NTAG424 ENCRYPTED SMART SLAB</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
