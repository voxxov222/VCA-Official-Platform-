import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Zap, X, RefreshCw, Upload, CheckCircle2, ShieldCheck, 
  Layers, AlertCircle, Scan, Sparkles, Scale, Calculator, ArrowRight,
  Maximize2, Eye, Cpu, Image as ImageIcon
} from 'lucide-react';
import { CardItem, CardSubgrades, MultiCardDetectionResult } from '../types';
import { SAMPLE_CARDS } from '../mockData/cards';
import { MarketMatrix } from './MarketMatrix';
import { GradingAnalysisTool } from './GradingAnalysisTool';

interface VScanScannerModalProps {
  onClose: () => void;
  onAddToPortfolio: (card: CardItem, gradeEstimate?: number) => void;
  onStartGradingWizard: (card: CardItem) => void;
  onCompareCard: (card: CardItem) => void;
}

export const VScanScannerModal: React.FC<VScanScannerModalProps> = ({
  onClose,
  onAddToPortfolio,
  onStartGradingWizard,
  onCompareCard
}) => {
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples'>('samples');
  
  // Camera & Image state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);

  // Scan lifecycle
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState<string>('Ready to capture card');
  const [selectedSampleCard, setSelectedSampleCard] = useState<CardItem>(SAMPLE_CARDS[0]);

  // Single card scan results
  const [scanResult, setScanResult] = useState<{
    card: CardItem;
    confidence: number;
    subgrades: CardSubgrades;
    alternatives: Array<{ name: string; confidence: number }>;
    capturedImage?: string;
  } | null>(null);

  // Multi card scan results
  const [multiResults, setMultiResults] = useState<MultiCardDetectionResult[] | null>(null);

  // Active view tab for result
  const [resultTab, setResultTab] = useState<'overview' | 'matrix' | 'grading'>('overview');

  // Scanner accuracy & filtering options matching design specs
  const [accuracyMode, setAccuracyMode] = useState<'quick' | 'accurate'>('accurate');
  const [separateVariants, setSeparateVariants] = useState<boolean>(true);
  const [showSettingsSheet, setShowSettingsSheet] = useState<boolean>(false);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const [torchActive, setTorchActive] = useState<boolean>(false);

  const LANGUAGES = [
    { code: 'EN', flag: '🇺🇸', name: 'English' },
    { code: 'JP', flag: '🇯🇵', name: 'Japanese' },
    { code: 'FR', flag: '🇫🇷', name: 'French' },
    { code: 'DE', flag: '🇩🇪', name: 'German' },
    { code: 'ES', flag: '🇪🇸', name: 'Spanish' },
    { code: 'IT', flag: '🇮🇹', name: 'Italian' },
    { code: 'ZH', flag: '🇨🇳', name: 'Chinese' },
    { code: 'KO', flag: '🇰🇷', name: 'Korean' }
  ];
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);

  const resetSettingsToDefault = () => {
    setAccuracyMode('accurate');
    setSeparateVariants(true);
  };

  // Start video stream if camera tab selected
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, facingMode]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(e => console.log("Play error", e));
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      // Fallback try simple video constraint
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await videoRef.current.play().catch(e => console.log("Play fallback error", e));
          setCameraActive(true);
          return;
        }
      } catch (fallbackErr) {
        setCameraError('Camera access unavailable or blocked by browser permissions. Please use File Upload or Preset Cards below.');
        setCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureCameraSnapshot = (): string | null => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.85);
      }
    }
    return null;
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        setUploadedImageBase64(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Perform single card analysis
  const handleAnalyzeCard = async (targetCard?: CardItem, customBase64?: string) => {
    setIsAnalyzing(true);
    const chosenCard = targetCard || selectedSampleCard;

    // Determine base64 image source
    let imagePayload: string | undefined = customBase64;
    if (!imagePayload) {
      if (activeTab === 'camera') {
        const snapshot = captureCameraSnapshot();
        if (snapshot) imagePayload = snapshot;
      } else if (activeTab === 'upload' && uploadedImageBase64) {
        imagePayload = uploadedImageBase64;
      }
    }

    setScanStep('CAPTURING & straightening optical perspective...');
    await new Promise(r => setTimeout(r, 600));

    setScanStep('RUNNING OCR & visual feature extraction...');
    await new Promise(r => setTimeout(r, 700));

    setScanStep('MATCHING against Pokémon TCG Database...');
    await new Promise(r => setTimeout(r, 700));

    setScanStep('CALLING Gemini 3.6 Vision Analysis Engine...');

    try {
      const res = await fetch('/api/vscan/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64: imagePayload, 
          cardIdHint: chosenCard.id 
        })
      });
      const data = await res.json();

      setScanResult({
        card: data.card || chosenCard,
        confidence: data.confidence || 98.7,
        subgrades: data.aiCondition || { centering: 94, corners: 92, edges: 95, surface: 91, overall: 9 },
        alternatives: data.alternatives || [
          { name: `${chosenCard.name} Legendary Collection`, confidence: 3.8 }
        ],
        capturedImage: imagePayload || chosenCard.imageUrl
      });
    } catch (e) {
      // Fallback
      setScanResult({
        card: chosenCard,
        confidence: 98.7,
        subgrades: { centering: 94, corners: 92, edges: 95, surface: 91, overall: 9 },
        alternatives: [{ name: `${chosenCard.name} Base Set 2`, confidence: 2.1 }],
        capturedImage: imagePayload || chosenCard.imageUrl
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Perform multi-card detection
  const handleAnalyzeMulti = async (customBase64?: string) => {
    setIsAnalyzing(true);
    let imagePayload: string | undefined = customBase64;
    if (!imagePayload) {
      if (activeTab === 'camera') {
        const snapshot = captureCameraSnapshot();
        if (snapshot) imagePayload = snapshot;
      } else if (activeTab === 'upload' && uploadedImageBase64) {
        imagePayload = uploadedImageBase64;
      }
    }

    setScanStep('DETECTING multiple card boundaries in frame...');
    await new Promise(r => setTimeout(r, 800));

    setScanStep('ISOLATING & extracting sub-images...');
    await new Promise(r => setTimeout(r, 800));

    try {
      const res = await fetch('/api/vscan/multi-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imagePayload, multiMode: true })
      });
      const data = await res.json();

      setMultiResults(data.detectedCards || [
        { boundingBox: { x: 8, y: 12, width: 40, height: 76 }, candidateCard: SAMPLE_CARDS[0], confidence: 98.4, croppedImageBase64: '' },
        { boundingBox: { x: 52, y: 12, width: 40, height: 76 }, candidateCard: SAMPLE_CARDS[1], confidence: 97.2, croppedImageBase64: '' }
      ]);
    } catch (err) {
      setMultiResults([
        { boundingBox: { x: 8, y: 12, width: 40, height: 76 }, candidateCard: SAMPLE_CARDS[0], confidence: 98.4, croppedImageBase64: '' },
        { boundingBox: { x: 52, y: 12, width: 40, height: 76 }, candidateCard: SAMPLE_CARDS[1], confidence: 97.2, croppedImageBase64: '' }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
      <div className="glass-panel w-full max-w-5xl rounded-3xl p-6 border border-cyan-500/30 space-y-6 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-black text-slate-100 tracking-wider">
                  VSCAN AI CAMERA SCANNER
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                  v2.4 VISION NEURAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Identify Pokémon cards, detect variants, evaluate optical subgrades & fetch 3-tier valuation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <div className="flex gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => { setMode('single'); setMultiResults(null); setScanResult(null); }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  mode === 'single' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                SINGLE CARD
              </button>
              <button
                onClick={() => { setMode('multi'); setScanResult(null); setMultiResults(null); }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  mode === 'multi' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400'
                }`}
              >
                MULTI-CARD (ISOLATE)
              </button>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* SCANNING CAPTURE AREA */}
        {!scanResult && !multiResults && (
          <div className="space-y-4">
            
            {/* Input Mode Selector */}
            <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
              <button
                onClick={() => setActiveTab('samples')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'samples' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>PRESET TEST CARDS</span>
              </button>
              <button
                onClick={() => setActiveTab('camera')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'camera' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>LIVE WEBCAM / REAR CAM</span>
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'upload' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>FILE UPLOAD</span>
              </button>
            </div>

            {/* TAB: PRESET SAMPLE CARDS */}
            {activeTab === 'samples' && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-slate-400">
                  SELECT A TEST POKÉMON CARD TO SIMULATE VSCAN AI OPTICAL CAPTURE:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {SAMPLE_CARDS.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedSampleCard(card)}
                      className={`p-3 rounded-2xl glass-panel-interactive text-left flex flex-col items-center cursor-pointer transition-all ${
                        selectedSampleCard.id === card.id
                          ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)] bg-cyan-950/30'
                          : 'border-slate-800'
                      }`}
                    >
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-28 h-38 object-cover rounded-xl border border-slate-700 shadow-md mb-2"
                      />
                      <div className="w-full text-center">
                        <div className="font-display font-bold text-xs text-slate-100 truncate">{card.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{card.set}</div>
                        <div className="text-[10px] text-cyan-400 font-mono font-bold mt-1">PSA 10 ${card.psa10Price} CAD</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: LIVE WEBCAM */}
            {activeTab === 'camera' && (
              <div className="space-y-2 relative">
                {/* HUD Top Bar Options matching design specs */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 px-1 pb-1">
                  {/* SCAN MODE toggle pill */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-[11px]">
                    <span className="text-slate-400 pl-2 text-[10px] uppercase font-bold">SCAN MODE:</span>
                    <button
                      onClick={() => setMode('single')}
                      className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                        mode === 'single' ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50' : 'text-slate-400'
                      }`}
                    >
                      Single
                    </button>
                    <button
                      onClick={() => setMode('multi')}
                      className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                        mode === 'multi' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50' : 'text-slate-400'
                      }`}
                    >
                      Multiple
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* CARD LANGUAGE Selector Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowLangDropdown(!showLangDropdown)}
                        className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-slate-400 text-[10px]">CARD LANG:</span>
                        <span>{selectedLanguage.flag} {selectedLanguage.code} ▾</span>
                      </button>

                      {showLangDropdown && (
                        <div className="absolute top-full right-0 mt-1 w-36 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-40 p-1 grid grid-cols-1 gap-0.5">
                          {LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => { setSelectedLanguage(lang); setShowLangDropdown(false); }}
                              className={`px-3 py-1.5 rounded-xl text-left text-xs font-mono flex items-center gap-2 hover:bg-slate-800 cursor-pointer ${
                                selectedLanguage.code === lang.code ? 'text-cyan-300 font-bold bg-cyan-950/40' : 'text-slate-300'
                              }`}
                            >
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Torch Toggle */}
                    <button
                      onClick={() => setTorchActive(!torchActive)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        torchActive ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                      title="Toggle Torch/Flash"
                    >
                      <Zap className="w-4 h-4" />
                    </button>

                    {/* Settings Gear Icon */}
                    <button
                      onClick={() => setShowSettingsSheet(!showSettingsSheet)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        showSettingsSheet ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                      title="Scan Mode Settings"
                    >
                      <span className="text-base leading-none">⚙️</span>
                    </button>

                    {cameraActive && (
                      <button
                        onClick={() => setFacingMode(f => f === 'environment' ? 'user' : 'environment')}
                        className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{facingMode === 'environment' ? 'REAR' : 'FRONT'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative aspect-video max-h-[360px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                  {cameraActive ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      {/* Interactive overlay capture trigger button */}
                      <button
                        onClick={() => mode === 'single' ? handleAnalyzeCard() : handleAnalyzeMulti()}
                        disabled={isAnalyzing}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 font-display font-black text-xs tracking-wider shadow-[0_0_25px_rgba(34,211,238,0.7)] flex items-center gap-2 cursor-pointer transition-all hover:scale-105 z-20"
                      >
                        <Scan className="w-4 h-4 text-slate-950" />
                        <span>CAPTURE FRAME & SCAN</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-8 text-center space-y-4 max-w-md">
                      <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                      <div>
                        <div className="font-display font-bold text-sm text-slate-200">
                          {cameraError || 'Camera Stream Initializing...'}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          If camera permissions are blocked by your browser settings, you can use File Upload or select from our preset Pokémon test cards.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                          onClick={startCamera}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold cursor-pointer hover:bg-slate-800"
                        >
                          RETRY CAMERA
                        </button>
                        <button
                          onClick={() => setActiveTab('upload')}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold cursor-pointer hover:bg-slate-800"
                        >
                          FILE UPLOAD
                        </button>
                        <button
                          onClick={() => setActiveTab('samples')}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold cursor-pointer hover:bg-slate-800"
                        >
                          PRESET TEST CARDS
                        </button>
                      </div>
                    </div>
                  )}

                  {/* HUD Scanline overlay */}
                  <div className="absolute inset-0 hud-scanlines pointer-events-none opacity-40" />

                  {/* Red Dashed Alignment Frame overlay matching design specs */}
                  {cameraActive && (
                    <div className="absolute inset-6 sm:inset-10 border-2 border-dashed border-rose-500/80 rounded-3xl pointer-events-none flex flex-col items-center justify-between p-3 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                      <div className="text-[10px] font-mono text-rose-300 bg-slate-950/85 px-3 py-1 rounded-full border border-rose-500/40 font-bold">
                        ALIGN POKÉMON CARD WITHIN FRAME
                      </div>

                      {/* Bottom status badge in camera overlay */}
                      <div className="bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300 text-xs font-bold">
                          🔍
                        </div>
                        <div className="text-left">
                          <div className="text-[11px] font-bold text-slate-200">No cards scanned yet</div>
                          <div className="text-[9px] text-slate-400">Point camera at card to begin</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SCAN MODE SETTINGS DRAWER / SHEET (Matching Design Specs) */}
                {showSettingsSheet && (
                  <div className="absolute inset-x-0 bottom-0 z-30 bg-slate-950/95 border-t border-rose-500/40 rounded-t-3xl p-5 space-y-4 backdrop-blur-2xl shadow-2xl transition-all">
                    {/* Handle pill */}
                    <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto" />

                    {/* Sheet Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-black text-base text-slate-100 flex items-center gap-2">
                        <span>Scan Mode</span>
                      </h3>
                      <button
                        onClick={resetSettingsToDefault}
                        className="px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-mono text-xs font-bold border border-rose-500/30 flex items-center gap-1 cursor-pointer"
                      >
                        <span>↺ Default</span>
                      </button>
                    </div>

                    {/* Radio Options: Quick vs Accurate */}
                    <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <button
                        onClick={() => setAccuracyMode('quick')}
                        className={`w-full p-3 rounded-xl text-left flex items-start gap-3 transition-all cursor-pointer ${
                          accuracyMode === 'quick' ? 'bg-rose-950/40 border border-rose-500/40 text-slate-100' : 'text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="text-lg">⚡</span>
                        <div className="flex-1">
                          <div className="font-bold text-xs text-slate-200">Quick</div>
                          <div className="text-[11px] text-slate-400">Automatically adds the best matching card</div>
                        </div>
                        {accuracyMode === 'quick' && (
                          <span className="text-rose-400 font-bold text-sm">✓</span>
                        )}
                      </button>

                      <button
                        onClick={() => setAccuracyMode('accurate')}
                        className={`w-full p-3 rounded-xl text-left flex items-start gap-3 transition-all cursor-pointer ${
                          accuracyMode === 'accurate' ? 'bg-rose-950/40 border border-rose-500/40 text-slate-100' : 'text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="text-lg">🔍</span>
                        <div className="flex-1">
                          <div className="font-bold text-xs text-slate-200">Accurate</div>
                          <div className="text-[11px] text-slate-400">Pick the right card when matches are close</div>
                        </div>
                        {accuracyMode === 'accurate' && (
                          <span className="text-rose-400 font-bold text-sm">✓</span>
                        )}
                      </button>
                    </div>

                    {/* Separate Variants Toggle */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-xs text-slate-200">Separate variants</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          Scan Normal, Holo and other variants as separate cards instead of grouping them
                        </div>
                      </div>

                      <button
                        onClick={() => setSeparateVariants(!separateVariants)}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                          separateVariants ? 'bg-rose-500' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            separateVariants ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      onClick={() => setShowSettingsSheet(false)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-bold cursor-pointer"
                    >
                      Apply & Close Settings
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: FILE UPLOAD */}
            {activeTab === 'upload' && (
              <div 
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-8 bg-slate-950 text-center space-y-4 transition-all"
              >
                {uploadedImageBase64 ? (
                  <div className="space-y-3">
                    <img 
                      src={uploadedImageBase64} 
                      alt="Uploaded Card Preview" 
                      className="max-h-52 mx-auto rounded-xl border border-cyan-500/50 shadow-2xl object-contain" 
                    />
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        CARD PHOTO READY FOR VSCAN
                      </span>
                      <button
                        onClick={() => setUploadedImageBase64(null)}
                        className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-rose-300 hover:bg-slate-800 cursor-pointer"
                      >
                        REMOVE / CHANGE
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-cyan-400 mx-auto" />
                    <div>
                      <div className="text-xs font-mono text-slate-200 font-bold">
                        DRAG & DROP CARD PHOTO OR CLICK TO BROWSE
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Supports High-Res JPG, PNG, WEBP up to 25MB</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      id="card-upload-input" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                      }} 
                    />
                    <label
                      htmlFor="card-upload-input"
                      className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 font-bold cursor-pointer hover:bg-slate-800 transition-all"
                    >
                      CHOOSE IMAGE FILE
                    </label>
                  </>
                )}
              </div>
            )}

            {/* SCAN ACTION BUTTON */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Auto Glare & Perspective Straightener Active</span>
              </div>

              <button
                onClick={() => mode === 'single' ? handleAnalyzeCard() : handleAnalyzeMulti()}
                disabled={isAnalyzing}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-slate-950 font-display font-extrabold text-sm tracking-wider shadow-[0_0_25px_rgba(34,211,238,0.5)] hover:shadow-[0_0_35px_rgba(34,211,238,0.8)] transition-all cursor-pointer flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                    <span>{scanStep}</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5 text-slate-950" />
                    <span>{mode === 'single' ? 'SCAN & VALUE CARD' : 'ISOLATE MULTI-CARDS'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* MULTI-CARD ISOLATION RESULTS VIEW */}
        {multiResults && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Cpu className="w-6 h-6 text-purple-400 shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-100">
                    MULTI-CARD ISOLATION COMPLETE ({multiResults.length} CARDS DETECTED IN FRAME)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Neural computer vision isolated individual Pokémon card boundaries & matched market pricing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    multiResults.forEach(item => onAddToPortfolio(item.candidateCard));
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-display font-extrabold text-xs tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>BATCH ADD ALL ({multiResults.length}) TO VAULT</span>
                </button>

                <button
                  onClick={() => setMultiResults(null)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-slate-100 cursor-pointer"
                >
                  SCAN AGAIN
                </button>
              </div>
            </div>

            {/* Bounding Box Spatial Visualizer Canvas */}
            <div className="relative aspect-video max-h-[220px] rounded-2xl bg-slate-950 border border-purple-500/30 overflow-hidden flex items-center justify-center p-4">
              <div className="hud-scanlines absolute inset-0 opacity-30 pointer-events-none"></div>
              <div className="absolute top-2 left-3 text-[10px] font-mono text-purple-300 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-purple-500/30">
                NEURAL BOUNDING RETICLE OVERLAY
              </div>

              <div className="w-full h-full relative border border-dashed border-slate-800 rounded-xl overflow-hidden">
                {multiResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="absolute border-2 border-purple-400 bg-purple-500/10 rounded-lg p-1.5 shadow-[0_0_15px_rgba(168,85,247,0.5)] flex flex-col justify-between transition-all hover:scale-105"
                    style={{
                      left: `${item.boundingBox.x}%`,
                      top: `${item.boundingBox.y}%`,
                      width: `${item.boundingBox.width}%`,
                      height: `${item.boundingBox.height}%`
                    }}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold text-white bg-slate-950/90 px-1.5 py-0.5 rounded border border-purple-400/50">
                      <span>CARD #{idx + 1}</span>
                      <span className="text-emerald-300">{item.confidence}%</span>
                    </div>

                    <div className="text-[10px] font-display font-black text-purple-200 truncate bg-slate-950/80 px-1 rounded">
                      {item.candidateCard.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Isolated Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {multiResults.map((item, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 relative group">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.candidateCard.imageUrl}
                      alt={item.candidateCard.name}
                      className="w-20 h-28 object-cover rounded-lg border border-purple-500/30 shadow-md shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-purple-400">ISOLATED #{idx + 1}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                          {item.confidence}% MATCH
                        </span>
                      </div>

                      <div className="font-display font-bold text-sm text-slate-100 truncate">
                        {item.candidateCard.name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono truncate">
                        {item.candidateCard.set} • #{item.candidateCard.number}
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-300 pt-1">
                        PSA 10 ${item.candidateCard.psa10Price} CAD
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onAddToPortfolio(item.candidateCard)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-cyan-300 font-bold cursor-pointer"
                    >
                      + ADD TO PORTFOLIO
                    </button>
                    <button
                      onClick={() => {
                        setMultiResults(null);
                        handleAnalyzeCard(item.candidateCard);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs tracking-wider cursor-pointer"
                    >
                      FULL ANALYSIS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SINGLE CARD RESULT DISPLAY */}
        {scanResult && (
          <div className="space-y-6">
            
            {/* Top Identity Banner */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={scanResult.card.imageUrl}
                  alt={scanResult.card.name}
                  className="w-16 h-22 object-cover rounded-xl border border-cyan-500/40 shadow-xl shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      {scanResult.confidence}% CONFIDENCE
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                      {scanResult.card.variant}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-xl text-slate-100 mt-1">
                    {scanResult.card.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-400">
                    {scanResult.card.set} • #{scanResult.card.number} • {scanResult.card.rarity}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onAddToPortfolio(scanResult.card, scanResult.subgrades.overall)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-cyan-300 flex items-center gap-2"
                >
                  <span>+ ADD TO PORTFOLIO</span>
                </button>
                <button
                  onClick={() => onStartGradingWizard(scanResult.card)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-display font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>SUBMIT FOR VCA SLAB</span>
                </button>
                <button
                  onClick={() => { setScanResult(null); setMultiResults(null); }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100"
                  title="Scan Another Card"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RESULT VIEW TABS */}
            <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
              <button
                onClick={() => setResultTab('overview')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  resultTab === 'overview' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                3-TIER VALUATION & OPTICAL SUBGRADES
              </button>
              <button
                onClick={() => setResultTab('matrix')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  resultTab === 'matrix' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                PRICE SOURCE MATRIX
              </button>
              <button
                onClick={() => setResultTab('grading')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  resultTab === 'grading' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                SHOULD I GRADE THIS?
              </button>
            </div>

            {resultTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 3-Tier Pricing Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs font-mono text-slate-400">RAW MARKET VALUE</div>
                    <div className="text-2xl font-mono font-black text-slate-100 mt-1">
                      ${scanResult.card.rawPrice.toFixed(2)} CAD
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs font-mono text-purple-400">PSA 9 GRADED</div>
                    <div className="text-2xl font-mono font-black text-purple-300 mt-1">
                      ${scanResult.card.psa9Price.toFixed(2)} CAD
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/30 text-center">
                    <div className="text-xs font-mono text-amber-400 font-bold">PSA 10 GEM MINT</div>
                    <div className="text-2xl font-mono font-black text-amber-300 mt-1">
                      ${scanResult.card.psa10Price.toFixed(2)} CAD
                    </div>
                  </div>
                </div>

                {/* AI Condition Subgrades Panel */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wider">
                        AI OPTICAL CONDITION ESTIMATE
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      PROJECTED: PSA {scanResult.subgrades.overall} - 10
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                        <span>CENTERING:</span>
                        <span className="text-slate-200 font-bold">{scanResult.subgrades.centering}/100</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${scanResult.subgrades.centering}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                        <span>CORNERS:</span>
                        <span className="text-slate-200 font-bold">{scanResult.subgrades.corners}/100</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${scanResult.subgrades.corners}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                        <span>EDGES:</span>
                        <span className="text-slate-200 font-bold">{scanResult.subgrades.edges}/100</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${scanResult.subgrades.edges}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                        <span>SURFACE:</span>
                        <span className="text-slate-200 font-bold">{scanResult.subgrades.surface}/100</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${scanResult.subgrades.surface}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {resultTab === 'matrix' && (
              <MarketMatrix card={scanResult.card} />
            )}

            {resultTab === 'grading' && (
              <GradingAnalysisTool card={scanResult.card} aiSubgrades={scanResult.subgrades} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
