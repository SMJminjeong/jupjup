import type { Category, Scrap } from '@jupjup/types';
import { create } from 'zustand';

interface ScrapState {
  scraps: Scrap[];
  filter: Category | 'all';
  setScraps: (s: Scrap[]) => void;
  appendScraps: (s: Scrap[]) => void;
  setFilter: (f: Category | 'all') => void;
  toggleBookmark: (id: string) => void;
  markRead: (id: string) => void;
  removeScrap: (id: string) => void;
}

export const useScrapStore = create<ScrapState>((set) => ({
  scraps: [],
  filter: 'all',
  setScraps: (scraps) => set({ scraps }),
  appendScraps: (more) => set((s) => ({ scraps: [...s.scraps, ...more] })),
  setFilter: (filter) => set({ filter }),
  toggleBookmark: (id) =>
    set((s) => ({
      scraps: s.scraps.map((it) =>
        it.id === id ? { ...it, isBookmarked: !it.isBookmarked } : it,
      ),
    })),
  markRead: (id) =>
    set((s) => ({
      scraps: s.scraps.map((it) => (it.id === id ? { ...it, isRead: true } : it)),
    })),
  removeScrap: (id) => set((s) => ({ scraps: s.scraps.filter((it) => it.id !== id) })),
}));
