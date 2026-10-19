import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  Copy,
  Check,
  Volume2,
  Download,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  Brain,
  Sliders,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { api } from '../../services/api';

interface AIAssistantToolProps {
  initialPrompt?: string;
  onBack?: () => void;
}

export const AIAssistantTool: React.FC<AIAssistantToolProps> = ({ initialPrompt, onBack }) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [tone, setTone] = useState<'informative' | 'concise' | 'socratic' | 'analytical'>('informative');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  React.useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setPrompt(initialPrompt);
      handleGenerate(initialPrompt);
    }
  }, [initialPrompt]);

  const starterChips = [
    'Explain quantum computing in simple terms',
    'Summarize the core concepts of machine learning',
    'Brainstorm innovative ideas for a clean energy app',
    'Provide a balanced pros & cons analysis of remote work',
    'Draft a clear step-by-step roadmap to master TypeScript'
  ];

  const handleGenerate = async (queryText?: string) => {
    const textToSend = queryText || prompt;
    if (!textToSend.trim() || loading) return;

    setLoading(true);
    setResponse('');
    try {
      const toneInstruction = {
        informative: 'Provide a thorough, easy-to-understand explanation with real-world examples.',
        concise: 'Provide an ultra-crisp, bulleted summary focusing only on essential facts.',
        socratic: 'Guide the user step-by-step, providing hints and asking reflective follow-up questions.',
        analytical: 'Provide deep analytical breakdown with pros, cons, edge cases, and structural logic.'
      }[tone];

      const res = await api.sendChatMessage({
        message: `${textToSend}\n\n[Tone guideline: ${toneInstruction}]`,
        systemInstruction: 'You are Astra 7 AI Assistant: intelligent, friendly, pedagogical, and highly structured. Break complex topics into steps, provide real examples, and end with a quick summary.'
      });

      setResponse(res.response || 'No response generated.');
    } catch (err: any) {
      setResponse(`I was unable to complete this query right now (${err.message || 'Network error'}). Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!response || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(response.replace(/[#*`_]/g, ''));
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleDownload = () => {
    if (!response) return;
    const blob = new Blob([response], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astra-assistant-output-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all group shrink-0"
                title="Return to Astra 7 Home"
              >
                <ArrowLeft className="w-4 h-4 text-indigo-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>← Back</span>
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Assistant</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                General reasoning, research synthesis, brainstorming, and deep pedagogical answers.
              </p>
            </div>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0">
            {(['informative', 'concise', 'socratic', 'analytical'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  tone === t
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Starter Chips */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Suggested Prompts
          </div>
          <div className="flex flex-wrap gap-2">
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(chip);
                  handleGenerate(chip);
                }}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 text-slate-600 dark:text-slate-300 text-xs shadow-sm hover:text-indigo-600 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder="Type your question or challenge here (e.g., 'Explain the difference between SQL and NoSQL databases with code examples')..."
            rows={4}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none transition-all"
          />

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Enter</kbd> to submit
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={loading || !prompt.trim()}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Reasoning...</span>
                </>
              ) : (
                <>
                  <span>Ask Astra</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Response Area */}
        {response && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Astra 7 Response</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium capitalize">
                  {tone}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleSpeak}
                  title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                  className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                    isSpeaking ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  title="Copy to clipboard"
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleDownload}
                  title="Download as Markdown"
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleGenerate()}
                  title="Regenerate response"
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
