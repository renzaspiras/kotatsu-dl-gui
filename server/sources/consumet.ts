import { MANGA } from '@consumet/extensions';

export class ConsumetMangaSource {
  id = 'consumet-mangadx';
  name = 'MangaDex (Consumet)';
  baseUrl = 'https://api.mangadx.org';
  language = 'en';

  private mangadx = new MANGA.MangaDex();

  async search(query: string, page = 1): Promise<any[]> {
    try {
      const results = await this.mangadx.search(query, page);
      return results.results?.map((manga: any) => ({
        id: manga.id,
        title: manga.title.english || manga.title.romaji || manga.title.native || 'Unknown Title',
        coverUrl: manga.image || 'https://via.placeholder.com/300x400?text=No+Image',
        description: manga.description || '',
        status: manga.status,
        rating: manga.rating,
        sourceId: this.id,
        url: `https://mangadx.org/title/${manga.id}`
      })) || [];
    } catch (error) {
      console.error('Consumet MangaDex search error:', error);
      return [];
    }
  }

  async getPopular(page = 1): Promise<any[]> {
    try {
      // Consumet doesn't have direct popular endpoint, so we'll use a trending search
      const results = await this.mangadx.search('', page);
      return results.results?.map((manga: any) => ({
        id: manga.id,
        title: manga.title.english || manga.title.romaji || manga.title.native || 'Unknown Title',
        coverUrl: manga.image || 'https://via.placeholder.com/300x400?text=No+Image',
        description: manga.description || '',
        status: manga.status,
        rating: manga.rating,
        sourceId: this.id,
        url: `https://mangadx.org/title/${manga.id}`
      })) || [];
    } catch (error) {
      console.error('Consumet MangaDex popular error:', error);
      return [];
    }
  }

  async getMangaDetails(id: string): Promise<any> {
    try {
      const manga = await this.mangadx.fetchMangaInfo(id);
      return {
        id: manga.id,
        title: manga.title.english || manga.title.romaji || manga.title.native || 'Unknown Title',
        coverUrl: manga.image || 'https://via.placeholder.com/512x720?text=No+Cover',
        description: manga.description || '',
        status: manga.status,
        rating: manga.rating,
        genres: manga.genres || [],
        authors: manga.authors || [],
        artists: manga.authors || [],
        yearReleased: manga.releaseDate,
        sourceId: this.id,
        url: `https://mangadx.org/title/${manga.id}`
      };
    } catch (error) {
      console.error('Consumet MangaDex details error:', error);
      throw error;
    }
  }

  async getChapters(mangaId: string): Promise<any[]> {
    try {
      const manga = await this.mangadx.fetchMangaInfo(mangaId);
      return manga.chapters?.map((chapter: any) => ({
        id: chapter.id,
        title: chapter.title || `Chapter ${chapter.chapterNumber}`,
        number: parseFloat(chapter.chapterNumber) || 0,
        url: `https://mangadx.org/chapter/${chapter.id}`,
        releaseDate: chapter.releaseDate,
        language: 'en'
      })) || [];
    } catch (error) {
      console.error('Consumet MangaDex chapters error:', error);
      return [];
    }
  }
}