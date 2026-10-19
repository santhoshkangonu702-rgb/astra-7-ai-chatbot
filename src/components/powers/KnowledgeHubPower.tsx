import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FolderPlus,
  FileText,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  Trash2,
  Upload,
  Plus,
  Tag,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Database,
  FileCode,
  StickyNote,
  Settings2,
  RefreshCw,
  Clock,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export interface KnowledgeSpace {
  id: string;
  name: string;
  description: string;
  tags: string[];
  instructions: string;
  color?: string;
  icon?: string;
  documents: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
    chunkCount: number;
  }>;
  notes: Array<{
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }>;
  chunks: Array<{
    id: string;
    docId: string;
    docName: string;
    chunkIndex: number;
    text: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeHubPowerProps {
  onAskAstra?: (prompt: string) => void;
}

export const KnowledgeHubPower: React.FC<KnowledgeHubPowerProps> = ({ onAskAstra }) => {
  const [spaces, setSpaces] = useState<KnowledgeSpace[]>([]);
  const [activeSpaceId, setActiveSpaceId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'documents' | 'notes' | 'search' | 'settings'>('chat');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    sources?: Array<{ docName: string; chunkId: string; excerpt: string; score: number }>;
    matchedNotes?: Array<{ title: string; excerpt: string }>;
  }>>([
    {
      role: 'assistant',
      content: `✨ KEY ANSWER\nWelcome to Astra 7 Knowledge Hub! Ask questions grounded directly in your private Knowledge Spaces.\n\n━━━━━━━━━━━━━━━━\n🔹 SOURCE EVIDENCE\nAstra 7 performs semantic chunking and TF-IDF vector retrieval to ensure answers are strictly cited from your uploaded documents and notes.\n\n🔹 PRACTICAL APPLICATION\nUpload lecture slides, research PDFs, code manuals, or meeting notes to create self-contained intelligent knowledge bases.\n\n🔹 SUMMARY\nSelect or create a Knowledge Space above to begin grounded querying.`
    }
  ]);

  // Document Upload Modal / State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // New Space Modal / State
  const [isNewSpaceModalOpen, setIsNewSpaceModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDesc, setNewSpaceDesc] = useState('');
  const [newSpaceTags, setNewSpaceTags] = useState('Research, AI');
  const [newSpaceInstructions, setNewSpaceInstructions] = useState('Ground answers strictly in these documents with exact citations.');
  const [creatingSpace, setCreatingSpace] = useState(false);

  // Note Modal / State
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('Key Takeaway');
  const [savingNote, setSavingNote] = useState(false);

  // Semantic Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    chunks: Array<{ id: string; docName: string; chunkIndex: number; text: string; relevanceScore?: number }>;
    matchedNotes: Array<{ id: string; title: string; content: string }>;
  } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch Spaces
  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge/spaces?userId=user-01');
      if (res.ok) {
        const data = await res.json();
        setSpaces(data.spaces || []);
        if (data.spaces && data.spaces.length > 0 && !activeSpaceId) {
          setActiveSpaceId(data.spaces[0].id);
        }
      }
    } catch (err: any) {
      setError('Could not connect to Knowledge Hub backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const activeSpace = spaces.find((s) => s.id === activeSpaceId) || spaces[0];

  // Handle Send Chat
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading || !activeSpace) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const res = await fetch(`/api/knowledge/spaces/${activeSpace.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId: 'user-01'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.answer,
            sources: data.sources,
            matchedNotes: data.matchedNotes
          }
        ]);
      } else {
        const errData = await res.json().catch(() => ({}));
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ Failed to retrieve knowledge: ${errData.error || 'Unknown error'}. Please check if documents are uploaded to this space.`
          }
        ]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Connection error: ${err.message}`
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Create New Space
  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim() || creatingSpace) return;

    setCreatingSpace(true);
    try {
      const res = await fetch('/api/knowledge/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSpaceName.trim(),
          description: newSpaceDesc.trim(),
          tags: newSpaceTags.split(',').map((t) => t.trim()).filter(Boolean),
          instructions: newSpaceInstructions.trim(),
          userId: 'user-01'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSpaces((prev) => [data.space, ...prev]);
        setActiveSpaceId(data.space.id);
        setIsNewSpaceModalOpen(false);
        setNewSpaceName('');
        setNewSpaceDesc('');
      }
    } catch (err: any) {
      alert('Error creating space: ' + err.message);
    } finally {
      setCreatingSpace(false);
    }
  };

  // Upload Document
  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocContent.trim() || !activeSpace || uploadingDoc) return;

    setUploadingDoc(true);
    try {
      const res = await fetch(`/api/knowledge/spaces/${activeSpace.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDocName.trim(),
          content: newDocContent.trim(),
          type: 'text/markdown',
          userId: 'user-01'
        })
      });

      if (res.ok) {
        await fetchSpaces();
        setIsUploadModalOpen(false);
        setNewDocName('');
        setNewDocContent('');
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  // File picker handler for uploading files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewDocName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setNewDocContent(text);
    };
    reader.readAsText(file);
  };

  // Delete Document
  const handleDeleteDoc = async (docId: string) => {
    if (!activeSpace || !confirm('Remove this document and all its indexed chunks?')) return;
    try {
      const res = await fetch(`/api/knowledge/spaces/${activeSpace.id}/documents/${docId}?userId=user-01`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchSpaces();
      }
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Save Note
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim() || !activeSpace || savingNote) return;

    setSavingNote(true);
    try {
      const res = await fetch(`/api/knowledge/spaces/${activeSpace.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle.trim(),
          content: noteContent.trim(),
          tags: noteTags.split(',').map((t) => t.trim()).filter(Boolean),
          userId: 'user-01'
        })
      });

      if (res.ok) {
        await fetchSpaces();
        setIsNoteModalOpen(false);
        setNoteTitle('');
        setNoteContent('');
      }
    } catch (err: any) {
      alert('Failed to save note: ' + err.message);
    } finally {
      setSavingNote(false);
    }
  };

  // Delete Note
  const handleDeleteNote = async (noteId: string) => {
    if (!activeSpace || !confirm('Delete this note?')) return;
    try {
      const res = await fetch(`/api/knowledge/spaces/${activeSpace.id}/notes/${noteId}?userId=user-01`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchSpaces();
      }
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Execute Semantic Search Inspector
  const handleRunSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || !activeSpace || searchLoading) return;

    setSearchLoading(true);
    try {
      const res = await fetch(`/api/knowledge/spaces/${activeSpace.id}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery.trim(),
          topK: 6,
          userId: 'user-01'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err: any) {
      alert('Search failed: ' + err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // Delete Current Space
  const handleDeleteSpace = async () => {
    if (!activeSpace || !confirm(`Permanently delete Knowledge Space "${activeSpace.name}"?`)) return;
    try {
      const res = await fetch(`/api/knowledge/spaces/${activeSpace.id}?userId=user-01`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const remaining = spaces.filter((s) => s.id !== activeSpace.id);
        setSpaces(remaining);
        if (remaining.length > 0) setActiveSpaceId(remaining[0].id);
      }
    } catch (err: any) {
      alert('Failed to delete space: ' + err.message);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Top Header Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Astra Knowledge Hub</h1>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full">
                  Semantic RAG
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Isolated knowledge spaces, automatic document chunking, and strictly grounded AI citations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsNewSpaceModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
            >
              <FolderPlus className="w-4 h-4" />
              New Space
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              disabled={!activeSpace}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
            >
              <Upload className="w-4 h-4 text-indigo-500" />
              Add Document
            </button>
            <button
              onClick={() => setIsNoteModalOpen(true)}
              disabled={!activeSpace}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
            >
              <StickyNote className="w-4 h-4 text-amber-500" />
              Quick Note
            </button>
          </div>
        </div>

        {/* Space Selector & Space Meta Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Active Space:
            </span>
            {spaces.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSpaceId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeSpace?.id === s.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {s.name}
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                  {s.documents?.length || 0}
                </span>
              </button>
            ))}
          </div>

          {activeSpace && (
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                {activeSpace.documents?.length || 0} Docs
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-500" />
                {activeSpace.chunks?.length || 0} Indexed Chunks
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                {activeSpace.notes?.length || 0} Notes
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Navigation Tabs & Space Details */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'chat'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Grounded Chat
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'documents'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Documents ({activeSpace?.documents?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'notes'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <StickyNote className="w-4 h-4" />
              Notes ({activeSpace?.notes?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'search'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              Vector Inspector
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'settings'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              Space Settings
            </button>
          </div>

          {/* Space Bio Card */}
          {activeSpace && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-3">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white text-sm block">
                  {activeSpace.name}
                </span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {activeSpace.description || 'No description provided.'}
                </p>
              </div>

              {activeSpace.tags && activeSpace.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {activeSpace.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span>Created: {new Date(activeSpace.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Area: Active Tab Content */}
        <div className="lg:col-span-3">
          {/* TAB 1: GROUNDED CHAT */}
          {activeTab === 'chat' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[700px]">
              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>

                      {/* Source Evidence Cards */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5" />
                            Grounded Citations ({msg.sources.length}):
                          </div>
                          <div className="space-y-1.5">
                            {msg.sources.map((src, i) => (
                              <div
                                key={i}
                                className="text-xs p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-700/60"
                              >
                                <div className="flex items-center justify-between font-medium text-slate-800 dark:text-slate-200">
                                  <span>📄 {src.docName}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                                    {src.score}% match
                                  </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 italic text-[11px] mt-1 line-clamp-2">
                                  "{src.excerpt}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs italic px-2 py-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    Searching semantic chunks in "{activeSpace?.name}" and verifying facts...
                  </div>
                )}
              </div>

              {/* Chat Input Box */}
              <form onSubmit={handleSendChat} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask anything grounded in "${activeSpace?.name || 'this space'}"...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-1.5 transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Ask
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Knowledge Documents</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Uploaded documents are split into semantic chunks and indexed for sub-millisecond retrieval.
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Document
                </button>
              </div>

              {activeSpace?.documents && activeSpace.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSpace.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                {doc.name}
                              </h3>
                              <span className="text-[11px] text-slate-400">
                                {new Date(doc.uploadedAt).toLocaleDateString()} • {(doc.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          {doc.chunkCount} Indexed Chunks
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Active & Grounded
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    No documents uploaded in this space yet.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload markdown, text, or research summaries to start grounding AI answers.
                  </p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
                  >
                    Upload First Document
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NOTES */}
          {activeTab === 'notes' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Knowledge Notes & Takeaways</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Quick factual notes and key concepts that Astra references during grounded reasoning.
                  </p>
                </div>
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Note
                </button>
              </div>

              {activeSpace?.notes && activeSpace.notes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSpace.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-amber-50/30 dark:bg-amber-950/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {note.title}
                          </h3>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                          {note.content}
                        </p>
                      </div>

                      {note.tags && note.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {note.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-[10px]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <StickyNote className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    No notes created in this space yet.
                  </p>
                  <button
                    onClick={() => setIsNoteModalOpen(true)}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition"
                  >
                    Add First Note
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VECTOR & SEMANTIC INSPECTOR */}
          {activeTab === 'search' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Semantic Search Inspector</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Directly inspect indexed chunks and TF-IDF relevance scores matching your query in "{activeSpace?.name}".
                </p>
              </div>

              <form onSubmit={handleRunSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter semantic search terms (e.g. 'architecture', 'authentication', 'protocol')..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || searchLoading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-1.5 transition"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </form>

              {searchLoading && (
                <div className="text-xs text-slate-500 py-4 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                  Computing TF-IDF cosine similarities...
                </div>
              )}

              {searchResults && (
                <div className="space-y-3 mt-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Matched Chunks ({searchResults.chunks.length}):
                  </h3>
                  {searchResults.chunks.map((chunk, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          {chunk.docName} (Chunk #{chunk.chunkIndex})
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono">
                          Relevance: {Math.round((chunk.relevanceScore || 0.8) * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {chunk.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SPACE SETTINGS */}
          {activeTab === 'settings' && activeSpace && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Knowledge Space Settings</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure custom AI directives and access controls for "{activeSpace.name}".
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    System Instructions for this Space
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={activeSpace.instructions}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    readOnly
                  />
                  <span className="text-[11px] text-slate-400">
                    Astra Brain strictly injects these instructions into the prompt context for all questions directed to this space.
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</h4>
                    <p className="text-xs text-slate-400">
                      Permanently remove this knowledge space, all uploaded documents, and notes.
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteSpace}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Space
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: NEW KNOWLEDGE SPACE */}
      {isNewSpaceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-indigo-500" />
              Create Knowledge Space
            </h3>

            <form onSubmit={handleCreateSpace} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Space Name
                </label>
                <input
                  type="text"
                  required
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="e.g. AI Architecture, Biology 101, Legal Specs"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newSpaceDesc}
                  onChange={(e) => setNewSpaceDesc(e.target.value)}
                  placeholder="Brief description of materials in this space..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newSpaceTags}
                  onChange={(e) => setNewSpaceTags(e.target.value)}
                  placeholder="e.g. Research, Python, College"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom AI Directives
                </label>
                <input
                  type="text"
                  value={newSpaceInstructions}
                  onChange={(e) => setNewSpaceInstructions(e.target.value)}
                  placeholder="e.g. Ground answers strictly in these documents."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSpaceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingSpace || !newSpaceName.trim()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
                >
                  {creatingSpace ? 'Creating...' : 'Create Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD DOCUMENT */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-500" />
              Add Document to "{activeSpace?.name}"
            </h3>

            <form onSubmit={handleUploadDocument} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Text File (.txt, .md, .json, .csv)
                </label>
                <input
                  type="file"
                  accept=".txt,.md,.json,.csv,.js,.ts"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Chapter 4 Summary.md"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Text / Markdown Content
                </label>
                <textarea
                  rows={6}
                  required
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  placeholder="Paste or type content here. Astra 7 will automatically chunk and index it..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingDoc || !newDocName.trim() || !newDocContent.trim()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
                >
                  {uploadingDoc ? 'Indexing Chunks...' : 'Save & Index Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: QUICK NOTE */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-amber-500" />
              Add Knowledge Note to "{activeSpace?.name}"
            </h3>

            <form onSubmit={handleSaveNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Core Principle or Formula"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content
                </label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write factual note..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={noteTags}
                  onChange={(e) => setNewSpaceTags(e.target.value)}
                  placeholder="e.g. Concept, Priority"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNote || !noteTitle.trim() || !noteContent.trim()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm"
                >
                  {savingNote ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
