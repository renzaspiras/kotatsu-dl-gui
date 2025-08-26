import { MANGA } from '@consumet/extensions';
import { MangaSource, SearchResult, MangaDetails, Chapter } from '../services/manga-parser.js';

export class MangaParkSource implements MangaSource {
  id = 'mangapark';
  name = 'MangaPark';
  baseUrl = 'https://mangapark.net';
  language = 'en';
  
  private mangapark = new MANGA.Mangapark();

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      console.log(`MangaPark searching for: ${query} on page ${page}`);
      
      const results = await this.mangapark.search(query, page);
      
      console.log(`MangaPark found ${results.results?.length || 0} manga results`);
      return this.mapResults(results.results || []);
    } catch (error) {
      console.error('MangaPark search error:', error);
      return [];
    }
  }

  async getPopular(page = 1): Promise<SearchResult[]> {
    try {
      console.log(`MangaPark getting popular manga page ${page}`);
      
      // Use the search with an empty query to get popular results
      const results = await this.mangapark.search('', page);
      
      console.log(`MangaPark found ${results.results?.length || 0} popular manga`);
      return this.mapResults(results.results || []);
    } catch (error) {
      console.error('MangaPark popular error:', error);
      return [];
    }
  }

  async getMangaDetails(id: string): Promise<MangaDetails> {
    try {
      const details = await this.mangapark.fetchMangaInfo(id);
      return this.mapDetails(details);
    } catch (error) {
      console.error('MangaPark details error:', error);
      throw error;
    }
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    try {
      const details = await this.mangapark.fetchMangaInfo(mangaId);
      
      if (!details.chapters) {
        return [];
      }
      
      return details.chapters.map((chapter: any, index: number) => ({
        id: chapter.id,
        title: chapter.title || `Chapter ${chapter.chapterNumber || index + 1}`,
        number: parseFloat(chapter.chapterNumber || '0') || index + 1,
        url: chapter.url || `https://mangapark.net/comic/${chapter.id}`,
        language: 'en'
      }));
    } catch (error) {
      console.error('MangaPark chapters error:', error);
      return [];
    }
  }

  private mapResults(mangaList: any[]): SearchResult[] {
    return mangaList.map(manga => {
      return {
        id: manga.id,
        title: manga.title || 'Unknown Title',
        coverUrl: manga.image || 'https://via.placeholder.com/300x400?text=No+Cover',
        description: manga.description || '',
        status: manga.status,
        rating: manga.rating ? manga.rating : undefined,
        sourceId: this.id,
        url: manga.url || `https://mangapark.net/comic/${manga.id}`
      };
    });
  }

  private mapDetails(manga: any): MangaDetails {
    return {
      id: manga.id,
      title: manga.title || 'Unknown Title',
      coverUrl: manga.image || 'https://via.placeholder.com/512x720?text=No+Cover',
      description: manga.description || '',
      status: manga.status,
      rating: manga.rating ? manga.rating : undefined,
      genres: manga.genres || [],
      authors: manga.authors || [],
      artists: manga.artists || [],
      yearReleased: manga.releaseDate ? new Date(manga.releaseDate).getFullYear() : undefined,
      sourceId: this.id,
      url: manga.url || `https://mangapark.net/comic/${manga.id}`
    };
  }
}