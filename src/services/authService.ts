import { UserProfile } from '../types/vca';

const STORAGE_KEY = 'vca_user_profile';

const DEFAULT_USER: UserProfile = {
  uid: 'user_vca_78901',
  email: 'toddwilliam420@gmail.com',
  displayName: 'Alex Vance',
  handle: '@alexvance_vca',
  bio: 'Pokémon TCG collector & VCA Gem Mint enthusiast. Hunting Base Set Charizards & 151 SIRs.',
  location: 'Vancouver, BC / Tokyo, JP',
  favoritePokemon: 'Charizard',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  coverUrl: '',
  followersCount: 1420,
  followingCount: 289,
  role: 'COLLECTOR',
  verifiedTraderBadge: true,
  joinedDate: 'January 2025',
  totalVaultValueUSD: 14850,
  totalCardsCount: 18
};

function loadStoredUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load user from localStorage', e);
  }
  return DEFAULT_USER;
}

function saveUserToStorage(user: UserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to save user to localStorage', e);
  }
}

let currentUser: UserProfile | null = loadStoredUser();
const LISTENERS: Array<(user: UserProfile | null) => void> = [];

export function getCurrentUser(): UserProfile | null {
  return currentUser;
}

export function subscribeAuth(callback: (user: UserProfile | null) => void): () => void {
  LISTENERS.push(callback);
  callback(currentUser);
  return () => {
    const idx = LISTENERS.indexOf(callback);
    if (idx !== -1) LISTENERS.splice(idx, 1);
  };
}

function notifyListeners() {
  saveUserToStorage(currentUser);
  LISTENERS.forEach(fn => fn(currentUser));
}

export async function loginUser(email: string, password?: string): Promise<UserProfile> {
  await new Promise(r => setTimeout(r, 600));
  currentUser = {
    ...DEFAULT_USER,
    email: email || DEFAULT_USER.email,
    displayName: email ? email.split('@')[0] : 'Collector'
  };
  notifyListeners();
  return currentUser;
}

export async function signUpUser(email: string, name: string, password?: string): Promise<UserProfile> {
  await new Promise(r => setTimeout(r, 800));
  currentUser = {
    uid: `user_${Date.now()}`,
    email,
    displayName: name || 'New Collector',
    avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
    role: 'COLLECTOR',
    verifiedTraderBadge: false,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    totalVaultValueUSD: 0,
    totalCardsCount: 0
  };
  notifyListeners();
  return currentUser;
}

export async function resetPassword(email: string): Promise<boolean> {
  await new Promise(r => setTimeout(r, 500));
  return true;
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  if (!currentUser) throw new Error('No user logged in');
  currentUser = { ...currentUser, ...updates };
  notifyListeners();
  return currentUser;
}

export function logoutUser(): void {
  currentUser = null;
  notifyListeners();
}

