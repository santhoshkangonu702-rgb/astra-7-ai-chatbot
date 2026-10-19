import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Play,
  Copy,
  Check,
  RotateCcw,
  Bug,
  Zap,
  ArrowRightLeft,
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

export const CodeAssistantTool: React.FC = () => {
  const [language, setLanguage] = useState('typescript');
  const [action, setAction] = useState<'explain' | 'generate' | 'debug' | 'improve' | 'convert' | 'format'>('explain');
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [prompt, setPrompt] = useState('');
  const [inputCode, setInputCode] = useState(
`// Example: Binary Search Algorithm
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`
  );

  const [outputCode, setOutputCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { id: 'typescript', label: 'TypeScript' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'react', label: 'React / JSX' },
    { id: 'html', label: 'HTML/CSS' },
    { id: 'java', label: 'Java' },
    { id: 'cpp', label: 'C++' },
    { id: 'c', label: 'C' },
    { id: 'sql', label: 'SQL' }
  ];

  const actions = [
    { id: 'explain', label: 'Explain Code', icon: FileCode },
    { id: 'generate', label: 'Generate Code', icon: Sparkles },
    { id: 'debug', label: 'Debug & Fix', icon: Bug },
    { id: 'improve', label: 'Optimize & Improve', icon: Zap },
    { id: 'convert', label: 'Convert Language', icon: ArrowRightLeft },
    { id: 'format', label: 'Format Code', icon: Code2 },
  ];

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await api.assistCode({
        code: inputCode,
        language,
        action,
        targetLanguage: action === 'convert' ? targetLanguage : undefined,
        prompt
      });
      setOutputCode(res.processedCode || '');
      setExplanation(res.explanation || '');
      setSuggestions(res.suggestions || []);
    } catch (err: any) {
      setExplanation(`Failed to process code: ${err.message || 'Please verify code and try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputCode && !inputCode) return;
    navigator.clipboard.writeText(outputCode || inputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Code Assistant</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Write, debug, explain, optimize, and translate code across 9+ programming languages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>

            {action === 'convert' && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>to</span>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {languages.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => setAction(act.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  action === act.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>

        {/* Optional Prompt Input (e.g. for generating or specific questions) */}
        {action === 'generate' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to build (e.g., 'A debounced search hook in React with TypeScript and abort controller')..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Dual Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Code Editor */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 pl-2">Input Code ({language})</span>
                </div>
              </div>

              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Paste or write code here..."
                rows={14}
                className="w-full bg-transparent font-mono text-xs text-indigo-200 leading-relaxed resize-none focus:outline-none scrollbar-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleRun}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run {action.toUpperCase()}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Code / Result */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-xs font-mono text-slate-400">Result & Diagnostics</span>
                </div>

                <button
                  onClick={handleCopy}
                  title="Copy code"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {outputCode ? (
                <pre className="font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto max-h-72 p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                  {outputCode}
                </pre>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Run an action on the left to see processed code and output here.
                </div>
              )}
            </div>

            {/* Explanation & Suggestions below output */}
            {explanation && (
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Analysis & Insights
                </div>
                <div className="text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap font-sans">
                  {explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
