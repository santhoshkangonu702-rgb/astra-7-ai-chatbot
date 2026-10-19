import React, { useState } from 'react';
import {
  PenTool,
  Copy,
  Check,
  Download,
  Bookmark,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  FileText,
  Mail,
  BookOpen,
  Briefcase,
  Code
} from 'lucide-react';
import { api } from '../../services/api';

interface CreatePowerProps {
  onSaveToLibrary?: (item: any) => void;
}

export const CreatePower: React.FC<CreatePowerProps> = ({ onSaveToLibrary }) => {
  const [selectedTool, setSelectedTool] = useState('essay');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('academic');
  const [length, setLength] = useState('balanced');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const tools = [
    { id: 'essay', label: 'Academic Essay / Paper', icon: BookOpen, desc: 'Scholarly structure, references & rigor' },
    { id: 'proposal', label: 'Business / Project Proposal', icon: Briefcase, desc: 'Executive summaries, milestones & ROI' },
    { id: 'email', label: 'Professional Correspondence', icon: Mail, desc: 'Polished client or academic emails' },
    { id: 'rewriter', label: 'Precision Rewriter & Polish', icon: RefreshCw, desc: 'Elevate diction, clarity & cadence' },
    { id: 'code_doc', label: 'Technical Documentation', icon: Code, desc: 'API specs, architectures & walk-throughs' },
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const p = customPrompt || prompt;
    if (!p.trim() || isGenerating) return;

    setIsGenerating(true);
    setSaved(false);

    try {
      const res = await api.createContent({
        tool: selectedTool,
        prompt: p,
        tone,
        length
      });
      setGeneratedText(res.content);
    } catch (err) {
      console.error(err);
      setGeneratedText('Failed to generate content. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!generatedText) return;
    onSaveToLibrary?.({
      id: `lib-${Date.now()}`,
      userId: 'user-01',
      type: 'document',
      title: `${selectedTool.toUpperCase()}: ${prompt.slice(0, 30)}...`,
      snippet: generatedText.slice(0, 150) + '...',
      createdAt: new Date().toISOString()
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astra-create-${selectedTool}.md`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold mb-2">
          <PenTool className="w-3.5 h-3.5" />
          <span>ASTRA CREATE STUDIO</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Professional Authoring & Writing Workspace
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Orchestrate tone, density, and precision across scholarly, executive, and creative formats.
        </p>
      </div>

      {/* Tool Preset Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {tools.map((t) => {
          const Icon = t.icon;
          const isSelected = selectedTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTool(t.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-lg'
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
              <div>
                <div className="text-xs font-bold">{t.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls & Prompting (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <span>Prompt & Tone Parameters</span>
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Tone / Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/40"
              >
                <option value="academic">Academic & Rigorous</option>
                <option value="executive">Executive & Direct</option>
                <option value="persuasive">Persuasive & Compelling</option>
                <option value="narrative">Narrative & Engaging</option>
                <option value="concise">Ultra-Concise & Bulleted</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Target Depth
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/40"
              >
                <option value="concise">Brief Overview (~150 words)</option>
                <option value="balanced">Balanced Detail (~400 words)</option>
                <option value="in_depth">In-Depth Synthesis (~800+ words)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Topic, Outline or Draft to Refine
              </label>
              <textarea
                rows={6}
                placeholder="Detail what you need Astra to compose or paste text to refine..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/40 resize-none font-sans"
              />
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing Composition...' : 'Generate Content'}</span>
            </button>
          </div>
        </div>

        {/* Right Output Editor & Live Refinement (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              Output Workspace
            </span>
            {generatedText && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                  <span>{saved ? 'Saved!' : 'Save'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Markdown</span>
                </button>
              </div>
            )}
          </div>

          <div className="min-h-[420px] p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl relative flex flex-col justify-between">
            {generatedText ? (
              <textarea
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                className="w-full flex-1 bg-transparent text-slate-200 text-sm leading-relaxed focus:outline-none resize-none font-sans min-h-[360px]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center my-auto text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-white">Your Document Workspace</div>
                <p className="text-xs text-slate-500 max-w-xs">
                  Fill in your requirements on the left to produce structured, citation-ready text.
                </p>
              </div>
            )}

            {/* Quick Refine Controls */}
            {generatedText && (
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">Refine:</span>
                {[
                  'Shorten & tighten',
                  'Make more academic',
                  'Add concrete examples',
                  'Correct syntax & flow'
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleGenerate(`${prompt} (Revision instruction: ${action})`)}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-purple-500/20 text-[11px] text-slate-300 hover:text-purple-200 border border-white/5 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
