import { create } from 'zustand';
import { mangaAPI, SearchResult, MangaDetails, Chapter, MangaSource } from '../lib/manga-api';

interface MangaState {
  // Sources
  sources: MangaSource[];
  selectedSource: string;
  
  // Search & Browse
  searchQuery: string;
  searchResults: SearchResult[];
  popularManga: SearchResult[];
  isLoading: boolean;
  error: string | null;
  
  // Details
  selectedManga: MangaDetails | null;
  chapters: Chapter[];
  
  // Actions
  loadSources: () => Promise<void>;
  setSelectedSource: (sourceId: string) => void;
  search: (query: string) => Promise<void>;
  loadPopular: (page?: number) => Promise<void>;
  loadMangaDetails: (sourceId: string, mangaId: string) => Promise<void>;
  loadChapters: (sourceId: string, mangaId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useMangaStore = create<MangaState>((set, get) => ({
  // Initial state
  sources: [],
  selectedSource: 'working-manga',
  searchQuery: '',
  searchResults: [],
  popularManga: [],
  isLoading: false,
  error: null,
  selectedManga: null,
  chapters: [],

  // Actions
  loadSources: async () => {
    try {
      set({ isLoading: true, error: null });
      const sources = await mangaAPI.getSources();
      set({ sources, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load sources', isLoading: false });
    }
  },

  setSelectedSource: (sourceId: string) => {
    set({ selectedSource: sourceId });
    // Auto-load popular manga for the new source
    get().loadPopular();
  },

  search: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const results = await mangaAPI.search(query, get().selectedSource);
      set({ searchResults: results, isLoading: false });
    } catch (error) {
      set({ error: 'Search failed', isLoading: false });
    }
  },

  loadPopular: async (page = 1) => {
    try {
      set({ isLoading: true, error: null });
      const popular = await mangaAPI.getPopular(get().selectedSource, page);
      set({ popularManga: popular, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load popular manga', isLoading: false });
    }
  },

  loadMangaDetails: async (sourceId: string, mangaId: string) => {
    try {
      set({ isLoading: true, error: null });
      const details = await mangaAPI.getMangaDetails(sourceId, mangaId);
      set({ selectedManga: details, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load manga details', isLoading: false });
    }
  },

  loadChapters: async (sourceId: string, mangaId: string) => {
    try {
      set({ isLoading: true, error: null });
      const chapters = await mangaAPI.getChapters(sourceId, mangaId);
      set({ chapters, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load chapters', isLoading: false });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },
}));