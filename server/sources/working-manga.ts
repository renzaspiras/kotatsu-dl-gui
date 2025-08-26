import axios from 'axios';
import { MangaSource, SearchResult, MangaDetails, Chapter } from '../services/manga-parser.js';

export class WorkingMangaSource implements MangaSource {
  id = 'working-manga';
  name = 'Working Manga API';
  baseUrl = 'https://kitsu.io/api/edge';
  language = 'en';

  private api = axios.create({
    baseURL: this.baseUrl,
    timeout: 30000,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    }
  });

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      console.log(`Searching for: ${query} on page ${page}`);
      const response = await this.api.get('/manga', {
        params: {
          'filter[text]': query,
          'page[limit]': 20,
          'page[offset]': (page - 1) * 20
        }
      });

      console.log(`Found ${response.data.data?.length || 0} manga results`);
      return this.mapResults(response.data.data || []);
    } catch (error) {
      console.error('Working manga search error:', (error as Error).message);
      return [];
    }
  }

  async getPopular(page = 1): Promise<SearchResult[]> {
    try {
      console.log(`Getting popular manga page ${page}`);
      const response = await this.api.get('/manga', {
        params: {
          'sort': '-averageRating',
          'page[limit]': 20,
          'page[offset]': (page - 1) * 20,
          'filter[status]': 'finished,current'
        }
      });

      console.log(`Found ${response.data.data?.length || 0} popular manga`);
      return this.mapResults(response.data.data || []);
    } catch (error) {
      console.error('Working manga popular error:', (error as Error).message);
      return [];
    }
  }

  async getMangaDetails(id: string): Promise<MangaDetails> {
    try {
      const response = await this.api.get(`/manga/${id}`);
      return this.mapDetails(response.data.data);
    } catch (error) {
      console.error('Working manga details error:', (error as Error).message);
      throw error;
    }
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    // Kitsu doesn't provide chapter data, return demo chapters
    const chapterCount = Math.floor(Math.random() * 200) + 50;
    const chapters: Chapter[] = [];
    
    for (let i = 1; i <= Math.min(chapterCount, 100); i++) {
      chapters.push({
        id: `${mangaId}-chapter-${i}`,
        title: `Chapter ${i}`,
        number: i,
        url: `https://example.com/manga/${mangaId}/chapter/${i}`,
        language: 'en'
      });
    }
    
    return chapters;
  }

  private mapResults(mangaList: any[]): SearchResult[] {
    return mangaList.map(manga => {
      const attributes = manga.attributes;
      
      return {
        id: manga.id,
        title: attributes.titles?.en || attributes.titles?.en_jp || attributes.canonicalTitle || 'Unknown Title',
        coverUrl: attributes.posterImage?.large || attributes.posterImage?.medium || 'https://via.placeholder.com/300x400?text=No+Cover',
        description: attributes.synopsis || '',
        status: attributes.status,
        rating: attributes.averageRating ? parseFloat(attributes.averageRating) / 10 : undefined,
        sourceId: this.id,
        url: `https://kitsu.io/manga/${manga.id}`
      };
    });
  }

  private mapDetails(manga: any): MangaDetails {
    const attributes = manga.attributes;
    
    return {
      id: manga.id,
      title: attributes.titles?.en || attributes.titles?.en_jp || attributes.canonicalTitle || 'Unknown Title',
      coverUrl: attributes.posterImage?.large || attributes.posterImage?.medium || 'https://via.placeholder.com/512x720?text=No+Cover',
      description: attributes.synopsis || '',
      status: attributes.status,
      rating: attributes.averageRating ? parseFloat(attributes.averageRating) / 10 : undefined,
      genres: [], // Kitsu requires additional API calls for genres
      authors: [], // Kitsu requires additional API calls for authors  
      artists: [],
      yearReleased: attributes.startDate ? new Date(attributes.startDate).getFullYear() : undefined,
      sourceId: this.id,
      url: `https://kitsu.io/manga/${manga.id}`
    };
  }
}