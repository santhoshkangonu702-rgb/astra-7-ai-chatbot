/**
 * ASTRA 7 — Chat History & Persistence Service
 * ChatGPT-style conversation persistence, grouping, and search registry.
 * 
 * Supports user-scoped schema:
 * users/{userId}/chats
 * users/{userId}/searches
 * users/{userId}/savedChats
 * users/{userId}/pinnedChats
 */

import { Conversation, ChatMessage } from '../types';

export interface ChatSearchEntry {
  id: string;
  query: string;
  timestamp: string;
  conversationId?: string;
  category?: string;
}

export interface UserChatStorageSchema {
  userId: string;
  chats: Conversation[];
  searches: ChatSearchEntry[];
  savedChatIds: string[];
  pinnedChatIds: string[];
  archivedChatIds: string[];
  lastActiveConvId?: string;
}

const STORAGE_KEY_PREFIX = 'astra7_chat_vault_v1_';
const DEFAULT_USER_ID = 'astra-explorer';

export class ChatHistoryService {
  private userId: string;

  constructor(userId: string = DEFAULT_USER_ID) {
    this.userId = userId;
  }

  private getKey(): string {
    return `${STORAGE_KEY_PREFIX}${this.userId}`;
  }

  /**
   * Load complete state for the user
   */
  loadUserData(): UserChatStorageSchema {
    try {
      const raw = localStorage.getItem(this.getKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.chats) && parsed.chats.length > 0) {
          return {
            userId: this.userId,
            chats: parsed.chats,
            searches: Array.isArray(parsed.searches) ? parsed.searches : [],
            savedChatIds: Array.isArray(parsed.savedChatIds) ? parsed.savedChatIds : [],
            pinnedChatIds: Array.isArray(parsed.pinnedChatIds) ? parsed.pinnedChatIds : [],
            archivedChatIds: Array.isArray(parsed.archivedChatIds) ? parsed.archivedChatIds : [],
            lastActiveConvId: parsed.lastActiveConvId || parsed.chats[0]?.id
          };
        }
      }
    } catch (err) {
      console.warn('[Astra Chat History] Could not load from localStorage, initializing fresh:', err);
    }

    // Default seed conversation
    const defaultConv: Conversation = {
      id: 'conv-default',
      userId: this.userId,
      title: 'Astra 7 Assistant',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: 'gemini-2.5-flash',
      messages: [
        {
          id: 'msg-welcome',
          role: 'assistant',
          content: `### Welcome to Astra 7 — Nexus 2040 Intelligent Core\n\nI am engineered to provide fast, reliable, and grounded answers across all fields:\n\n- 🌍 **Astra Data Universe**: 15 integrated domains spanning Global, India, Earth, Science, Space, Future City, and Tech.\n- ⚡ **Grounded Live Research**: Real-time web and verified citations without hallucinated links.\n- 🎵 **Astra Music**: Authorized audio previews and high-speed streaming across all genres and languages.\n- 🎙️ **Voice AI**: Hands-free conversation with natural real-time speech recognition.\n- 🧮 **Step-by-Step Problem Solving**: Math proofs, engineering simulations, and coding architectures.\n\nType your question below, click the microphone to speak, or pick from popular queries!`,
          timestamp: new Date().toISOString(),
          category: 'GENERAL_KNOWLEDGE',
          suggestedActions: [
            'Explore Astra Data Universe',
            'Simulate Future City 2040 Blueprint',
            'Play Kesariya or trending Indian hits',
            'Explain Quantum Computing in Telugu (తెలుగులో వివరించండి)'
          ]
        }
      ]
    };

    return {
      userId: this.userId,
      chats: [defaultConv],
      searches: [
        { id: 'search-1', query: 'Future City Blueprint', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'search-2', query: 'Germany Universities', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 'search-3', query: 'AI Technology News', timestamp: new Date(Date.now() - 172800000).toISOString() }
      ],
      savedChatIds: [],
      pinnedChatIds: [],
      archivedChatIds: [],
      lastActiveConvId: defaultConv.id
    };
  }

  /**
   * Save complete user data
   */
  saveUserData(data: Partial<UserChatStorageSchema>): void {
    try {
      const current = this.loadUserData();
      const updated: UserChatStorageSchema = {
        ...current,
        ...data,
        userId: this.userId
      };
      localStorage.setItem(this.getKey(), JSON.stringify(updated));
    } catch (err) {
      console.warn('[Astra Chat History] Could not save to localStorage:', err);
    }
  }

  /**
   * Record a search entry into history without creating duplicates
   */
  recordSearch(query: string, conversationId?: string, category?: string): ChatSearchEntry[] {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return [];

    const current = this.loadUserData();
    const existingIndex = current.searches.findIndex(
      (s) => s.query.toLowerCase() === trimmed.toLowerCase()
    );

    let updatedSearches = [...current.searches];
    if (existingIndex >= 0) {
      // Move to top with updated timestamp
      const existing = updatedSearches[existingIndex];
      updatedSearches.splice(existingIndex, 1);
      updatedSearches.unshift({
        ...existing,
        timestamp: new Date().toISOString(),
        conversationId: conversationId || existing.conversationId
      });
    } else {
      updatedSearches.unshift({
        id: `search-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        query: trimmed,
        timestamp: new Date().toISOString(),
        conversationId,
        category
      });
    }

    // Keep top 40 searches
    updatedSearches = updatedSearches.slice(0, 40);
    this.saveUserData({ searches: updatedSearches });
    return updatedSearches;
  }

  /**
   * Delete single search entry
   */
  removeSearch(id: string): ChatSearchEntry[] {
    const current = this.loadUserData();
    const filtered = current.searches.filter((s) => s.id !== id);
    this.saveUserData({ searches: filtered });
    return filtered;
  }

  /**
   * Clear all searches
   */
  clearAllSearches(): void {
    this.saveUserData({ searches: [] });
  }

  /**
   * Smart automatic title generator from the user's first query
   * Example: "What is software engineering?" -> "Software Engineering Basics"
   * Example: "Create a Python calculator" -> "Python Calculator"
   */
  generateSmartTitle(firstMessage: string): string {
    if (!firstMessage || !firstMessage.trim()) return 'New Conversation';
    let text = firstMessage.trim();

    // Remove markdown symbols, quotes, multiple spaces
    text = text.replace(/[`*#_>~]/g, '').replace(/["']/g, '').replace(/\s+/g, ' ').trim();

    // Check specific question patterns
    const lower = text.toLowerCase();

    // "What is / What are / Define / Explain / How does ... work"
    const whatIsMatch = text.match(/^(?:what\s+(?:is|are)|explain|tell\s+me\s+about|define)\s+(.+?)(?:\?|$)/i);
    if (whatIsMatch && whatIsMatch[1]) {
      const topic = this.cleanTopic(whatIsMatch[1]);
      return `${this.capitalizeWords(topic)} Overview`;
    }

    // "How to / Build / Create / Write / Make"
    const actionMatch = text.match(/^(?:how\s+to\s+(?:create|build|write|make|code)|create|build|write|code|make)\s+(.+?)(?:\?|$)/i);
    if (actionMatch && actionMatch[1]) {
      const topic = this.cleanTopic(actionMatch[1]);
      return `${this.capitalizeWords(topic)}`;
    }

    // "Solve / Calculate / Prove"
    const mathMatch = text.match(/^(?:solve|calculate|evaluate|find|prove)\s+(.+?)(?:\?|$)/i);
    if (mathMatch && mathMatch[1]) {
      return `Math: ${mathMatch[1].slice(0, 30).trim()}`;
    }

    // "Compare X and Y"
    const compareMatch = text.match(/^(?:compare|difference\s+between)\s+(.+?)(?:\?|$)/i);
    if (compareMatch && compareMatch[1]) {
      return `Comparison: ${this.capitalizeWords(this.cleanTopic(compareMatch[1]))}`;
    }

    // Telugu prompt detector
    if (/[\u0C00-\u0C7F]/.test(text)) {
      const teWords = text.split(' ').slice(0, 5).join(' ');
      return `${teWords}... (తెలుగు)`;
    }

    // Hindi prompt detector
    if (/[\u0900-\u097F]/.test(text)) {
      const hiWords = text.split(' ').slice(0, 5).join(' ');
      return `${hiWords}... (हिंदी)`;
    }

    // Fallback: take first 4-6 meaningful words up to 36 chars
    const words = text.split(' ').filter(w => !['a', 'an', 'the', 'is', 'in', 'at', 'of', 'for', 'to', 'can', 'you', 'please'].includes(w.toLowerCase()));
    const title = words.slice(0, 5).join(' ').replace(/[?.!,:;]+$/, '');
    if (title.length > 38) {
      return title.slice(0, 35) + '...';
    }
    return this.capitalizeWords(title || 'Astra Discussion');
  }

  private cleanTopic(raw: string): string {
    return raw
      .replace(/^(?:a|an|the)\s+/i, '')
      .replace(/\s+(?:step\s+by\s+step|in\s+detail|please|with\s+code)$/i, '')
      .trim();
  }

  private capitalizeWords(str: string): string {
    return str
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
      .slice(0, 40);
  }
}

export const chatHistoryService = new ChatHistoryService();
