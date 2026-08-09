import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Camera, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Edit3, 
  Save, 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  CheckCircle2, 
  Upload, 
  Grid, 
  MessageSquare, 
  FileText, 
  Activity,
  Zap,
  Flame,
  Radio,
  Share2,
  DollarSign,
  TrendingUp,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { getCurrentUser, updateUserProfile, subscribeAuth } from '../../services/authService';
import { UserProfile, VCASlab } from '../../types';
import { MOCK_SLABS } from '../../mockData/cards';
import { HolographicLabel } from '../HolographicLabel';
import { HoloCardImage } from '../HoloCardImage';

interface ProfileViewProps {
  onNavigate?: (view: string) => void;
  onOpenNfcModal?: (slab?: VCASlab) => void;
  onToast?: (msg: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigate,
  onOpenNfcModal,
  onToast
}) => {
  const [user, setUser] = useState<UserProfile | null>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<'vault' | 'posts' | 'certificates' | 'ledger'>('vault');
  const [isEditing, setIsEditing] = useState(false);

  // Form edit state
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('@alexvance');
  const [bio, setBio] = useState('Collector of Base Set 1st Editions, 151 SIRs & Japanese Promos. Verified VCA Vault member.');
  const [location, setLocation] = useState('Vancouver, BC / Tokyo, JP');
  const [favoritePokemon, setFavoritePokemon] = useState('Charizard Base Set 1st Ed');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      if (u) {
        setDisplayName(u.displayName || 'Alex Vance');
        setUsername(u.handle || '@alexvance_vca');
        setBio(u.bio || 'Pokémon TCG collector & VCA Gem Mint enthusiast. Hunting Base Set Charizards & 151 SIRs.');
        setLocation(u.location || 'Vancouver, BC / Tokyo, JP');
        setFavoritePokemon(u.favoritePokemon || 'Charizard');
        setAvatarPreview(u.avatarUrl || '');
        setCoverPreview(u.coverUrl || '');
      }
    });
    return unsub;
  }, []);

  // Handle custom avatar upload
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (onToast) onToast('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
      await updateUserProfile({ avatarUrl: base64 });
      if (onToast) onToast('Profile picture updated & synced across VCA and Slabbook!');
    };
    reader.readAsDataURL(file);
  };

  // Handle custom cover banner upload
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setCoverPreview(base64);
      await updateUserProfile({ coverUrl: base64 });
      if (onToast) onToast('Cover banner updated & synced across VCA and Slabbook!');
    };
    reader.readAsDataURL(file);
  };

  // Save Profile Changes
  const handleSaveProfile = async () => {
    try {
      const updated = await updateUserProfile({
        displayName: displayName || user?.displayName || 'Collector',
        handle: username || user?.handle || '@alexvance',
        bio: bio || user?.bio || '',
        location: location || user?.location || '',
        favoritePokemon: favoritePokemon || user?.favoritePokemon || 'Charizard',
        avatarUrl: avatarPreview || user?.avatarUrl || '',
        coverUrl: coverPreview || user?.coverUrl || ''
      });
      setUser(updated);
      setIsEditing(false);
      if (onToast) onToast('Profile details synchronized across VCA and Slabbook!');
    } catch (err) {
      if (onToast) onToast('Failed to save profile changes.');
    }
  };

  const userSlabs = MOCK_SLABS;

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-100">
      
      {/* Hidden File Inputs for Image Upload */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* COVER BANNER & PROFILE CARD */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        
        {/* Cover Image Header */}
        <div className="h-48 md:h-64 w-full relative bg-gradient-to-r from-slate-950 via-cyan-950/60 to-indigo-950/80 overflow-hidden">
          {coverPreview ? (
            <img src={coverPreview} alt="Cover Banner" className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_60%)] flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            </div>
          )}

          {/* Change Cover Button */}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700/80 text-xs font-mono font-bold text-slate-200 hover:text-cyan-300 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Change Banner</span>
          </button>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
            
            {/* Avatar with Camera Overlay */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden border-4 border-[#05070A] bg-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.3)] relative">
                <img
                  src={avatarPreview || user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.displayName || 'Collector'}
                  className="w-full h-full object-cover"
                />
                
                {/* Upload Hover Overlay */}
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-cyan-400" />
                  <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase">Upload Photo</span>
                </button>
              </div>

              {/* Verified Badge */}
              <div className="absolute bottom-1 right-1 bg-cyan-500 text-slate-950 p-1.5 rounded-xl border-2 border-[#05070A] shadow-md" title="Verified VCA Vault Member">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* User Main Information */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-display font-black tracking-wide text-white">
                  {user?.displayName || displayName}
                </h1>
                <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  {username}
                </span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Vault Pro
                </span>
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl font-sans">
                {bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Member since Oct 2024</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fav: <strong className="text-slate-200">{favoritePokemon}</strong></span>
                </div>
              </div>
            </div>

            {/* Edit Profile CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Avatar</span>
              </button>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-display font-black text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>

          </div>

          {/* EDIT PROFILE MODAL / DRAWER */}
          {isEditing && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-4 font-mono text-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-display font-bold text-sm text-cyan-300 uppercase flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-cyan-400" /> EDIT COLLECTOR PROFILE
                </span>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                    placeholder="Alex Vance"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Handle / Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                    placeholder="@alexvance"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Collector Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Favorite Pokémon / Chase Card</label>
                  <input
                    type="text"
                    value={favoritePokemon}
                    onChange={(e) => setFavoritePokemon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Photo Button inside Form */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Choose New Avatar Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.4)] cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* STATS METRIC BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 font-mono">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Total Vault Valuation</div>
              <div className="text-lg md:text-xl font-black text-cyan-300 font-display mt-0.5">$42,850 CAD</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold mt-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4% 30d
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Authenticated Slabs</div>
              <div className="text-lg md:text-xl font-black text-white font-display mt-0.5">14 SLABS</div>
              <div className="text-[10px] text-cyan-400 font-bold mt-0.5">100% CMAC Verified</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Average Vault Grade</div>
              <div className="text-lg md:text-xl font-black text-amber-400 font-display mt-0.5">9.6 / 10</div>
              <div className="text-[10px] text-slate-400 font-bold mt-0.5">Gem Mint Ratio: 75%</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Trader Reputation</div>
              <div className="text-lg md:text-xl font-black text-indigo-300 font-display mt-0.5">99.8 / 100</div>
              <div className="text-[10px] text-indigo-400 font-bold mt-0.5">42 Successful Trades</div>
            </div>
          </div>

        </div>
      </div>

      {/* SHOWCASE TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'vault' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Grid className="w-4 h-4 text-cyan-400" />
          <span>VAULT SHOWCASE ({userSlabs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'posts' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>FOILBOOK POSTS (8)</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'certificates' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>DIGITAL CERTIFICATES</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'ledger' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-purple-400" />
          <span>LEDGER HISTORY</span>
        </button>
      </div>

      {/* TAB 1: VAULT SHOWCASE */}
      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userSlabs.map((slab) => (
            <div
              key={slab.serialNumber}
              className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group"
            >
              <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 flex items-center justify-center overflow-hidden">
                <HoloCardImage
                  src={slab.card?.imageUrl || 'https://images.pokemontcg.io/base1/4_hires.png'}
                  alt={slab.card?.name || (slab.card as any)?.pokemonName || 'Card'}
                  className="h-56 object-contain"
                  containerClassName="h-56"
                />

                {/* Holographic Label */}
                <div className="absolute top-2 left-2 right-2">
                  <HolographicLabel
                    serialNumber={slab.serialNumber}
                    grade={slab.overallGrade}
                    gradeLabel={slab.gradeLabel}
                  />
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-base text-white">{slab.card?.name || (slab.card as any)?.pokemonName || 'Unknown Card'}</span>
                  <span className="text-xs text-cyan-300 font-bold">${(slab.vaultValueCAD || 0).toLocaleString()} CAD</span>
                </div>
                <div className="text-xs text-slate-400">
                  {slab.card?.set || (slab.card as any)?.setName} • #{slab.card?.number || (slab.card as any)?.cardNumber}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[10px] font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> NTAG424 SEAL OK
                </span>
                {onOpenNfcModal && (
                  <button
                    onClick={() => onOpenNfcModal(slab)}
                    className="text-cyan-400 hover:text-cyan-200 font-bold underline cursor-pointer"
                  >
                    TAP VERIFY →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: FOILBOOK POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-4 max-w-2xl mx-auto font-sans">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={avatarPreview || user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-cyan-400"
              />
              <div>
                <div className="font-bold text-white text-sm">{user?.displayName || 'Alex Vance'}</div>
                <div className="text-[10px] font-mono text-slate-400">2 hours ago • Public</div>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              Just added the 1st Edition Shadowless Base Set Charizard to my authenticated VCA Vault!
              VScan AI surface analysis returned 98.6% centering score with Gem Mint 10 label. ⚡🔥
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center gap-4">
              <img src="https://images.pokemontcg.io/base1/4_hires.png" alt="Charizard" className="h-20 object-contain" />
              <div className="font-mono text-xs">
                <div className="font-bold text-cyan-300">Charizard Base Set #4/102</div>
                <div className="text-slate-400">SERIAL: VCA-000-000-001</div>
                <div className="text-emerald-400 font-bold mt-1">Est. Value: $9,850 CAD</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 font-mono space-y-4 text-center">
          <Award className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
          <h3 className="text-xl font-display font-bold text-white">VCA Digital Certificates of Authenticity</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            All 14 slabs in this portfolio are cryptographically signed with SHA-256 ledger hashes and backed by NTAG424 CMAC NFC security chips.
          </p>
        </div>
      )}

      {/* TAB 4: LEDGER HISTORY */}
      {activeTab === 'ledger' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-3">
          <div className="font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> RECENT LEDGER TRANSACTIONS FOR {username}
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-emerald-400 font-bold">[OWNERSHIP_SIGNED]</span> Signed VCA-000-000-001
              </div>
              <span className="text-slate-500">Today at 2:15 PM</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold">[NFC_LINKED]</span> NTAG424 Bound to Pikachu #173
              </div>
              <span className="text-slate-500">Yesterday at 10:43 AM</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
