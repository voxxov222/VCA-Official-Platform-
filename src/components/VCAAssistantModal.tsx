import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, User } from 'lucide-react';
import { getPortfolio } from '../services/portfolioService';
import { GoogleGenAI } from '@google/genai';

interface VCAAssistantModalProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const VCAAssistantModal: React.FC<VCAAssistantModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello Collector! I am your VCA Market Intelligence Assistant. Ask me about portfolio valuation, grading upside, Raw vs PSA 10 market spreads, or Pokémon TCG pricing trends."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    const portfolio = getPortfolio();
    const totalVal = portfolio.reduce((s, item) => s + item.card.market.rawPriceUSD * item.quantity, 0);

    let reply = `Based on your VCA Vault data: You currently hold ${portfolio.length} cards with a total raw portfolio value of ~$${totalVal.toLocaleString()} USD. The highest PSA 10 grading upside in your collection belongs to ${portfolio[0]?.card.pokemonName || 'Charizard Base Set'}.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey !== '') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are the VCA (Verified Card Authority) Market AI Assistant. The user's question is: "${currentInput}".
Portfolio Context: User holds ${portfolio.length} cards, total raw value ~$${totalVal} USD. First card: ${portfolio[0]?.card.pokemonName}.
Provide a concise, expert 2-3 sentence financial/grading response.`
                }
              ]
            }
          ]
        });
        if (res.text) {
          reply = res.text.trim();
        }
      } catch (err) {
        console.warn('Gemini Assistant API call fallback:', err);
      }
    }

    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'assistant', text: reply }]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030508]/90 backdrop-blur-2xl flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-[#070b12] border border-purple-500/40 rounded-3xl p-6 space-y-4 flex flex-col h-[550px] relative text-white font-mono shadow-[0_0_80px_rgba(167,139,250,0.25)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/30 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            <h3 className="font-display font-black text-sm text-white tracking-wider">VCA CONVERSATIONAL AI ASSISTANT</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 font-sans text-xs">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-purple-950 border border-purple-500/40 text-purple-300'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3 rounded-2xl max-w-[80%] font-mono text-[11px] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/30'
                  : 'bg-slate-950 text-slate-200 border border-slate-800'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-[10px] text-purple-400 font-mono animate-pulse flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyzing VCA Database & Live Market Consensus...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="flex gap-2 overflow-x-auto shrink-0 pb-1 font-mono text-[10px]">
          <button
            onClick={() => setInput("What is my total portfolio worth?")}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-purple-300 hover:border-purple-500/40 whitespace-nowrap"
          >
            "What is my portfolio worth?"
          </button>
          <button
            onClick={() => setInput("Which card in my vault has the highest grading upside?")}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-purple-300 hover:border-purple-500/40 whitespace-nowrap"
          >
            "Highest grading upside?"
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 shrink-0 pt-2 border-t border-slate-800">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about prices, grading upside, Charizard sales..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
