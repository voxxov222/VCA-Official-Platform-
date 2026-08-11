import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Gift, Zap, ShieldCheck, Flame, RotateCcw, 
  Share2, Share, Radio, Plus, Check, Trophy, ExternalLink, RefreshCw, Star,
  X, Eye, Maximize2, Volume2, ArrowLeft, ArrowRight, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Pack3DCanvas } from '../Pack3DCanvas';
import { Card3DPopoutCanvas, PokemonVariantData } from '../Card3DPopoutCanvas';
import { HoloCardImage } from '../HoloCardImage';
import { playTearSound, playFlipSwish, playRarePullFanfare } from '../../utils/audioSynth';
import { CardItem } from '../../types';
import { SAMPLE_CARDS } from '../../mockData/cards';
import { addSlabbookPost } from '../../services/slabbookService';
import { getCurrentUser } from '../../services/authService';

interface PackType {
  id: string;
  name: string;
  series: string;
  year: string;
  packImage: string;
  chaseCard: string;
  chaseValueCAD: number;
  description: string;
  costCredits: number;
}

const PACK_TYPES: PackType[] = [
  {
    id: 'base-set-1st',
    name: '1999 Base Set 1st Edition',
    series: 'Vintage Classic',
    year: '1999',
    packImage: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=600&auto=format&fit=crop&q=80',
    chaseCard: 'Charizard Holo 1st Edition 4/102',
    chaseValueCAD: 12500,
    description: 'The holy grail of Pokémon packs. High chance for 1st Edition Shadowless Holos.',
    costCredits: 0,
  },
  {
    id: 'evolving-skies',
    name: 'Evolving Skies Booster',
    series: 'Sword & Shield',
    year: '2021',
    packImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    chaseCard: 'Umbreon VMAX Alt Art #215 (Moonbreon)',
    chaseValueCAD: 1850,
    description: 'Home of Moonbreon, Rayquaza VMAX Alt Art, and Eeveelution Alt Arts.',
    costCredits: 50,
  },
  {
    id: 'pokemon-151',
    name: 'Scarlet & Violet 151',
    series: 'Special Illustration',
    year: '2023',
    packImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    chaseCard: 'Charizard ex Special Illustration Rare #199',
    chaseValueCAD: 920,
    description: 'Reimagining original 151 Pokémon with jaw-dropping full-art illustrations.',
    costCredits: 100,
  },
  {
    id: 'shiny-treasure',
    name: 'Japanese Shiny Treasure ex',
    series: 'High Class Pack',
    year: '2024',
    packImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    chaseCard: 'Shiny Charizard ex SSR #349 (God Pack)',
    chaseValueCAD: 1450,
    description: 'High Class Japanese booster with guaranteed shiny Pokémon in every pack!',
    costCredits: 150,
  },
];

interface PulledCard {
  card: CardItem;
  isFlipped: boolean;
  isMinted: boolean;
  nftTokenId?: string;
  nfcSerial?: string;
}

interface PackRipper3DViewProps {
  onToast: (msg: string) => void;
  onNavigate: (view: string) => void;
}

export const PackRipper3DView: React.FC<PackRipper3DViewProps> = ({
  onToast,
  onNavigate,
}) => {
  const [selectedPack, setSelectedPack] = useState<PackType>(PACK_TYPES[0]);
  const [packState, setPackState] = useState<'IDLE' | 'OPENING' | 'REVEALING' | 'COMPLETE'>('IDLE');
  const [pulledCards, setPulledCards] = useState<PulledCard[]>([]);
  const [userCredits, setUserCredits] = useState<number>(350);
  const [dailyStreak, setDailyStreak] = useState<number>(5);

  // 3D Rare Reveal Spotlight Modal state
  const [active3DCardIndex, setActive3DCardIndex] = useState<number | null>(null);
  const [foilFinish, setFoilFinish] = useState<'prismatic' | 'gold_liquid' | 'diamond_star' | 'laser_rainbow'>('prismatic');
  const [auraIntensity, setAuraIntensity] = useState<'hyper' | 'high' | 'low' | 'off'>('hyper');
  const [popOutDepth, setPopOutDepth] = useState<number>(0.8);

  const mapCardToVariantData = (cardItem: CardItem): PokemonVariantData => {
    let type: 'fire' | 'electric' | 'psychic' | 'dragon' | 'water' | 'dark' | 'grass' = 'fire';
    const nameLower = cardItem.name.toLowerCase();
    if (nameLower.includes('charizard') || nameLower.includes('moltres') || nameLower.includes('ho-oh')) type = 'fire';
    else if (nameLower.includes('pikachu') || nameLower.includes('raichu') || nameLower.includes('zapdos')) type = 'electric';
    else if (nameLower.includes('gengar') || nameLower.includes('mew') || nameLower.includes('alakazam')) type = 'psychic';
    else if (nameLower.includes('rayquaza') || nameLower.includes('dragonite')) type = 'dragon';
    else if (nameLower.includes('lugia') || nameLower.includes('blastoise') || nameLower.includes('gyarados')) type = 'water';
    else if (nameLower.includes('umbreon') || nameLower.includes('tyranitar')) type = 'dark';

    return {
      id: cardItem.id,
      name: cardItem.name,
      number: cardItem.number,
      set: cardItem.set,
      rarity: cardItem.rarity,
      type,
      cardImageUrl: cardItem.imageUrl,
      characterSpriteUrl: cardItem.imageUrl,
      rawPrice: cardItem.rawPrice,
      psa9Price: cardItem.psa9Price,
      psa10Price: cardItem.psa10Price,
      artist: cardItem.artist || 'Mitsuhiro Arita',
      pokedexEntry: 'An exceptionally rare Pokémon card pulled directly from a sealed 3D booster pack.',
      hp: cardItem.hp || 120
    };
  };

  // Generate a random pack of 5 cards upon opening
  const generatePackPull = (): PulledCard[] => {
    const shuffled = [...SAMPLE_CARDS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    if (selectedPack.id === 'base-set-1st') {
      selected[4] = SAMPLE_CARDS[0]; // Charizard Base Set
    } else if (selectedPack.id === 'evolving-skies') {
      selected[4] = SAMPLE_CARDS[1]; // Rayquaza VMAX
    } else if (selectedPack.id === 'pokemon-151') {
      selected[4] = SAMPLE_CARDS[2]; // Gengar
    } else {
      selected[4] = SAMPLE_CARDS[3]; // Lugia
    }

    return selected.map((card) => ({
      card,
      isFlipped: false,
      isMinted: false,
    }));
  };

  const handleStartOpenPack = () => {
    if (userCredits < selectedPack.costCredits) {
      onToast(`Insufficient VCA Credits! You need ${selectedPack.costCredits} credits.`);
      return;
    }

    if (selectedPack.costCredits > 0) {
      setUserCredits((prev) => prev - selectedPack.costCredits);
    }

    playTearSound();
    setPackState('OPENING');

    setTimeout(() => {
      const cards = generatePackPull();
      setPulledCards(cards);
      setPackState('REVEALING');
    }, 1800);
  };

  const handleFlipCard = (index: number) => {
    if (pulledCards[index].isFlipped) return;

    playFlipSwish();

    const updated = [...pulledCards];
    updated[index].isFlipped = true;
    setPulledCards(updated);

    const isRare = updated[index].card.rarity.includes('Holo') || updated[index].card.psa10Price > 500;
    if (isRare) {
      playRarePullFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#fbbf24', '#a78bfa', '#f43f5e'],
      });
      // Automatically open the 3D Rare Reveal Spotlight!
      setActive3DCardIndex(index);
    }

    if (updated.every((c) => c.isFlipped)) {
      setPackState('COMPLETE');
    }
  };

  const handleFlipAll = () => {
    playRarePullFanfare();
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#22d3ee', '#fbbf24', '#a78bfa', '#34d399'],
    });

    const updated = pulledCards.map((item) => ({ ...item, isFlipped: true }));
    setPulledCards(updated);
    setPackState('COMPLETE');

    // Automatically inspect the top rare pull (index 4)
    setActive3DCardIndex(4);
  };

  const handleMintNft = (index: number) => {
    const item = pulledCards[index];
    if (item.isMinted) return;

    const user = getCurrentUser();
    const tokenNum = Math.floor(1000 + Math.random() * 9000);
    const nftId = `NFT-VCA-${tokenNum}-${item.card.name.toUpperCase().replace(/\s+/g, '')}`;
    const nfcSerial = `VCA-${Math.floor(Math.random() * 900 + 100)}-${tokenNum}`;

    const updated = [...pulledCards];
    updated[index].isMinted = true;
    updated[index].nftTokenId = nftId;
    updated[index].nfcSerial = nfcSerial;
    setPulledCards(updated);

    addSlabbookPost({
      authorName: user.displayName,
      authorHandle: user.handle,
      authorAvatar: user.avatarUrl,
      isVerifiedCollector: true,
      content: `🔥 UNBELIEVABLE PULL! Just ripped open a ${selectedPack.name} and minted a Grade #10 ${item.card.name} (${item.card.set}) on-chain as Digital Pokémon NFT #${nftId}! Estimated value: $${item.card.psa10Price} CAD!`,
      images: [item.card.imageUrl],
      cardSlab: {
        serialNumber: nfcSerial,
        cardName: item.card.name,
        setName: item.card.set,
        grade: 10,
        estimatedValueCAD: item.card.psa10Price,
      },
    });

    onToast(`🎉 Minted NFT #${nftId} & Bound NTAG424 Serial ${nfcSerial} to Vault & Slabbook Feed!`);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* HEADER STRIP */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <Gift className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
                  3D PACK RIPPER ARCADE
                </h1>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                  NFT MINTING ENABLED
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                REAL-TIME THREE.JS BOOSTER PACK SIMULATION, HIGH-RARE FANFARES & ON-CHAIN DIGITAL TWIN MINTING
              </p>
            </div>
          </div>
        </div>

        {/* User Credits & Daily Bonus */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-900 border border-amber-500/30 px-3 py-2 rounded-xl flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-slate-400">CREDITS:</span>
            <strong className="text-amber-300 font-bold text-sm">{userCredits} VCA</strong>
          </div>

          <div className="bg-slate-900 border border-cyan-500/30 px-3 py-2 rounded-xl flex items-center gap-2">
            <Flame className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span className="text-slate-400">DAILY STREAK:</span>
            <strong className="text-cyan-300 font-bold">{dailyStreak} DAYS</strong>
          </div>
        </div>
      </div>

      {/* PACK SELECTION CAROUSEL */}
      {packState === 'IDLE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span>SELECT A 3D BOOSTER PACK TO OPEN:</span>
            <span className="text-cyan-400 font-bold">FREE DAILY PACK AVAILABLE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PACK_TYPES.map((pack) => {
              const isSelected = pack.id === selectedPack.id;
              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPack(pack)}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.25)]'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2.5 right-4 bg-cyan-400 text-slate-950 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                      SELECTED
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 group">
                      <img
                        src={pack.packImage}
                        alt={pack.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center font-mono text-[10px]">
                        <span className="bg-slate-900/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                          {pack.series}
                        </span>
                        <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 font-bold">
                          {pack.year}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-slate-100 text-sm">{pack.name}</h3>
                      <p className="text-[11px] font-mono text-slate-400 mt-1 leading-snug">
                        {pack.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 font-mono text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">TOP CHASE:</span>
                      <span className="text-amber-300 font-bold truncate max-w-[140px]">{pack.chaseCard}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">MAX VALUE:</span>
                      <span className="text-emerald-400 font-bold">${pack.chaseValueCAD.toLocaleString()} CAD</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 font-bold">
                      <span className="text-slate-400">COST:</span>
                      <span className={pack.costCredits === 0 ? 'text-emerald-400 font-bold' : 'text-amber-300'}>
                        {pack.costCredits === 0 ? 'FREE DAILY' : `${pack.costCredits} VCA CREDITS`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3D PACK OPENING STAGE */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
        
        {/* Stage Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <div className="font-display font-bold text-slate-100 text-base">
                {selectedPack.name} (3D Interactive Stage)
              </div>
              <div className="text-xs font-mono text-slate-400">
                CHASE TARGET: <strong className="text-amber-300">{selectedPack.chaseCard}</strong> (${selectedPack.chaseValueCAD.toLocaleString()} CAD)
              </div>
            </div>
          </div>

          {packState === 'REVEALING' && (
            <button
              onClick={handleFlipAll}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>REVEAL ALL CARDS (FLIP ALL)</span>
            </button>
          )}

          {packState === 'COMPLETE' && (
            <button
              onClick={() => {
                setPackState('IDLE');
                setPulledCards([]);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs font-bold hover:border-cyan-400 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>OPEN ANOTHER BOOSTER PACK</span>
            </button>
          )}
        </div>

        {/* STAGE 1: THREE.JS 3D PACK CANVAS */}
        {(packState === 'IDLE' || packState === 'OPENING') && (
          <div className="relative bg-slate-950/80 rounded-2xl border border-slate-800 p-4">
            <Pack3DCanvas
              packName={selectedPack.name}
              packImage={selectedPack.packImage}
              isOpening={packState === 'OPENING'}
              onTearComplete={handleStartOpenPack}
            />
          </div>
        )}

        {/* STAGE 2: CARDS REVEAL GRID */}
        {(packState === 'REVEALING' || packState === 'COMPLETE') && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="font-display font-black text-xl text-cyan-300">
                {packState === 'REVEALING' ? 'CLICK OR TAP CARDS TO REVEAL PULLS!' : '🎉 PACK OPENING COMPLETE!'}
              </div>
              <p className="text-xs font-mono text-slate-400">
                MINT PULLED CARDS AS ON-CHAIN DIGITAL POKÉMON NFTS TO YOUR VCA VAULT & SLABBOOK FEED
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {pulledCards.map((item, idx) => {
                const isRare = item.card.psa10Price > 500 || item.card.rarity.includes('Holo');
                return (
                  <div
                    key={idx}
                    className="relative group flex flex-col items-center justify-between p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 shadow-xl transition-all hover:border-cyan-500/50"
                  >
                    {/* Card Flip Scene */}
                    <div
                      onClick={() => handleFlipCard(idx)}
                      className={`relative w-full aspect-[2.5/3.5] rounded-xl overflow-hidden cursor-pointer transition-transform duration-700 transform-gpu ${
                        item.isFlipped ? '' : 'hover:scale-105'
                      }`}
                      style={{
                        perspective: '1000px',
                      }}
                    >
                      {item.isFlipped ? (
                        <div className="w-full h-full relative group">
                          <HoloCardImage
                            imageUrl={item.card.imageUrl}
                            altText={item.card.name}
                            variant={item.card.variant || 'Holo'}
                            isSlab={true}
                            grade={10}
                            className="w-full h-full object-cover rounded-xl shadow-2xl"
                          />

                          {/* Ultra Rare Aura Glow */}
                          {isRare && (
                            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse" />
                          )}
                        </div>
                      ) : (
                        /* Card Back Image */
                        <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 border-2 border-cyan-400/40 rounded-xl flex flex-col items-center justify-center p-4 text-center shadow-inner group-hover:border-cyan-300">
                          <ShieldCheck className="w-12 h-12 text-cyan-400 animate-pulse" />
                          <span className="font-display font-black text-xs text-slate-200 mt-2">VCA CARD #{idx + 1}</span>
                          <span className="text-[10px] font-mono text-cyan-400 font-bold mt-1">CLICK TO FLIP</span>
                        </div>
                      )}
                    </div>

                    {/* Card Details & Actions */}
                    {item.isFlipped && (
                      <div className="w-full text-center font-mono space-y-2 pt-1 border-t border-slate-800">
                        <div>
                          <div className="font-display font-bold text-xs text-slate-100 truncate">{item.card.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{item.card.set} #{item.card.number}</div>
                          <div className="text-[11px] text-amber-300 font-bold mt-0.5">
                            PSA 10: ${item.card.psa10Price} CAD
                          </div>
                        </div>

                        {/* Inspect in 3D Button */}
                        <button
                          onClick={() => setActive3DCardIndex(idx)}
                          className="w-full py-1 px-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>INSPECT IN 3D PARALLAX</span>
                        </button>

                        {/* Mint NFT Button */}
                        <button
                          onClick={() => handleMintNft(idx)}
                          disabled={item.isMinted}
                          className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            item.isMinted
                              ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 cursor-default'
                              : 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                          }`}
                        >
                          {item.isMinted ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>MINTED ON-CHAIN</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>MINT DIGITAL NFT</span>
                            </>
                          )}
                        </button>

                        {item.nftTokenId && (
                          <div className="text-[9px] text-cyan-400 font-mono truncate font-bold bg-slate-900 border border-slate-800 p-1 rounded">
                            {item.nftTokenId}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* 3D RARE REVEAL SPOTLIGHT MODAL */}
      {active3DCardIndex !== null && pulledCards[active3DCardIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_80px_rgba(34,211,238,0.3)] space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400">
                  <Trophy className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-xl text-slate-100">
                      {pulledCards[active3DCardIndex].card.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold">
                      {pulledCards[active3DCardIndex].card.set} #{pulledCards[active3DCardIndex].card.number}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">
                    PARALLAX 3D HIGH-FIDELITY REVEAL • ROTATE & TILT MOUSE FOR HOLO SHIMMER
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActive3DCardIndex(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              
              {/* 3D Parallax Canvas Stage */}
              <div className="relative">
                <Card3DPopoutCanvas
                  card={mapCardToVariantData(pulledCards[active3DCardIndex].card)}
                  variantType="holo"
                  popOutDepth={popOutDepth}
                  auraIntensity={auraIntensity}
                  foilFinish={foilFinish}
                  className="w-full h-[440px]"
                />
              </div>

              {/* Controls & Card Specs */}
              <div className="space-y-5 font-mono text-xs">
                
                {/* Price & Value Badge */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-amber-500/40 space-y-2">
                  <div className="flex justify-between items-center text-slate-300 text-xs font-bold">
                    <span>ESTIMATED PSA 10 MARKET VALUE:</span>
                    <span className="text-amber-300 font-display font-black text-lg">
                      ${pulledCards[active3DCardIndex].card.psa10Price.toLocaleString()} CAD
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>RAW ESTIMATE: ${pulledCards[active3DCardIndex].card.rawPrice} CAD</span>
                    <span>PSA 9 ESTIMATE: ${pulledCards[active3DCardIndex].card.psa9Price} CAD</span>
                  </div>
                </div>

                {/* Foil Finish Selector */}
                <div className="space-y-2">
                  <label className="text-slate-300 font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>HOLOGRAPHIC FOIL SHIMMER FINISH:</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'prismatic', label: 'Prismatic Holo' },
                      { id: 'gold_liquid', label: 'Gold Liquid' },
                      { id: 'diamond_star', label: 'Diamond Star' },
                      { id: 'laser_rainbow', label: 'Laser Rainbow' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFoilFinish(f.id as any)}
                        className={`py-2 px-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          foilFinish === f.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Elemental Aura Intensity */}
                <div className="space-y-2">
                  <label className="text-slate-300 font-bold flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>ELEMENTAL AURA PARTICLE DENSITY:</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['hyper', 'high', 'low', 'off'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setAuraIntensity(level as any)}
                        className={`py-1.5 px-2 rounded-xl border text-center text-xs font-bold uppercase transition-all cursor-pointer ${
                          auraIntensity === level
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pop-Out Depth Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-300 font-bold">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      3D POP-OUT DEPTH:
                    </span>
                    <span className="text-cyan-400">{Math.round(popOutDepth * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.5"
                    step="0.1"
                    value={popOutDepth}
                    onChange={(e) => setPopOutDepth(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Modal Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleMintNft(active3DCardIndex)}
                    disabled={pulledCards[active3DCardIndex].isMinted}
                    className={`flex-1 py-3 px-4 rounded-xl font-display font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      pulledCards[active3DCardIndex].isMinted
                        ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-[0_0_25px_rgba(34,211,238,0.4)]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>
                      {pulledCards[active3DCardIndex].isMinted ? 'MINTED ON-CHAIN' : 'MINT DIGITAL POKÉMON NFT'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActive3DCardIndex(null);
                      onNavigate('slabbook');
                    }}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-cyan-400" />
                    <span>VIEW ON SLABBOOK</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
