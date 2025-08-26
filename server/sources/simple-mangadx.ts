import axios from 'axios';
import { MangaSource, SearchResult, MangaDetails, Chapter } from '../services/manga-parser.js';

export class SimpleMangaDxSource implements MangaSource {
  id = 'simple-mangadx';
  name = 'MangaDx (Direct API)';
  baseUrl = 'https://api.mangadx.org';
  language = 'en';

  private api = axios.create({
    baseURL: this.baseUrl,
    timeout: 30000,
    headers: {
      'User-Agent': 'Kotatsu-dl/2.0.0',
      'Accept': 'application/json'
    }
  });

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      console.log(`Searching for: ${query} on page ${page}`);
      const response = await this.api.get('/manga', {
        params: {
          title: query,
          limit: 20,
          offset: (page - 1) * 20,
          'contentRating[]': ['safe', 'suggestive'],
          'availableTranslatedLanguage[]': ['en'],
          'includes[]': ['cover_art'],
          'order[relevance]': 'desc'
        }
      });

      console.log(`Found ${response.data.data?.length || 0} manga results`);
      return this.mapSearchResults(response.data.data || []);
    } catch (error) {
      console.error('MangaDx search error:', (error as Error).message);
      return [];
    }
  }

  async getPopular(page = 1): Promise<SearchResult[]> {
    try {
      console.log(`Getting popular manga page ${page}`);
      const response = await this.api.get('/manga', {
        params: {
          limit: 20,
          offset: (page - 1) * 20,
          'contentRating[]': ['safe', 'suggestive'],
          'availableTranslatedLanguage[]': ['en'],
          'includes[]': ['cover_art'],
          'order[followedCount]': 'desc',
          'hasAvailableChapters': 'true'
        }
      });

      console.log(`Found ${response.data.data?.length || 0} popular manga`);
      return this.mapSearchResults(response.data.data || []);
    } catch (error) {
      console.error('MangaDx popular error:', (error as Error).message);
      return [];
    }
  }

  async getMangaDetails(id: string): Promise<MangaDetails> {
    try {
      const response = await this.api.get(`/manga/${id}`, {
        params: {
          'includes[]': ['author', 'artist', 'cover_art']
        }
      });

      return this.mapMangaDetails(response.data.data);
    } catch (error) {
      console.error('MangaDx details error:', (error as Error).message);
      throw error;
    }
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    try {
      const response = await this.api.get('/chapter', {
        params: {
          manga: mangaId,
          'translatedLanguage[]': ['en'],
          'order[chapter]': 'asc',
          limit: 500
        }
      });

      return this.mapChapters(response.data.data || []);
    } catch (error) {
      console.error('MangaDx chapters error:', (error as Error).message);
      return [];
    }
  }

  private mapSearchResults(mangaList: any[]): SearchResult[] {
    return mangaList.map(manga => {
      const title = this.getTitle(manga.attributes);
      const coverArt = manga.relationships?.find((rel: any) => rel.type === 'cover_art');
      const coverUrl = this.getCoverUrl(manga.id, coverArt?.attributes?.fileName);

      return {
        id: manga.id,
        title,
        coverUrl,
        description: manga.attributes.description?.en || '',
        status: manga.attributes.status,
        sourceId: this.id,
        url: `https://mangadx.org/title/${manga.id}`
      };
    });
  }

  private mapMangaDetails(manga: any): MangaDetails {
    const title = this.getTitle(manga.attributes);
    const coverArt = manga.relationships?.find((rel: any) => rel.type === 'cover_art');
    const coverUrl = this.getCoverUrl(manga.id, coverArt?.attributes?.fileName);

    const authors = manga.relationships
      ?.filter((rel: any) => rel.type === 'author')
      ?.map((rel: any) => rel.attributes?.name)
      ?.filter(Boolean) || [];

    const artists = manga.relationships
      ?.filter((rel: any) => rel.type === 'artist')
      ?.map((rel: any) => rel.attributes?.name)
      ?.filter(Boolean) || [];

    return {
      id: manga.id,
      title,
      coverUrl,
      description: manga.attributes.description?.en || '',
      status: manga.attributes.status,
      genres: manga.attributes.tags
        ?.filter((tag: any) => tag.attributes.group === 'genre')
        ?.map((tag: any) => tag.attributes.name.en) || [],
      authors,
      artists,
      yearReleased: manga.attributes.year,
      sourceId: this.id,
      url: `https://mangadx.org/title/${manga.id}`
    };
  }

  private mapChapters(chapters: any[]): Chapter[] {
    return chapters.map(chapter => {
      const chapterNum = parseFloat(chapter.attributes.chapter) || 0;
      const title = chapter.attributes.title || `Chapter ${chapterNum}`;

      return {
        id: chapter.id,
        title,
        number: chapterNum,
        url: `https://mangadx.org/chapter/${chapter.id}`,
        releaseDate: chapter.attributes.publishAt,
        language: chapter.attributes.translatedLanguage
      };
    });
  }

  private getTitle(attributes: any): string {
    return attributes.title?.en || 
           attributes.title?.['ja-ro'] || 
           Object.values(attributes.title || {})[0] || 
           'Unknown Title';
  }

  private getCoverUrl(mangaId: string, fileName?: string): string {
    if (!fileName) {
      return 'https://via.placeholder.com/300x400?text=No+Cover';
    }
    return `https://uploads.mangadx.org/covers/${mangaId}/${fileName}.256.jpg`;
  }
}