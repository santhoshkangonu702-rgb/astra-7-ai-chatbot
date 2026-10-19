/**
 * Astra 7 — Music Router
 * Endpoints for searching authorized music catalogs across Indian regional and international languages.
 * Connects to live authorized preview streams via Apple iTunes and verified providers.
 */

import { Router, Request, Response } from 'express';
import { AstraMusicService } from './musicService';

export const musicRouter = Router();

// 1. Search Music Catalog (with live iTunes search and legitimate 30s previews)
musicRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const language = (req.query.language as string) || '';
    const limit = parseInt((req.query.limit as string) || '30', 10);
    const results = await AstraMusicService.searchAsync(q, language, limit);
    res.json(results);
  } catch (err: any) {
    console.error('[Music Router] search error:', err);
    res.status(500).json({ error: 'Music catalog search failed', details: err.message });
  }
});

// 2. Trending / Featured Music with dynamically verified live streams
musicRouter.get('/trending', async (req: Request, res: Response) => {
  try {
    const language = (req.query.language as string) || '';
    const tracks = await AstraMusicService.getTrendingAsync(language);
    res.json({
      tracks,
      total: tracks.length,
      hasPreviewCount: tracks.filter((t) => Boolean(t.playbackPreviewUrl)).length
    });
  } catch (err: any) {
    console.error('[Music Router] trending error:', err);
    res.status(500).json({ error: 'Failed to fetch trending music', details: err.message });
  }
});

// 3. Search Autocomplete Suggestions
musicRouter.get('/suggestions', (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const suggestions = AstraMusicService.getSuggestions(q);
    res.json({ suggestions });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch suggestions', details: err.message });
  }
});

// 4. Supported Languages
musicRouter.get('/languages', (_req: Request, res: Response) => {
  res.json({ languages: AstraMusicService.getLanguages() });
});
