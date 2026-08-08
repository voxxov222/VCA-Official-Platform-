import React, { useState } from 'react';
import { Sparkles, MessageSquare, Heart, Share2, Send, ShieldCheck, User } from 'lucide-react';
import { MOCK_SLABS, DEMO_USER } from '../../mockData/cards';

export const CommunityView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'EvoMaster99',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      time: '12m ago',
      content: 'Just authenticated my Charizard ex Special Illustration Rare with VCA! NTAG424 chip tap verified in 0.4s. Gem Mint #10!',
      slab: MOCK_SLABS[0],
      likes: 34,
      comments: 8
    },
    {
      id: 2,
      author: 'PikaCollector',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      time: '1h ago',
      content: 'Comparison between PSA 10 and VCA Black Label 10 on 151 Pikachu. VCA optical centering subgrade engine is insanely precise.',
      slab: MOCK_SLABS[1],
      likes: 89,
      comments: 19
    }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'VaultTrader_CA', text: 'Hey Alex! Interested in trading your Charizard VCA Gem Mint 10 for my Pikachu 151 + cash?', time: '2:14 PM' },
    { sender: 'Alex Vance (You)', text: 'Hey! Send over the VCA serial number for your Pikachu so I can verify CMAC chip logs.', time: '2:15 PM' }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { sender: 'Alex Vance (You)', text: chatInput, time: 'Just now' }]);
    setChatInput('');
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
              COLLECTOR NETWORK & COMMUNITY
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            VERIFIED COLLECTOR SHOWCASE, DISCUSSIONS & DIRECT P2P MESSAGING
          </p>
        </div>

        <div className="flex gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'feed' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400'}`}
          >
            GLOBAL FEED
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'chat' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'}`}
          >
            P2P TRADE MESSAGING
          </button>
        </div>
      </div>

      {activeTab === 'feed' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                  <div>
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{post.author}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">{post.time}</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">{post.content}</p>

              {post.slab && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                  <img src={post.slab.card.imageUrl} alt={post.slab.card.name} className="w-16 h-22 object-cover rounded-lg border border-slate-700" />
                  <div>
                    <div className="font-display font-bold text-sm text-slate-100">{post.slab.card.name}</div>
                    <div className="text-xs font-mono text-cyan-300 font-bold">Grade #{post.slab.overallGrade} • {post.slab.serialNumber}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 pt-2 text-xs font-mono text-slate-400 border-t border-slate-800">
                <button className="flex items-center gap-1.5 hover:text-rose-400">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-cyan-300">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="glass-panel max-w-3xl mx-auto rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-xs font-mono text-slate-300 font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>DIRECT CHAT WITH VaultTrader_CA</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">ONLINE</span>
          </div>

          <div className="h-64 overflow-y-auto space-y-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
            {messages.map((m, idx) => (
              <div key={idx} className={`p-3 rounded-xl max-w-md text-xs font-mono ${m.sender.includes('Alex') ? 'bg-cyan-500/20 text-cyan-200 ml-auto border border-cyan-500/30' : 'bg-slate-900 text-slate-200 border border-slate-800'}`}>
                <div className="text-[10px] text-slate-400 font-bold mb-1">{m.sender} • {m.time}</div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type message or paste VCA slab serial..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
