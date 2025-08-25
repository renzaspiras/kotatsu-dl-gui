import axios, { AxiosInstance, AxiosResponse } from 'axios'
import * as cheerio from 'cheerio'

export interface MangaSource {
  id: string
  name: string
  baseUrl: string
  searchPath: string
  supportedLanguages: string[]
}

export interface MangaSearchResult {
  id: string
  title: string
  description?: string
  coverUrl?: string
  url: string
  source: string
  status?: 'ongoing' | 'completed' | 'hiatus'
  chapters?: number
}

export interface MangaDetails extends MangaSearchResult {
  chapters: ChapterInfo[]
  genres: string[]
  author?: string
  artist?: string
  year?: number
}

export interface ChapterInfo {
  id: string
  title: string
  number: number
  url: string
  date?: Date
  pages?: string[]
}

export abstract class BaseMangaParser {
  protected client: AxiosInstance
  protected source: MangaSource

  constructor(source: MangaSource) {
    this.source = source
    this.client = axios.create({
      baseURL: source.baseUrl,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
  }

  abstract search(query: string): Promise<MangaSearchResult[]>
  abstract getMangaDetails(mangaId: string): Promise<MangaDetails>
  abstract getChapterPages(chapterId: string): Promise<string[]>

  protected async fetchHTML(url: string): Promise<cheerio.CheerioAPI> {
    const response: AxiosResponse<string> = await this.client.get(url)
    return cheerio.load(response.data)
  }

  protected normalizeUrl(url: string): string {
    if (url.startsWith('http')) {
      return url
    }
    if (url.startsWith('//')) {
      return 'https:' + url
    }
    if (url.startsWith('/')) {
      return this.source.baseUrl + url
    }
    return this.source.baseUrl + '/' + url
  }
}

// Example parser for a generic manga site
export class GenericMangaParser extends BaseMangaParser {
  async search(query: string): Promise<MangaSearchResult[]> {
    try {
      const searchUrl = `${this.source.searchPath}?q=${encodeURIComponent(query)}`
      const $ = await this.fetchHTML(searchUrl)
      
      const results: MangaSearchResult[] = []
      
      // This is a generic implementation - each site would need its own selectors
      $('.search-result').each((_, element) => {
        const $el = $(element)
        const title = $el.find('.title').text().trim()
        const url = $el.find('a').attr('href')
        const coverUrl = $el.find('img').attr('src')
        const description = $el.find('.description').text().trim()
        
        if (title && url) {
          results.push({
            id: this.extractIdFromUrl(url),
            title,
            description: description || undefined,
            coverUrl: coverUrl ? this.normalizeUrl(coverUrl) : undefined,
            url: this.normalizeUrl(url),
            source: this.source.id
          })
        }
      })
      
      return results
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  }

  async getMangaDetails(mangaId: string): Promise<MangaDetails> {
    const mangaUrl = `/manga/${mangaId}`
    const $ = await this.fetchHTML(mangaUrl)
    
    const title = $('h1.manga-title').text().trim()
    const description = $('.manga-description').text().trim()
    const coverUrl = $('.manga-cover img').attr('src')
    const author = $('.manga-author').text().trim()
    const status = $('.manga-status').text().trim().toLowerCase()
    
    const chapters: ChapterInfo[] = []
    $('.chapter-list .chapter-item').each((_, element) => {
      const $el = $(element)
      const chapterTitle = $el.find('.chapter-title').text().trim()
      const chapterUrl = $el.find('a').attr('href')
      const chapterNumber = this.extractChapterNumber(chapterTitle)
      
      if (chapterTitle && chapterUrl) {
        chapters.push({
          id: this.extractIdFromUrl(chapterUrl),
          title: chapterTitle,
          number: chapterNumber,
          url: this.normalizeUrl(chapterUrl)
        })
      }
    })
    
    return {
      id: mangaId,
      title,
      description,
      coverUrl: coverUrl ? this.normalizeUrl(coverUrl) : undefined,
      url: this.normalizeUrl(mangaUrl),
      source: this.source.id,
      status: this.normalizeStatus(status),
      chapters: chapters.reverse(), // Usually chapters are listed newest first
      genres: this.extractGenres($),
      author: author || undefined
    }
  }

  async getChapterPages(chapterId: string): Promise<string[]> {
    const chapterUrl = `/chapter/${chapterId}`
    const $ = await this.fetchHTML(chapterUrl)
    
    const pages: string[] = []
    
    // Method 1: Direct image tags
    $('.page-image img').each((_, element) => {
      const src = $(element).attr('src')
      if (src) {
        pages.push(this.normalizeUrl(src))
      }
    })
    
    // Method 2: JavaScript data (common pattern)
    if (pages.length === 0) {
      const scriptContent = $('script:contains("pages")').html()
      if (scriptContent) {
        const pagesMatch = scriptContent.match(/pages\s*[:=]\s*(\[.*?\])/)
        if (pagesMatch) {
          try {
            const pagesArray = JSON.parse(pagesMatch[1])
            pages.push(...pagesArray.map((url: string) => this.normalizeUrl(url)))
          } catch (error) {
            console.error('Failed to parse pages from script:', error)
          }
        }
      }
    }
    
    return pages
  }

  private extractIdFromUrl(url: string): string {
    const match = url.match(/\/(\d+|[a-zA-Z0-9-_]+)\/?$/)
    return match ? match[1] : url
  }

  private extractChapterNumber(title: string): number {
    const match = title.match(/(?:chapter|ch\.?)\s*(\d+(?:\.\d+)?)/i)
    return match ? parseFloat(match[1]) : 0
  }

  private normalizeStatus(status: string): 'ongoing' | 'completed' | 'hiatus' | undefined {
    const lowercaseStatus = status.toLowerCase()
    if (lowercaseStatus.includes('ongoing') || lowercaseStatus.includes('publishing')) {
      return 'ongoing'
    }
    if (lowercaseStatus.includes('completed') || lowercaseStatus.includes('finished')) {
      return 'completed'
    }
    if (lowercaseStatus.includes('hiatus') || lowercaseStatus.includes('paused')) {
      return 'hiatus'
    }
    return undefined
  }

  private extractGenres($: cheerio.CheerioAPI): string[] {
    const genres: string[] = []
    $('.manga-genres .genre').each((_, element) => {
      const genre = $(element).text().trim()
      if (genre) {
        genres.push(genre)
      }
    })
    return genres
  }
}

// Manga sources registry
export class MangaSourceRegistry {
  private parsers: Map<string, BaseMangaParser> = new Map()

  registerSource(source: MangaSource, parser: BaseMangaParser) {
    this.parsers.set(source.id, parser)
  }

  getParser(sourceId: string): BaseMangaParser | undefined {
    return this.parsers.get(sourceId)
  }

  getAllSources(): MangaSource[] {
    return Array.from(this.parsers.keys()).map(id => {
      const parser = this.parsers.get(id)!
      return (parser as any).source
    })
  }

  async searchAll(query: string): Promise<MangaSearchResult[]> {
    const results: MangaSearchResult[] = []
    
    for (const parser of this.parsers.values()) {
      try {
        const sourceResults = await parser.search(query)
        results.push(...sourceResults)
      } catch (error) {
        console.error(`Search failed for source ${(parser as any).source.id}:`, error)
      }
    }
    
    return results
  }
}

// Initialize default sources
export const mangaRegistry = new MangaSourceRegistry()

// Example sources (these would need actual implementation)
const exampleSources: MangaSource[] = [
  {
    id: 'mangadex',
    name: 'MangaDex',
    baseUrl: 'https://mangadex.org',
    searchPath: '/search',
    supportedLanguages: ['en', 'ja', 'es', 'fr']
  },
  {
    id: 'mangakakalot',
    name: 'Mangakakalot',
    baseUrl: 'https://mangakakalot.com',
    searchPath: '/search',
    supportedLanguages: ['en']
  }
]

// Register example parsers
exampleSources.forEach(source => {
  mangaRegistry.registerSource(source, new GenericMangaParser(source))
})