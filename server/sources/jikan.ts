import jikan4js from 'jikan4.js';

export class JikanMangaSource {
  id = 'jikan-mal';
  name = 'MyAnimeList (Jikan)';
  baseUrl = 'https://api.jikan.moe/v4';
  language = 'en';

  private jikan = new (jikan4js as any).Jikan();

  async search(query: string, page = 1): Promise<any[]> {
    try {
      const results = await this.jikan.manga.search({
        q: query,
        page: page,
        limit: 20,
        order_by: 'score',
        sort: 'desc'
      });

      return results.data?.map((manga: any) => ({
        id: manga.mal_id.toString(),
        title: manga.title || manga.title_english || 'Unknown Title',
        coverUrl: manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || 'https://via.placeholder.com/300x400?text=No+Image',
        description: manga.synopsis || '',
        status: manga.status,
        rating: manga.score,
        sourceId: this.id,
        url: manga.url
      })) || [];
    } catch (error) {
      console.error('Jikan search error:', error);
      return [];
    }
  }

  async getPopular(page = 1): Promise<any[]> {
    try {
      const results = await this.jikan.manga.getTop({
        page: page,
        limit: 20,
        filter: 'bypopularity'
      });

      return results.data?.map((manga: any) => ({
        id: manga.mal_id.toString(),
        title: manga.title || manga.title_english || 'Unknown Title',
        coverUrl: manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || 'https://via.placeholder.com/300x400?text=No+Image',
        description: manga.synopsis || '',
        status: manga.status,
        rating: manga.score,
        sourceId: this.id,
        url: manga.url
      })) || [];
    } catch (error) {
      console.error('Jikan popular error:', error);
      return [];
    }
  }

  async getMangaDetails(id: string): Promise<any> {
    try {
      const manga = await this.jikan.manga.getFull(parseInt(id));
      
      return {
        id: manga.data.mal_id.toString(),
        title: manga.data.title || manga.data.title_english || 'Unknown Title',
        coverUrl: manga.data.images?.jpg?.large_image_url || manga.data.images?.jpg?.image_url || 'https://via.placeholder.com/512x720?text=No+Cover',
        description: manga.data.synopsis || '',
        status: manga.data.status,
        rating: manga.data.score,
        genres: manga.data.genres?.map((g: any) => g.name) || [],
        authors: manga.data.authors?.map((a: any) => a.name) || [],
        artists: manga.data.authors?.map((a: any) => a.name) || [],
        yearReleased: manga.data.published?.from ? new Date(manga.data.published.from).getFullYear() : undefined,
        sourceId: this.id,
        url: manga.data.url
      };
    } catch (error) {
      console.error('Jikan details error:', error);
      throw error;
    }
  }

  async getChapters(_mangaId: string): Promise<any[]> {
    // MyAnimeList doesn't provide chapter data, return empty array
    return [];
  }
}