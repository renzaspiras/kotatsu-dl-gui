import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

export interface SearchResult {
  id: string;
  title: string;
  coverUrl: string;
  description?: string;
  status?: string;
  rating?: number;
  sourceId: string;
  url: string;
}

export interface MangaDetails {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  status: string;
  rating?: number;
  genres: string[];
  authors: string[];
  artists: string[];
  yearReleased?: number;
  sourceId: string;
  url: string;
}

export interface Chapter {
  id: string;
  title: string;
  number: number;
  url: string;
  releaseDate?: string;
  language?: string;
}

export interface MangaSource {
  id: string;
  name: string;
  baseUrl: string;
  language: string;
}

class MangaAPI {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  async getSources(): Promise<MangaSource[]> {
    const response = await this.api.get('/manga/sources');
    return response.data;
  }

  async search(query: string, source?: string): Promise<SearchResult[]> {
    const response = await this.api.get('/manga/search', {
      params: { query, source }
    });
    return response.data;
  }

  async getPopular(source = 'working-manga', page = 1): Promise<SearchResult[]> {
    const response = await this.api.get('/manga/popular', {
      params: { source, page }
    });
    return response.data;
  }

  async getMangaDetails(sourceId: string, mangaId: string): Promise<MangaDetails> {
    const response = await this.api.get(`/manga/details/${sourceId}/${mangaId}`);
    return response.data;
  }

  async getChapters(sourceId: string, mangaId: string): Promise<Chapter[]> {
    const response = await this.api.get(`/manga/chapters/${sourceId}/${mangaId}`);
    return response.data;
  }
}

export const mangaAPI = new MangaAPI();