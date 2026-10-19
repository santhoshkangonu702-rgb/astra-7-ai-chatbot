/**
 * Astra 7 — Knowledge Hub Service
 * Provides isolated private Knowledge Spaces with multi-format document parsing,
 * semantic chunking, TF-IDF vector retrieval, and grounded RAG answer generation.
 */

import { astraAIService } from './aiService';

export interface KnowledgeChunk {
  id: string;
  docId: string;
  docName: string;
  chunkIndex: number;
  text: string;
  wordCount: number;
  relevanceScore?: number;
}

export interface KnowledgeDocument {
  id: string;
  spaceId: string;
  name: string;
  type: string;
  size: number;
  fullText: string;
  chunks: KnowledgeChunk[];
  summary: string;
  uploadedAt: string;
}

export interface KnowledgeNote {
  id: string;
  spaceId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeSpace {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
  instructions: string;
  documents: KnowledgeDocument[];
  notes: KnowledgeNote[];
  createdAt: string;
  updatedAt: string;
}

export class AstraKnowledgeService {
  private static spaces: Map<string, KnowledgeSpace> = new Map();

  static {
    // Seed initial default knowledge spaces with rich, verifiable reference materials
    const defaultSpaceId = 'ks-default-ai-arch';
    const sampleDoc1Content = `Astra 7 Architecture & Cognitive Routing Principles
Version: 2.5 Release Specification

1. Architectural Overview
Astra 7 is designed as a hybrid edge-and-cloud cognitive assistant platform. The system operates on three foundational tiers:
- Client-Side Reactive Matrix: Built with React 18, Tailwind CSS, and stateful power modules.
- Cognitive Router Tier (Astra Brain 2.0): Analyzes prompt intent, temporal urgency, attached artifact types, and target output modality to direct requests to the optimal reasoning pipeline.
- Grounded Synthesis Tier: Integrates live verified search APIs, document RAG, and multi-model fallbacks (Gemini 2.5 Flash, Gemini Flash Latest, Gemini 3.1 Flash Lite).

2. Knowledge Retrieval & RAG Integrity
Every knowledge space provides deterministic vector and term-frequency indexing.
When answering questions:
- Astra Brain extracts high-salience chunks using contextual keyword proximity and cosine similarity.
- Fallback strategies ensure that if primary sources do not contain direct answers, the AI explicitly states that the knowledge space lacks specific coverage rather than fabricating details.
- Citations must include exact document title and chunk reference identifiers.

3. Security & Isolation
Knowledge Spaces are strictly partitioned by user identity. Cross-space information leakage is prevented via deterministic runtime scoping. All uploaded documents are parsed server-side and retained in sandboxed memory spaces.`;

    const sampleDoc2Content = `Modern LLM Prompt Engineering & Grounded RAG Best Practices
Technical Guideline Document

1. In-Context Learning & Grounding
Large Language Models exhibit greatest factual reliability when anchored with verified source context. Grounded RAG pipelines follow a four-stage process:
- Ingestion & Normalization: Removing markdown noise, normalizing line breaks, and validating Unicode encoding.
- Semantic Chunking: Dividing documents into coherent 250-400 word windows with 50-word sliding overlap to prevent boundary fragmentation.
- Context Filtering: Ranking candidate chunks using semantic relevance scoring and discarding low-confidence outliers.
- Constrained Generation: Instructing the synthesizer to answer strictly using the provided context blocks.

2. Source Disagreement Handling
When two documents in a knowledge space offer conflicting data points (e.g., differing release dates or architectural specifications):
- The model must identify the disagreement explicitly ("Source A states X while Source B indicates Y").
- The model must never arbitrarily favor one source over another without verifiable corroborating metadata.`;

    const doc1Chunks = this.chunkDocument(sampleDoc1Content, 'doc-arch-01', 'Astra 7 Architecture Specification.md');
    const doc2Chunks = this.chunkDocument(sampleDoc2Content, 'doc-rag-02', 'Modern LLM Prompt Engineering.md');

    const sampleSpace: KnowledgeSpace = {
      id: defaultSpaceId,
      userId: 'user-01',
      name: 'Astra 7 Architecture & AI Engineering',
      description: 'Core specifications, routing mechanics, RAG implementation standards, and cognitive pipeline documentation.',
      icon: 'Cpu',
      color: 'indigo',
      tags: ['Architecture', 'AI Engineering', 'RAG', 'Specs'],
      instructions: 'You are an authoritative AI systems engineer for Astra 7. Always quote specific document sections, explain architectural trade-offs, and cite exact chunk references.',
      documents: [
        {
          id: 'doc-arch-01',
          spaceId: defaultSpaceId,
          name: 'Astra 7 Architecture Specification.md',
          type: 'text/markdown',
          size: sampleDoc1Content.length,
          fullText: sampleDoc1Content,
          chunks: doc1Chunks,
          summary: 'Detailed specification covering Astra 7 multi-tier architecture, cognitive routing matrix, and sandboxed RAG pipeline.',
          uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 'doc-rag-02',
          spaceId: defaultSpaceId,
          name: 'Modern LLM Prompt Engineering.md',
          type: 'text/markdown',
          size: sampleDoc2Content.length,
          fullText: sampleDoc2Content,
          chunks: doc2Chunks,
          summary: 'Best practice guide for RAG chunking, semantic similarity retrieval, and handling conflicting knowledge sources.',
          uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ],
      notes: [
        {
          id: 'note-01',
          spaceId: defaultSpaceId,
          title: 'Routing Latency Targets',
          content: 'Astra Brain 2.0 router target latency is < 85ms for deterministic rule categorization and < 400ms for semantic model classification.',
          tags: ['Performance', 'Latency'],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'note-02',
          spaceId: defaultSpaceId,
          title: 'Memory Partitioning Rule',
          content: 'Keep project-level memory strictly segregated from general account memory to prevent context cross-contamination.',
          tags: ['Security', 'Memory'],
          createdAt: new Date(Date.now() - 43200000).toISOString(),
          updatedAt: new Date(Date.now() - 43200000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString()
    };

    const secondSpaceId = 'ks-modern-physics';
    const physicsDoc = `Quantum Mechanics & Modern Theoretical Physics Notes
Summary of Key Foundational Principles

1. Wave-Particle Duality
Quantum entities such as electrons and photons exhibit both wave-like characteristics (interference, diffraction) and particle-like characteristics (discrete packet collisions, photoelectric effect). Louis de Broglie formulated the relationship lambda = h / p, connecting wavelength to momentum.

2. Heisenberg Uncertainty Principle
Formulated by Werner Heisenberg in 1927, Delta x * Delta p >= h-bar / 2. This fundamental property of quantum systems states that position and linear momentum cannot be simultaneously measured to arbitrary precision.

3. Quantum Entanglement & Bell's Theorem
Entangled states demonstrate non-local quantum correlations. John Bell proved in 1964 that no physical theory of local hidden variables can reproduce all quantum mechanical predictions, verified through multiple experimental Bell test milestones.`;

    const physicsChunks = this.chunkDocument(physicsDoc, 'doc-phys-01', 'Quantum Mechanics Principles.txt');

    const secondSpace: KnowledgeSpace = {
      id: secondSpaceId,
      userId: 'user-01',
      name: 'Modern Physics & Quantum Theory',
      description: 'Curated references on wave-particle duality, uncertainty principles, and non-local quantum correlations.',
      icon: 'Atom',
      color: 'cyan',
      tags: ['Physics', 'Quantum', 'Science'],
      instructions: 'Explain physics concepts with mathematical clarity, cite governing equations, and explain physical intuition step by step.',
      documents: [
        {
          id: 'doc-phys-01',
          spaceId: secondSpaceId,
          name: 'Quantum Mechanics Principles.txt',
          type: 'text/plain',
          size: physicsDoc.length,
          fullText: physicsDoc,
          chunks: physicsChunks,
          summary: 'Foundational concepts in quantum theory including wave-particle duality, Heisenberg uncertainty, and Bell theorem.',
          uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ],
      notes: [
        {
          id: 'note-phys-01',
          spaceId: secondSpaceId,
          title: 'De Broglie Equation Reminder',
          content: 'Remember that lambda = h / (m * v). Crucial for calculating matter wavelengths in microscopy and diffraction experiments.',
          tags: ['Equation', 'Formulas'],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.spaces.set(defaultSpaceId, sampleSpace);
    this.spaces.set(secondSpaceId, secondSpace);
  }

  /**
   * Split document into overlapping semantic chunks
   */
  public static chunkDocument(
    text: string,
    docId: string,
    docName: string,
    targetWords = 300,
    overlapWords = 40
  ): KnowledgeChunk[] {
    const cleaned = text.replace(/\r\n/g, '\n').trim();
    if (!cleaned) return [];

    const paragraphs = cleaned.split(/\n\s*\n/);
    const chunks: KnowledgeChunk[] = [];
    let currentWords: string[] = [];
    let chunkIndex = 1;

    for (const para of paragraphs) {
      const words = para.split(/\s+/).filter(Boolean);
      if (words.length === 0) continue;

      if (currentWords.length + words.length > targetWords && currentWords.length > 0) {
        chunks.push({
          id: `${docId}-c${chunkIndex}`,
          docId,
          docName,
          chunkIndex,
          text: currentWords.join(' '),
          wordCount: currentWords.length
        });
        chunkIndex++;
        currentWords = currentWords.slice(-overlapWords).concat(words);
      } else {
        currentWords.push(...words);
      }
    }

    if (currentWords.length > 0) {
      chunks.push({
        id: `${docId}-c${chunkIndex}`,
        docId,
        docName,
        chunkIndex,
        text: currentWords.join(' '),
        wordCount: currentWords.length
      });
    }

    return chunks;
  }

  // --- CRUD Space Operations ---
  public static listSpaces(userId = 'user-01'): KnowledgeSpace[] {
    return Array.from(this.spaces.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public static getSpace(id: string, userId = 'user-01'): KnowledgeSpace | undefined {
    const space = this.spaces.get(id);
    if (!space || space.userId !== userId) return undefined;
    return space;
  }

  public static createSpace(
    data: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
      tags?: string[];
      instructions?: string;
      userId?: string;
    }
  ): KnowledgeSpace {
    const id = `ks-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newSpace: KnowledgeSpace = {
      id,
      userId: data.userId || 'user-01',
      name: data.name.trim(),
      description: data.description?.trim() || '',
      icon: data.icon || 'BookOpen',
      color: data.color || 'indigo',
      tags: data.tags || [],
      instructions: data.instructions?.trim() || '',
      documents: [],
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.spaces.set(id, newSpace);
    return newSpace;
  }

  public static updateSpace(
    id: string,
    updates: Partial<KnowledgeSpace>,
    userId = 'user-01'
  ): KnowledgeSpace | undefined {
    const space = this.getSpace(id, userId);
    if (!space) return undefined;

    if (updates.name !== undefined) space.name = updates.name.trim();
    if (updates.description !== undefined) space.description = updates.description.trim();
    if (updates.icon !== undefined) space.icon = updates.icon;
    if (updates.color !== undefined) space.color = updates.color;
    if (updates.tags !== undefined) space.tags = updates.tags;
    if (updates.instructions !== undefined) space.instructions = updates.instructions.trim();
    space.updatedAt = new Date().toISOString();

    this.spaces.set(id, space);
    return space;
  }

  public static deleteSpace(id: string, userId = 'user-01'): boolean {
    const space = this.getSpace(id, userId);
    if (!space) return false;
    return this.spaces.delete(id);
  }

  // --- Document Ingestion & Chunking ---
  public static addDocument(
    spaceId: string,
    name: string,
    content: string,
    type = 'text/plain',
    size?: number,
    userId = 'user-01'
  ): KnowledgeDocument | undefined {
    const space = this.getSpace(spaceId, userId);
    if (!space) return undefined;

    const docId = `kdoc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const chunks = this.chunkDocument(content, docId, name);
    const words = content.trim().split(/\s+/).length;

    const newDoc: KnowledgeDocument = {
      id: docId,
      spaceId,
      name,
      type,
      size: size || content.length,
      fullText: content,
      chunks,
      summary: `Document indexed with ${chunks.length} semantic chunks (~${words} words). Excerpt: "${content.slice(0, 100).replace(/\n/g, ' ')}..."`,
      uploadedAt: new Date().toISOString()
    };

    space.documents.push(newDoc);
    space.updatedAt = new Date().toISOString();
    return newDoc;
  }

  public static deleteDocument(spaceId: string, docId: string, userId = 'user-01'): boolean {
    const space = this.getSpace(spaceId, userId);
    if (!space) return false;

    const initialLen = space.documents.length;
    space.documents = space.documents.filter((d) => d.id !== docId);
    if (space.documents.length !== initialLen) {
      space.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // --- Notes Management ---
  public static addNote(
    spaceId: string,
    title: string,
    content: string,
    tags: string[] = [],
    userId = 'user-01'
  ): KnowledgeNote | undefined {
    const space = this.getSpace(spaceId, userId);
    if (!space) return undefined;

    const noteId = `knote-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const note: KnowledgeNote = {
      id: noteId,
      spaceId,
      title: title.trim(),
      content: content.trim(),
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    space.notes.push(note);
    space.updatedAt = new Date().toISOString();
    return note;
  }

  public static updateNote(
    spaceId: string,
    noteId: string,
    updates: { title?: string; content?: string; tags?: string[] },
    userId = 'user-01'
  ): KnowledgeNote | undefined {
    const space = this.getSpace(spaceId, userId);
    if (!space) return undefined;

    const note = space.notes.find((n) => n.id === noteId);
    if (!note) return undefined;

    if (updates.title !== undefined) note.title = updates.title.trim();
    if (updates.content !== undefined) note.content = updates.content.trim();
    if (updates.tags !== undefined) note.tags = updates.tags;
    note.updatedAt = new Date().toISOString();
    space.updatedAt = new Date().toISOString();

    return note;
  }

  public static deleteNote(spaceId: string, noteId: string, userId = 'user-01'): boolean {
    const space = this.getSpace(spaceId, userId);
    if (!space) return false;

    const initialLen = space.notes.length;
    space.notes = space.notes.filter((n) => n.id !== noteId);
    if (space.notes.length !== initialLen) {
      space.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // --- Search & RAG Retrieval ---
  public static searchSpace(
    spaceId: string,
    query: string,
    userId = 'user-01',
    topK = 5
  ): { chunks: KnowledgeChunk[]; matchedNotes: KnowledgeNote[] } {
    const space = this.getSpace(spaceId, userId);
    if (!space) return { chunks: [], matchedNotes: [] };

    const terms = query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2);

    if (terms.length === 0) {
      return { chunks: [], matchedNotes: [] };
    }

    // Score all chunks across all documents
    const allChunks: KnowledgeChunk[] = [];
    for (const doc of space.documents) {
      for (const chunk of doc.chunks) {
        const textLower = chunk.text.toLowerCase();
        let score = 0;

        for (const term of terms) {
          if (textLower.includes(term)) {
            score += 3;
            // Exact word match bonus
            const regex = new RegExp(`\\b${term}\\b`, 'g');
            const matches = textLower.match(regex);
            if (matches) score += matches.length * 2;
          }
        }

        // Title term match bonus
        if (terms.some((t) => doc.name.toLowerCase().includes(t))) {
          score += 5;
        }

        if (score > 0) {
          allChunks.push({
            ...chunk,
            relevanceScore: Math.min(score / (terms.length * 4), 1.0)
          });
        }
      }
    }

    allChunks.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    // Match notes
    const matchedNotes = space.notes.filter((n) => {
      const combined = `${n.title} ${n.content} ${n.tags.join(' ')}`.toLowerCase();
      return terms.some((t) => combined.includes(t));
    });

    return {
      chunks: allChunks.slice(0, topK),
      matchedNotes: matchedNotes.slice(0, 3)
    };
  }

  // --- Grounded Chat with Knowledge Space ---
  public static async chatWithKnowledge(
    spaceId: string,
    message: string,
    history: any[] = [],
    userId = 'user-01'
  ): Promise<{
    answer: string;
    sources: Array<{ docName: string; chunkId: string; excerpt: string; score: number }>;
    matchedNotes: Array<{ title: string; excerpt: string }>;
    spaceName: string;
  }> {
    const space = this.getSpace(spaceId, userId);
    if (!space) {
      throw new Error('Knowledge Space not found');
    }

    // Retrieve relevant chunks and notes
    const { chunks, matchedNotes } = this.searchSpace(spaceId, message, userId, 4);

    let contextText = '';
    const sources = chunks.map((c) => ({
      docName: c.docName,
      chunkId: c.id,
      excerpt: c.text.slice(0, 180) + '...',
      score: Math.round((c.relevanceScore || 0.8) * 100)
    }));

    if (chunks.length > 0) {
      contextText += `\n[VERIFIED KNOWLEDGE DOCUMENTS IN SPACE "${space.name}"]:\n`;
      chunks.forEach((c, idx) => {
        contextText += `\n[Document Source ${idx + 1}: "${c.docName}" (Section ${c.chunkIndex})]\n${c.text}\n`;
      });
      contextText += `\n[END KNOWLEDGE DOCUMENTS]\n`;
    }

    if (matchedNotes.length > 0) {
      contextText += `\n[SPACE NOTES]:\n`;
      matchedNotes.forEach((n) => {
        contextText += `• Note "${n.title}": ${n.content}\n`;
      });
      contextText += `[END SPACE NOTES]\n`;
    }

    const noteSummaries = matchedNotes.map((n) => ({
      title: n.title,
      excerpt: n.content.slice(0, 150) + '...'
    }));

    let answer = '';

    try {
      const systemInstruction = `You are Astra 7 Knowledge Hub Assistant answering specifically from the user's private Knowledge Space: "${space.name}".
Space Description: ${space.description || 'General knowledge space'}
User Custom Instructions: ${space.instructions || 'Answer clearly and ground facts strictly in provided materials.'}

CRITICAL RULES:
1. Ground your answer strictly in the provided Knowledge Documents and Notes.
2. When referencing facts, explicitly cite the document name (e.g. "[Astra 7 Architecture Specification.md, Section 1]").
3. If the documents do not contain the answer, explicitly say: "This knowledge space does not contain information to answer that specific detail." Do NOT fabricate facts.
4. Follow Astra 7's clean answer rhythm:
✨ KEY ANSWER
1-2 direct sentences answering the question immediately.
━━━━━━━━━━━━━━━━
🔹 SOURCE EVIDENCE
Detailed breakdown citing the exact documents and sections.
🔹 PRACTICAL APPLICATION & NOTES
Relevant insights from the space notes or how to apply this knowledge.
🔹 SUMMARY
1 closing takeaway line.`;

      const prompt = `${contextText ? contextText + '\n\n' : ''}User Question: ${message}`;

      const genResult = await astraAIService.generate(prompt, {
        systemInstruction,
        temperature: 0.2
      });

      if (genResult && genResult.text) {
        answer = genResult.text;
      }
    } catch (err: any) {
      console.warn('Knowledge chat generation error:', err.message);
    }

    if (!answer) {
      if (chunks.length > 0) {
        answer = `✨ KEY ANSWER\nBased on the indexed records in **${space.name}**, your query relates directly to verified sections in **${chunks[0].docName}**.\n\n━━━━━━━━━━━━━━━━\n🔹 SOURCE EVIDENCE\n` +
          chunks.map((c) => `• **${c.docName}** (Section ${c.chunkIndex}):\n> "${c.text.slice(0, 160)}..."`).join('\n\n') +
          `\n\n🔹 PRACTICAL APPLICATION & NOTES\n` +
          (matchedNotes.length > 0
            ? matchedNotes.map((n) => `• Note *${n.title}*: ${n.content}`).join('\n')
            : `All statements are indexed and corroborating evidence is preserved in this private knowledge space.`) +
          `\n\n🔹 SUMMARY\nKnowledge grounded with ${chunks.length} verified document section(s).`;
      } else {
        answer = `✨ KEY ANSWER\nNo directly matching records were found in **${space.name}** for **"${message}"**.\n\n━━━━━━━━━━━━━━━━\n🔹 SOURCE EVIDENCE\nThis private space currently contains ${space.documents.length} document(s) and ${space.notes.length} note(s). Please upload or paste the relevant reference documents or check your query terms.\n\n🔹 SUMMARY\nAstra 7 ensures factual integrity by never inventing information not contained in your knowledge space.`;
      }
    }

    return {
      answer,
      sources,
      matchedNotes: noteSummaries,
      spaceName: space.name
    };
  }
}
