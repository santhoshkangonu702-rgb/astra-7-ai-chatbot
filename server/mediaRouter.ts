/**
 * Astra 7 — Multimodal Media API Router
 * Endpoints for AI Image & Video Studio, Vision Analysis, Veo Polling, and Gallery Management.
 */

import { Router, Request, Response } from 'express';
import { AstraMediaService } from './mediaService';

export const mediaRouter = Router();

// 0. Robust Image Upload & Verification Pipeline
mediaRouter.post('/upload-image', (req: Request, res: Response) => {
  try {
    const { base64Image, filename, mimeType, size } = req.body;
    if (!base64Image || typeof base64Image !== 'string') {
      return res.status(400).json({
        error: 'No image data was provided in the upload request.'
      });
    }

    // Extract mime type
    let detectedMime = mimeType || 'image/jpeg';
    let cleanBase64 = base64Image;
    if (base64Image.startsWith('data:')) {
      const match = base64Image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMime = match[1].toLowerCase();
        cleanBase64 = match[2];
      }
    }

    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(detectedMime)) {
      return res.status(415).json({
        error: `Unsupported image format (${detectedMime}). Astra 7 accepts JPG, JPEG, PNG, and WEBP.`
      });
    }

    // Size check
    const approximateBytes = Math.ceil((cleanBase64.length * 3) / 4);
    const maxBytes = 20 * 1024 * 1024; // 20MB
    if (approximateBytes > maxBytes) {
      return res.status(413).json({
        error: 'Image file size exceeds the 20MB limit. Please upload a smaller file.'
      });
    }

    const fileId = `img-up-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const verifiedUrl = base64Image.startsWith('data:') ? base64Image : `data:${detectedMime};base64,${cleanBase64}`;

    res.json({
      success: true,
      fileId,
      url: verifiedUrl,
      mimeType: detectedMime,
      size: size || approximateBytes,
      filename: filename || 'uploaded_image.jpg',
      verifiedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[Media Router] upload-image error:', err);
    res.status(500).json({
      error: 'Image upload failed. Please check your network connection and try again.'
    });
  }
});


// 1. Generate Image (Text -> Image)
mediaRouter.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio, style, quality, enhance, userId } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'A prompt is required for image generation.' });
    }

    const result = await AstraMediaService.generateImage({
      userId: userId || 'user-01',
      prompt: prompt.trim(),
      aspectRatio,
      style,
      quality,
      enhance: enhance !== false,
    });

    res.json(result);
  } catch (err: any) {
    console.error('[Media Router] generate-image error:', err);
    res.status(500).json({ error: err.message || 'Image generation failed.' });
  }
});

// 2. Edit Image (Image + Instruction -> Transformed Image)
mediaRouter.post('/edit-image', async (req: Request, res: Response) => {
  try {
    const { base64Image, instruction, preserveSubject, userId } = req.body;
    if (!base64Image || !instruction) {
      return res.status(400).json({ error: 'Both base64Image and editing instruction are required.' });
    }

    const result = await AstraMediaService.editImage({
      userId: userId || 'user-01',
      base64Image,
      instruction: instruction.trim(),
      preserveSubject: preserveSubject !== false,
    });

    res.json(result);
  } catch (err: any) {
    console.error('[Media Router] edit-image error:', err);
    res.status(500).json({ error: err.message || 'Image editing failed.' });
  }
});

// 3. Analyze Image (Multimodal Vision Breakdown)
mediaRouter.post('/analyze-image', async (req: Request, res: Response) => {
  try {
    const { base64Image, prompt } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: 'Image data is required for analysis.' });
    }

    const result = await AstraMediaService.analyzeImage({
      base64Image,
      prompt,
    });

    res.json(result);
  } catch (err: any) {
    console.error('[Media Router] analyze-image error:', err);
    res.status(500).json({ error: err.message || 'Image analysis failed.' });
  }
});

// 4. Analyze Video
mediaRouter.post('/analyze-video', async (req: Request, res: Response) => {
  try {
    const { videoName, videoSize, videoDuration, prompt, base64FrameSample } = req.body;
    if (!videoName) {
      return res.status(400).json({ error: 'Video metadata is required for analysis.' });
    }

    const result = await AstraMediaService.analyzeVideo({
      videoName,
      videoSize: videoSize || 1024 * 1024,
      videoDuration,
      prompt: prompt || 'Summarize this video and identify key moments.',
      base64FrameSample,
    });

    res.json(result);
  } catch (err: any) {
    console.error('[Media Router] analyze-video error:', err);
    res.status(500).json({ error: err.message || 'Video analysis failed.' });
  }
});

// 5. Start Veo Video Generation
mediaRouter.post('/generate-video', async (req: Request, res: Response) => {
  try {
    const { prompt, base64StartImage, resolution, aspectRatio, userId } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A prompt is required for video generation.' });
    }

    const result = await AstraMediaService.startVideoGeneration({
      userId: userId || 'user-01',
      prompt: prompt.trim(),
      base64StartImage,
      resolution,
      aspectRatio,
    });

    res.json(result);
  } catch (err: any) {
    console.error('[Media Router] generate-video error:', err);
    res.status(500).json({ error: err.message || 'Video generation initiation failed.' });
  }
});

// 6. Poll Veo Video Generation Status
mediaRouter.post('/video-status', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required.' });
    }

    const result = await AstraMediaService.pollVideoStatus(operationName);
    res.json(result);
  } catch (err: any) {
    console.error('[Media Router] video-status error:', err);
    res.status(500).json({ error: err.message || 'Failed to poll video status.' });
  }
});

// 7. Download Veo Video
mediaRouter.post('/video-download', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required.' });
    }

    const { downloadUri, apiKey } = await AstraMediaService.getVideoDownloadUri(operationName);

    // Fetch video stream securely server-side using Gemini key
    const videoRes = await fetch(downloadUri, {
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!videoRes.ok) {
      return res.status(videoRes.status).json({ error: 'Failed to retrieve video stream from provider.' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="astra7-generated-video.mp4"');

    const arrayBuffer = await videoRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err: any) {
    console.error('[Media Router] video-download error:', err);
    res.status(500).json({ error: err.message || 'Failed to stream video.' });
  }
});

// 8. Video Creation Workflow (Idea -> Script -> Scene Plan -> Captions)
mediaRouter.post('/workflow', async (req: Request, res: Response) => {
  try {
    const { topic, targetDuration, style, aspectRatio } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required for video workflow planning.' });
    }

    const result = await AstraMediaService.createVideoWorkflow({
      topic,
      targetDuration,
      style,
      aspectRatio,
    });

    res.json(result);
  } catch (err: any) {
    console.error('[Media Router] workflow error:', err);
    res.status(500).json({ error: err.message || 'Video workflow blueprint generation failed.' });
  }
});

// 9. Trending AI Models & Tools Directory
mediaRouter.get('/models', (req: Request, res: Response) => {
  const models = AstraMediaService.getModelsDirectory();
  res.json({ models });
});

// 10. Gallery Management
mediaRouter.get('/gallery', (req: Request, res: Response) => {
  const filter = req.query.filter as any;
  const items = AstraMediaService.getGallery(filter);
  res.json({ items });
});

mediaRouter.post('/gallery', (req: Request, res: Response) => {
  const item = req.body;
  const saved = AstraMediaService.saveToGallery(item);
  res.json({ item: saved });
});

mediaRouter.post('/gallery/:id/favorite', (req: Request, res: Response) => {
  const { id } = req.params;
  const isFavorite = AstraMediaService.toggleFavorite(id);
  res.json({ success: true, id, isFavorite });
});

mediaRouter.delete('/gallery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const success = AstraMediaService.deleteGalleryItem(id);
  res.json({ success, id });
});

// 11. Media Usage Statistics
mediaRouter.get('/usage', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user-01';
  const usage = AstraMediaService.getMediaUsage(userId);
  res.json({ usage });
});
