import React, { useRef, useState } from 'react';
import { PenTool, RotateCcw, CheckCircle, X } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureDataUrl: string, typedName: string) => void;
  onClose: () => void;
  serialNumber: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  onClose,
  serialNumber
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedName, setTypedName] = useState('Alex Vance');
  const [mode, setMode] = useState<'draw' | 'type'>('draw');

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleConfirm = () => {
    let dataUrl = '';
    if (mode === 'draw' && canvasRef.current) {
      dataUrl = canvasRef.current.toDataURL('image/png');
    } else {
      // Create SVG representation for typed
      dataUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80"><text x="20" y="50" font-family="cursive" font-size="32" fill="%2322d3ee">${encodeURIComponent(typedName)}</text></svg>`;
    }
    onSave(dataUrl, typedName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-cyan-500/30 space-y-4 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display text-sm font-extrabold text-slate-100 tracking-wider">
              CRYPTOGRAPHIC OWNER SIGNATURE
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Appending verified digital signature to VCA Ledger record for <span className="font-mono text-cyan-300 font-bold">{serialNumber}</span>.
        </p>

        {/* Mode switcher */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setMode('draw')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              mode === 'draw' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
            }`}
          >
            DRAW SIGNATURE
          </button>
          <button
            onClick={() => setMode('type')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              mode === 'type' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
            }`}
          >
            CURSIVE TYPED
          </button>
        </div>

        {mode === 'draw' ? (
          <div className="relative border-2 border-dashed border-slate-700/80 rounded-xl bg-slate-950 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={450}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[140px] cursor-crosshair"
            />
            <button
              onClick={clearCanvas}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800 text-xs flex items-center gap-1 font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>CLEAR</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-lg font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
              placeholder="Enter owner full name"
            />
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center font-serif italic text-2xl text-cyan-400 min-h-[60px] flex items-center justify-center">
              {typedName || 'Signature Preview'}
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-800"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <CheckCircle className="w-4 h-4" />
            <span>SIGN & APPEND TO LEDGER</span>
          </button>
        </div>
      </div>
    </div>
  );
};
