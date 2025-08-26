import { Router } from 'express';
import { MangaParser } from '../services/manga-parser.js';
import { WorkingMangaSource } from '../sources/working-manga.js';
import { MangaDxSource } from '../sources/mangadx.js';
import { MangaParkSource } from '../sources/mangapark.js';

const router = Router();
const parser = new MangaParser();

// Register reliable manga sources
parser.addSource(new WorkingMangaSource());
parser.addSource(new MangaDxSource());
parser.addSource(new MangaParkSource());

// Get available sources
router.get('/sources', (req, res) => {
  const sources = parser.getSources().map(source => ({
    id: source.id,
    name: source.name,
    baseUrl: source.baseUrl,
    language: source.language
  }));
  res.json(sources);
});

// Search manga across all sources
router.get('/search', async (req, res) => {
  try {
    const { query, source } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = await parser.search(query as string, source as string);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search manga' });
  }
});

// Get popular manga from a source
router.get('/popular', async (req, res) => {
  try {
    const { source = 'working-manga', page = '1' } = req.query;
    
    const results = await parser.getPopular(source as string, parseInt(page as string));
    res.json(results);
  } catch (error) {
    console.error('Popular manga error:', error);
    res.status(500).json({ error: 'Failed to get popular manga' });
  }
});

// Get manga details
router.get('/details/:sourceId/:mangaId', async (req, res) => {
  try {
    const { sourceId, mangaId } = req.params;
    
    const details = await parser.getMangaDetails(sourceId, mangaId);
    res.json(details);
  } catch (error) {
    console.error('Manga details error:', error);
    res.status(500).json({ error: 'Failed to get manga details' });
  }
});

// Get manga chapters
router.get('/chapters/:sourceId/:mangaId', async (req, res) => {
  try {
    const { sourceId, mangaId } = req.params;
    
    const chapters = await parser.getChapters(sourceId, mangaId);
    res.json(chapters);
  } catch (error) {
    console.error('Chapters error:', error);
    res.status(500).json({ error: 'Failed to get chapters' });
  }
});

export default router;