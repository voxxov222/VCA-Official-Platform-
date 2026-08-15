import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, Upload, Search, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { CardItem } from '../types';

interface Props {
  onClose: () => void;
  onAddToPortfolio: (card: CardItem, gradeEstimate?: number) => void;
  onStartGradingWizard: (card: CardItem) => void;
  onCompareCard: (card: CardItem) => void;
}

type Quote = { condition: string; price: number | null; currency: string; source: string | null; marketType: string; observedAt: string | null; status: string; note?: string };

export const VScanCameraScannerProduction: React.FC<Props> = ({ onClose, onAddToPortfolio, onStartGradingWizard, onCompareCard }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState('Point the rear camera at one card');
  const [result, setResult] = useState<any>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [marketWarning, setMarketWarning] = useState<string | null>(null);

  useEffect(() => { startCamera(); return () => stopCamera(); }, []);

  async function startCamera() {
    stopCamera();
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera API unavailable. Use HTTPS or localhost.');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
      setCameraError(null);
    } catch (error) {
      setCameraReady(false);
      setCameraError(error instanceof Error ? error.message : 'Camera permission was denied or unavailable.');
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
  }

  function takePhoto(): string | null {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || !video.videoWidth) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  function onCapture() {
    const image = takePhoto();
    if (!image) { setCameraError('Camera is not ready. Hold the card steady and try again.'); return; }
    setCaptured(image);
    setUploadPreview(null);
    setResult(null);
    setQuotes([]);
    setMarketWarning(null);
    setStep('Photo captured. Ready to identify.');
  }

  function onUpload(file: File) {
    if (!file.type.startsWith('image/')) { setCameraError('Please select an image file.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || '');
      setUploadPreview(value);
      setCaptured(value);
      setResult(null);
      setQuotes([]);
      setMarketWarning(null);
      setStep('Photo loaded. Ready to identify.');
    };
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if (!captured) return;
    setAnalyzing(true);
    setMarketWarning(null);
    setStep('IDENTIFYING CARD FROM YOUR PHOTO...');
    try {
      const identifyResponse = await fetch('/api/vscan/identify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: captured })
      });
      const identified = await identifyResponse.json();
      if (!identifyResponse.ok || !identified.success || !identified.card?.name) {
        throw new Error(identified.error || 'CARD_IDENTIFICATION_UNAVAILABLE');
      }
      setResult(identified);
      setStep('CARD IDENTIFIED. FETCHING VERIFIED MARKET DATA...');

      const card = identified.card;
      const params = new URLSearchParams({ name: card.name });
      if (card.set) params.set('set', card.set);
      if (card.number) params.set('number', card.number);
      const marketResponse = await fetch(`/api/vscan/market?${params.toString()}`);
      const market = await marketResponse.json();
      if (!marketResponse.ok || !market.success) throw new Error(market.error || 'MARKET_PROVIDER_UNAVAILABLE');
      setQuotes(market.data.quotes || []);
      setMarketWarning((market.data.sourceWarnings || []).join(', ') || null);
      setStep('VERIFIED MARKET DATA LOADED');
    } catch (error) {
      setResult(null);
      setQuotes([]);
      setStep(error instanceof Error ? error.message : 'SCAN_FAILED');
    } finally {
      setAnalyzing(false);
    }
  }

  const identifiedCard: CardItem | null = result?.card ? ({ ...result.card, id: result.card.id || `vscan-${Date.now()}`, name: result.card.name, imageUrl: captured || result.card.imageUrl } as CardItem) : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-3 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl border border-cyan-500/30 bg-[#05080d] shadow-2xl overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3"><Camera className="text-cyan-400"/><div><h2 className="font-display font-black tracking-wider">VSCAN — REAL CARD CAMERA</h2><p className="text-xs text-slate-400 font-mono">PHOTO → IDENTIFY → MARKET VALUES</p></div></div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800"><X/></button>
        </header>

        <div className="grid lg:grid-cols-2 gap-5 p-5">
          <section className="space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-cyan-500/30 bg-black">
              {!captured ? <video ref={videoRef} muted playsInline autoPlay className="w-full h-full object-cover"/> : <img src={captured} alt="Captured trading card" className="w-full h-full object-contain bg-black"/>}
              {!captured && <div className="absolute inset-8 border-2 border-cyan-400/70 rounded-xl pointer-events-none"><div className="absolute -top-6 left-0 text-[10px] font-mono text-cyan-300">ALIGN ONE CARD INSIDE FRAME</div></div>}
              {analyzing && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="px-4 py-3 rounded-xl bg-slate-950/90 border border-cyan-400 text-cyan-300 font-mono text-xs animate-pulse">{step}</div></div>}
            </div>
            {cameraError && <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex gap-2"><AlertCircle className="w-4 h-4 shrink-0"/>{cameraError}</div>}
            <div className="flex gap-2">
              <button onClick={captured ? () => { setCaptured(null); setResult(null); setQuotes([]); startCamera(); } : onCapture} disabled={!cameraReady && !captured} className="flex-1 py-3 rounded-xl bg-cyan-400 text-slate-950 font-black disabled:opacity-40">{captured ? 'RETAKE PHOTO' : 'TAKE PHOTO'}</button>
              <button onClick={startCamera} className="p-3 rounded-xl border border-slate-700 hover:border-cyan-400" title="Restart camera"><RefreshCw/></button>
              <label className="p-3 rounded-xl border border-slate-700 hover:border-cyan-400 cursor-pointer"><Upload/><input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])}/></label>
            </div>
            {captured && <button onClick={analyze} disabled={analyzing} className="w-full py-3 rounded-xl border border-cyan-400/50 text-cyan-300 font-black hover:bg-cyan-400/10 disabled:opacity-40"><Search className="inline w-4 h-4 mr-2"/>{analyzing ? 'ANALYZING...' : 'IDENTIFY CARD + FIND PRICES'}</button>}
            <p className="text-[10px] text-slate-500 font-mono">Camera requires HTTPS (or localhost) and browser permission. No sample card is used when scanning.</p>
          </section>

          <section className="space-y-4">
            {!result ? <div className="h-full min-h-64 rounded-2xl border border-slate-800 bg-slate-900/30 p-6 flex items-center justify-center text-center text-slate-500 font-mono text-xs">{step}</div> : <>
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-4">
                <div className="flex items-start justify-between gap-3"><div><div className="text-lg font-black">{result.card.name}</div><div className="text-xs text-slate-400">{result.card.set || 'Set not confirmed'} · #{result.card.number || '—'} · {result.card.variant || 'Variant not confirmed'}</div></div><div className="text-right"><div className="text-cyan-300 font-black">{Math.round((result.confidence || 0) * 100) / 100}%</div><div className="text-[9px] text-slate-500">IDENTIFICATION CONFIDENCE</div></div></div>
                {result.card.visibleFlaws?.length > 0 && <div className="mt-3 text-xs text-amber-300">Visible issues: {result.card.visibleFlaws.join(', ')}</div>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {quotes.map(q => <div key={q.condition} className="rounded-2xl border border-slate-800 bg-black/30 p-4"><div className="text-[10px] font-mono text-slate-500">{q.condition.replace('_',' ')}</div>{q.status === 'AVAILABLE' && q.price != null ? <><div className="text-2xl font-black text-slate-100">${q.price.toFixed(2)}</div><div className="text-[9px] text-cyan-400 mt-1">{q.source}</div><div className="text-[9px] text-slate-500">Observed {q.observedAt ? new Date(q.observedAt).toLocaleString() : '—'}</div></> : <><div className="text-lg font-black text-slate-600">UNAVAILABLE</div><div className="text-[9px] text-slate-500">{q.note}</div></>}</div>)}
              </div>
              {marketWarning && <div className="text-[10px] text-amber-300 border border-amber-500/20 rounded-xl p-3">Market source warning: {marketWarning}</div>}
              <div className="flex gap-2"><button disabled={!identifiedCard} onClick={() => identifiedCard && onAddToPortfolio(identifiedCard)} className="flex-1 py-3 rounded-xl bg-cyan-400 text-slate-950 font-black disabled:opacity-40"><CheckCircle2 className="inline w-4 h-4 mr-2"/>ADD TO PORTFOLIO</button><button disabled={!identifiedCard} onClick={() => identifiedCard && onStartGradingWizard(identifiedCard)} className="flex-1 py-3 rounded-xl border border-violet-400/40 text-violet-300 font-black disabled:opacity-40">SUBMIT TO VCA</button></div>
              <button onClick={() => { setCaptured(null); setResult(null); setQuotes([]); setStep('Point the rear camera at one card'); startCamera(); }} className="w-full py-2 rounded-xl text-slate-400 hover:text-cyan-300 text-xs font-mono"><RotateCcw className="inline w-3 h-3 mr-1"/>SCAN ANOTHER CARD</button>
            </>}
          </section>
        </div>
      </div>
    </div>
  );
};
