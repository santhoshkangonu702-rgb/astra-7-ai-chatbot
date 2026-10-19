import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Brain,
  RotateCcw,
  Check,
  X,
  ArrowRight,
  ListOrdered,
  Calendar,
  Layers,
  ChevronRight,
  Lightbulb,
  Award,
  ArrowLeft,
  FileCheck2
} from 'lucide-react';
import { api } from '../../services/api';
import { StudyFlashcard, StudyQuizQuestion } from '../../types';

interface StudyAssistantToolProps {
  onBack?: () => void;
}

export const StudyAssistantTool: React.FC<StudyAssistantToolProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'explain' | 'exam_prep' | 'solver' | 'flashcards' | 'quiz' | 'notes'>('explain');
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [difficulty, setDifficulty] = useState('College / Undergraduate');
  const [examMarkWeight, setExamMarkWeight] = useState<'2-mark' | '5-mark' | '8-mark'>('5-mark');
  const [topic, setTopic] = useState('');
  const [problemQuery, setProblemQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Concept / Notes / Solver content
  const [explanationContent, setExplanationContent] = useState('');
  const [solverHints, setSolverHints] = useState<string[]>([]);
  const [showFullSolution, setShowFullSolution] = useState(false);

  // Flashcards state
  const [flashcards, setFlashcards] = useState<StudyFlashcard[]>([
    {
      id: 'fc-default-1',
      front: 'What is the time complexity of QuickSort average vs worst case?',
      back: 'Average case: O(n log n). Worst case: O(n²) when the pivot chosen is consistently the extreme element (already sorted array with bad pivot).',
      category: 'Data Structures'
    },
    {
      id: 'fc-default-2',
      front: 'What are ACID properties in DBMS?',
      back: 'Atomicity (all or nothing), Consistency (preserves database integrity), Isolation (concurrent executions are independent), Durability (committed changes persist).',
      category: 'DBMS'
    },
    {
      id: 'fc-default-3',
      front: 'What is a Semaphore in Operating Systems?',
      back: 'A synchronization variable used to control access to shared resources in a multi-threaded system. Types: Binary (0 or 1, mutex) and Counting.',
      category: 'Operating Systems'
    }
  ]);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<StudyQuizQuestion[]>([
    {
      id: 'q-default-1',
      question: 'In C++, which keyword is used to prevent an object from being modified by a member function?',
      options: ['static', 'const', 'volatile', 'mutable'],
      correctIndex: 1,
      explanation: 'A const member function guarantees it will not modify any non-mutable member variables.'
    },
    {
      id: 'q-default-2',
      question: 'Which OSI model layer handles end-to-end flow control and reliable transmission?',
      options: ['Network Layer', 'Data Link Layer', 'Transport Layer', 'Session Layer'],
      correctIndex: 2,
      explanation: 'The Transport Layer (TCP) provides reliable segment sequencing, error detection, and flow control.'
    }
  ]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const subjects = [
    'C Programming',
    'C++',
    'Java',
    'Python',
    'Data Structures & Algorithms',
    'DBMS',
    'Operating Systems',
    'Computer Networks',
    'Digital Electronics',
    'Engineering Mathematics',
    'Physics',
    'Chemistry'
  ];

  const difficulties = [
    'High School',
    'College / Undergraduate',
    'Advanced / Graduate'
  ];

  const handleAction = async (overrideAction?: typeof activeTab) => {
    const actionToRun = overrideAction || activeTab;
    const currentTopic = topic.trim() || (actionToRun === 'solver' ? problemQuery.trim() : 'Fundamental Core Principles');

    setLoading(true);
    try {
      if (actionToRun === 'exam_prep') {
        const markGuidelines = {
          '2-mark': 'Format as a 2-Mark University Exam Answer: Crisp definition, key formula, and concise bullet points (under 50 words).',
          '5-mark': 'Format as a 5-Mark University Exam Answer: Structured conceptual breakdown with numbered points, architecture/schematic description, and key advantages/use-cases.',
          '8-mark': 'Format as an 8-Mark University Exam Answer: In-depth technical derivation, step-by-step mathematical proof, ASCII/block diagram description, comprehensive analysis, and real-world engineering trade-offs.'
        }[examMarkWeight];

        const res = await api.performStudyAction({
          action: 'explain',
          topic: currentTopic,
          subject,
          difficulty,
          query: `[EXAM PREP - ${examMarkWeight.toUpperCase()}] Subject: ${subject}. Topic: ${currentTopic}. ${markGuidelines} End with quick summary.`
        });
        setExplanationContent(res.content || '');
      } else if (actionToRun === 'explain' || actionToRun === 'notes') {
        const res = await api.performStudyAction({
          action: actionToRun,
          topic: currentTopic,
          subject,
          difficulty,
          query: `Please explain this topic clearly with step-by-step engineering intuition, real-world applications, follow-up practice check questions, and end with a quick summary: ${currentTopic}`
        });
        setExplanationContent(res.content || '');
      } else if (actionToRun === 'flashcards') {
        const res = await api.performStudyAction({
          action: 'flashcards',
          topic: currentTopic,
          subject,
          difficulty
        });
        if (res.flashcards && res.flashcards.length > 0) {
          setFlashcards(res.flashcards);
          setFlippedCards({});
          setMasteredCards({});
        }
      } else if (actionToRun === 'quiz') {
        const res = await api.performStudyAction({
          action: 'quiz',
          topic: currentTopic,
          subject,
          difficulty
        });
        if (res.questions && res.questions.length > 0) {
          setQuizQuestions(res.questions);
          setUserAnswers({});
          setQuizSubmitted(false);
        }
      } else if (actionToRun === 'solver') {
        const res = await api.performStudyAction({
          action: 'problem_solve',
          topic: currentTopic,
          subject,
          difficulty,
          query: problemQuery
        });
        setExplanationContent(res.content || '');
        setSolverHints([
          'Hint 1: Write down all known parameters and required target variables.',
          'Hint 2: Identify the governing conservation law or mathematical formula.',
          'Hint 3: Watch your dimension units before performing final substitutions.'
        ]);
        setShowFullSolution(false);
      }
    } catch (err: any) {
      setExplanationContent(`Unable to load study module: ${err.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMastered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMasteredCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Back Button and AI Tutor Pro branding */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:text-amber-500 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-all shrink-0"
                title="Return to Astra 7 Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>AI Tutor Pro • Socratic Learning Suite</span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Study Assistant & STEM Solver</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                “Learn Smarter. Think Better. Achieve More with AI Tutor Pro.”
              </p>
            </div>
          </div>

          {/* Subject & Difficulty Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Study Mode Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'explain', label: 'Explain Concept', icon: Brain },
            { id: 'exam_prep', label: 'University Exam Prep (2/5/8 Marks)', icon: FileCheck2 },
            { id: 'solver', label: 'Step-by-Step Problem Solver', icon: ListOrdered },
            { id: 'flashcards', label: 'Interactive Flashcards', icon: Layers },
            { id: 'quiz', label: 'Practice Quiz & MCQs', icon: Award },
            { id: 'notes', label: 'High-Yield Notes', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'flashcards' && flashcards.length === 0) handleAction('flashcards');
                  if (tab.id === 'quiz' && quizQuestions.length === 0) handleAction('quiz');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Exam Prep Mark Weight Selector */}
        {activeTab === 'exam_prep' && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-amber-300">Exam Question Standard:</span>
            <div className="flex items-center gap-2">
              {(
                [
                  { id: '2-mark', label: '2-Mark (Definitions & Formula)' },
                  { id: '5-mark', label: '5-Mark (Structured Points)' },
                  { id: '8-mark', label: '8-Mark (Derivations & Deep Analysis)' }
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setExamMarkWeight(m.id)}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    examMarkWeight === m.id
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar for Topic / Question */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={activeTab === 'solver' ? problemQuery : topic}
              onChange={(e) => activeTab === 'solver' ? setProblemQuery(e.target.value) : setTopic(e.target.value)}
              placeholder={
                activeTab === 'explain'
                  ? 'Enter topic to explain (e.g. Photosynthesis, Bayes Theorem, TCP Handshake)...'
                  : activeTab === 'flashcards'
                  ? 'Enter topic for flashcards (e.g. Organic Chemistry Functional Groups)...'
                  : activeTab === 'quiz'
                  ? 'Enter quiz subject/topic (e.g. World War II Turning Points)...'
                  : activeTab === 'solver'
                  ? 'Paste math or science problem here (e.g. Find derivative of f(x) = 3x^3 - 4x + 2)...'
                  : 'Enter topic for concise revision notes...'
              }
              className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handleAction()}
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1 & 5: Concept Explainer / Notes */}
        {(activeTab === 'explain' || activeTab === 'notes') && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeTab === 'explain' ? 'Concept Explanation' : 'High-Yield Notes'}
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {subject} • {difficulty}
              </span>
            </div>

            {explanationContent ? (
              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {explanationContent}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Brain className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs">Type a topic above and click Generate to start learning.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Interactive Flashcards */}
        {activeTab === 'flashcards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Click any card to flip and view the answer
              </div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Mastered: {Object.values(masteredCards).filter(Boolean).length} / {flashcards.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcards.map((card, idx) => {
                const isFlipped = !!flippedCards[card.id];
                const isMastered = !!masteredCards[card.id];
                return (
                  <div
                    key={card.id || idx}
                    onClick={() => toggleCardFlip(card.id)}
                    className={`cursor-pointer rounded-3xl p-6 border transition-all duration-300 min-h-[220px] flex flex-col justify-between select-none ${
                      isFlipped
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {card.category || subject} #{idx + 1}
                        </span>
                        <button
                          onClick={(e) => toggleMastered(card.id, e)}
                          title={isMastered ? 'Mark for review' : 'Mark as mastered'}
                          className={`p-1.5 rounded-full transition-colors ${
                            isMastered
                              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'text-slate-300 hover:text-emerald-500'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {isFlipped ? 'Answer' : 'Question / Term'}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        {isFlipped ? card.back : card.front}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Click to flip</span>
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Practice Quiz */}
        {activeTab === 'quiz' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Practice Assessment ({quizQuestions.length} Questions)
                </h2>
              </div>
              {quizSubmitted && (
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Score: {calculateScore()} / {quizQuestions.length} ({Math.round((calculateScore() / quizQuestions.length) * 100)}%)
                </div>
              )}
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, qIndex) => {
                const selectedOption = userAnswers[q.id];
                const isAnswered = selectedOption !== undefined;
                return (
                  <div key={q.id || qIndex} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pt-0.5">
                        {q.question}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIndex) => {
                        let btnStyle = 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                        if (selectedOption === optIndex) {
                          btnStyle = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-400';
                        }
                        if (quizSubmitted) {
                          if (optIndex === q.correctIndex) {
                            btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500 font-bold';
                          } else if (selectedOption === optIndex && optIndex !== q.correctIndex) {
                            btnStyle = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-400';
                          }
                        }

                        return (
                          <button
                            key={optIndex}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setUserAnswers((prev) => ({ ...prev, [q.id]: optIndex }));
                              }
                            }}
                            className={`p-3 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                          >
                            <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIndex)}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {quizSubmitted ? (
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Reset Quiz
                </button>
              ) : (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all"
                >
                  Submit & Check Answers
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Step-by-Step Solver */}
        {activeTab === 'solver' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Homework & Equation Problem Solver
                </h2>
              </div>
            </div>

            {solverHints.length > 0 && !showFullSolution && (
              <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Lightbulb className="w-4 h-4" />
                  <span>Socratic Guidance (Hints before answers)</span>
                </div>
                <div className="space-y-1.5">
                  {solverHints.map((hint, i) => (
                    <p key={i} className="text-xs text-slate-700 dark:text-slate-300">
                      • {hint}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => setShowFullSolution(true)}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Reveal Step-by-Step Solution
                </button>
              </div>
            )}

            {showFullSolution && explanationContent && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {explanationContent}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
