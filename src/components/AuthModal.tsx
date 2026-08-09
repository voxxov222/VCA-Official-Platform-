import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Lock, Key, ShieldCheck, Sparkles, LogOut, CheckCircle2, 
  RefreshCw, AlertCircle, Award, BadgeCheck, Settings, Save, ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types/vca';
import { 
  getCurrentUser, subscribeAuth, loginUser, signUpUser, resetPassword, updateUserProfile, logoutUser 
} from '../services/authService';

interface AuthModalProps {
  onClose: () => void;
  onToast?: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onToast }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser());
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT' | 'PROFILE'>('LOGIN');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [role, setRole] = useState<'COLLECTOR' | 'VERIFIED_PRO' | 'ADMIN'>('COLLECTOR');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeAuth((user) => {
      setCurrentUser(user);
      if (user) {
        setDisplayName(user.displayName);
        setAvatarUrl(user.avatarUrl);
        setRole(user.role);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      setMode('PROFILE');
    } else {
      setMode('LOGIN');
    }
  }, [currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await loginUser(email, password);
      onToast?.(`Welcome back to VCA, ${email.split('@')[0]}!`);
      onClose();
    } catch (err: any) {
      setError('Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginUser('toddwilliam420@gmail.com', 'password123');
      onToast?.('Logged in as Todd W. (Alpha Vault Collector)');
      onClose();
    } catch (err) {
      setError('Failed demo login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !displayName) {
      setError('Name and email are required.');
      return;
    }
    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const newUser = await signUpUser(email, displayName, password);
      onToast?.(`Welcome to Verified Card Authority, ${newUser.displayName}!`);
      onClose();
    } catch (err: any) {
      setError('Sign up failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg(`Password recovery link dispatched to ${email}. Check your inbox.`);
    } catch (err) {
      setError('Unable to send password recovery email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      await updateUserProfile({
        displayName,
        avatarUrl,
        role
      });
      onToast?.('User profile and credentials updated successfully!');
      setSuccessMsg('Profile updated!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    onToast?.('Signed out of VCA Security Vault.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto font-mono">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-cyan-500/30 space-y-6 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-slate-100">
                {mode === 'PROFILE' ? 'USER PROFILE & SECURITY' : mode === 'LOGIN' ? 'VCA SECURE AUTHENTICATION' : mode === 'SIGNUP' ? 'REGISTER VCA COLLECTOR ACCOUNT' : 'RECOVER PASSWORD'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {mode === 'PROFILE' ? 'Manage credentials & collector vault' : 'NTAG424 Cryptographic Vault Access'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-bold">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@vca.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-400 font-bold">PASSWORD</label>
                <button
                  type="button"
                  onClick={() => { setError(null); setMode('FORGOT'); }}
                  className="text-[10px] text-cyan-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-display font-extrabold text-xs tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <ShieldCheck className="w-4 h-4 text-slate-950" />}
              <span>AUTHENTICATE & LOG IN</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-bold">OR QUICK DEMO</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>LOG IN AS DEMO VAULT COLLECTOR</span>
            </button>

            <div className="text-center pt-2 text-[11px] text-slate-400">
              Don't have a VCA account yet?{' '}
              <button
                type="button"
                onClick={() => { setError(null); setMode('SIGNUP'); }}
                className="text-cyan-300 font-bold hover:underline"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* MODE: SIGNUP */}
        {mode === 'SIGNUP' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-bold">COLLECTOR / DISPLAY NAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Ash Ketchum (Pallet Vault)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-bold">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold">PASSWORD</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold">CONFIRM PASSWORD</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 text-slate-950 font-display font-extrabold text-xs tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <ShieldCheck className="w-4 h-4 text-slate-950" />}
              <span>CREATE VCA COLLECTOR ACCOUNT</span>
            </button>

            <div className="text-center pt-2 text-[11px] text-slate-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setError(null); setMode('LOGIN'); }}
                className="text-cyan-300 font-bold hover:underline"
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {/* MODE: FORGOT */}
        {mode === 'FORGOT' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your registered email address and we will dispatch a password recovery link to access your VCA encrypted ledger.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-bold">RECOVERY EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Mail className="w-4 h-4 text-slate-950" />}
              <span>SEND RECOVERY LINK</span>
            </button>

            <div className="text-center pt-2 text-[11px] text-slate-400">
              Back to{' '}
              <button
                type="button"
                onClick={() => { setError(null); setMode('LOGIN'); }}
                className="text-cyan-300 font-bold hover:underline"
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {/* MODE: PROFILE */}
        {mode === 'PROFILE' && currentUser && (
          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* User Avatar Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.displayName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-md shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm text-slate-100 truncate">
                    {currentUser.displayName}
                  </span>
                  {currentUser.verifiedTraderBadge && (
                    <BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" title="Verified Trader Badge" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-bold">
                    {currentUser.role}
                  </span>
                  <span>Joined {currentUser.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">DISPLAY NAME</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">AVATAR IMAGE URL</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">ACCOUNT TIER / ROLE</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="COLLECTOR">COLLECTOR (Standard Vault)</option>
                  <option value="VERIFIED_PRO">VERIFIED PRO (High-Volume Trader)</option>
                  <option value="ADMIN">ADMIN QC (Grader / Inspector)</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-400 font-bold text-xs hover:bg-rose-950/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>SIGN OUT</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-extrabold text-xs tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Save className="w-4 h-4 text-slate-950" />}
                <span>SAVE CHANGES</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
