import { Router } from 'express';
import { MangaParser } from '../services/manga-parser.js';

const router = Router();

// POST /api/download/start
router.post('/start', async (req, res) => {
  try {
    const { sourceId, mangaId, title } = req.body;
    
    if (!sourceId || !mangaId || !title) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // For now, return a mock download ID
    // In a real implementation, this would start the actual download process
    const downloadId = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      downloadId,
      message: 'Download started successfully',
      status: 'started'
    });
  } catch (error) {
    console.error('Download start error:', error);
    res.status(500).json({ error: 'Failed to start download' });
  }
});

// GET /api/download/status/:downloadId
router.get('/status/:downloadId', (req, res) => {
  const { downloadId } = req.params;
  
  // Mock download progress
  // In a real implementation, this would check the actual download status
  res.json({
    downloadId,
    progress: {
      current: Math.floor(Math.random() * 100),
      total: 100,
      percentage: Math.floor(Math.random() * 100),
      status: 'downloading'
    }
  });
});

export default router;