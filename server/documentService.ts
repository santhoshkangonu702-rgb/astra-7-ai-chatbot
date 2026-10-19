/**
 * Astra 7 — Document Intelligence & RAG Retrieval Engine
 * Supports PDF, TXT, CSV, DOCX, and image parsing with chunking and semantic relevance scoring.
 */

export interface DocumentChunk {
  id: string;
  docId: string;
  docName: string;
  chunkIndex: number;
  text: string;
  wordCount: number;
  relevanceScore?: number;
}

export interface ParsedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  fullText: string;
  chunks: DocumentChunk[];
  summary?: string;
  keyTopics?: string[];
  uploadedAt: string;
}

export class AstraDocumentService {
  private static store: Map<string, ParsedDocument> = new Map();

  /**
   * Split text into semantic chunks of roughly targetWords with overlap
   */
  public static chunkText(
    text: string,
    docId: string,
    docName: string,
    targetWords = 350,
    overlapWords = 50
  ): DocumentChunk[] {
    const cleaned = text.replace(/\r\n/g, '\n').trim();
    if (!cleaned) return [];

    // Split by paragraphs first
    const paragraphs = cleaned.split(/\n\s*\n/);
    const chunks: DocumentChunk[] = [];
    let currentChunkWords: string[] = [];
    let chunkIndex = 0;

    for (const para of paragraphs) {
      const words = para.split(/\s+/).filter(Boolean);
      if (words.length === 0) continue;

      if (currentChunkWords.length + words.length > targetWords && currentChunkWords.length > 0) {
        // Create chunk
        chunks.push({
          id: `${docId}-chunk-${chunkIndex}`,
          docId,
          docName,
          chunkIndex,
          text: currentChunkWords.join(' '),
          wordCount: currentChunkWords.length
        });
        chunkIndex++;

        // Keep overlap words for semantic continuity
        currentChunkWords = currentChunkWords.slice(-overlapWords).concat(words);
      } else {
        currentChunkWords.push(...words);
      }
    }

    if (currentChunkWords.length > 0) {
      chunks.push({
        id: `${docId}-chunk-${chunkIndex}`,
        docId,
        docName,
        chunkIndex,
        text: currentChunkWords.join(' '),
        wordCount: currentChunkWords.length
      });
    }

    return chunks;
  }

  /**
   * Store and index an uploaded document
   */
  public static indexDocument(
    name: string,
    type: string,
    size: number,
    content: string
  ): ParsedDocument {
    const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const chunks = this.chunkText(content, id, name);

    // Extract quick title & summary preview
    const firstFewLines = content.slice(0, 300).trim();
    const doc: ParsedDocument = {
      id,
      name,
      type,
      size,
      fullText: content,
      chunks,
      summary: `Document containing ${chunks.length} section(s) and ~${content.split(/\s+/).length} words. First section preview: "${firstFewLines.slice(0, 120)}..."`,
      uploadedAt: new Date().toISOString()
    };

    this.store.set(id, doc);
    return doc;
  }

  /**
   * Retrieve document by ID
   */
  public static getDocument(id: string): ParsedDocument | undefined {
    return this.store.get(id);
  }

  /**
   * Search relevant chunks across all stored documents or a specific document using TF-IDF / term overlap
   */
  public static retrieveRelevantChunks(
    query: string,
    docId?: string,
    topK = 4
  ): DocumentChunk[] {
    const queryTerms = query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2);

    if (queryTerms.length === 0) return [];

    let pool: DocumentChunk[] = [];
    if (docId && this.store.has(docId)) {
      pool = this.store.get(docId)!.chunks;
    } else {
      for (const doc of this.store.values()) {
        pool.push(...doc.chunks);
      }
    }

    // Score chunks
    const scored = pool.map((chunk) => {
      const chunkLower = chunk.text.toLowerCase();
      let score = 0;

      for (const term of queryTerms) {
        if (chunkLower.includes(term)) {
          // Count occurrences
          const regex = new RegExp(`\\b${term}\\b`, 'g');
          const matches = (chunkLower.match(regex) || []).length;
          score += matches > 0 ? matches * 2 : 1;
        }
      }

      return {
        ...chunk,
        relevanceScore: score
      };
    });

    // Filter chunks with score > 0 and sort descending
    return scored
      .filter((c) => (c.relevanceScore || 0) > 0)
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, topK);
  }

  /**
   * Format chunks into RAG context string for Gemini prompt
   */
  public static buildRAGContext(chunks: DocumentChunk[]): string {
    if (chunks.length === 0) return '';

    const lines: string[] = [
      '\n[DOCUMENT INTELLIGENCE — RELEVANT EXCERPTS FROM USER UPLOADED FILES]:'
    ];

    chunks.forEach((c, idx) => {
      lines.push(
        `--- EXCERPT ${idx + 1} (From "${c.docName}", Section ${c.chunkIndex + 1}) ---`
      );
      lines.push(c.text);
    });

    lines.push(
      '--- END OF EXCERPTS ---\n' +
      'INSTRUCTIONS: Ground your response in the excerpts above. If the answer is not contained in the provided text, clearly state: "The uploaded document does not contain specific information about this topic." Cite the section or document name where helpful.'
    );

    return lines.join('\n');
  }
}
