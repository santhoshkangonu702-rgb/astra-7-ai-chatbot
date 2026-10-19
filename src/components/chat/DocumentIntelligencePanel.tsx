import React, { useRef, useState } from 'react';
import { FileText, Upload, Sparkles, X, CheckCircle2, Layers, Table, FileQuestion } from 'lucide-react';
import { api } from '../../services/api';

export interface ActiveDoc {
  id: string;
  name: string;
  type: string;
  size: number;
  chunksCount: number;
  summary?: string;
  content: string;
}

interface DocumentIntelligencePanelProps {
  activeDoc: ActiveDoc | null;
  onDocLoaded: (doc: ActiveDoc) => void;
  onDocRemoved: () => void;
  onTriggerPrompt: (prompt: string) => void;
}

export const DocumentIntelligencePanel: React.FC<DocumentIntelligencePanelProps> = ({
  activeDoc,
  onDocLoaded,
  onDocRemoved,
  onTriggerPrompt
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsUploading(true);
    try {
      let textContent = '';

      if (
        file.type.includes('text') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.csv') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.md')
      ) {
        textContent = await file.text();
      } else {
        // Fallback simulated document extractor for PDF/DOCX
        const buffer = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const raw = decoder.decode(buffer);
        // Extract visible characters and readable words
        const words = raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        textContent = words.length > 50 ? words : `Document content from ${file.name} (Binary size: ${(file.size / 1024).toFixed(1)} KB)`;
      }

      const uploaded = await api.uploadDocument(file.name, textContent, file.type, file.size);

      onDocLoaded({
        id: uploaded.id,
        name: uploaded.name,
        type: uploaded.type,
        size: uploaded.size,
        chunksCount: uploaded.chunksCount,
        summary: uploaded.summary,
        content: textContent
      });
    } catch (err: any) {
      alert(`Document upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  if (activeDoc) {
    return (
      <div className="mx-4 my-2 p-3 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-purple-950/30 text-xs shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white truncate max-w-xs">{activeDoc.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                  {(activeDoc.size / 1024).toFixed(1)} KB
                </span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] flex items-center gap-1">
                  <Layers className="w-2.5 h-2.5" />
                  {activeDoc.chunksCount} RAG chunks
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Indexed in Astra RAG Engine. Queries will search this document first.</span>
              </div>
            </div>
          </div>

          <button
            onClick={onDocRemoved}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
            title="Remove document"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Document Action Buttons */}
        <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-white/5">
          <button
            onClick={() => onTriggerPrompt(`Please provide a comprehensive executive summary of this uploaded document "${activeDoc.name}", outlining key objectives and findings.`)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-[11px] text-slate-300 hover:text-cyan-200 transition-all"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Summarize Document</span>
          </button>
          <button
            onClick={() => onTriggerPrompt(`Extract the top 5 key takeaways, actionable items, and important dates/metrics from this document "${activeDoc.name}".`)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-[11px] text-slate-300 hover:text-cyan-200 transition-all"
          >
            <Table className="w-3 h-3 text-amber-400" />
            <span>Key Takeaways & Metrics</span>
          </button>
          <button
            onClick={() => onTriggerPrompt(`What are the most complex or technical concepts in "${activeDoc.name}", and can you explain them in simple, clear language?`)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-[11px] text-slate-300 hover:text-cyan-200 transition-all"
          >
            <FileQuestion className="w-3 h-3 text-purple-400" />
            <span>Explain Difficult Sections</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`mx-4 my-2 p-3 rounded-xl border border-dashed text-xs transition-all flex items-center justify-between ${
        dragOver
          ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200'
          : 'border-white/10 bg-slate-900/30 text-slate-400 hover:border-white/20'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
          }
        }}
        accept=".pdf,.txt,.docx,.csv,.md,.json"
        className="hidden"
      />

      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
          <Upload className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-semibold text-slate-200">Document Intelligence:</span>
          <span className="ml-1 text-[11px]">
            {isUploading
              ? 'Analyzing and chunking document...'
              : 'Drop PDF, TXT, CSV, or DOCX to ask questions & summarize.'}
          </span>
        </div>
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-[11px] transition-colors shrink-0"
      >
        {isUploading ? 'Indexing...' : 'Upload File'}
      </button>
    </div>
  );
};
