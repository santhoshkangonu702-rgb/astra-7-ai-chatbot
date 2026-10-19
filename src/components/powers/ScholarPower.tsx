import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCw,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  ArrowRight,
  Brain,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { QuizQuestion, FlashcardDeck } from '../../types';
import { api } from '../../services/api';
import { SAMPLE_QUIZZES, SAMPLE_FLASHCARDS } from '../../data/sampleData';

interface ScholarPowerProps {
  onSaveToLibrary?: (item: any) => void;
}

export const ScholarPower: React.FC<ScholarPowerProps> = ({ onSaveToLibrary }) => {
  const [activeTab, setActiveTab] = useState<'tutor' | 'quiz' | 'flashcards'>('tutor');

  // Tutor state
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('History & Archaeology');
  const [gradeLevel, setGradeLevel] = useState('College / Adult');
  const [isExplaining, setIsExplaining] = useState(false);
  const [lessonExplanation, setLessonExplanation] = useState<string | null>(null);

  // Quiz state
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // Flashcards state
  const [selectedDeckIdx, setSelectedDeckIdx] = useState(0);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeQuiz = SAMPLE_QUIZZES[selectedQuizIndex] || SAMPLE_QUIZZES[0];
  const activeDeck = SAMPLE_FLASHCARDS[selectedDeckIdx] || SAMPLE_FLASHCARDS[0];

  const handleExplainConcept = async () => {
    if (!topic.trim() || isExplaining) return;
    setIsExplaining(true);
    setLessonExplanation(null);

    try {
      const res = await api.scholarRequest({
        topic,
        subject,
        difficulty: gradeLevel,
        action: 'explain'
      });
      setLessonExplanation(res.explanation);
    } catch (err) {
      console.error(err);
      setLessonExplanation(
        `### Lesson Overview: ${topic}\n\n1. **Core Concept**: Let us break this down step-by-step.\n2. **Real-Life Example**: Historical artifacts provide concrete evidence of human ingenuity.\n3. **Quick Summary**: Continuous practice reinforces deep conceptual mastery.`
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswers[currentQuestionIdx] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIdx]: optionIdx }));
    setShowExplanation((prev) => ({ ...prev, [currentQuestionIdx]: true }));
  };

  const calculateScore = () => {
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentQuestionIdx(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>AI TUTOR PRO SYSTEM</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Astra Scholar Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Learn Smarter. Think Better. Achieve More with AI Tutor Pro. Step-by-step conceptual mastery and interactive assessments.
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/10 rounded-2xl">
          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'tutor'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Step-by-Step Tutor
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive Quizzes
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flashcard Decks
          </button>
        </div>
      </div>

      {/* Tab 1: AI Step-by-Step Tutor */}
      {activeTab === 'tutor' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span>Personalized Concept Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                >
                  <option value="History & Archaeology">History & Archaeology</option>
                  <option value="Physics & Engineering">Physics & Engineering</option>
                  <option value="Mathematics & Logic">Mathematics & Logic</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Literature & Philosophy">Literature & Philosophy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Target Skill / Level</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                >
                  <option value="Middle School">Middle School (Ages 11-14)</option>
                  <option value="High School">High School (Ages 14-18)</option>
                  <option value="College / Adult">College / University</option>
                  <option value="Advanced Researcher">Advanced Scholar / Specialist</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Concept or Problem</label>
                <input
                  type="text"
                  placeholder="e.g. How the Antikythera Mechanism calculates eclipses"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleExplainConcept}
                disabled={isExplaining || !topic.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isExplaining ? 'Formulating Step-by-Step Lesson...' : 'Teach Me This Concept'}</span>
              </button>
            </div>
          </div>

          {/* Lesson result display */}
          {lessonExplanation && (
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-4 shadow-2xl animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    AI Tutor Pro Lesson
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Topic: <span className="text-white font-medium">{topic}</span>
                </div>
              </div>

              <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {lessonExplanation}
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs">
                <span className="text-emerald-300">
                  Ready to test your retention on this concept?
                </span>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Take Practice Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Interactive Quizzes */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Deck selector */}
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUIZZES.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQuizIndex(idx);
                  resetQuiz();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedQuizIndex === idx
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {q.title} ({q.questions.length} Qs)
              </button>
            ))}
          </div>

          {!quizFinished ? (
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">
                  Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                  {activeQuiz.subject}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100}%`
                  }}
                />
              </div>

              {/* Question text */}
              <h3 className="text-lg md:text-xl font-bold text-white">
                {activeQuiz.questions[currentQuestionIdx].question}
              </h3>

              {/* Options list */}
              <div className="space-y-3">
                {activeQuiz.questions[currentQuestionIdx].options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
                  const isAnswered = selectedAnswers[currentQuestionIdx] !== undefined;
                  const isCorrect = activeQuiz.questions[currentQuestionIdx].correctIndex === optIdx;

                  let btnStyle = 'bg-black/30 border-white/10 hover:border-white/20 text-slate-200';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-200';
                    } else {
                      btnStyle = 'bg-black/20 border-white/5 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center font-mono text-xs text-slate-400">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note */}
              {showExplanation[currentQuestionIdx] && (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>AI Tutor Explanation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeQuiz.questions[currentQuestionIdx].explanation}
                  </p>
                </div>
              )}

              {/* Next / Finish navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
                >
                  Previous
                </button>

                {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                  <button
                    disabled={selectedAnswers[currentQuestionIdx] === undefined}
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled={selectedAnswers[currentQuestionIdx] === undefined}
                    onClick={() => setQuizFinished(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-slate-950 font-bold text-xs shadow-lg"
                  >
                    Complete Quiz & View Score
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Score Card */
            <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You scored {calculateScore()} out of {activeQuiz.questions.length} questions correctly.
                </p>
              </div>

              <div className="text-4xl font-extrabold text-emerald-400 font-mono">
                {Math.round((calculateScore() / activeQuiz.questions.length) * 100)}%
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                >
                  Retry Quiz
                </button>
                <button
                  onClick={() => setActiveTab('tutor')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                >
                  Study Another Topic
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Interactive Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {SAMPLE_FLASHCARDS.map((deck, idx) => (
              <button
                key={deck.id}
                onClick={() => {
                  setSelectedDeckIdx(idx);
                  setCurrentCardIdx(0);
                  setIsFlipped(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedDeckIdx === idx
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {deck.title} ({deck.cards.length} Cards)
              </button>
            ))}
          </div>

          <div className="max-w-xl mx-auto space-y-4">
            {/* The Flashcard */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-80 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-500/30 p-8 flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-all shadow-2xl relative select-none"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">
                  Card {currentCardIdx + 1} of {activeDeck.cards.length}
                </span>
                <span className="text-[10px] font-mono uppercase text-emerald-400">
                  {isFlipped ? 'Answer / Insight' : 'Question / Term'}
                </span>
              </div>

              <div className="text-center py-6">
                <h4 className="text-xl sm:text-2xl font-bold text-white">
                  {isFlipped
                    ? activeDeck.cards[currentCardIdx].back
                    : activeDeck.cards[currentCardIdx].front}
                </h4>
              </div>

              <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <RotateCw className="w-3 h-3" />
                <span>Click or tap to flip card</span>
              </div>
            </div>

            {/* Flashcard Navigation */}
            <div className="flex items-center justify-between px-4">
              <button
                disabled={currentCardIdx === 0}
                onClick={() => {
                  setCurrentCardIdx((p) => Math.max(0, p - 1));
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200"
              >
                Flip
              </button>

              <button
                disabled={currentCardIdx === activeDeck.cards.length - 1}
                onClick={() => {
                  setCurrentCardIdx((p) => Math.min(activeDeck.cards.length - 1, p + 1));
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
