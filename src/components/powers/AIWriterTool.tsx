import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  Languages,
  AlignLeft,
  Sliders,
  Send,
  FileEdit,
  Type,
  ArrowLeft
} from 'lucide-react';
import { api } from '../../services/api';

interface AIWriterToolProps {
  onBack?: () => void;
}

export const AIWriterTool: React.FC<AIWriterToolProps> = ({ onBack }) => {
  const [contentType, setContentType] = useState<string>('email');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<string>('professional');
  const [length, setLength] = useState<string>('medium');
  const [language, setLanguage] = useState<string>('English');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    { id: 'email', label: 'Email Draft' },
    { id: 'blog', label: 'Blog Post' },
    { id: 'essay', label: 'Academic Essay' },
    { id: 'social', label: 'Social Caption' },
    { id: 'message', label: 'Professional Message' },
    { id: 'grammar', label: 'Grammar Polish' },
    { id: 'rewrite', label: 'Smart Rewrite' },
    { id: 'summary', label: 'Executive Summary' },
  ];

  const tones = ['Professional', 'Friendly', 'Persuasive', 'Academic', 'Creative', 'Casual'];
  const lengths = ['Short', 'Medium', 'Long'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Japanese', 'Chinese', 'Portuguese'];

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    try {
      const res = await api.createContent({
        tool: contentType,
        prompt: topic,
        tone: tone.toLowerCase(),
        length: length.toLowerCase(),
        language
      });
      setGeneratedText(res.content || '');
    } catch (err: any) {
      setGeneratedText(`Content generation failed: ${err.message || 'Please check input and try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astra-writer-${contentType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = generatedText.trim() ? generatedText.trim().split(/\s+/).length : 0;
  const charCount = generatedText.length;

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all group shrink-0"
                title="Return to Astra 7 Home"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>← Back</span>
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Writer</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Craft polished essays, emails, social captions, and professional rewrites in seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Content Type Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setContentType(type.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                contentType === type.id
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Input (Left) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  What would you like to write or improve?
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    contentType === 'email'
                      ? 'e.g., Follow up on an interview with the design director, highlighting enthusiasm for design systems...'
                      : contentType === 'grammar'
                      ? 'Paste text to polish and correct...'
                      : 'Provide details, context, key points, or instructions...'
                  }
                  rows={5}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Tones, Lengths, Languages in a compact grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {tones.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Length
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {lengths.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Crafting Content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Content</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output & Editor (Right) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full min-h-[380px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Generated Draft</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopy}
                      disabled={!generatedText}
                      title="Copy to clipboard"
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={!generatedText}
                      title="Download as text"
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  placeholder="Your generated content will appear here. You can directly edit, refine, or copy it..."
                  className="w-full h-72 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pt-3 resize-none focus:outline-none"
                />
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span><strong>{wordCount}</strong> words</span>
                  <span><strong>{charCount}</strong> characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    {language}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
