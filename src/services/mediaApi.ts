/**
 * Astra 7 — Multimodal AI Media API Client
 * Interfaces with server-side /api/media/* endpoints for:
 * - AI Image Generation & Inpainting
 * - AI Video Generation (Veo 3.1) & Status Polling
 * - Multimodal Vision & Video Analysis
 * - Video Creation Workflows
 * - Live Models Directory & Gallery Store
 */

export interface GeneratedImageResponse {
  id: string;
  imageUrl: string;
  prompt: string;
  enhancedPrompt?: string;
  model: string;
  aspectRatio: string;
  createdAt: string;
}

export interface EditedImageResponse {
  id: string;
  imageUrl: string;
  originalUrl: string;
  instruction: string;
  model: string;
  createdAt: string;
}

export interface ImageAnalysisResponse {
  analysis: string;
  tags: string[];
  suggestedPrompts: string[];
  modelUsed: string;
}

export interface VideoAnalysisResponse {
  summary: string;
  keyMoments: Array<{ timestamp: string; title: string; description: string }>;
  captions: string[];
  modelUsed: string;
  formatSupported: boolean;
}

export interface VideoGenerationStartResponse {
  operationName: string;
  status: 'preparing' | 'generating';
  model: string;
  message: string;
}

export interface VideoStatusResponse {
  done: boolean;
  error?: any;
  status: 'preparing' | 'generating' | 'processing' | 'almost_ready' | 'completed' | 'failed';
}

export interface VideoWorkflowResponse {
  concept: string;
  script: string;
  scenes: Array<{
    sceneNumber: number;
    durationSeconds: number;
    visualPrompt: string;
    cameraMovement: string;
    narration: string;
    onScreenText: string;
  }>;
  voiceoverScript: string;
  thumbnailPrompt: string;
  musicMood: string;
}

export interface ModelCapabilityItem {
  id: string;
  name: string;
  provider: string;
  category:
    | 'AI CHAT'
    | 'AI IMAGE'
    | 'AI VIDEO'
    | 'AI AUDIO'
    | 'AI VOICE'
    | 'AI MUSIC'
    | 'AI CODING'
    | 'AI 3D'
    | 'AI DESIGN'
    | 'AI WRITING'
    | 'AI RESEARCH';
  status: 'Available' | 'New' | 'Popular' | 'Trending';
  capabilities: string[];
  limitations: string[];
  contextWindow?: string;
  pricingTier: 'Standard Free' | 'Pro Required' | 'Usage-Based';
  configured: boolean;
  recommendedUse: string;
}

export interface GalleryMediaItem {
  id: string;
  userId: string;
  mediaType: 'image' | 'video';
  url: string;
  originalUrl?: string;
  prompt: string;
  enhancedPrompt?: string;
  provider: string;
  model: string;
  style?: string;
  aspectRatio?: string;
  duration?: number;
  isFavorite?: boolean;
  createdAt: string;
}

export interface MediaUsageResponse {
  imagesGenerated: number;
  videosGenerated: number;
  activeJobs: number;
  storageUsedMb: number;
  quotaRemaining: number;
}

class MediaApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`/api/media${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errJson.error || `Media API request failed: ${res.status}`);
    }

    return res.json();
  }

  // 0. Robust Image Upload & Verification
  public async uploadImage(params: {
    base64Image: string;
    filename?: string;
    mimeType?: string;
    size?: number;
  }): Promise<{
    success: boolean;
    fileId: string;
    url: string;
    mimeType: string;
    size: number;
    filename: string;
    verifiedAt: string;
  }> {
    return this.request('/upload-image', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // 1. Text-to-Image Generation

  public async generateImage(params: {
    prompt: string;
    aspectRatio?: '1:1' | '4:5' | '16:9' | '9:16' | '3:4' | '4:3';
    style?: string;
    quality?: 'standard' | 'high';
    enhance?: boolean;
    userId?: string;
  }): Promise<GeneratedImageResponse> {
    return this.request<GeneratedImageResponse>('/generate-image', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // 2. Image Editing & Inpainting
  public async editImage(params: {
    base64Image: string;
    instruction: string;
    preserveSubject?: boolean;
    userId?: string;
  }): Promise<EditedImageResponse> {
    return this.request<EditedImageResponse>('/edit-image', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // 3. Vision Analysis
  public async analyzeImage(params: {
    base64Image: string;
    prompt?: string;
  }): Promise<ImageAnalysisResponse> {
    return this.request<ImageAnalysisResponse>('/analyze-image', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // 4. Video Analysis
  public async analyzeVideo(params: {
    videoName: string;
    videoSize: number;
    videoDuration?: number;
    prompt?: string;
    base64FrameSample?: string;
  }): Promise<VideoAnalysisResponse> {
    return this.request<VideoAnalysisResponse>('/analyze-video', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // 5. Veo Video Generation (Step 1: Start)
  public async generateVideo(params: {
    prompt: string;
    base64StartImage?: string;
    resolution?: '720p' | '1080p';
    aspectRatio?: '16:9' | '9:16';
    userId?: string;
  }): Promise<VideoGenerationStartResponse> {
    return this.request<VideoGenerationStartResponse>('/generate-video', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // 6. Veo Video Polling (Step 2: Status)
  public async pollVideoStatus(operationName: string): Promise<VideoStatusResponse> {
    return this.request<VideoStatusResponse>('/video-status', {
      method: 'POST',
      body: JSON.stringify({ operationName }),
    });
  }

  // 7. Veo Video Download (Step 3: Download / Blob URL)
  public async downloadVideoBlob(operationName: string): Promise<Blob> {
    const res = await fetch('/api/media/video-download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationName }),
    });

    if (!res.ok) {
      throw new Error('Failed to retrieve video stream from server.');
    }

    return res.blob();
  }

  // 8. Video Creation Workflow (Script -> Scenes -> Captions)
  public async createVideoWorkflow(params: {
    topic: string;
    targetDuration?: string;
    style?: string;
    aspectRatio?: '16:9' | '9:16';
  }): Promise<VideoWorkflowResponse> {
    return this.request<VideoWorkflowResponse>('/workflow', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // 9. Models Directory
  public async getModels(): Promise<ModelCapabilityItem[]> {
    const res = await this.request<{ models: ModelCapabilityItem[] }>('/models');
    return res.models;
  }

  // 10. Gallery Operations
  public async getGallery(filter?: 'all' | 'image' | 'video' | 'favorites'): Promise<GalleryMediaItem[]> {
    const query = filter ? `?filter=${filter}` : '';
    const res = await this.request<{ items: GalleryMediaItem[] }>(`/gallery${query}`);
    return res.items;
  }

  public async toggleFavorite(id: string): Promise<boolean> {
    const res = await this.request<{ isFavorite: boolean }>(`/gallery/${id}/favorite`, {
      method: 'POST',
    });
    return res.isFavorite;
  }

  public async deleteGalleryItem(id: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(`/gallery/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  }

  public async saveToGallery(item: Partial<GalleryMediaItem>): Promise<GalleryMediaItem> {
    const res = await this.request<{ item: GalleryMediaItem }>('/gallery', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return res.item;
  }

  // 11. Media Usage
  public async getUsage(userId = 'user-01'): Promise<MediaUsageResponse> {
    const res = await this.request<{ usage: MediaUsageResponse }>(`/usage?userId=${userId}`);
    return res.usage;
  }
}

export const mediaApi = new MediaApiService();
