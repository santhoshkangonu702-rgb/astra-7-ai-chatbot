import React, { useState } from 'react';
import {
  Layers,
  Search,
  BookOpen,
  FileText,
  Presentation,
  Download,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  FolderKanban,
  ArrowRight,
  Send,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../../services/api';
import { ChatMarkdown } from '../chat/ChatMarkdown';
import { PowerId } from '../../types';

interface EverythingResult {
  goal: string;
  stages: Array<{
    id: string;
    name: string;
    status: 'completed';
    outputSnippet: string;
  }>;
  researchSummary: string;
  structuredDraft: string;
  presentationOutline: Array<{ slide: number; title: string; bullets: string[] }>;
  suggestedActions: string[];
}

interface EverythingWorkspacePowerProps {
  onSelectPower?: (power: PowerId) => void;
}

export const EverythingWorkspacePower: React.FC<EverythingWorkspacePowerProps> = ({ onSelectPower }) => {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'pipeline' | 'meeting' | 'document'>('pipeline');
  const [pipelinePrompt, setPipelinePrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<EverythingResult | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Meeting Assistant State
  const [meetingTranscript, setMeetingTranscript] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [isMeetingLoading, setIsMeetingLoading] = useState(false);
  const [meetingResult, setMeetingResult] = useState<any | null>(null);

  // Document Generator State
  const [docTemplate, setDocTemplate] = useState('Executive Summary');
  const [docTopic, setDocTopic] = useState('');
  const [docInstructions, setDocInstructions] = useState('');
  const [isDocLoading, setIsDocLoading] = useState(false);
  const [docResult, setDocResult] = useState<any | null>(null);

  const sampleWorkflows = [
    'Research electric vehicles battery recycling and create an executive presentation',
    'Investigate quantum key distribution security and draft an engineering whitepaper',
    'Synthesize 2026 AI chip market trends, write notes, and outline a keynote presentation'
  ];

  const handleExecutePipeline = async (promptToRun: string) => {
    const p = promptToRun.trim();
    if (!p) return;
    setIsExecuting(true);
    try {
      const res = await api.executeEverythingPipeline(p);
      setPipelineResult(res);
    } catch (err) {
      console.error('Everything pipeline execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleProcessMeeting = async () => {
    if (!meetingTranscript.trim()) return;
    setIsMeetingLoading(true);
    try {
      const data = await api.processMeetingTranscript(meetingTranscript, meetingTitle);
      setMeetingResult(data);
    } catch (err) {
      console.error('Meeting process error:', err);
    } finally {
      setIsMeetingLoading(false);
    }
  };

  const handleGenerateDoc = async () => {
    if (!docTopic.trim()) return;
    setIsDocLoading(true);
    try {
      const data = await api.generateDocument(docTemplate, docTopic, docInstructions);
      setDocResult(data);
    } catch (err) {
      console.error('Doc gen error:', err);
    } finally {
      setIsDocLoading(false);
    }
  };

  const copyMarkdown = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Astra Everything Workspace
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                End-to-End Suite
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Research → Files → Analysis → Writing → Presentation → Export: Coordinated seamlessly in one unified view.
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setActiveWorkspaceTab('pipeline')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceTab === 'pipeline'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Multi-Stage Pipeline
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('meeting')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceTab === 'meeting'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Meeting Assistant
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('document')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceTab === 'document'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Document Generator
          </button>
        </div>
      </div>

      {/* 1. Multi-Stage Pipeline */}
      {activeWorkspaceTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Enter End-to-End Objective
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={pipelinePrompt}
                onChange={e => setPipelinePrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleExecutePipeline(pipelinePrompt)}
                placeholder="e.g. Research electric vehicles and create a 5-slide keynote presentation..."
                className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium placeholder:text-slate-400"
              />
              <button
                onClick={() => handleExecutePipeline(pipelinePrompt)}
                disabled={isExecuting || !pipelinePrompt.trim()}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shrink-0"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Everything</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-slate-400 py-1 font-medium">Examples:</span>
              {sampleWorkflows.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPipelinePrompt(sample);
                    handleExecutePipeline(sample);
                  }}
                  className="text-xs px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors truncate max-w-[340px]"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Pipeline Results View */}
          {pipelineResult && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Pipeline Step Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pipelineResult.stages.map((stg) => (
                  <div key={stg.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{stg.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {stg.outputSnippet}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Research Summary & Structured Draft */}
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Search className="w-4 h-4 text-purple-500" />
                        <span>Synthesized Research</span>
                      </h3>
                      <button
                        onClick={() => copyMarkdown(pipelineResult.researchSummary)}
                        className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {pipelineResult.researchSummary}
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-pink-500" />
                        <span>Executive Deliverable Draft</span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyMarkdown(pipelineResult.structuredDraft)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-200"
                        >
                          {copiedDraft ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedDraft ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => downloadFile('Executive_Draft.md', pipelineResult.structuredDraft)}
                          className="px-2.5 py-1 rounded-lg bg-purple-500 text-white text-xs flex items-center gap-1 hover:bg-purple-600 font-medium"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto pr-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      <ChatMarkdown content={pipelineResult.structuredDraft} />
                    </div>
                  </div>
                </div>

                {/* Right: Presentation Slides */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Presentation className="w-4 h-4 text-indigo-500" />
                      <span>Keynote Slide Deck ({pipelineResult.presentationOutline.length} Slides)</span>
                    </h3>
                    <button
                      onClick={() => {
                        const content = pipelineResult.presentationOutline
                          .map(s => `Slide ${s.slide}: ${s.title}\n${s.bullets.map(b => `- ${b}`).join('\n')}`)
                          .join('\n\n---\n\n');
                        downloadFile('Presentation_Deck.md', content);
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Export Deck</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {pipelineResult.presentationOutline.map((slide) => (
                      <div
                        key={slide.slide}
                        className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/20 dark:from-slate-800/40 dark:to-purple-950/20 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            Slide {slide.slide}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex-1 ml-2 truncate">
                            {slide.title}
                          </h4>
                        </div>
                        <ul className="space-y-1 pl-2">
                          {slide.bullets.map((b, bi) => (
                            <li key={bi} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Meeting Assistant Tab */}
      {activeWorkspaceTab === 'meeting' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Meeting Title & Permitted Transcript / Notes
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={e => setMeetingTitle(e.target.value)}
              placeholder="e.g. Q3 Architecture Review & Roadmap Alignment"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium focus:outline-none"
            />
            <textarea
              rows={8}
              value={meetingTranscript}
              onChange={e => setMeetingTranscript(e.target.value)}
              placeholder="Paste permitted transcript or meeting notes here... Astra will extract Summary, Decisions, Action Items, and Open Questions."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleProcessMeeting}
              disabled={isMeetingLoading || !meetingTranscript.trim()}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all"
            >
              {isMeetingLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Transcript...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Meeting Minutes & Action Items</span>
                </>
              )}
            </button>
          </div>

          {/* Meeting Results */}
          {meetingResult && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 space-y-1">
                <h4 className="text-xs font-bold uppercase text-purple-700 dark:text-purple-400">
                  Executive Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {meetingResult.meetingSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Decisions Made</h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {meetingResult.decisionsMade.map((d: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Action Items</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {meetingResult.actionItems.map((act: any) => (
                      <li key={act.id} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border">
                        <span className="font-medium">{act.task}</span>
                        <span className="text-[10px] font-mono text-purple-500 shrink-0">
                          {act.owner || 'Unassigned'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Document Generator Tab */}
      {activeWorkspaceTab === 'document' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Select Template</label>
              <select
                value={docTemplate}
                onChange={e => setDocTemplate(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="Executive Summary">Executive Summary</option>
                <option value="Project Proposal">Project Proposal</option>
                <option value="Research Report">Research Report</option>
                <option value="Formal Letter">Formal Letter</option>
                <option value="High-Yield Study Notes">High-Yield Study Notes</option>
                <option value="Technical Architecture Document">Technical Architecture Document</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Topic or Project</label>
              <input
                type="text"
                value={docTopic}
                onChange={e => setDocTopic(e.target.value)}
                placeholder="e.g. Distributed Database Migration Plan"
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-semibold text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Special Instructions / Tone</label>
            <input
              type="text"
              value={docInstructions}
              onChange={e => setDocInstructions(e.target.value)}
              placeholder="e.g. Include risk matrices, technical budget breakdown, and 3-month milestones..."
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            onClick={handleGenerateDoc}
            disabled={isDocLoading || !docTopic.trim()}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all"
          >
            {isDocLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Drafting Document...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Professional Document</span>
              </>
            )}
          </button>

          {/* Doc Output */}
          {docResult && (
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {docResult.title} ({docResult.wordCount} words • ~{docResult.readingTimeMinutes} min read)
                </span>
                <button
                  onClick={() => downloadFile(`${docResult.documentType}.md`, docResult.markdownContent)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Markdown</span>
                </button>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-h-96 overflow-y-auto">
                <ChatMarkdown content={docResult.markdownContent} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
