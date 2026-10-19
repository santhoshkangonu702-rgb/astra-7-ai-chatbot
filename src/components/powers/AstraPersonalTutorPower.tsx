import React, { useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Lightbulb,
  FileText,
  Sliders,
  Send,
  Zap,
  Clock
} from 'lucide-react';

export type TutorFlowStage = 'learn' | 'practice' | 'test' | 'review' | 'improve';
export type AnswerFormat = 'simple' | 'detailed' | '2-mark' | '5-mark' | '8-mark' | 'exam-format';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  hint: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Olympiad';
}

const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    question: 'What is the Second Law of Thermodynamics and its statistical basis?',
    answer: 'The entropy of an isolated system never decreases over time. Statistically, systems spontaneously evolve toward thermodynamic equilibrium, which corresponds to the state of maximum microstate multiplicity (W) via Boltzmann equation S = k_B ln(W).',
    hint: 'Think about spontaneous heat transfer and microstate probability.',
    difficulty: 'Intermediate'
  },
  {
    id: 'fc-2',
    question: 'Explain the difference between Pointers and References in C++.',
    answer: 'A pointer is a variable that stores memory address (can be null, reassigned, arithmetic capable). A reference is an alias to an existing object (cannot be null, cannot be reseated after initialization).',
    hint: 'Address vs alias, nullability, re-seating.',
    difficulty: 'Foundation'
  },
  {
    id: 'fc-3',
    question: 'How does Backpropagation calculate weight gradients in deep neural networks?',
    answer: 'Backpropagation uses the Chain Rule of calculus to compute partial derivatives of the loss function with respect to each parameter layer-by-layer backwards from output to input: ∂L/∂w_ij = ∂L/∂a_j * ∂a_j/∂z_j * ∂z_j/∂w_ij.',
    hint: 'Chain Rule applied layer by layer.',
    difficulty: 'Olympiad'
  }
];

interface AstraPersonalTutorPowerProps {
  onBack?: () => void;
}

export const AstraPersonalTutorPower: React.FC<AstraPersonalTutorPowerProps> = ({ onBack }) => {
  const [currentStage, setCurrentStage] = useState<TutorFlowStage>('learn');
  const [subject, setSubject] = useState('Computer Science');
  const [topic, setTopic] = useState('Pointers, Memory Allocation & Data Structures');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Exam Ready'>('Intermediate');
  const [learningStyle, setLearningStyle] = useState<'Socratic' | 'Intuitive & Visual' | 'Rigorous & Formal'>('Socratic');
  const [answerFormat, setAnswerFormat] = useState<AnswerFormat>('5-mark');

  // Flashcard state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Practice state
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Mistakes & Progress
  const [mistakesList, setMistakesList] = useState<string[]>([
    'Confused pointer dereference (*) with address-of operator (&)',
    'Overlooked base-case termination in recursive binary tree search'
  ]);

  const flowStages: Array<{ id: TutorFlowStage; label: string; number: string }> = [
    { id: 'learn', label: 'LEARN', number: '01' },
    { id: 'practice', label: 'PRACTICE', number: '02' },
    { id: 'test', label: 'TEST', number: '03' },
    { id: 'review', label: 'REVIEW', number: '04' },
    { id: 'improve', label: 'IMPROVE', number: '05' },
  ];

  const handleEvaluatePractice = () => {
    if (!practiceAnswer.trim()) return;
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setFeedback(
        'Excellent conceptual reasoning! You correctly identified memory address representation. To secure full marks in a 5-Mark format, also explicitly contrast pointer re-assignment with reference immutability.'
      );
    }, 600);
  };

  return (
    <div id="astra-personal-tutor" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-8 text-slate-100 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-emerald-400" />
                ASTRA PERSONAL TUTOR
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                AI TUTOR PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized learning loops: Learn • Practice • Test • Review • Improve
            </p>
          </div>
        </div>

        {/* Learning Parameters Selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Biotechnology">Biotechnology</option>
            <option value="Economics">Economics</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Exam Ready">Exam Ready</option>
          </select>

          <select
            value={answerFormat}
            onChange={(e) => setAnswerFormat(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-emerald-300 font-semibold focus:outline-none focus:border-emerald-400"
          >
            <option value="simple">Simple Format</option>
            <option value="detailed">Detailed Format</option>
            <option value="2-mark">2-Mark Standard</option>
            <option value="5-mark">5-Mark Standard</option>
            <option value="8-mark">8-Mark Essay</option>
            <option value="exam-format">Official Exam Format</option>
          </select>
        </div>
      </div>

      {/* 5-Step Learning Loop Header */}
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {flowStages.map((stage) => {
          const isCurrent = currentStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setCurrentStage(stage.id)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono text-emerald-400">{stage.number}</div>
              <div className="text-xs font-black tracking-wider mt-0.5">{stage.label}</div>
            </button>
          );
        })}
      </div>

      {/* Stage Body Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Playground (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentStage === 'learn' && (
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-emerald-500/30 backdrop-blur-2xl shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                    {subject} • {difficulty}
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">{topic}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {answerFormat.toUpperCase()}
                </span>
              </div>

              {/* Lesson Narrative */}
              <div className="space-y-4 text-xs md:text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Socratic Core Principle: Address Resolution & Pointers
                </h4>
                <p>
                  In computer memory, every variable is stored in a specific hexadecimal byte address. While standard variables hold values (e.g. integer 42), a <strong>pointer</strong> is a variable whose sole value is the memory address of another entity.
                </p>
                <div className="p-3.5 rounded-xl bg-black/40 font-mono text-xs text-emerald-300 border border-emerald-500/20 space-y-1">
                  <div>int score = 100;       <span className="text-slate-500">// Memory address: 0x7ffd91</span></div>
                  <div>int* ptr = &score;    <span className="text-slate-500">// ptr holds 0x7ffd91</span></div>
                  <div>*ptr = 150;           <span className="text-slate-500">// Direct mutation: score becomes 150</span></div>
                </div>
                <p className="text-xs text-slate-400">
                  Key takeaway: The asterisk <code className="text-emerald-300 font-mono">*</code> serves two purposes: type declaration (<code className="text-emerald-300 font-mono">int*</code>) and dereference operator (accessing the data at the address).
                </p>
              </div>

              {/* Quick Knowledge Check Prompt */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Ready to test your intuition?</div>
                  <div className="text-[11px] text-slate-400">Flip interactive flashcards or solve practice problems.</div>
                </div>
                <button
                  onClick={() => setCurrentStage('practice')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <span>Begin Practice</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {currentStage === 'practice' && (
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-emerald-500/30 backdrop-blur-2xl shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-200">
                    Active Practice Problem ({answerFormat.toUpperCase()})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">HINT AVAILABLE</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-sm font-bold text-white">
                  Question: What occurs when you pass a pointer by value to a function versus passing a pointer by reference?
                </div>
                <p className="text-xs text-slate-400">
                  Provide your explanation. Astra AI Tutor will evaluate your understanding, precision, and adherence to exam mark distribution.
                </p>
              </div>

              {/* User Answer Textarea */}
              <div className="space-y-3">
                <textarea
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  placeholder="Draft your solution here... (e.g., Passing by value creates a copy of the pointer address itself...)"
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-slate-900/60 border border-white/10 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-amber-300 hover:underline flex items-center gap-1"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Show Socratic Hint'}</span>
                  </button>

                  <button
                    onClick={handleEvaluatePractice}
                    disabled={isEvaluating || !practiceAnswer.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50"
                  >
                    {isEvaluating ? 'Astra Reviewing...' : 'Submit for AI Assessment'}
                  </button>
                </div>

                {showHint && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200">
                    Hint: Consider what happens if the function modifies the pointer to point to a different memory address (e.g. allocating new buffer). Does the caller see the change?
                  </div>
                )}

                {feedback && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-xs text-emerald-200 space-y-1 animate-fadeIn">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Astra Socratic Feedback</span>
                    </div>
                    <p className="leading-relaxed text-slate-200">{feedback}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flashcards Testing Mode */}
          {(currentStage === 'test' || currentStage === 'review' || currentStage === 'improve') && (
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-emerald-500/30 backdrop-blur-2xl shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-200">
                  Interactive Flashcard Deck ({activeCardIndex + 1} of {SAMPLE_FLASHCARDS.length})
                </span>
                <span className="text-[10px] font-mono text-emerald-400">FLIP TO TEST RECALL</span>
              </div>

              {/* Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[220px] p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-emerald-400/40 transition-all cursor-pointer flex flex-col justify-between select-none shadow-lg relative group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {SAMPLE_FLASHCARDS[activeCardIndex].difficulty}
                  </span>
                  <span>Click anywhere to flip</span>
                </div>

                <div className="py-4 text-center">
                  {!isFlipped ? (
                    <div className="text-base md:text-lg font-bold text-white">
                      {SAMPLE_FLASHCARDS[activeCardIndex].question}
                    </div>
                  ) : (
                    <div className="text-xs md:text-sm text-emerald-200 leading-relaxed text-left bg-black/40 p-4 rounded-2xl border border-emerald-500/30">
                      <span className="font-bold text-emerald-400 block mb-1">Model Solution:</span>
                      {SAMPLE_FLASHCARDS[activeCardIndex].answer}
                    </div>
                  )}
                </div>

                <div className="text-center text-[10px] text-slate-500">
                  {isFlipped ? 'Model solution revealed' : 'Test your mental memory before flipping'}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : SAMPLE_FLASHCARDS.length - 1));
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300"
                >
                  Previous Card
                </button>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveCardIndex((prev) => (prev < SAMPLE_FLASHCARDS.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Mistake Tracking & Progress Matrix (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-200">
                Cognitive Mastery
              </span>
              <span className="text-[10px] font-mono text-emerald-400">84% READY</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Curriculum Mastery</span>
                <span className="text-emerald-300 font-mono font-bold">14 / 16 Topics</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[84%]" />
              </div>
            </div>

            {/* Mistake Tracking Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-amber-400" />
                  Mistake Tracker
                </span>
                <span className="text-[10px] font-mono text-slate-400">{mistakesList.length} flagged</span>
              </div>

              <div className="space-y-2">
                {mistakesList.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-start justify-between gap-2"
                  >
                    <span>{m}</span>
                    <button
                      onClick={() => setMistakesList((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-white flex-shrink-0"
                      title="Mark resolved"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Format Guidance */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-white flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Distribution Guide</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Astra automatically enforces marks criteria (Definition 1 pt, Syntax 2 pts, Edge cases 2 pts).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
