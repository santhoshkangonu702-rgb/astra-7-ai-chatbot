import React, { useState } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Search,
  GraduationCap,
  FileText,
  Mic,
  User,
  Shield,
  AlertTriangle,
  Mail,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Send
} from 'lucide-react';

export type HelpTab =
  | 'getting-started'
  | 'chat-help'
  | 'search-help'
  | 'study-help'
  | 'document-help'
  | 'voice-help'
  | 'account-help'
  | 'privacy'
  | 'report-problem'
  | 'contact-support';

interface HelpCenterPowerProps {
  onBack?: () => void;
  onNavigateToPower?: (powerId: any) => void;
}

export const HelpCenterPower: React.FC<HelpCenterPowerProps> = ({
  onBack,
  onNavigateToPower,
}) => {
  const [activeTab, setActiveTab] = useState<HelpTab>('getting-started');
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const tabs: Array<{ id: HelpTab; label: string; icon: React.ElementType }> = [
    { id: 'getting-started', label: 'Getting Started', icon: Sparkles },
    { id: 'chat-help', label: 'Chat Help', icon: MessageSquare },
    { id: 'search-help', label: 'Search Help', icon: Search },
    { id: 'study-help', label: 'Study Help', icon: GraduationCap },
    { id: 'document-help', label: 'Document Help', icon: FileText },
    { id: 'voice-help', label: 'Voice Help', icon: Mic },
    { id: 'account-help', label: 'Account Help', icon: User },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'report-problem', label: 'Report Problem', icon: AlertTriangle },
    { id: 'contact-support', label: 'Contact Support', icon: Mail },
  ];

  return (
    <div className="min-h-full p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group"
              title="Return to Astra 7 Home"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back to Astra 7</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                HELP & SUPPORT
              </span>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Astra 7 Help Center</span>
                <HelpCircle className="w-5 h-5 text-amber-400" />
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive guides, module walkthroughs, privacy guidelines, and direct support.
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar tabs + Content area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="md:col-span-1 space-y-1 bg-slate-900/40 border border-white/5 p-2 rounded-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 space-y-6">
          {/* 1. Getting Started */}
          {activeTab === 'getting-started' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-lg">
                <Sparkles className="w-5 h-5" />
                <h2>Welcome to ASTRA 7 — NEXUS 2040</h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ASTRA 7 is a unified futuristic AI operating system engineered around a central cognitive core. Whether you need step-by-step mathematical tutoring, multilingual code execution, grounded web search, or document synthesis, Astra 7 routes your requests to specialized reasoning models.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>Astra Brain 2.0 Router</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Type naturally in the prompt bar. Astra automatically detects coding, math, current news, translation, or creative requests and optimizes response depth.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    <span>Live Web Grounding</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    When questions require current events, live sports, or breaking updates, Astra accesses grounded sources with verifiable titles, domains, and publication dates.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Mic className="w-4 h-4 text-purple-400" />
                    <span>Voice Astra</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Converse hands-free with real-time speech synthesis and reactive visual waveform telemetry.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Astra Memory Controls</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    You have total authority over remembered context. Toggle memory on or off anytime with zero data retention guarantees.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Chat Help */}
          {activeTab === 'chat-help' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span>Chat System & Context Mastery</span>
              </h2>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <h4 className="font-bold text-amber-300">Conversational Continuity & Follow-ups</h4>
                  <p className="text-slate-400">
                    Astra maintains multi-turn context. You can start with "What is quantum computing?", then ask "Explain it simply", "Give an example", or "Format this as an exam answer", and Astra retains the conversation history.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <h4 className="font-bold text-amber-300">Smart Answer Formatting</h4>
                  <p className="text-slate-400">
                    Astra automatically formats responses: definitions include key points, comparisons format into clean markdown tables, programming answers include copyable code blocks with output, and mathematics includes step-by-step formulas.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <h4 className="font-bold text-amber-300">Chat Management</h4>
                  <p className="text-slate-400">
                    Use the chat sidebar to start new chats, search past conversations, rename, pin, copy answers to clipboard, or export conversations to JSON or Markdown.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Search Help */}
          {activeTab === 'search-help' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <span>Live Search & Verified Sources</span>
              </h2>
              <p className="text-xs text-slate-300">
                Astra 7 never fabricates citations or sources. When temporal information is queried:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-400 space-y-2">
                <li><strong className="text-slate-200">Grounded Citations:</strong> Every verified answer displays source titles, root domains, and publication dates where available.</li>
                <li><strong className="text-slate-200">Temporal Transparency:</strong> If a live search connection is unavailable, Astra clearly informs you that answers reflect baseline model training and recommends verification.</li>
                <li><strong className="text-slate-200">Web Search Toggle:</strong> Click the "Web Search" button in the chat input bar to force live search retrieval for any query.</li>
              </ul>
            </div>
          )}

          {/* 4. Study Help */}
          {activeTab === 'study-help' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span>AI Tutor Pro & Exam Preparation</span>
              </h2>
              <div className="space-y-3 text-xs text-slate-300">
                <p>
                  Study Mode supports engineering curricula (C, C++, Java, Python, Engineering Mathematics, Digital Logic, Physics, Chemistry) with tailored answer formats:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-mono font-bold text-amber-300 block text-sm">2 Mark</span>
                    <span className="text-[10px] text-slate-400">Crisp definitions & formulas</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-mono font-bold text-amber-300 block text-sm">5 Mark</span>
                    <span className="text-[10px] text-slate-400">Structured points & diagrams</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-mono font-bold text-amber-300 block text-sm">8 Mark</span>
                    <span className="text-[10px] text-slate-400">In-depth derivations & proofs</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-mono font-bold text-amber-300 block text-sm">Quiz</span>
                    <span className="text-[10px] text-slate-400">Adaptive interactive testing</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Document Help */}
          {activeTab === 'document-help' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Documents AI & Semantic Indexing</span>
              </h2>
              <p className="text-xs text-slate-300">
                Upload and inspect PDF, DOCX, PPTX, TXT, and CSV documents with full privacy protection:
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span><strong>Chunked Retrieval:</strong> Long manuals and research papers are parsed into semantic chunks for high-precision question answering.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span><strong>Executive Summaries:</strong> Generate one-click executive summaries, structured notes, and study flashcards.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span><strong>Instant Removal:</strong> Close or delete uploaded files anytime with complete memory purge.</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. Voice Help */}
          {activeTab === 'voice-help' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-400" />
                <span>Voice Astra Assistant</span>
              </h2>
              <p className="text-xs text-slate-300">
                Voice Astra provides real-time spoken dialogue using the Web Speech API and responsive visual telemetry:
              </p>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Core Operational States</span>
                </div>
                <p>• <strong>Listening:</strong> Microphone active, converting speech to text tokens.</p>
                <p>• <strong>Thinking:</strong> Astra Core evaluating query context across models.</p>
                <p>• <strong>Speaking:</strong> Real-time audio waveform feedback with natural speech cadence.</p>
                <p className="text-[11px] text-amber-300">Tip: Click the Mute or Stop button at any point to pause audio playback instantly.</p>
              </div>
            </div>
          )}

          {/* 7. Account Help */}
          {activeTab === 'account-help' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <span>Account, Profiles & Subscription</span>
              </h2>
              <p className="text-xs text-slate-300">
                Manage your credentials, preferences, session tokens, and subscription tiers:
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <p>• <strong>Profile Editing:</strong> Update your full name, avatar, bio, and linked email address.</p>
                <p>• <strong>Plan Tiers:</strong> Free users have access to standard models; Pro 2040 unlocks continuous streaming, higher rate limits, and exascale analytical tools.</p>
                <p>• <strong>Sessions:</strong> View all active devices and revoke unauthorized logins with single-click session invalidation.</p>
              </div>
            </div>
          )}

          {/* 8. Privacy */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Privacy Architecture & Zero Retention</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                ASTRA 7 was designed from the ground up with strict user privacy principles. We never sell your data, use your private documents to train public foundation models, or log confidential chats without your explicit consent.
              </p>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 space-y-1.5">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Enterprise Security Compliance</span>
                </div>
                <p className="text-[11px] text-emerald-300">
                  All communications are encrypted in transit via TLS 1.3. Server-side API keys are kept strictly confidential and never transmitted to the browser client.
                </p>
              </div>
            </div>
          )}

          {/* 9. Report Problem */}
          {activeTab === 'report-problem' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Report an Issue or Bug</span>
              </h2>
              <p className="text-xs text-slate-300">
                Encountered unexpected behavior, a calculation error, or a broken interface button? Submit a diagnostic report directly to the engineering team.
              </p>

              {reportSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-bold">Diagnostic Report Received</div>
                    <div className="text-slate-400 mt-0.5">Thank you for helping us improve Astra 7. The telemetry log has been recorded.</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Describe the issue, what steps caused it, and expected vs actual behavior..."
                    className="w-full p-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400/50"
                  />
                  <button
                    disabled={!reportText.trim()}
                    onClick={() => {
                      setReportSubmitted(true);
                      setTimeout(() => {
                        setReportSubmitted(false);
                        setReportText('');
                      }, 4000);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Diagnostic Report</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 10. Contact Support */}
          {activeTab === 'contact-support' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>Contact Astra 7 Engineering</span>
              </h2>
              <p className="text-xs text-slate-300">
                Need enterprise integration, custom API keys, or academic institutional licensing? Send our support team a direct message:
              </p>

              {contactSubmitted ? (
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-bold">Message Sent Successfully</div>
                    <div className="text-slate-400 mt-0.5">Our support engineers will follow up within 24 hours.</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Your Email (e.g. alex@example.com)"
                    className="w-full p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400/50"
                  />
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we help your team?"
                    className="w-full p-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400/50"
                  />
                  <button
                    disabled={!contactEmail.trim() || !contactMessage.trim()}
                    onClick={() => {
                      setContactSubmitted(true);
                      setTimeout(() => {
                        setContactSubmitted(false);
                        setContactEmail('');
                        setContactMessage('');
                      }, 4000);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
