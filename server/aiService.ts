/**
 * Astra 7 — Modular AI Service Layer
 * Abstracted interface and implementation for LLM generation and streaming.
 * Provides model fallback cascades, schema-compliant multi-turn conversation formatting,
 * and decoupling of LLM providers.
 */

import { GoogleGenAI } from '@google/genai';

export interface ChatTurn {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export interface StreamGenerationOptions {
  model?: string;
  systemInstruction?: string;
  temperature?: number;
  history?: ChatTurn[];
  userMemories?: string[];
  tools?: any[];
  toolConfig?: any;
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onComplete: (fullText: string, modelUsed: string) => void;
  onError: (error: Error) => void;
}

export interface IAIService {
  generateStream(
    prompt: string,
    options: StreamGenerationOptions,
    callbacks: StreamCallbacks
  ): Promise<void>;
  generate(
    prompt: string,
    options?: { model?: string; systemInstruction?: string; temperature?: number; responseMimeType?: string }
  ): Promise<{ text: string; modelUsed: string }>;
}

export class GeminiAIService implements IAIService {
  private getClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }

  /**
   * Builds strict alternating contents schema required by Gemini
   * [ { role: 'user', parts: [...] }, { role: 'model', parts: [...] }, ... ]
   * Ensures the first turn is always 'user' and never contains consecutive identical roles.
   */
  public formatConversationHistory(history: ChatTurn[], currentPrompt: string): any[] {
    const contents: any[] = [];
    let lastRole: string | null = null;

    // Filter and take recent history (last 12 turns)
    const validTurns = (history || []).slice(-12).filter(t => t.content && t.content.trim());

    for (const turn of validTurns) {
      const role = turn.role === 'assistant' || turn.role === 'model' ? 'model' : 'user';

      // Gemini schema requires first message to be 'user'
      if (contents.length === 0 && role === 'model') {
        continue;
      }

      if (role === lastRole) {
        // Merge consecutive messages of the same role
        const prevTurn = contents[contents.length - 1];
        prevTurn.parts[0].text += `\n\n${turn.content.trim()}`;
      } else {
        contents.push({
          role,
          parts: [{ text: turn.content.trim() }]
        });
        lastRole = role;
      }
    }

    // Append current user prompt
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts[0].text += `\n\n${currentPrompt.trim()}`;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: currentPrompt.trim() }]
      });
    }

    return contents;
  }

  /**
   * Streams response with model fallback cascade
   */
  public async generateStream(
    prompt: string,
    options: StreamGenerationOptions,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const client = this.getClient();
    if (!client) {
      throw new Error('GEMINI_API_KEY is not configured on the server. Please add your key to continue.');
    }

    const requestedModel = options.model || 'gemini-2.5-flash';
    const candidateModels = Array.from(
      new Set([
        requestedModel,
        'gemini-2.5-flash',
        'gemini-flash-latest',
        'gemini-2.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-3.8-flash'
      ].filter(Boolean) as string[])
    );

    const contents = this.formatConversationHistory(options.history || [], prompt);

    // Build system instruction including user memories if present
    let finalSystemInstruction = options.systemInstruction || 'You are Astra 7, a fast, accurate, multi-purpose AI assistant.';
    if (options.userMemories && options.userMemories.length > 0) {
      finalSystemInstruction += `\n\n[USER PERSONALIZED MEMORY & SAVED CONTEXT]:\nThe user has saved the following personal preferences and project facts into your memory:\n${options.userMemories.map(m => `• ${m}`).join('\n')}\nUse this context to personalize your responses naturally when relevant.`;
    }

    let fullText = '';
    let successfullyStreamed = false;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const stream = await client.models.generateContentStream({
          model: modelName,
          contents,
          config: {
            systemInstruction: finalSystemInstruction,
            temperature: options.temperature ?? 0.7,
            ...(options.tools ? { tools: options.tools } : {}),
            ...(options.toolConfig ? { toolConfig: options.toolConfig } : {})
          }
        });

        for await (const chunk of stream) {
          const chunkText = chunk.text || '';
          if (chunkText) {
            fullText += chunkText;
            callbacks.onChunk(chunkText);
          }
        }

        callbacks.onComplete(fullText, modelName);
        successfullyStreamed = true;
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[Astra 7 AI] Stream attempt on ${modelName} encountered: ${err?.message}. Cascading to next candidate...`);
        // If we already yielded some text to the client, do not restart stream to avoid mixed text
        if (fullText.length > 0) {
          callbacks.onComplete(fullText, modelName);
          return;
        }
      }
    }

    if (!successfullyStreamed) {
      callbacks.onError(lastError || new Error('Failed to generate streaming response from AI provider.'));
    }
  }

  /**
   * Synchronous generation with fallback cascade
   */
  public async generate(
    prompt: string,
    options?: { model?: string; systemInstruction?: string; temperature?: number; responseMimeType?: string }
  ): Promise<{ text: string; modelUsed: string }> {
    const client = this.getClient();
    if (!client) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const requestedModel = options?.model || 'gemini-2.5-flash';
    const candidateModels = Array.from(
      new Set([
        requestedModel,
        'gemini-2.5-flash',
        'gemini-flash-latest',
        'gemini-2.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-3.8-flash'
      ].filter(Boolean) as string[])
    );

    for (const modelName of candidateModels) {
      try {
        const response = await client.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            ...(options?.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
            ...(options?.temperature !== undefined ? { temperature: options.temperature } : {}),
            ...(options?.responseMimeType ? { responseMimeType: options.responseMimeType } : {})
          }
        });

        if (response && response.text) {
          return { text: response.text, modelUsed: modelName };
        }
      } catch (err: any) {
        continue;
      }
    }

    throw new Error('Failed to generate response across all model candidates.');
  }
}

// Export singleton instance of the AI service layer
export const astraAIService: IAIService = new GeminiAIService();
