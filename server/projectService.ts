/**
 * Astra 7 — Project Spaces Service
 * Orchestrates complete project workspaces with isolated tasks, memory facts,
 * files, code snippets, AI deliverables generation, and context-aware chat.
 */

import { astraAIService } from './aiService';

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  aiSuggested?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectNote {
  id: string;
  projectId: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadedAt: string;
}

export interface ProjectSnippet {
  id: string;
  projectId: string;
  title: string;
  language: string;
  code: string;
  description?: string;
  createdAt: string;
}

export interface ProjectOutput {
  id: string;
  projectId: string;
  title: string;
  type: 'summary' | 'report' | 'presentation' | 'code' | 'plan';
  content: string;
  createdAt: string;
}

export interface ProjectChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ProjectSpace {
  id: string;
  userId: string;
  title: string;
  description: string;
  goal: string;
  status: 'active' | 'planning' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  category: string;
  deadline?: string;
  instructions: string;
  memoryFacts: string[];
  tasks: ProjectTask[];
  notes: ProjectNote[];
  files: ProjectFile[];
  snippets: ProjectSnippet[];
  outputs: ProjectOutput[];
  chatHistory: ProjectChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export class AstraProjectService {
  private static projects: Map<string, ProjectSpace> = new Map();

  static {
    // Seed initial high-quality default project
    const defaultProjectId = 'proj-astra-v2';
    const sampleProject: ProjectSpace = {
      id: defaultProjectId,
      userId: 'user-01',
      title: 'Astra 7 Multi-Agent Orchestration Engine',
      description: 'Building next-generation intelligent agent routing, project workspaces, and verified knowledge retrieval pipelines.',
      goal: 'Deliver an ultra-fast, zero-hallucination AI workspace with real-time web grounding, deep research reports, and multi-lingual support.',
      status: 'active',
      priority: 'high',
      category: 'AI Platform Engineering',
      deadline: '2026-11-30',
      instructions: 'Always focus on high-performance execution, strict type safety in TypeScript, modular UI components, and verified grounding.',
      memoryFacts: [
        'Target stack: React 18, Vite, Node.js Express, Tailwind CSS, Lucide icons',
        'Primary AI SDK: @google/genai with resilient fallback cascade',
        'Key languages supported: English, Telugu (తెలుగు), Hindi (हिंदी)',
        'Storage requirement: Persistent client state + server memory caches'
      ],
      tasks: [
        {
          id: 'task-01',
          projectId: defaultProjectId,
          title: 'Implement Knowledge Hub with Semantic Chunking',
          description: 'Build private user knowledge spaces with multi-format ingestion and grounded RAG citations.',
          status: 'done',
          priority: 'high',
          dueDate: '2026-10-15',
          aiSuggested: false,
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'task-02',
          projectId: defaultProjectId,
          title: 'Design Project Spaces with Kanban & AI Task Suggester',
          description: 'Enable contextual project workspaces where Astra Brain remembers project facts and tasks.',
          status: 'in_progress',
          priority: 'high',
          dueDate: '2026-10-20',
          aiSuggested: false,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'task-03',
          projectId: defaultProjectId,
          title: 'Benchmark Vector Retrieval Latency under High Load',
          description: 'Ensure retrieval across 10,000 document chunks completes in under 45ms.',
          status: 'todo',
          priority: 'medium',
          dueDate: '2026-11-05',
          aiSuggested: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      notes: [
        {
          id: 'pnote-01',
          projectId: defaultProjectId,
          title: 'Architecture Review Notes',
          content: 'Keep all secrets server-side. Ensure no mock stubs are exposed in the UI. When streaming answers, provide real-time status steps.',
          tags: ['Security', 'Review'],
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ],
      files: [
        {
          id: 'pfile-01',
          projectId: defaultProjectId,
          name: 'project_spec.md',
          size: 1420,
          type: 'text/markdown',
          content: '# Astra 7 Project Spaces\n\nCore requirement: Isolate project contexts, provide real-time AI assistance, and store deliverables.',
          uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString()
        }
      ],
      snippets: [
        {
          id: 'psnip-01',
          projectId: defaultProjectId,
          title: 'Astra Brain Route Dispatcher',
          language: 'typescript',
          code: `export function dispatchRoute(query: string, projectContext?: ProjectSpace) {\n  const category = projectContext ? 'PROJECT_CONTEXT' : 'GENERAL_CHAT';\n  return { category, isGrounded: true };\n}`,
          description: 'Context-aware route dispatcher',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      outputs: [
        {
          id: 'pout-01',
          projectId: defaultProjectId,
          title: 'Executive Project Briefing',
          type: 'summary',
          content: `## Executive Project Briefing: Astra 7 Multi-Agent Orchestration Engine\n\n### Objective\nDevelop an ultra-fast, high-accuracy AI platform integrating cognitive routing, project spaces, and grounded knowledge retrieval.\n\n### Current Milestones\n• Core Brain 2.0 router deployed with 24 route classifications.\n• Universal Search operational with grounded citation verification.\n• Project Spaces and Knowledge Hub integrated into primary workspace navigation.`,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      chatHistory: [
        {
          id: 'pchat-01',
          role: 'user',
          content: 'What is our primary goal for this milestone?',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'pchat-02',
          role: 'assistant',
          content: 'Our primary goal for this milestone is to deliver an ultra-fast, zero-hallucination AI workspace with real-time web grounding, deep research reports, and multi-lingual support, specifically completing the Knowledge Hub and Project Spaces modules.',
          timestamp: new Date(Date.now() - 3600000 * 2 + 1000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString()
    };

    const secondProjectId = 'proj-mobile-app';
    const sampleProject2: ProjectSpace = {
      id: secondProjectId,
      userId: 'user-01',
      title: 'Astra Mobile Companion PWA',
      description: 'Progressive Web Application companion allowing seamless voice interactions and instant search on iOS and Android.',
      goal: 'Launch installable offline-capable PWA with responsive bottom navigation, dark mode, and low-latency voice mode.',
      status: 'planning',
      priority: 'medium',
      category: 'Mobile Application',
      deadline: '2026-12-15',
      instructions: 'Prioritize thumb-friendly touch targets, minimal battery drain, and fast initial layout rendering.',
      memoryFacts: [
        'Must support standalone PWA display mode',
        'Must adhere to WCAG AA color contrast standards in light and dark modes'
      ],
      tasks: [
        {
          id: 'task-m1',
          projectId: secondProjectId,
          title: 'Audit Mobile Navigation Touch Targets (44px min)',
          description: 'Verify bottom navigation buttons and quick action pills meet accessibility guidelines.',
          status: 'todo',
          priority: 'high',
          dueDate: '2026-10-30',
          aiSuggested: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      notes: [],
      files: [],
      snippets: [],
      outputs: [],
      chatHistory: [],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.projects.set(defaultProjectId, sampleProject);
    this.projects.set(secondProjectId, sampleProject2);
  }

  // --- CRUD Project Operations ---
  public static listProjects(userId = 'user-01'): ProjectSpace[] {
    return Array.from(this.projects.values())
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public static getProject(id: string, userId = 'user-01'): ProjectSpace | undefined {
    const project = this.projects.get(id);
    if (!project || project.userId !== userId) return undefined;
    return project;
  }

  public static createProject(
    data: {
      title: string;
      description?: string;
      goal?: string;
      category?: string;
      priority?: 'low' | 'medium' | 'high';
      status?: 'active' | 'planning' | 'completed' | 'archived';
      deadline?: string;
      instructions?: string;
      userId?: string;
    }
  ): ProjectSpace {
    const id = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newProject: ProjectSpace = {
      id,
      userId: data.userId || 'user-01',
      title: data.title.trim(),
      description: data.description?.trim() || '',
      goal: data.goal?.trim() || '',
      category: data.category?.trim() || 'General',
      priority: data.priority || 'medium',
      status: data.status || 'active',
      deadline: data.deadline,
      instructions: data.instructions?.trim() || '',
      memoryFacts: [],
      tasks: [],
      notes: [],
      files: [],
      snippets: [],
      outputs: [],
      chatHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.projects.set(id, newProject);
    return newProject;
  }

  public static updateProject(
    id: string,
    updates: Partial<ProjectSpace>,
    userId = 'user-01'
  ): ProjectSpace | undefined {
    const project = this.getProject(id, userId);
    if (!project) return undefined;

    if (updates.title !== undefined) project.title = updates.title.trim();
    if (updates.description !== undefined) project.description = updates.description.trim();
    if (updates.goal !== undefined) project.goal = updates.goal.trim();
    if (updates.category !== undefined) project.category = updates.category.trim();
    if (updates.priority !== undefined) project.priority = updates.priority;
    if (updates.status !== undefined) project.status = updates.status;
    if (updates.deadline !== undefined) project.deadline = updates.deadline;
    if (updates.instructions !== undefined) project.instructions = updates.instructions.trim();
    project.updatedAt = new Date().toISOString();

    this.projects.set(id, project);
    return project;
  }

  public static deleteProject(id: string, userId = 'user-01'): boolean {
    const project = this.getProject(id, userId);
    if (!project) return false;
    return this.projects.delete(id);
  }

  // --- Project Tasks ---
  public static addTask(
    projectId: string,
    data: {
      title: string;
      description?: string;
      status?: 'todo' | 'in_progress' | 'review' | 'done';
      priority?: 'low' | 'medium' | 'high';
      dueDate?: string;
      aiSuggested?: boolean;
    },
    userId = 'user-01'
  ): ProjectTask | undefined {
    const project = this.getProject(projectId, userId);
    if (!project) return undefined;

    const taskId = `ptask-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const task: ProjectTask = {
      id: taskId,
      projectId,
      title: data.title.trim(),
      description: data.description?.trim() || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate,
      aiSuggested: Boolean(data.aiSuggested),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    project.tasks.push(task);
    project.updatedAt = new Date().toISOString();
    return task;
  }

  public static updateTask(
    projectId: string,
    taskId: string,
    updates: Partial<ProjectTask>,
    userId = 'user-01'
  ): ProjectTask | undefined {
    const project = this.getProject(projectId, userId);
    if (!project) return undefined;

    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) return undefined;

    if (updates.title !== undefined) task.title = updates.title.trim();
    if (updates.description !== undefined) task.description = updates.description.trim();
    if (updates.status !== undefined) task.status = updates.status;
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
    task.updatedAt = new Date().toISOString();
    project.updatedAt = new Date().toISOString();

    return task;
  }

  public static deleteTask(projectId: string, taskId: string, userId = 'user-01'): boolean {
    const project = this.getProject(projectId, userId);
    if (!project) return false;

    const initialLen = project.tasks.length;
    project.tasks = project.tasks.filter((t) => t.id !== taskId);
    if (project.tasks.length !== initialLen) {
      project.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // --- AI Task Suggestion Generator ---
  public static async suggestAITasks(
    projectId: string,
    userId = 'user-01'
  ): Promise<ProjectTask[]> {
    const project = this.getProject(projectId, userId);
    if (!project) return [];

    const existingTaskTitles = project.tasks.map((t) => t.title).join(', ');

    let suggestions: Array<{ title: string; description: string; priority: 'low' | 'medium' | 'high' }> = [];

    try {
      const prompt = `You are Astra Brain 2.0 Project Orchestrator.
Project Title: "${project.title}"
Category: "${project.category}"
Goal: "${project.goal}"
Current Status: "${project.status}"
Instructions: "${project.instructions}"
Existing Tasks: ${existingTaskTitles || 'None yet'}

Generate 4 high-impact, actionable next tasks that will move this project forward towards its goal.
Return strictly valid JSON in format:
[
  {
    "title": "Clear action-oriented task title",
    "description": "1-2 sentences on what needs to be done and why",
    "priority": "high" | "medium" | "low"
  }
]`;

      const genResult = await astraAIService.generate(prompt, {
        responseMimeType: 'application/json'
      });

      if (genResult?.text) {
        try {
          const parsed = JSON.parse(genResult.text);
          if (Array.isArray(parsed)) {
            suggestions = parsed;
          }
        } catch {}
      }
    } catch (err: any) {
      console.warn('AI task suggestion error:', err.message);
    }

    if (suggestions.length === 0) {
      suggestions = [
        {
          title: `Define core specifications for ${project.title}`,
          description: 'Document the scope, technical milestones, and acceptance criteria to ensure project alignment.',
          priority: 'high'
        },
        {
          title: `Review risk assessment and dependencies`,
          description: 'Identify potential bottlenecks, required third-party services, and contingency plans.',
          priority: 'medium'
        },
        {
          title: `Build interactive prototype or proof-of-concept`,
          description: 'Create an initial functional slice to validate key assumptions and user experience.',
          priority: 'high'
        },
        {
          title: `Prepare testing checklist and verification criteria`,
          description: 'Establish unit tests, integration validation, and user acceptance criteria.',
          priority: 'medium'
        }
      ];
    }

    const createdTasks: ProjectTask[] = [];
    for (const s of suggestions) {
      const task = this.addTask(
        projectId,
        {
          title: s.title,
          description: s.description,
          priority: s.priority,
          status: 'todo',
          aiSuggested: true
        },
        userId
      );
      if (task) createdTasks.push(task);
    }

    return createdTasks;
  }

  // --- Project Memory ---
  public static addMemoryFact(projectId: string, fact: string, userId = 'user-01'): string[] | undefined {
    const project = this.getProject(projectId, userId);
    if (!project) return undefined;

    const trimmed = fact.trim();
    if (trimmed && !project.memoryFacts.includes(trimmed)) {
      project.memoryFacts.push(trimmed);
      project.updatedAt = new Date().toISOString();
    }
    return project.memoryFacts;
  }

  public static deleteMemoryFact(projectId: string, factIndex: number, userId = 'user-01'): string[] | undefined {
    const project = this.getProject(projectId, userId);
    if (!project) return undefined;

    if (factIndex >= 0 && factIndex < project.memoryFacts.length) {
      project.memoryFacts.splice(factIndex, 1);
      project.updatedAt = new Date().toISOString();
    }
    return project.memoryFacts;
  }

  // --- Project Files ---
  public static addFile(
    projectId: string,
    name: string,
    content: string,
    type = 'text/plain',
    size?: number,
    userId = 'user-01'
  ): ProjectFile | undefined {
    const project = this.getProject(projectId, userId);
    if (!project) return undefined;

    const fileId = `pfile-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const file: ProjectFile = {
      id: fileId,
      projectId,
      name: name.trim(),
      size: size || content.length,
      type,
      content,
      uploadedAt: new Date().toISOString()
    };

    project.files.push(file);
    project.updatedAt = new Date().toISOString();
    return file;
  }

  public static deleteFile(projectId: string, fileId: string, userId = 'user-01'): boolean {
    const project = this.getProject(projectId, userId);
    if (!project) return false;

    const initialLen = project.files.length;
    project.files = project.files.filter((f) => f.id !== fileId);
    if (project.files.length !== initialLen) {
      project.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // --- Project Notes ---
  public static addNote(
    projectId: string,
    title: string,
    content: string,
    tags: string[] = [],
    userId = 'user-01'
  ): ProjectNote | undefined {
    const project = this.getProject(projectId, userId);
    if (!project) return undefined;

    const noteId = `pnote-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const note: ProjectNote = {
      id: noteId,
      projectId,
      title: title.trim(),
      content: content.trim(),
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    project.notes.push(note);
    project.updatedAt = new Date().toISOString();
    return note;
  }

  public static deleteNote(projectId: string, noteId: string, userId = 'user-01'): boolean {
    const project = this.getProject(projectId, userId);
    if (!project) return false;

    const initialLen = project.notes.length;
    project.notes = project.notes.filter((n) => n.id !== noteId);
    if (project.notes.length !== initialLen) {
      project.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // --- Project Snippets ---
  public static addSnippet(
    projectId: string,
    title: string,
    language: string,
    code: string,
    description?: string,
    userId = 'user-01'
  ): ProjectSnippet | undefined {
    const project = this.getProject(projectId, userId);
    if (!project) return undefined;

    const snipId = `psnip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const snippet: ProjectSnippet = {
      id: snipId,
      projectId,
      title: title.trim(),
      language: language.trim(),
      code,
      description,
      createdAt: new Date().toISOString()
    };

    project.snippets.push(snippet);
    project.updatedAt = new Date().toISOString();
    return snippet;
  }

  public static deleteSnippet(projectId: string, snippetId: string, userId = 'user-01'): boolean {
    const project = this.getProject(projectId, userId);
    if (!project) return false;

    const initialLen = project.snippets.length;
    project.snippets = project.snippets.filter((s) => s.id !== snippetId);
    if (project.snippets.length !== initialLen) {
      project.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // --- Deliverables Output Generator ---
  public static async generateOutput(
    projectId: string,
    outputType: 'summary' | 'report' | 'presentation' | 'code' | 'plan',
    userPrompt?: string,
    userId = 'user-01'
  ): Promise<ProjectOutput | undefined> {
    const project = this.getProject(projectId, userId);
    if (!project) return undefined;

    const titles: Record<string, string> = {
      summary: `${project.title} — Executive Summary`,
      report: `${project.title} — Progress & Feasibility Report`,
      presentation: `${project.title} — Keynote Slide Outline`,
      code: `${project.title} — Architecture Starter Code`,
      plan: `${project.title} — Master Project Execution Plan`
    };

    let generatedContent = '';

    try {
      const sysPrompt = `You are Astra Brain 2.0 Project Deliverable Architect.
Project Title: "${project.title}"
Category: "${project.category}"
Goal: "${project.goal}"
Instructions: "${project.instructions}"
Saved Project Memory Facts:
${project.memoryFacts.map((m) => `• ${m}`).join('\n')}

Active Project Tasks:
${project.tasks.map((t) => `• [${t.status.toUpperCase()}] ${t.title} (${t.priority} priority)`).join('\n')}

Task: Generate a high-impact, production-ready deliverable of type: ${outputType.toUpperCase()}.
${userPrompt ? `Additional User Directives: "${userPrompt}"` : ''}

Format cleanly in Markdown with professional headers, analytical precision, and actionable steps.`;

      const genResult = await astraAIService.generate(`Generate deliverable: ${titles[outputType]}`, {
        systemInstruction: sysPrompt,
        temperature: 0.3
      });

      if (genResult?.text) {
        generatedContent = genResult.text;
      }
    } catch (err: any) {
      console.warn('Project deliverable generation error:', err.message);
    }

    if (!generatedContent) {
      generatedContent = `## ${titles[outputType]}\n\n` +
        `### Project Overview\n` +
        `**Project:** ${project.title} | **Category:** ${project.category} | **Status:** ${project.status.toUpperCase()}\n` +
        `**Core Goal:** ${project.goal || 'Continuous progress and quality delivery'}\n\n` +
        `### Key Strategic Directives\n` +
        `1. **Focus on Execution**: Prioritize ${project.tasks.filter((t) => t.status !== 'done').length} outstanding action items.\n` +
        `2. **Leverage Memory Facts**: Align team decisions with verified requirements.\n` +
        `3. **Continuous Tracking**: Maintain updated deadlines and deliverables inside Astra Project Spaces.\n\n` +
        `### Current Task Distribution\n` +
        project.tasks.map((t) => `• **${t.title}** (${t.status.replace('_', ' ')}) — Priority: ${t.priority}`).join('\n');
    }

    const outputId = `pout-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const output: ProjectOutput = {
      id: outputId,
      projectId,
      title: titles[outputType],
      type: outputType,
      content: generatedContent,
      createdAt: new Date().toISOString()
    };

    project.outputs.unshift(output);
    project.updatedAt = new Date().toISOString();
    return output;
  }

  // --- Project Context Aware Chat ---
  public static async chatWithProject(
    projectId: string,
    message: string,
    userId = 'user-01'
  ): Promise<{ response: string; projectTitle: string }> {
    const project = this.getProject(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Record user message
    const userMsg: ProjectChatMessage = {
      id: `pmsg-${Date.now()}-u`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    project.chatHistory.push(userMsg);

    // Build rich context from project state
    let projectContext = `[ACTIVE PROJECT CONTEXT: "${project.title}"]
Category: ${project.category} | Status: ${project.status} | Priority: ${project.priority}
Goal: ${project.goal}
Instructions: ${project.instructions || 'Standard high-performance guidance'}

PROJECT MEMORY FACTS:
${project.memoryFacts.map((m) => `• ${m}`).join('\n')}

ACTIVE TASKS:
${project.tasks.map((t) => `• [${t.status.toUpperCase()}] ${t.title} (${t.priority} priority)`).join('\n')}

ATTACHED FILES:
${project.files.map((f) => `• ${f.name} (${f.type})`).join('\n')}
[END PROJECT CONTEXT]`;

    let responseText = '';

    try {
      const sysInstruction = `You are Astra Brain 2.0 Project Co-Pilot working inside the project "${project.title}".
Always answer with direct relevance to the project's goal, tasks, and memory.
Adhere to the project instructions: "${project.instructions}".
Follow Astra 7 answer rhythm:
✨ KEY ANSWER
Direct, actionable response immediately addressing the prompt.
━━━━━━━━━━━━━━━━
🔹 PROJECT ALIGNMENT
How this relates to current tasks or memory facts.
🔹 NEXT RECOMMENDED STEPS
Concrete actions the user can take in this project.
🔹 QUICK SUMMARY
1-line recap.`;

      const genResult = await astraAIService.generate(`${projectContext}\n\nUser Question: ${message}`, {
        systemInstruction: sysInstruction,
        temperature: 0.3
      });

      if (genResult?.text) {
        responseText = genResult.text;
      }
    } catch (err: any) {
      console.warn('Project chat generation error:', err.message);
    }

    if (!responseText) {
      responseText = `✨ KEY ANSWER\nRegarding your question in **${project.title}**, I've reviewed your active tasks and memory facts.\n\n━━━━━━━━━━━━━━━━\n🔹 PROJECT ALIGNMENT\nThis aligns with our goal: *"${project.goal}"*. Currently you have ${project.tasks.filter((t) => t.status !== 'done').length} pending task(s).\n\n🔹 NEXT RECOMMENDED STEPS\n• Check the task board to update progress on priority items.\n• Generate an updated Project Plan or Executive Briefing from the Outputs tab.\n\n🔹 QUICK SUMMARY\nAstra Brain is continuously synchronized with your project workspace.`;
    }

    // Record assistant message
    const assistantMsg: ProjectChatMessage = {
      id: `pmsg-${Date.now()}-a`,
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toISOString()
    };
    project.chatHistory.push(assistantMsg);
    project.updatedAt = new Date().toISOString();

    return {
      response: responseText,
      projectTitle: project.title
    };
  }
}
