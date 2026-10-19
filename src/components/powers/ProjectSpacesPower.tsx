import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Send,
  FileText,
  Code,
  Brain,
  Trash2,
  Calendar,
  Layers,
  Presentation,
  FileSpreadsheet,
  Download,
  Copy,
  ChevronRight,
  ListTodo,
  FileCode,
  Settings,
  RefreshCw,
  Target
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

export interface ProjectSpace {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: string;
  instructions: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'active' | 'paused' | 'completed';
  color?: string;
  icon?: string;
  tasks: ProjectTask[];
  memoryFacts: string[];
  files: Array<{
    id: string;
    projectId: string;
    name: string;
    size: number;
    type: string;
    content: string;
    uploadedAt: string;
  }>;
  notes: Array<{
    id: string;
    projectId: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
  }>;
  snippets: Array<{
    id: string;
    projectId: string;
    title: string;
    language: string;
    code: string;
    description: string;
    createdAt: string;
  }>;
  outputs: Array<{
    id: string;
    projectId: string;
    title: string;
    type: 'summary' | 'report' | 'presentation' | 'code' | 'plan';
    content: string;
    createdAt: string;
  }>;
  chatHistory: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ProjectSpacesPowerProps {
  onNavigateToPower?: (power: string) => void;
}

export const ProjectSpacesPower: React.FC<ProjectSpacesPowerProps> = () => {
  const [projects, setProjects] = useState<ProjectSpace[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat' | 'memory' | 'deliverables' | 'files'>('tasks');
  const [loading, setLoading] = useState(true);

  // New Project Modal
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Product');
  const [newGoal, setNewGoal] = useState('');
  const [newInstructions, setNewInstructions] = useState('Maintain agile standards and prioritize MVP features.');
  const [creatingProject, setCreatingProject] = useState(false);

  // New Task Modal
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskStatus, setTaskStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>('todo');
  const [savingTask, setSavingTask] = useState(false);
  const [suggestingTasks, setSuggestingTasks] = useState(false);

  // New Memory Fact Modal
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [memoryFactInput, setMemoryFactInput] = useState('');
  const [savingFact, setSavingFact] = useState(false);

  // Deliverables State
  const [outputType, setOutputType] = useState<'summary' | 'report' | 'presentation' | 'code' | 'plan'>('summary');
  const [outputPrompt, setOutputPrompt] = useState('');
  const [generatingOutput, setGeneratingOutput] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `✨ KEY ANSWER\nWelcome to your Astra Project Co-Pilot! I have loaded all active tasks, memory facts, and files for this workspace.\n\n━━━━━━━━━━━━━━━━\n🔹 PROJECT ALIGNMENT\nAsk me anything about milestones, task execution order, architecture decisions, or next deliverables.\n\n🔹 NEXT RECOMMENDED STEPS\n• Review or generate AI task recommendations on the Tasks board.\n• Add key constraints or architectural facts in Project Memory.\n\n🔹 QUICK SUMMARY\nReady to co-pilot your project.`
    }
  ]);

  // Fetch Projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?userId=user-01');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        if (data.projects && data.projects.length > 0 && !activeProjectId) {
          setActiveProjectId(data.projects[0].id);
        }
      }
    } catch (err: any) {
      console.warn('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || creatingProject) return;

    setCreatingProject(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim(),
          category: newCategory,
          goal: newGoal.trim() || 'Deliver exceptional project milestones on time',
          instructions: newInstructions.trim(),
          priority: 'high',
          status: 'active',
          userId: 'user-01'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => [data.project, ...prev]);
        setActiveProjectId(data.project.id);
        setIsNewProjectModalOpen(false);
        setNewTitle('');
        setNewDesc('');
        setNewGoal('');
      }
    } catch (err: any) {
      alert('Error creating project: ' + err.message);
    } finally {
      setCreatingProject(false);
    }
  };

  // Add Task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !activeProject || savingTask) return;

    setSavingTask(true);
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle.trim(),
          description: taskDesc.trim(),
          priority: taskPriority,
          status: taskStatus,
          userId: 'user-01'
        })
      });

      if (res.ok) {
        await fetchProjects();
        setIsNewTaskModalOpen(false);
        setTaskTitle('');
        setTaskDesc('');
      }
    } catch (err: any) {
      alert('Error adding task: ' + err.message);
    } finally {
      setSavingTask(false);
    }
  };

  // Change Task Status (Kanban move)
  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'review' | 'done') => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          userId: 'user-01'
        })
      });
      if (res.ok) {
        await fetchProjects();
      }
    } catch (err: any) {
      console.warn('Update task status failed:', err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/tasks/${taskId}?userId=user-01`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchProjects();
      }
    } catch (err: any) {
      console.warn('Delete task failed:', err);
    }
  };

  // AI Task Suggestion
  const handleSuggestAITasks = async () => {
    if (!activeProject || suggestingTasks) return;
    setSuggestingTasks(true);
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/tasks/suggest-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-01' })
      });
      if (res.ok) {
        await fetchProjects();
      }
    } catch (err: any) {
      alert('AI task suggestion error: ' + err.message);
    } finally {
      setSuggestingTasks(false);
    }
  };

  // Add Memory Fact
  const handleAddMemoryFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryFactInput.trim() || !activeProject || savingFact) return;

    setSavingFact(true);
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fact: memoryFactInput.trim(),
          userId: 'user-01'
        })
      });
      if (res.ok) {
        await fetchProjects();
        setIsMemoryModalOpen(false);
        setMemoryFactInput('');
      }
    } catch (err: any) {
      alert('Failed to save memory fact: ' + err.message);
    } finally {
      setSavingFact(false);
    }
  };

  // Delete Memory Fact
  const handleDeleteMemoryFact = async (index: number) => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/memory`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index,
          userId: 'user-01'
        })
      });
      if (res.ok) {
        await fetchProjects();
      }
    } catch (err: any) {
      console.warn('Failed to delete memory fact:', err);
    }
  };

  // Generate Deliverable Output
  const handleGenerateDeliverable = async () => {
    if (!activeProject || generatingOutput) return;
    setGeneratingOutput(true);
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/generate-output`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outputType,
          prompt: outputPrompt.trim(),
          userId: 'user-01'
        })
      });
      if (res.ok) {
        await fetchProjects();
        setOutputPrompt('');
      }
    } catch (err: any) {
      alert('Generation error: ' + err.message);
    } finally {
      setGeneratingOutput(false);
    }
  };

  // Chat with Project
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !activeProject || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const res = await fetch(`/api/projects/${activeProject.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId: 'user-01'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        const err = await res.json().catch(() => ({}));
        setChatMessages((prev) => [...prev, { role: 'assistant', content: `⚠️ Error: ${err.error || 'Chat failed'}` }]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: `⚠️ Connection error: ${err.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const tasksByStatus = {
    todo: activeProject?.tasks?.filter((t) => t.status === 'todo') || [],
    in_progress: activeProject?.tasks?.filter((t) => t.status === 'in_progress') || [],
    review: activeProject?.tasks?.filter((t) => t.status === 'review') || [],
    done: activeProject?.tasks?.filter((t) => t.status === 'done') || []
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Header Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Astra Project Spaces</h1>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full">
                  Workspaces & Tasks
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                End-to-end workspaces with project memory facts, Kanban task execution, and AI deliverable generators.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              disabled={!activeProject}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
            >
              <ListTodo className="w-4 h-4 text-purple-500" />
              Add Task
            </button>
            <button
              onClick={handleSuggestAITasks}
              disabled={!activeProject || suggestingTasks}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 transition shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {suggestingTasks ? 'Generating...' : 'AI Suggest Tasks'}
            </button>
          </div>
        </div>

        {/* Project Selector Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Active Project:
            </span>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProjectId(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeProject?.id === p.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                {p.title}
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                  {p.tasks?.length || 0}
                </span>
              </button>
            ))}
          </div>

          {activeProject && (
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-purple-500" />
                Goal: <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">{activeProject.goal}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-pink-500" />
                {activeProject.memoryFacts?.length || 0} Facts
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold uppercase text-[10px]">
                {activeProject.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Nav */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'tasks'
                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              Kanban & Tasks ({activeProject?.tasks?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'chat'
                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Brain className="w-4 h-4" />
              Project Co-Pilot
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'memory'
                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Project Memory ({activeProject?.memoryFacts?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('deliverables')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'deliverables'
                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Deliverables ({activeProject?.outputs?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'files'
                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              Files & Snippets
            </button>
          </div>

          {/* Project Details Card */}
          {activeProject && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-3">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white text-sm block">
                  {activeProject.title}
                </span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {activeProject.description}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                <span className="font-semibold text-purple-900 dark:text-purple-300 block mb-1">
                  Target Goal:
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {activeProject.goal}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <div>Category: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeProject.category}</span></div>
                <div>Status: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeProject.status}</span></div>
                <div>Created: <span>{new Date(activeProject.createdAt).toLocaleDateString()}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          {/* TAB 1: KANBAN & TASK BOARD */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Kanban Task Board</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Drag or click to move tasks through execution stages. AI suggestions automatically link to project goals.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSuggestAITasks}
                    disabled={suggestingTasks}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Suggest Tasks
                  </button>
                  <button
                    onClick={() => setIsNewTaskModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Task
                  </button>
                </div>
              </div>

              {/* 4 Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 1. Todo Column */}
                <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      To Do ({tasksByStatus.todo.length})
                    </span>
                  </div>

                  <div className="space-y-2 min-h-[300px]">
                    {tasksByStatus.todo.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                            {task.title}
                          </h4>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-1 text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded font-medium uppercase ${
                              task.priority === 'high'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {task.priority}
                          </span>
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-0.5"
                          >
                            Start &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. In Progress Column */}
                <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      In Progress ({tasksByStatus.in_progress.length})
                    </span>
                  </div>

                  <div className="space-y-2 min-h-[300px]">
                    {tasksByStatus.in_progress.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/60 shadow-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                            {task.title}
                          </h4>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-1 text-[10px]">
                          <span className="px-1.5 py-0.5 rounded font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                            Active
                          </span>
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, 'review')}
                            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-0.5"
                          >
                            Review &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Review Column */}
                <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Review ({tasksByStatus.review.length})
                    </span>
                  </div>

                  <div className="space-y-2 min-h-[300px]">
                    {tasksByStatus.review.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                            {task.title}
                          </h4>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[10px]">
                          <span className="px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                            Verification
                          </span>
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, 'done')}
                            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5"
                          >
                            Done &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Done Column */}
                <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Done ({tasksByStatus.done.length})
                    </span>
                  </div>

                  <div className="space-y-2 min-h-[300px]">
                    {tasksByStatus.done.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-1 opacity-80"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 line-through">
                            {task.title}
                          </h4>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                          Completed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECT CO-PILOT CHAT */}
          {activeTab === 'chat' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[700px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs italic px-2 py-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-500" />
                    Consulting project memory and tasks in "{activeProject?.title}"...
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChat} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask Astra Brain about "${activeProject?.title}"...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-1.5 transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PROJECT MEMORY */}
          {activeTab === 'memory' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Project Memory Facts</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Permanent facts, architectural rules, and decisions that Astra Brain always remembers for this workspace.
                  </p>
                </div>
                <button
                  onClick={() => setIsMemoryModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Memory Fact
                </button>
              </div>

              {activeProject?.memoryFacts && activeProject.memoryFacts.length > 0 ? (
                <div className="space-y-2">
                  {activeProject.memoryFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                          {fact}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteMemoryFact(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete memory fact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <Brain className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    No explicit memory facts stored for this project yet.
                  </p>
                  <button
                    onClick={() => setIsMemoryModalOpen(true)}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition"
                  >
                    Add First Memory Fact
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DELIVERABLES GENERATOR */}
          {activeTab === 'deliverables' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Deliverable Generator</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Generate instant executive briefings, master project plans, presentation outlines, and architecture code from this project's state.
                </p>
              </div>

              {/* Generator Form */}
              <div className="p-4 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { id: 'summary', label: 'Executive Summary', icon: FileText },
                    { id: 'plan', label: 'Master Plan', icon: Layers },
                    { id: 'presentation', label: 'Slide Outline', icon: Presentation },
                    { id: 'code', label: 'Starter Code', icon: Code },
                    { id: 'report', label: 'Progress Report', icon: FileSpreadsheet }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setOutputType(btn.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                        outputType === btn.id
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100/50'
                      }`}
                    >
                      <btn.icon className="w-4 h-4" />
                      {btn.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={outputPrompt}
                    onChange={(e) => setOutputPrompt(e.target.value)}
                    placeholder="Optional directives (e.g. 'Emphasize mobile responsiveness and Q4 timeline')..."
                    className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleGenerateDeliverable}
                    disabled={generatingOutput}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {generatingOutput ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </div>

              {/* Saved Deliverables */}
              {activeProject?.outputs && activeProject.outputs.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Generated Deliverables:</h3>
                  {activeProject.outputs.map((out) => (
                    <div
                      key={out.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {out.title}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {new Date(out.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed max-h-60 overflow-y-auto p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                        <ReactMarkdown>{out.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FILES & SNIPPETS */}
          {activeTab === 'files' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Files & Code Snippets</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Documents, architecture blueprints, and code templates attached to "{activeProject?.title}".
                  </p>
                </div>
              </div>

              {activeProject?.files && activeProject.files.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProject.files.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                        <FileCode className="w-4 h-4 text-purple-500" />
                        {f.name}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {f.type} • {(f.size / 1024).toFixed(1)} KB
                      </p>
                      <pre className="mt-2 p-2 bg-slate-900 text-slate-100 rounded text-[10px] overflow-x-auto max-h-24">
                        {f.content.slice(0, 200)}...
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
                  No files attached yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: NEW PROJECT */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-purple-500" />
              Create Project Space
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. NextGen Web App, Thesis Defense"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Core Goal
                </label>
                <input
                  type="text"
                  required
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="e.g. Ship production MVP by end of quarter"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief summary of project scope..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProject || !newTitle.trim()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
                >
                  {creatingProject ? 'Creating...' : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW TASK */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-purple-500" />
              Add Task to "{activeProject?.title}"
            </h3>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Set up authentication flow"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Details and acceptance criteria..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTask || !taskTitle.trim()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
                >
                  {savingTask ? 'Saving...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NEW MEMORY FACT */}
      {isMemoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Save Project Memory Fact
            </h3>

            <form onSubmit={handleAddMemoryFact} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Memory Fact / Rule / Constraint
                </label>
                <textarea
                  rows={3}
                  required
                  value={memoryFactInput}
                  onChange={(e) => setMemoryFactInput(e.target.value)}
                  placeholder="e.g. 'Backend uses Node 20 with TypeScript and SQLite' or 'Primary launch is slated for Q4'."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMemoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingFact || !memoryFactInput.trim()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
                >
                  {savingFact ? 'Saving...' : 'Save to Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
