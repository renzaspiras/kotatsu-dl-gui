import { create } from 'zustand'
import { MangaSearchResult, MangaDetails } from '@/lib/manga-parser'

interface MangaStore {
  searchResults: MangaSearchResult[]
  searchQuery: string
  isSearching: boolean
  selectedManga: MangaDetails | null
  favorites: string[]
  
  setSearchResults: (results: MangaSearchResult[]) => void
  setSearchQuery: (query: string) => void
  setIsSearching: (searching: boolean) => void
  setSelectedManga: (manga: MangaDetails | null) => void
  addToFavorites: (mangaId: string) => void
  removeFromFavorites: (mangaId: string) => void
  clearSearch: () => void
}

export const useMangaStore = create<MangaStore>((set) => ({
  searchResults: [],
  searchQuery: '',
  isSearching: false,
  selectedManga: null,
  favorites: [],
  
  setSearchResults: (results) => set({ searchResults: results }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  setSelectedManga: (manga) => set({ selectedManga: manga }),
  
  addToFavorites: (mangaId) =>
    set((state) => ({
      favorites: [...state.favorites.filter(id => id !== mangaId), mangaId]
    })),
    
  removeFromFavorites: (mangaId) =>
    set((state) => ({
      favorites: state.favorites.filter(id => id !== mangaId)
    })),
    
  clearSearch: () => set({ 
    searchResults: [], 
    searchQuery: '', 
    isSearching: false 
  })
}))