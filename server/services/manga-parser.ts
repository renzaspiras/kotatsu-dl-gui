import axios from 'axios';
import * as cheerio from 'cheerio';

export interface MangaSource {
  id: string;
  name: string;
  baseUrl: string;
  language: string;
  search(query: string, page?: number): Promise<SearchResult[]>;
  getPopular(page?: number): Promise<SearchResult[]>;
  getMangaDetails(id: string): Promise<MangaDetails>;
  getChapters(mangaId: string): Promise<Chapter[]>;
}

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

export class MangaParser {
  private sources: Map<string, MangaSource> = new Map();

  addSource(source: MangaSource) {
    this.sources.set(source.id, source);
  }

  getSources(): MangaSource[] {
    return Array.from(this.sources.values());
  }

  async search(query: string, sourceId?: string): Promise<SearchResult[]> {
    if (sourceId) {
      const source = this.sources.get(sourceId);
      if (!source) {
        throw new Error(`Source ${sourceId} not found`);
      }
      return await source.search(query);
    }

    // Search across all sources
    const results: SearchResult[] = [];
    const promises = Array.from(this.sources.values()).map(async (source) => {
      try {
        const sourceResults = await source.search(query);
        results.push(...sourceResults);
      } catch (error) {
        console.error(`Error searching ${source.id}:`, error);
      }
    });

    await Promise.all(promises);
    return results;
  }

  async getPopular(sourceId: string, page = 1): Promise<SearchResult[]> {
    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error(`Source ${sourceId} not found`);
    }
    return await source.getPopular(page);
  }

  async getMangaDetails(sourceId: string, mangaId: string): Promise<MangaDetails> {
    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error(`Source ${sourceId} not found`);
    }
    return await source.getMangaDetails(mangaId);
  }

  async getChapters(sourceId: string, mangaId: string): Promise<Chapter[]> {
    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error(`Source ${sourceId} not found`);
    }
    return await source.getChapters(mangaId);
  }
}