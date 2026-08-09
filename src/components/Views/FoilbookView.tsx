import React, { useState, useEffect } from 'react';
import { 
  Sparkles, MessageSquare, Heart, Share2, Send, ShieldCheck, User, Users, 
  Store, Tv, Search, Image as ImageIcon, Smile, MoreHorizontal, X, MessageCircle, 
  Settings, Tag, PlusCircle, ShoppingBag, Filter, Flame, Zap, Award, Edit3, 
  Check, ArrowRight, DollarSign, RefreshCw, BadgeCheck, Save
} from 'lucide-react';
import { MOCK_SLABS } from '../../mockData/cards';
import { getCurrentUser, subscribeAuth, updateUserProfile } from '../../services/authService';
import { UserProfile } from '../../types';

interface ChatMessage {
  id: string;
  sender: string;
  isMe: boolean;
  text: string;
  time: string;
  attachmentSlab?: typeof MOCK_SLABS[0];
}

interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerVerified: boolean;
  cardName: string;
  setName: string;
  grade: string;
  priceUsd: number;
  type: 'sale' | 'trade' | 'both';
  imageUrl: string;
  description: string;
  createdAt: string;
}

const POKEMON_BADGES = [
  { name: 'Charizard', icon: '🔥', color: 'from-orange-500 to-amber-600', type: 'Fire/Flying' },
  { name: 'Pikachu', icon: '⚡', color: 'from-amber-400 to-yellow-500', type: 'Electric' },
  { name: 'Gengar', icon: '👻', color: 'from-purple-600 to-indigo-800', type: 'Ghost/Poison' },
  { name: 'Rayquaza', icon: '🐉', color: 'from-emerald-500 to-teal-700', type: 'Dragon/Flying' },
  { name: 'Mewtwo', icon: '🧬', color: 'from-fuchsia-600 to-purple-700', type: 'Psychic' },
  { name: 'Umbreon', icon: '🌙', color: 'from-slate-700 to-blue-900', type: 'Dark' },
  { name: 'Lugia', icon: '🌊', color: 'from-cyan-500 to-blue-700', type: 'Psychic/Flying' },
  { name: 'Blastoise', icon: '💧', color: 'from-blue-500 to-cyan-600', type: 'Water' },
  { name: 'Venusaur', icon: '🌿', color: 'from-green-500 to-emerald-700', type: 'Grass/Poison' }
];

export const FoilbookView: React.FC = () => {
  const [navTab, setNavTab] = useState<'feed' | 'marketplace' | 'messages' | 'settings'>('feed');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser());

  // User profile state synced with authService
  const [userProfile, setUserProfile] = useState({
    displayName: currentUser?.displayName || 'Alex Vance',
    handle: currentUser?.handle || '@alexvance_vca',
    bio: currentUser?.bio || 'Pokémon TCG collector & VCA Gem Mint enthusiast. Hunting Base Set Charizards & 151 SIRs.',
    favoritePokemon: currentUser?.favoritePokemon || 'Charizard',
    avatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setCurrentUser(u);
      if (u) {
        setUserProfile({
          displayName: u.displayName || 'Alex Vance',
          handle: u.handle || '@alexvance_vca',
          bio: u.bio || 'Pokémon TCG collector & VCA Gem Mint enthusiast. Hunting Base Set Charizards & 151 SIRs.',
          favoritePokemon: u.favoritePokemon || 'Charizard',
          avatar: u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        });
      }
    });
    return unsub;
  }, []);

  const [settingsSaved, setSettingsSaved] = useState(false);

  // Feed posts state
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'VaultTrader_CA',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      time: '12m ago',
      content: 'Just authenticated my Charizard ex Special Illustration Rare with VCA! NTAG424 chip tap verified in 0.4s. Gem Mint #10!',
      slab: MOCK_SLABS[0],
      likes: 34,
      comments: 8,
      liked: false,
    },
    {
      id: 2,
      author: 'PikaCollector',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      time: '1h ago',
      content: 'Comparison between PSA 10 and VCA Black Label 10 on 151 Pikachu. VCA optical centering subgrade engine is insanely precise.',
      slab: MOCK_SLABS[1],
      likes: 89,
      comments: 19,
      liked: true,
    }
  ]);

  const [postInput, setPostInput] = useState('');

  // Contacts for DM
  const [contacts] = useState([
    { id: '1', name: 'VaultTrader_CA', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', online: true, fav: 'Charizard' },
    { id: '2', name: 'Ash Ketchum', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&auto=format&fit=crop&q=80', online: true, fav: 'Pikachu' },
    { id: '3', name: 'Misty Water', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', online: false, fav: 'Lugia' },
    { id: '4', name: 'Brock Stone', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', online: true, fav: 'Gengar' },
  ]);

  // Active floating chat
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  // Conversations dictionary by contact id
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({
    '1': [
      { id: 'c1', sender: 'VaultTrader_CA', isMe: false, text: "Hey Alex! Interested in trading your Charizard VCA Gem Mint 10 for my Pikachu 151 + cash?", time: '2:14 PM' },
      { id: 'c2', sender: 'Alex Vance', isMe: true, text: "Hey! Send over the VCA serial number for your Pikachu so I can verify CMAC chip logs.", time: '2:15 PM' }
    ],
    '2': [
      { id: 'c3', sender: 'Ash Ketchum', isMe: false, text: "Gotta catch 'em all! Do you have any Base Set Shadowless cards available for trade?", time: '1:00 PM' }
    ],
    '3': [
      { id: 'c4', sender: 'Misty Water', isMe: false, text: "Hi! I saw your listing for the Water-type cards. Still available?", time: 'Yesterday' }
    ],
    '4': [
      { id: 'c5', sender: 'Brock Stone', isMe: false, text: "Solid slabs you have there! Let me know if you want to trade for Gengar ex.", time: '3 days ago' }
    ]
  });

  // Marketplace Listings State
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>([
    {
      id: 'm1',
      sellerId: '1',
      sellerName: 'VaultTrader_CA',
      sellerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      sellerVerified: true,
      cardName: 'Charizard ex #223/197 (Special Illustration Rare)',
      setName: 'Obsidian Flames',
      grade: 'VCA Gem Mint 10',
      priceUsd: 285,
      type: 'sale',
      imageUrl: MOCK_SLABS[0].card.imageUrl,
      description: 'Flawless optical centering and crisp edges. Verified NTAG424 DNA NFC chip intact. Fast tracked shipping included.',
      createdAt: '2 hours ago'
    },
    {
      id: 'm2',
      sellerId: '2',
      sellerName: 'Ash Ketchum',
      sellerAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&auto=format&fit=crop&q=80',
      sellerVerified: true,
      cardName: 'Pikachu #173/165 (Special Illustration Rare)',
      setName: 'Pokémon 151',
      grade: 'VCA Black Label 10',
      priceUsd: 145,
      type: 'both',
      imageUrl: MOCK_SLABS[1].card.imageUrl,
      description: 'Looking to sell or trade for vintage Base Set Holos! Comes in acrylic protective case with gold holographic foil header.',
      createdAt: '5 hours ago'
    },
    {
      id: 'm3',
      sellerId: '3',
      sellerName: 'Misty Water',
      sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      sellerVerified: false,
      cardName: 'Blastoise ex #200/165 (SIR)',
      setName: 'Pokémon 151',
      grade: 'VCA Mint 9',
      priceUsd: 110,
      type: 'trade',
      imageUrl: 'https://images.pokemontcg.io/sv3pt5/200_hires.png',
      description: 'Only looking for high-grade Water type trades or Rayquaza cards!',
      createdAt: '1 day ago'
    }
  ]);

  // Modal state for creating a marketplace listing
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);
  const [newListingCard, setNewListingCard] = useState({
    cardName: 'Gengar VMAX #271/264 (Alt Art)',
    setName: 'Fusion Strike',
    grade: 'VCA Gem Mint 10',
    priceUsd: 320,
    type: 'sale' as 'sale' | 'trade' | 'both',
    description: 'Fresh from VCA AI grading queue. Perfect 10 centering subgrade.'
  });

  // Handlers
  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeChat) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: userProfile.displayName,
      isMe: true,
      text: chatInput,
      time: 'Just now'
    };

    setConversations(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMsg]
    }));

    const textToSend = chatInput;
    setChatInput('');

    // Simulate auto-reply after 1.2s
    setTimeout(() => {
      const contactObj = contacts.find(c => c.id === activeChat);
      const autoReplyText = `Thanks for reaching out, ${userProfile.displayName}! I received your message: "${textToSend}". Let's check VCA verification on this trade!`;
      
      setConversations(prev => ({
        ...prev,
        [activeChat]: [
          ...(prev[activeChat] || []),
          {
            id: (Date.now() + 1).toString(),
            sender: contactObj ? contactObj.name : 'Seller',
            isMe: false,
            text: autoReplyText,
            time: 'Just now'
          }
        ]
      }));
    }, 1200);
  };

  const handleCreatePost = () => {
    if (!postInput.trim()) return;
    const newPost = {
      id: Date.now(),
      author: `${userProfile.displayName} (You)`,
      avatar: userProfile.avatar,
      time: 'Just now',
      content: postInput,
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts([newPost, ...posts]);
    setPostInput('');
  };

  const handleContactSeller = (sellerId: string, cardName: string) => {
    setActiveChat(sellerId);
    setNavTab('messages');
    
    // Pre-populate initial context message if conversation is empty or add prompt
    const initialPrompt = `Hi! I saw your listing for "${cardName}" on Foilbook Marketplace. Is it still available?`;
    setConversations(prev => {
      const currentMsgs = prev[sellerId] || [];
      return {
        ...prev,
        [sellerId]: [
          ...currentMsgs,
          {
            id: Date.now().toString(),
            sender: userProfile.displayName,
            isMe: true,
            text: initialPrompt,
            time: 'Just now'
          }
        ]
      };
    });
  };

  const handleSaveListing = () => {
    const listing: MarketplaceListing = {
      id: 'm_' + Date.now(),
      sellerId: 'me',
      sellerName: userProfile.displayName,
      sellerAvatar: userProfile.avatar,
      sellerVerified: true,
      cardName: newListingCard.cardName,
      setName: newListingCard.setName,
      grade: newListingCard.grade,
      priceUsd: Number(newListingCard.priceUsd) || 0,
      type: newListingCard.type,
      imageUrl: 'https://images.pokemontcg.io/swsh8/271_hires.png',
      description: newListingCard.description,
      createdAt: 'Just now'
    };

    setMarketplaceListings([listing, ...marketplaceListings]);
    setShowCreateListingModal(false);
  };

  const selectedBadgeObj = POKEMON_BADGES.find(b => b.name === userProfile.favoritePokemon) || POKEMON_BADGES[0];

  const activeContactInfo = contacts.find(c => c.id === activeChat);

  return (
    <div className="h-full min-h-screen bg-[#05070a] font-sans pb-16 text-slate-100">
      {/* Top Header / Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 shadow-lg shadow-purple-500/20">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-2xl text-slate-100 tracking-wider">
                FOILBOOK
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold">
                POKÉMON SOCIAL NETWORK
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              CONNECT, TRADE, CHAT & SHOWCASE VERIFIED SLABS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search Foilbook..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-9 pr-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>

          <button 
            onClick={() => setNavTab('settings')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
          >
            <img src={userProfile.avatar} alt="Me" className="w-5 h-5 rounded-full object-cover" />
            <span className="hidden md:inline">{userProfile.displayName}</span>
            <span className="text-base leading-none">{selectedBadgeObj.icon}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* LEFT SIDEBAR - Navigation */}
        <div className="hidden md:block col-span-1 space-y-2">
          <button 
            onClick={() => setNavTab('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left cursor-pointer ${
              navTab === 'settings' ? 'bg-purple-950/40 border border-purple-500/40 text-purple-200' : 'hover:bg-slate-900/80 text-slate-300'
            }`}
          >
            <div className="relative">
              <img src={userProfile.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-purple-400" />
              <span className="absolute -bottom-1 -right-1 text-xs">{selectedBadgeObj.icon}</span>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 leading-tight">{userProfile.displayName}</div>
              <div className="text-[10px] font-mono text-purple-300">{userProfile.handle}</div>
            </div>
          </button>
          
          <button 
            onClick={() => setNavTab('feed')}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left cursor-pointer ${
              navTab === 'feed' ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 font-bold' : 'hover:bg-slate-900/80 text-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm">Social Feed</span>
          </button>
          
          <button 
            onClick={() => setNavTab('marketplace')}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left cursor-pointer ${
              navTab === 'marketplace' ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200 font-bold' : 'hover:bg-slate-900/80 text-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center text-amber-400">
              <Store className="w-4 h-4" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span className="text-sm">Marketplace</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">New</span>
            </div>
          </button>

          <button 
            onClick={() => setNavTab('messages')}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left cursor-pointer ${
              navTab === 'messages' ? 'bg-purple-950/40 border border-purple-500/40 text-purple-200 font-bold' : 'hover:bg-slate-900/80 text-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span className="text-sm">Direct Messages</span>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            </div>
          </button>

          <button 
            onClick={() => setNavTab('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left cursor-pointer ${
              navTab === 'settings' ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 font-bold' : 'hover:bg-slate-900/80 text-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400">
              <Settings className="w-4 h-4" />
            </div>
            <span className="text-sm">User Settings</span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800/50 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 px-3 uppercase tracking-wider">Collector Groups</h3>
            <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900/80 transition-colors text-left">
              <img src="https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=100&auto=format&fit=crop&q=80" alt="Group" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xs font-bold text-slate-300">Base Set Enthusiasts</span>
            </button>
            <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900/80 transition-colors text-left">
              <img src="https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=100&auto=format&fit=crop&q=80" alt="Group" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xs font-bold text-slate-300">High-End Slabs Trade</span>
            </button>
          </div>
        </div>

        {/* CENTER COLUMN - MAIN CONTENT TABS */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-6">

          {/* TAB 1: SOCIAL FEED */}
          {navTab === 'feed' && (
            <div className="space-y-6">
              {/* Create Post */}
              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl">
                <div className="flex gap-3 mb-4">
                  <img src={userProfile.avatar} alt="You" className="w-10 h-10 rounded-full border border-purple-400 object-cover" />
                  <input 
                    type="text" 
                    placeholder={`What's on your mind, ${userProfile.displayName}? (Share a pull, slab, or trade)`} 
                    value={postInput}
                    onChange={(e) => setPostInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                    className="flex-1 bg-slate-950/50 hover:bg-slate-800/80 focus:bg-slate-950 border border-slate-800 rounded-full px-5 text-sm text-slate-200 transition-colors focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 px-2">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-xs font-bold hidden sm:inline">Photo/Slab</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer">
                      <Smile className="w-4 h-4" />
                      <span className="text-xs font-bold hidden sm:inline">Badge: {selectedBadgeObj.icon}</span>
                    </button>
                  </div>
                  <button 
                    onClick={handleCreatePost}
                    disabled={!postInput.trim()}
                    className="px-5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                          <div>
                            <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5 hover:underline cursor-pointer">
                              <span>{post.author}</span>
                              <ShieldCheck className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <span>{post.time}</span>
                              <span>•</span>
                              <Users className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed mb-4">{post.content}</p>

                      {post.slab && (
                        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group cursor-pointer relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-4">
                            <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold transition-colors border border-white/20">
                              View Verified Certificate
                            </button>
                          </div>
                          <div className="flex p-4 gap-4 items-center relative z-0">
                            <img src={post.slab.card.imageUrl} alt={post.slab.card.name} className="w-24 h-auto object-contain rounded-lg shadow-2xl drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]" />
                            <div>
                              <div className="font-display font-black text-lg text-white mb-1">{post.slab.card.name}</div>
                              <div className="text-xs font-mono text-cyan-300 font-bold mb-2">Grade #{post.slab.overallGrade} • {post.slab.serialNumber}</div>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300">{post.slab.card.setName}</span>
                                <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300">{post.slab.card.rarity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 pb-2 text-[11px] text-slate-400 border-b border-slate-800/60 mb-2">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                            <Heart className="w-2.5 h-2.5 text-white fill-white" />
                          </div>
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex gap-3 hover:underline cursor-pointer">
                          <span>{post.comments} comments</span>
                          <span>2 shares</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => {
                            const newPosts = [...posts];
                            const p = newPosts.find(p => p.id === post.id);
                            if (p) {
                              p.liked = !p.liked;
                              p.likes += p.liked ? 1 : -1;
                            }
                            setPosts(newPosts);
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-800/60 transition-colors text-sm font-bold cursor-pointer ${post.liked ? 'text-purple-400' : 'text-slate-400'}`}
                        >
                          <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                          Like
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-800/60 transition-colors text-slate-400 text-sm font-bold cursor-pointer">
                          <MessageCircle className="w-5 h-5" />
                          Comment
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-800/60 transition-colors text-slate-400 text-sm font-bold cursor-pointer">
                          <Share2 className="w-5 h-5" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FOILBOOK MARKETPLACE */}
          {navTab === 'marketplace' && (
            <div className="space-y-6">
              {/* Header Banner & Create Button */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-1">
                    <Store className="w-4 h-4" />
                    <span>Foilbook Collector Marketplace</span>
                  </div>
                  <h2 className="font-display font-black text-xl text-white">Buy, Sell & Trade Verified Slabs</h2>
                  <p className="text-xs text-slate-400 mt-1">Direct P2P trading with verified NTAG424 NFC chip authenticity</p>
                </div>

                <button
                  onClick={() => setShowCreateListingModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-display font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List Card For Sale/Trade</span>
                </button>
              </div>

              {/* Marketplace Feed Listings */}
              <div className="grid grid-cols-1 gap-4">
                {marketplaceListings.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <img src={item.sellerAvatar} alt={item.sellerName} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                        <div>
                          <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            <span>{item.sellerName}</span>
                            {item.sellerVerified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">{item.createdAt}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          item.type === 'sale' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          item.type === 'trade' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {item.type === 'both' ? 'SALE / TRADE' : item.type.toUpperCase()}
                        </span>

                        <span className="text-lg font-mono font-black text-amber-400">
                          {item.priceUsd > 0 ? `$${item.priceUsd}` : 'Trade Only'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center">
                      <img src={item.imageUrl} alt={item.cardName} className="w-24 h-32 object-contain rounded-xl bg-slate-950 p-1 border border-slate-800" />
                      <div className="space-y-2 flex-1">
                        <h3 className="font-display font-black text-base text-slate-100 leading-snug">{item.cardName}</h3>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">{item.setName}</span>
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-[11px] border border-cyan-800/50">{item.grade}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{item.description}</p>

                        <div className="pt-2 flex items-center gap-3">
                          <button
                            onClick={() => handleContactSeller(item.sellerId, item.cardName)}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Contact Seller</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT MESSAGING SERVICE */}
          {navTab === 'messages' && (
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                  <h2 className="font-display font-bold text-base text-white">Direct Messenger</h2>
                </div>
                <span className="text-xs font-mono text-slate-400">Local State Chat Engine</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 h-[420px]">
                {/* Contact List */}
                <div className="border-r border-slate-800 p-2 space-y-1 overflow-y-auto">
                  {contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveChat(c.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left cursor-pointer ${
                        activeChat === c.id ? 'bg-purple-950/60 border border-purple-500/40' : 'hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="relative">
                        <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                        {c.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-bold text-slate-200 truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {conversations[c.id]?.slice(-1)[0]?.text || 'No messages yet'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Chat Panel */}
                <div className="col-span-2 flex flex-col h-full bg-[#07090e]">
                  {activeChat && activeContactInfo ? (
                    <>
                      {/* Active Contact Bar */}
                      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
                        <div className="flex items-center gap-3">
                          <img src={activeContactInfo.avatar} alt={activeContactInfo.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div className="text-xs font-bold text-white">{activeContactInfo.name}</div>
                            <div className="text-[10px] font-mono text-emerald-400">● Active now</div>
                          </div>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {(conversations[activeChat] || []).map((msg) => (
                          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-sans leading-relaxed ${
                              msg.isMe 
                                ? 'bg-purple-600 text-white rounded-br-sm' 
                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
                            }`}>
                              <div className="text-[9px] font-mono opacity-60 mb-0.5">{msg.time}</div>
                              <div>{msg.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Input */}
                      <div className="p-3 border-t border-slate-800 bg-slate-900">
                        <div className="flex items-center gap-2 bg-slate-950 rounded-full px-4 py-2 border border-slate-800 focus-within:border-purple-500/50">
                          <input
                            type="text"
                            placeholder={`Message ${activeContactInfo.name}...`}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim()}
                            className="p-1.5 text-purple-400 hover:text-purple-300 disabled:opacity-40 cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                      <MessageCircle className="w-10 h-10 mb-2 opacity-40 text-purple-400" />
                      <div className="text-xs font-mono font-bold text-slate-300">Select a contact to start chatting</div>
                      <div className="text-[11px] max-w-xs mt-1">Send direct messages, trade offers, and verify VCA slab serials in real-time.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: USER SETTINGS PANEL */}
          {navTab === 'settings' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-lg text-white">Foilbook Profile Settings</h2>
                    <p className="text-xs text-slate-400">Customize your display name, bio, and favorite Pokémon badge</p>
                  </div>
                </div>

                {settingsSaved && (
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5 animate-bounce">
                    <Check className="w-3.5 h-3.5" />
                    <span>Profile Saved!</span>
                  </div>
                )}
              </div>

              {/* Profile Preview Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-indigo-950/40 border border-purple-500/30 flex items-center gap-5">
                <div className="relative">
                  <img src={userProfile.avatar} alt={userProfile.displayName} className="w-16 h-16 rounded-full object-cover border-2 border-purple-400 shadow-xl" />
                  <span className="absolute -bottom-1 -right-1 text-xl">{selectedBadgeObj.icon}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-white">{userProfile.displayName}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold">
                      {selectedBadgeObj.name} Trainer
                    </span>
                  </div>
                  <div className="text-xs font-mono text-purple-300">{userProfile.handle}</div>
                  <p className="text-xs text-slate-300 max-w-md italic">"{userProfile.bio}"</p>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">Display Name</label>
                  <input
                    type="text"
                    value={userProfile.displayName}
                    onChange={(e) => setUserProfile({ ...userProfile, displayName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">Handle / Tag</label>
                  <input
                    type="text"
                    value={userProfile.handle}
                    onChange={(e) => setUserProfile({ ...userProfile, handle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">Collector Bio</label>
                  <textarea
                    rows={3}
                    value={userProfile.bio}
                    onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Favorite Pokemon Badge Selector */}
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-2">Favorite Pokémon Profile Badge</label>
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                    {POKEMON_BADGES.map((badge) => (
                      <button
                        key={badge.name}
                        type="button"
                        onClick={() => setUserProfile({ ...userProfile, favoritePokemon: badge.name })}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                          userProfile.favoritePokemon === badge.name
                            ? 'bg-purple-950/60 border-purple-500 text-white font-bold shadow-lg shadow-purple-500/10'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xl">{badge.icon}</span>
                        <div>
                          <div className="text-xs font-bold leading-tight">{badge.name}</div>
                          <div className="text-[9px] opacity-60">{badge.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={async () => {
                      try {
                        await updateUserProfile({
                          displayName: userProfile.displayName,
                          handle: userProfile.handle,
                          bio: userProfile.bio,
                          favoritePokemon: userProfile.favoritePokemon,
                          avatarUrl: userProfile.avatar,
                        });
                        setSettingsSaved(true);
                        setTimeout(() => setSettingsSaved(false), 2500);
                      } catch (err) {
                        console.error('Failed to save settings:', err);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-bold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN - Contacts & Quick Messenger */}
        <div className="hidden lg:block col-span-1 space-y-4">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase font-mono">Foilbook Contacts</h3>
              <span className="text-[10px] font-mono text-emerald-400">4 Online</span>
            </div>
            <div className="space-y-1">
              {contacts.map((contact) => (
                <button 
                  key={contact.id}
                  onClick={() => {
                    setActiveChat(contact.id);
                    setNavTab('messages');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="relative">
                    <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#05070a] rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-slate-100 transition-colors block truncate">{contact.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">Fav: {contact.fav}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE MARKETPLACE LISTING MODAL */}
      {showCreateListingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 text-xs font-mono shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-black text-sm text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-400" />
                <span>List Card on Foilbook Marketplace</span>
              </h3>
              <button onClick={() => setShowCreateListingModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">Card Name & Collector #</label>
              <input
                type="text"
                value={newListingCard.cardName}
                onChange={(e) => setNewListingCard({ ...newListingCard, cardName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Set Name</label>
                <input
                  type="text"
                  value={newListingCard.setName}
                  onChange={(e) => setNewListingCard({ ...newListingCard, setName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Grade</label>
                <input
                  type="text"
                  value={newListingCard.grade}
                  onChange={(e) => setNewListingCard({ ...newListingCard, grade: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Asking Price ($ USD)</label>
                <input
                  type="number"
                  value={newListingCard.priceUsd}
                  onChange={(e) => setNewListingCard({ ...newListingCard, priceUsd: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Listing Type</label>
                <select
                  value={newListingCard.type}
                  onChange={(e) => setNewListingCard({ ...newListingCard, type: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="sale">For Sale</option>
                  <option value="trade">For Trade</option>
                  <option value="both">Sale or Trade</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">Listing Description & Terms</label>
              <textarea
                rows={3}
                value={newListingCard.description}
                onChange={(e) => setNewListingCard({ ...newListingCard, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateListingModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveListing}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
              >
                Publish Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


