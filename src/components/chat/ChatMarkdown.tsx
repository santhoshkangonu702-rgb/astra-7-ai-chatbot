import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Terminal, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const textContent = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    triggerHaptic(14);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && (match || textContent.includes('\n'))) {
    return (
      <div className="my-3 rounded-2xl overflow-hidden border border-amber-500/20 bg-[#060810] shadow-xl font-['JetBrains_Mono',monospace]">
        <div className="flex items-center justify-between px-4 py-2 bg-[#0A0E1A] border-b border-amber-500/15 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#F5B82E]" />
            <span className="uppercase text-[#FFD76A] font-bold tracking-wider">{language || 'code'}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 text-[11px] font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="p-4 overflow-x-auto text-xs sm:text-[13px] font-mono leading-relaxed text-slate-200">
          <pre>
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <code
      className="px-1.5 py-0.5 rounded-md bg-white/10 text-[#FFD76A] text-[12px] font-['JetBrains_Mono',monospace] border border-amber-500/25"
      {...props}
    >
      {children}
    </code>
  );
};

export const ChatMarkdown: React.FC<{ content: string; accentColor?: string }> = ({
  content,
  accentColor = '#F5B82E'
}) => {
  // Enhance dividers for rhythm structure
  const formattedContent = content
    .replace(/━{4,}/g, '\n\n---\n\n');

  return (
    <div className="prose prose-invert prose-sm sm:prose-base max-w-none break-words leading-relaxed text-[#F8FAFC] font-['Inter',sans-serif]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as any,
          hr: () => (
            <div className="my-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-amber-500/40 via-[#F5B82E]/30 to-transparent" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5B82E]" />
              <div className="h-px flex-1 bg-gradient-to-l from-amber-500/40 via-[#F5B82E]/30 to-transparent" />
            </div>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-2xl border border-amber-500/20 bg-[#070A14]/90 shadow-md">
              <table className="min-w-full divide-y divide-amber-500/15 text-left text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-amber-500/10 text-[#FFD76A] font-mono text-[11px] uppercase tracking-wider">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-xs font-semibold text-[#FFD76A]">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-xs text-slate-200 border-t border-white/5">{children}</td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38BDF8] hover:text-[#7DD3FC] underline underline-offset-2 transition-colors inline-flex items-center gap-0.5 font-medium"
            >
              <span>{children}</span>
              <ExternalLink className="w-3 h-3 ml-0.5 inline opacity-70" />
            </a>
          ),
          ul: ({ children }) => <ul className="my-2 space-y-1.5 pl-5 list-disc text-[#F1F5F9] marker:text-[#F5B82E]">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 space-y-1.5 pl-5 list-decimal text-[#F1F5F9] marker:text-[#F5B82E] marker:font-semibold">{children}</ol>,
          h1: ({ children }) => (
            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFD76A] mt-4 mb-2 font-['Space_Grotesk',sans-serif]"
              style={{ color: '#FFD76A' }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="text-base sm:text-lg font-bold text-[#F5B82E] mt-3.5 mb-1.5 tracking-tight font-['Space_Grotesk',sans-serif]"
              style={{ color: '#F5B82E' }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-semibold text-amber-200 mt-3 mb-1 font-['Space_Grotesk',sans-serif]">
              {children}
            </h3>
          ),
          p: ({ children }) => {
            const rawStr = String(children);

            // Warning block (Amber)
            if (rawStr.startsWith('⚠️ WARNING') || rawStr.startsWith('⚠️ NOTE')) {
              return (
                <div className="my-2 p-3.5 rounded-xl bg-amber-500/10 border-l-4 border-[#F5B82E] text-amber-200 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#F5B82E] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{children}</div>
                </div>
              );
            }

            // Success / Key Result block (Green)
            if (rawStr.startsWith('✅ SUCCESS') || rawStr.startsWith('✨ KEY ') || rawStr.startsWith('✨ FINAL ') || rawStr.startsWith('✨ SUMMARY ')) {
              return (
                <div className="my-2 p-3.5 rounded-xl bg-emerald-500/10 border-l-4 border-emerald-400 text-emerald-100 text-xs sm:text-sm flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">{children}</div>
                </div>
              );
            }

            // Error / Caution block (Red)
            if (rawStr.startsWith('❌ ERROR') || rawStr.startsWith('🚨 DANGER')) {
              return (
                <div className="my-2 p-3.5 rounded-xl bg-rose-500/10 border-l-4 border-rose-500 text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{children}</div>
                </div>
              );
            }

            // Source Citation block (Cyan/Soft Blue accent)
            if (rawStr.startsWith('📚 SOURCE') || rawStr.startsWith('🔗 CITATION')) {
              return (
                <div className="my-2 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[#38BDF8] text-xs font-mono flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <div>{children}</div>
                </div>
              );
            }

            return <p className="my-1.5 leading-relaxed text-[#F8FAFC] font-['Inter',sans-serif]">{children}</p>;
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#F5B82E] pl-3.5 my-2.5 text-slate-300 italic bg-amber-500/5 py-1.5 rounded-r-xl">
              {children}
            </blockquote>
          )
        }}
      >
        {formattedContent}
      </ReactMarkdown>
    </div>
  );
};
