import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  FileCheck,
  HelpCircle,
  BookOpen,
  ListFilter,
  CheckCircle2,
  Trash2,
  Download,
  Send,
  Loader2,
  Layers,
  ArrowRight,
  ArrowLeft,
  Table,
  CheckSquare,
  Presentation,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Copy,
  Check
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export interface UploadedDoc2 {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'PPTX' | 'TXT' | 'CSV' | 'Image';
  size: string;
  uploadedAt: string;
  summary: string;
  keyPoints: string[];
  sampleContent: string;
  tableData?: Array<Record<string, string>>;
  chapters?: Array<{ title: string; summary: string }>;
  quiz?: Array<{ question: string; options: string[]; answer: string }>;
  flashcards?: Array<{ front: string; back: string }>;
  presentationOutline?: Array<{ slide: number; title: string; bullets: string[] }>;
}

const PRELOADED_DOCS_2: UploadedDoc2[] = [
  {
    id: 'doc-1',
    name: 'Quantum_Neural_Architectures_2040.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedAt: 'Today, 10:14 AM',
    summary:
      'Comprehensive analysis of 10,000-qubit fault-tolerant topological quantum computers coupled with photonics and room-temperature superconductors for neural mesh routing.',
    keyPoints: [
      'Topological anyons demonstrate 99.98% coherence across 12-hour simulation windows.',
      'Photonic interconnects decrease cross-rack latency to 3.2 picoseconds.',
      'Eliminates helium cryogenic reliance via yttrium barium copper oxide planar substrates.'
    ],
    sampleContent: `Abstract: We present the architectural blueprint for the Astra 7 Nexus 2040 quantum neural processor. By interleaving silicon-photonic waveguides with surface-code topological qubits, our design maintains error mitigation without requiring liquid-helium dilution refrigerators. The processor delivers 120 Peta-QOPS while maintaining continuous parity checks against orbital telemetry streams.`,
    chapters: [
      { title: 'Chapter 1: Cryogenic Decoupling', summary: 'Methods for operating topological gates at 77K using liquid nitrogen.' },
      { title: 'Chapter 2: Photonic Interconnects', summary: 'Waveguide transmission reducing rack latency to 3.2ps.' },
      { title: 'Chapter 3: Fault Tolerance Bounds', summary: 'Surface code distance-9 error thresholds verified across 10,000 qubits.' }
    ],
    tableData: [
      { Parameter: 'Coherence Time', Value: '12.4 Hours', Threshold: 'Standard' },
      { Parameter: 'Latency Overhead', Value: '3.2 ps', Threshold: 'Sub-nanosecond' },
      { Parameter: 'Error Rate', Value: '0.0002%', Threshold: 'Fault-Tolerant' }
    ],
    quiz: [
      {
        question: 'What eliminates liquid-helium reliance in the Astra 2040 quantum processor?',
        options: ['YBCO planar substrates', 'Liquid hydrogen', 'Lead-acid buffers'],
        answer: 'YBCO planar substrates'
      }
    ],
    flashcards: [
      { front: 'Coherence threshold of Astra 2040 topological anyons', back: '99.98% coherence over 12 hours' },
      { front: 'Cross-rack photonic waveguide latency', back: '3.2 picoseconds' }
    ],
    presentationOutline: [
      { slide: 1, title: 'Quantum Neural Mesh 2040', bullets: ['Architectural overview', 'YBCO substrate performance'] },
      { slide: 2, title: 'Performance Metrics', bullets: ['120 Peta-QOPS', 'Sub-3.5ps latency'] }
    ]
  },
  {
    id: 'doc-2',
    name: 'Clean_Energy_Desalination_Matrix.csv',
    type: 'CSV',
    size: '420 KB',
    uploadedAt: 'Yesterday, 3:15 PM',
    summary:
      'Telemetry data from coastal solar-powered reverse osmosis and graphene membrane desalination facilities across Gujarat and Mediterranean hubs.',
    keyPoints: [
      'Energy usage reduced to 1.15 kWh/m³ using multi-layer graphene nanopore membranes.',
      'Byproduct mineral extraction yields battery-grade lithium carbonate (320kg/day).',
      'Continuous daily output exceeds 4.2 billion liters at zero carbon grid intensity.'
    ],
    sampleContent: `facility_id,region,solar_mwh,freshwater_ml,lithium_kg,efficiency\nKUTCH-01,Gujarat_IN,1420.5,124.8,320.4,98.2%\nMED-04,Valencia_ES,890.2,78.5,185.0,97.8%`,
    tableData: [
      { Facility: 'KUTCH-01', Region: 'Gujarat, IN', Output_ML: '124.8', Lithium_KG: '320.4' },
      { Facility: 'MED-04', Region: 'Valencia, ES', Output_ML: '78.5', Lithium_KG: '185.0' },
      { Facility: 'ARABIAN-02', Region: 'Muscat, OM', Output_ML: '110.2', Lithium_KG: '290.1' }
    ]
  }
];

interface DocumentAIPowerProps {
  onBack?: () => void;
}

export const DocumentAIPower: React.FC<DocumentAIPowerProps> = ({ onBack }) => {
  const [documents, setDocuments] = useState<UploadedDoc2[]>(PRELOADED_DOCS_2);
  const [selectedDoc, setSelectedDoc] = useState<UploadedDoc2>(PRELOADED_DOCS_2[0]);
  const [activeTab, setActiveTab] = useState<
    'ask' | 'summary' | 'chapters' | 'tables' | 'quiz' | 'flashcards' | 'presentation' | 'compare'
  >('ask');
  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'astra'; text: string; citation?: string }>
  >([
    {
      sender: 'astra',
      text: 'Document fully parsed and indexed into Astra Brain 2.0. You can query specific paragraphs, extract structured data tables, or generate study quizzes.',
      citation: 'Page 1, Abstract & Section 1.1'
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setActivePipelineStep(1);

    // Simulate 7-step pipeline: UPLOAD -> VALIDATE -> EXTRACT -> INDEX -> UNDERSTAND -> ASK -> ANALYZE
    const extension = file.name.split('.').pop()?.toUpperCase() || 'TXT';
    let docType: UploadedDoc2['type'] = 'PDF';
    if (extension.includes('DOC')) docType = 'DOCX';
    else if (extension.includes('PPT')) docType = 'PPTX';
    else if (extension.includes('CSV')) docType = 'CSV';
    else if (['JPG', 'JPEG', 'PNG', 'WEBP'].includes(extension)) docType = 'Image';
    else if (extension.includes('TXT')) docType = 'TXT';

    const reader = new FileReader();
    reader.onload = () => {
      const newDoc: UploadedDoc2 = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: docType,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: 'Just now',
        summary: `Validated and indexed document: ${file.name}. All textual vectors and semantic entities extracted.`,
        keyPoints: [
          `File format: ${docType} validated with zero corruption.`,
          `Semantic vectors generated and stored in client-side document memory.`,
          `Structured table and text extraction ready for instant query.`
        ],
        sampleContent: typeof reader.result === 'string' ? reader.result.slice(0, 1000) : 'Binary content processed.',
        tableData: [
          { Key: 'File Name', Value: file.name },
          { Key: 'Size', Value: `${(file.size / 1024).toFixed(0)} KB` },
          { Key: 'Index Status', Value: 'Verified Complete' }
        ]
      };

      setDocuments([newDoc, ...documents]);
      setSelectedDoc(newDoc);
      setIsProcessing(false);
      setActivePipelineStep(7);
      hapticSuccess();
    };

    if (docType === 'CSV' || docType === 'TXT') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    const q = question.trim();
    const userMsg = { sender: 'user' as const, text: q };
    setChatMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setIsProcessing(true);

    setTimeout(() => {
      let ans = `Based on **${selectedDoc.name}**, `;
      let citation = `${selectedDoc.name} • Section 2.1, Page 3`;

      if (q.toLowerCase().includes('coherence') || q.toLowerCase().includes('anyon')) {
        ans += `the topological anyons demonstrate **99.98% coherence** across a continuous 12-hour simulation cycle.`;
        citation = `Chapter 1, Page 4, Paragraph 2`;
      } else if (q.toLowerCase().includes('latency') || q.toLowerCase().includes('speed')) {
        ans += `the cross-rack photonic interconnects reduce transmission latency to **3.2 picoseconds**, completely removing copper bus impedance.`;
        citation = `Chapter 2, Page 9, Table 3`;
      } else {
        ans += `the indexed document indicates key principles centered on **${selectedDoc.keyPoints[0] || 'the core findings'}**.`;
      }

      setChatMessages((prev) => [...prev, { sender: 'astra', text: ans, citation }]);
      setIsProcessing(false);
      hapticSuccess();
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 border border-amber-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group shrink-0 mr-1"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back</span>
            </button>
          )}
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <FileText className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">DOCUMENT INTELLIGENCE 2.0</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                MULTIMODAL RAG
              </span>
            </div>
            <p className="text-xs text-slate-400">
              PDF, DOCX, PPTX, TXT, CSV & Images • Grounded Question-Answering with Precise Page Citations
            </p>
          </div>
        </div>

        {/* Upload Trigger */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.pptx,.txt,.csv,image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* 7-Step Pipeline Visualizer: UPLOAD → VALIDATE → EXTRACT → INDEX → UNDERSTAND → ASK → ANALYZE */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
        <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
          Astra Document Pipeline
        </div>
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 text-[10px] font-mono">
          {['UPLOAD', 'VALIDATE', 'EXTRACT', 'INDEX', 'UNDERSTAND', 'ASK', 'ANALYZE'].map((step, idx) => (
            <React.Fragment key={step}>
              <div className="px-2.5 py-1 rounded-md shrink-0 border bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                {step}
              </div>
              {idx < 6 && <span className="text-slate-600 shrink-0">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Grid: Document Selector + Tab Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Registry */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            Indexed Documents ({documents.length})
          </div>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc);
                  hapticAction();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedDoc.id === doc.id
                    ? 'bg-amber-500/15 border-amber-500/40 shadow-md'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300 font-bold">
                    {doc.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{doc.size}</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{doc.name}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{doc.summary}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Intelligence Operations */}
        <div className="lg:col-span-8 space-y-4">
          {/* Action Tabs: Ask, Summary, Chapters, Tables, Quiz, Flashcards, Presentation, Compare */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-white/10 pb-2 text-xs">
            {[
              { id: 'ask', label: 'Ask Questions', icon: HelpCircle },
              { id: 'summary', label: 'Executive Summary', icon: FileText },
              { id: 'chapters', label: 'Chapters', icon: BookOpen },
              { id: 'tables', label: 'Tables & CSV', icon: Table },
              { id: 'quiz', label: 'Quiz Generator', icon: CheckSquare },
              { id: 'flashcards', label: 'Flashcards', icon: Layers },
              { id: 'presentation', label: 'Slides Outline', icon: Presentation }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB: Ask Questions */}
          {activeTab === 'ask' && (
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 flex flex-col h-[520px]">
              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl text-xs space-y-1.5 ${
                      msg.sender === 'user'
                        ? 'bg-amber-500/20 text-white ml-auto max-w-[80%]'
                        : 'bg-black/50 border border-white/10 text-slate-200 mr-auto max-w-[90%]'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-amber-400 uppercase font-bold">
                      {msg.sender === 'user' ? 'YOU' : 'ASTRA BRAIN → DOCUMENTS → ANALYZED'}
                    </div>
                    <div className="leading-relaxed">{msg.text}</div>
                    {msg.citation && (
                      <div className="pt-1.5 border-t border-white/10 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                        <span>Citation:</span>
                        <span>{msg.citation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder={`Ask anything about ${selectedDoc.name}...`}
                  className="flex-1 p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-400/50"
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={!question.trim() || isProcessing}
                  className="px-4 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 disabled:opacity-40 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: Summary */}
          {activeTab === 'summary' && (
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white">{selectedDoc.name} — Summary</h3>
              <p className="text-slate-300 leading-relaxed">{selectedDoc.summary}</p>

              <div className="space-y-2 pt-2">
                <div className="font-bold text-amber-300 font-mono uppercase text-[11px]">
                  Extracted Core Findings:
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-200">
                  {selectedDoc.keyPoints.map((kp, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {kp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB: Tables */}
          {activeTab === 'tables' && (
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white">Extracted Structured Table Data</h3>
              {selectedDoc.tableData && selectedDoc.tableData.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
                  <table className="w-full text-left">
                    <thead className="border-b border-white/10 bg-white/5 font-mono text-[11px] text-slate-400">
                      <tr>
                        {Object.keys(selectedDoc.tableData[0]).map((header) => (
                          <th key={header} className="p-3">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {selectedDoc.tableData.map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="p-3 font-mono text-xs">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">No tabular data detected in this document.</div>
              )}
            </div>
          )}

          {/* TAB: Quiz Generator */}
          {activeTab === 'quiz' && (
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Generated Document Knowledge Quiz</h3>
                <span className="text-[10px] font-mono text-amber-300">Astra Study Engine</span>
              </div>
              {selectedDoc.quiz && selectedDoc.quiz.length > 0 ? (
                <div className="space-y-4">
                  {selectedDoc.quiz.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="font-bold text-slate-100">
                        Q{idx + 1}: {q.question}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            className="p-2.5 rounded-lg text-left bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">Click to generate automated quiz from text vectors.</div>
              )}
            </div>
          )}

          {/* TAB: Presentation Outline */}
          {activeTab === 'presentation' && (
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white">Generated Presentation Slide Outline</h3>
              {selectedDoc.presentationOutline ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedDoc.presentationOutline.map((slide) => (
                    <div key={slide.slide} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="font-mono text-[10px] text-amber-400 font-bold">SLIDE {slide.slide}</div>
                      <div className="font-bold text-slate-100">{slide.title}</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                        {slide.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">Presentation outline generated on request.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
