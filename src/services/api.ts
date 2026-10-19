/**
 * Astra 7 — Client API Service
 * Handles server-side API communication
 */

import { HistoricalObject, DatabaseStats, AIProviderConfig, UserMemoryItem } from '../types';

export const api = {
  // Historical Objects
  async getObjects(params: {
    q?: string;
    civilization?: string;
    status?: string;
    material?: string;
    verification?: string;
    start_year?: number;
    end_year?: number;
    page?: number;
    limit?: number;
  } = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.civilization) query.set('civilization', params.civilization);
    if (params.status) query.set('status', params.status);
    if (params.material) query.set('material', params.material);
    if (params.verification) query.set('verification', params.verification);
    if (params.start_year !== undefined) query.set('start_year', String(params.start_year));
    if (params.end_year !== undefined) query.set('end_year', String(params.end_year));
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const res = await fetch(`/api/objects?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch historical objects');
    return res.json() as Promise<{
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      objects: HistoricalObject[];
    }>;
  },

  async getObjectById(id: string) {
    const res = await fetch(`/api/objects/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch object');
    return res.json() as Promise<{
      object: HistoricalObject;
      related: HistoricalObject[];
    }>;
  },

  async getDatabaseStats(): Promise<DatabaseStats> {
    const res = await fetch('/api/objects/stats');
    if (!res.ok) throw new Error('Failed to fetch database stats');
    return res.json();
  },

  async createObject(data: Partial<HistoricalObject>) {
    const res = await fetch('/api/objects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create object');
    }
    return res.json();
  },

  async updateObject(id: string, updates: Partial<HistoricalObject> & { changed_by?: string; reason?: string }) {
    const res = await fetch(`/api/objects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update object');
    }
    return res.json();
  },

  async bulkImportObjects(items: any[], format: 'json' | 'csv') {
    const res = await fetch('/api/objects/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, format })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Import failed');
    }
    return res.json();
  },

  async getTimeline() {
    const res = await fetch('/api/timeline');
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return res.json();
  },

  async getMapLocations() {
    const res = await fetch('/api/map');
    if (!res.ok) throw new Error('Failed to fetch map data');
    return res.json();
  },

  // Astra Chat & Streaming Multi-Purpose Assistant
  async sendChat(
    message: string,
    history: any[] = [],
    model?: string,
    options?: {
      forceWebSearch?: boolean;
      documentId?: string;
      language?: string;
    }
  ) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        model,
        forceWebSearch: options?.forceWebSearch,
        documentId: options?.documentId,
        language: options?.language
      })
    });
    if (!res.ok) throw new Error('Chat generation failed');
    return res.json();
  },

  async streamChat(
    params: {
      message: string;
      history?: any[];
      forceWebSearch?: boolean;
      documentId?: string;
      language?: string;
      userMemories?: string[];
      answerLength?: 'short' | 'balanced' | 'detailed' | 'deep';
    },
    callbacks: {
      onChunk: (text: string) => void;
      onStatus?: (status: { step: string; label: string }) => void;
      onRoute?: (route: any) => void;
      onSources?: (sources: any[]) => void;
      onDocumentChunks?: (chunks: any[]) => void;
      onDone?: (meta: any) => void;
      onError?: (err: any) => void;
    },
    signal?: AbortSignal
  ) {
    const res = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal
    });

    if (!res.ok) {
      throw new Error(`Streaming failed with status: ${res.status}`);
    }

    if (!res.body) {
      throw new Error('ReadableStream not supported by browser environment');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          if (!block.trim()) continue;
          let eventType = 'message';
          let dataStr = '';

          const blockLines = block.split('\n');
          for (const line of blockLines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              dataStr = line.slice(6).trim();
            }
          }

          if (!dataStr) continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (eventType === 'chunk' && parsed.text) {
              callbacks.onChunk(parsed.text);
            } else if (eventType === 'status') {
              callbacks.onStatus?.(parsed);
            } else if (eventType === 'route') {
              callbacks.onRoute?.(parsed);
            } else if (eventType === 'sources') {
              callbacks.onSources?.(parsed.sources || []);
            } else if (eventType === 'documentChunks') {
              callbacks.onDocumentChunks?.(parsed.chunks || []);
            } else if (eventType === 'done') {
              callbacks.onDone?.(parsed);
            } else if (eventType === 'error') {
              callbacks.onError?.(parsed);
            }
          } catch (e) {
            // non-json line
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },

  async universalSearch(query: string, options?: { answerLength?: 'short' | 'balanced' | 'detailed' | 'deep'; forceSearch?: boolean }) {
    const res = await fetch('/api/search/universal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        answerLength: options?.answerLength || 'balanced',
        forceSearch: options?.forceSearch || false
      })
    });
    if (!res.ok) throw new Error('Universal search query failed');
    return res.json();
  },

  async uploadDocument(name: string, content: string, type = 'text/plain', size?: number) {
    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content, type, size: size || content.length })
    });
    if (!res.ok) throw new Error('Document indexing failed');
    return res.json();
  },

  async classifyQuery(q: string, hasAttachments = false, forceSearch = false) {
    const params = new URLSearchParams({
      q,
      hasAttachments: String(hasAttachments),
      forceSearch: String(forceSearch)
    });
    const res = await fetch(`/api/router/classify?${params.toString()}`);
    if (!res.ok) throw new Error('Classification failed');
    return res.json();
  },

  async sendChatMessage(params: { message: string; systemInstruction?: string; history?: any[] }) {
    const res = await this.sendChat(params.message, params.history);
    return {
      content: res.content || res.response || '',
      response: res.content || res.response || ''
    };
  },

  // Astra Search
  async searchWeb(query: string, mode: 'quick' | 'deep' | 'fact_check' | 'source_explorer' = 'deep') {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode })
    });
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  // Astra Scholar
  async scholarRequest(params: {
    topic: string;
    subject?: string;
    difficulty?: string;
    action?: 'explain' | 'generate_quiz';
  }) {
    const res = await fetch('/api/scholar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Scholar operation failed');
    return res.json();
  },

  // Astra Create
  async createContent(params: {
    tool: string;
    prompt: string;
    tone?: string;
    length?: string;
    language?: string;
  }) {
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Create generation failed');
    return res.json();
  },

  // Astra Vision
  async analyzeVision(imageBase64: string, mimeType: string, prompt?: string) {
    const res = await fetch('/api/vision/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType, prompt })
    });
    if (!res.ok) throw new Error('Vision analysis failed');
    return res.json();
  },

  // Astra Data
  async analyzeData(csvText: string, fileName?: string) {
    const res = await fetch('/api/data/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvText, fileName })
    });
    if (!res.ok) throw new Error('Data analysis failed');
    return res.json();
  },

  // AI Configuration Settings
  async getAISettings(): Promise<AIProviderConfig> {
    const res = await fetch('/api/settings/ai');
    if (!res.ok) throw new Error('Failed to load AI settings');
    return res.json();
  },

  async updateAISettings(settings: Partial<AIProviderConfig>) {
    const res = await fetch('/api/settings/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update AI settings');
    return res.json();
  },

  // Astra 7 Code Assistant
  async assistCode(params: {
    code?: string;
    language: string;
    action: string;
    targetLanguage?: string;
    prompt?: string;
  }) {
    const res = await fetch('/api/code/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Code assistant failed');
    return res.json();
  },

  // Astra 7 Idea Generator
  async generateIdeas(params: {
    category: string;
    topic: string;
    audience?: string;
    skillLevel?: string;
  }) {
    const res = await fetch('/api/ideas/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Idea generation failed');
    return res.json();
  },

  // Astra 7 Study Suite
  async performStudyAction(params: {
    action: 'explain' | 'notes' | 'flashcards' | 'quiz' | 'problem_solve' | 'planner';
    topic: string;
    subject?: string;
    difficulty?: string;
    query?: string;
  }) {
    const res = await fetch('/api/study/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Study assistant action failed');
    return res.json();
  },

  // Astra 7 User Context & Memory
  async getUserMemories(userId = 'user-01') {
    const res = await fetch(`/api/user/memories?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to load user memories');
    return res.json() as Promise<{ memories: UserMemoryItem[] }>;
  },

  async addUserMemory(memory: { category: string; content: string; userId?: string }) {
    const res = await fetch('/api/user/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory)
    });
    if (!res.ok) throw new Error('Failed to save memory');
    return res.json();
  },

  async deleteUserMemory(id: string) {
    const res = await fetch(`/api/user/memories/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete memory');
    return res.json();
  },

  async clearUserMemories(userId = 'user-01') {
    const res = await fetch(`/api/user/memories?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to clear memories');
    return res.json();
  },

  // Astra 7 Unified Workspace APIs
  async generateNavigatorPlan(goal: string) {
    const res = await fetch('/api/navigator/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal })
    });
    if (!res.ok) throw new Error('Navigator planning request failed');
    return res.json();
  },

  async verifyFact(claim: string) {
    const res = await fetch('/api/factcheck/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim })
    });
    if (!res.ok) throw new Error('Fact verification request failed');
    return res.json();
  },

  async getDailyBriefing(category = 'Technology', edition = 'morning') {
    const res = await fetch(`/api/briefing/daily?category=${encodeURIComponent(category)}&edition=${encodeURIComponent(edition)}`);
    if (!res.ok) throw new Error('Daily briefing fetch failed');
    return res.json();
  },

  async generateSmartPlan(prompt: string, days = 20) {
    const res = await fetch('/api/planner/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, days })
    });
    if (!res.ok) throw new Error('Smart planner request failed');
    return res.json();
  },

  async generateGoalCoachRoadmap(goal: string) {
    const res = await fetch('/api/goalcoach/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal })
    });
    if (!res.ok) throw new Error('Goal coach request failed');
    return res.json();
  },

  async processMeetingTranscript(transcript: string, title?: string) {
    const res = await fetch('/api/meeting/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, title })
    });
    if (!res.ok) throw new Error('Meeting summarization failed');
    return res.json();
  },

  async generateDocument(template: string, topic: string, instructions?: string) {
    const res = await fetch('/api/documents/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template, topic, instructions })
    });
    if (!res.ok) throw new Error('Document generation failed');
    return res.json();
  },

  async executeEverythingPipeline(prompt: string) {
    const res = await fetch('/api/everything/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('Everything workspace execution failed');
    return res.json();
  }
};
