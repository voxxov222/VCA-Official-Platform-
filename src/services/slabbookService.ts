// Slabbook Feed & Social Posting Service

export interface SlabbookPostItem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  isVerifiedCollector: boolean;
  content: string;
  images?: string[];
  cardSlab?: {
    serialNumber: string;
    cardName: string;
    setName: string;
    grade: number;
    estimatedValueCAD: number;
  };
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

const INITIAL_POSTS: SlabbookPostItem[] = [
  {
    id: 'post-101',
    authorName: 'Ash Ketchum',
    authorHandle: '@pallet_hero',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isVerifiedCollector: true,
    content: '🔥 Just submitted my 1999 Base Set First Edition Charizard for VCA AI Optical Grading! Surface score 9.8, Corners 9.6. Pending NTAG424 NFC binding!',
    images: ['https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop&q=80'],
    cardSlab: {
      serialNumber: 'VCA-000-000-001',
      cardName: 'Charizard Holo 1st Edition',
      setName: 'Base Set 1999',
      grade: 10,
      estimatedValueCAD: 12500
    },
    likesCount: 142,
    commentsCount: 19,
    createdAt: '12m ago'
  }
];

let postsMemory = [...INITIAL_POSTS];

export function getSlabbookPosts(): SlabbookPostItem[] {
  return postsMemory;
}

export function addSlabbookPost(postData: Omit<SlabbookPostItem, 'id' | 'likesCount' | 'commentsCount' | 'createdAt'>): SlabbookPostItem {
  const newPost: SlabbookPostItem = {
    ...postData,
    id: `post-${Date.now()}`,
    likesCount: 0,
    commentsCount: 0,
    createdAt: 'Just now'
  };
  postsMemory = [newPost, ...postsMemory];
  return newPost;
}
