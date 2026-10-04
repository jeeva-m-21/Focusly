import React, { useState } from 'react';
import {
  RotateCw,
  Award,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  Layers,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFocusStore } from '../../store/useFocusStore';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { calculateRetentionProbability, ReviewGrade } from '../../algorithms/spacedRepetition';

export const ExamPrepView: React.FC = () => {
  const {
    examTopics,
    flashcards,
    courses,
    updateTopicConfidence,
    reviewFlashcardSM2,
    mockQuestions,
    mockExamState,
    answerMockQuestion,
    submitMockExam,
    resetMockExam
  } = useFocusStore();

  const [activeTab, setActiveTab] = useState<'matrix' | 'flashcards' | 'mock'>('matrix');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeFlashcard = flashcards[currentFlashcardIndex];
  const activeTopic = activeFlashcard ? examTopics.find((t) => t.id === activeFlashcard.topicId) : null;
  const activeCourse = activeTopic ? courses.find((c) => c.id === activeTopic.courseId) : null;

  const currentCardProgress = activeFlashcard
    ? {
        cardId: activeFlashcard.id,
        repetitions: activeFlashcard.repetitions ?? 0,
        intervalDays: activeFlashcard.intervalDays ?? 1,
        easeFactor: activeFlashcard.easeFactor ?? 2.5,
        lastReviewedTimestamp: activeFlashcard.lastReviewedTimestamp ?? Date.now(),
        nextReviewTimestamp: activeFlashcard.nextReviewTimestamp ?? Date.now(),
        retentionPercent: activeFlashcard.retentionPercent ?? 50
      }
    : null;

  const cardRetention = currentCardProgress ? calculateRetentionProbability(currentCardProgress) : 50;

  const handleSM2Review = (grade: ReviewGrade) => {
    if (activeFlashcard) {
      reviewFlashcardSM2(activeFlashcard.id, grade);
    }
    if (grade >= 3) {
      confetti({
        particleCount: grade === 4 ? 40 : 20,
        spread: 50,
        origin: { y: 0.75 }
      });
    }
    setIsFlipped(false);
    setCurrentFlashcardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handleMockSubmit = () => {
    submitMockExam();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5df] dark:border-[#22242f] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9da0a6] dark:text-[#676b76] font-semibold">
              EXAM PREP & PRACTICE STUDIO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
            Exam Mastery & Recall
          </h1>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
            Spaced repetition flashcards, topic confidence matrix, and simulated timed midterm engines.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center bg-[#f4f1eb] dark:bg-[#181922] p-1 rounded-xl border border-[#e8e5df] dark:border-[#242630] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-white dark:bg-[#252834] text-[#1c1d21] dark:text-[#f0eff4] shadow-xs'
                : 'text-[#64676e] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
            }`}
          >
            Topic Matrix
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-[#252834] text-[#1c1d21] dark:text-[#f0eff4] shadow-xs'
                : 'text-[#64676e] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
            }`}
          >
            Flashcards ({flashcards.length})
          </button>
          <button
            onClick={() => setActiveTab('mock')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'mock'
                ? 'bg-white dark:bg-[#252834] text-[#1c1d21] dark:text-[#f0eff4] shadow-xs'
                : 'text-[#64676e] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
            }`}
          >
            Timed Mock Exam
          </button>
        </div>
      </div>

      {/* TAB 1: TOPIC OVERVIEW MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-[#fff1f2]/60 dark:bg-[#881337]/20 border-[#fecdd3] dark:border-[#881337]/50 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#be123c] dark:text-rose-400 uppercase tracking-wide">
                  Needs Practice
                </span>
                <span className="text-xs font-mono font-medium text-[#be123c] dark:text-rose-300 bg-white dark:bg-[#1a1518] px-2 py-0.5 rounded-full border border-[#fecdd3] dark:border-[#881337]">
                  &lt;50%
                </span>
              </div>
              <div className="text-2xl font-bold text-[#be123c] dark:text-rose-400 my-2">2 Topics</div>
              <p className="text-[11.5px] text-[#be123c]/90 dark:text-rose-300/90 leading-normal">
                Pointers & SVD proofs need extra review before Friday section.
              </p>
            </Card>

            <Card className="p-4 bg-[#fffbeb]/60 dark:bg-[#78350f]/20 border-[#fde68a] dark:border-[#78350f]/50 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#b45309] dark:text-amber-400 uppercase tracking-wide">
                  In Progress
                </span>
                <span className="text-xs font-mono font-medium text-[#b45309] dark:text-amber-300 bg-white dark:bg-[#1a1713] px-2 py-0.5 rounded-full border border-[#fde68a] dark:border-[#78350f]">
                  50–79%
                </span>
              </div>
              <div className="text-2xl font-bold text-[#b45309] dark:text-amber-400 my-2">1 Topic</div>
              <p className="text-[11.5px] text-[#b45309]/90 dark:text-amber-300/90 leading-normal">
                Induction over trees needs 1 more practice session.
              </p>
            </Card>

            <Card className="p-4 bg-[#f0fdf4]/60 dark:bg-[#064e3b]/20 border-[#bbf7d0] dark:border-[#065f46]/50 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#15803d] dark:text-emerald-400 uppercase tracking-wide">
                  Mastered
                </span>
                <span className="text-xs font-mono font-medium text-[#15803d] dark:text-emerald-300 bg-white dark:bg-[#121a16] px-2 py-0.5 rounded-full border border-[#bbf7d0] dark:border-[#065f46]">
                  ≥80%
                </span>
              </div>
              <div className="text-2xl font-bold text-[#15803d] dark:text-emerald-400 my-2">2 Topics</div>
              <p className="text-[11.5px] text-[#15803d]/90 dark:text-emerald-300/90 leading-normal">
                Backtracking and Gram-Schmidt algorithms solid.
              </p>
            </Card>
          </div>

          {/* Matrix Table */}
          <Card className="bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs overflow-hidden">
            <CardHeader
              title="Course Topics & Confidence Scores"
              subtitle="Track your confidence across midterms and finals"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f6f2] dark:bg-[#181922] border-b border-[#e8e5df] dark:border-[#22242f] text-[#64676e] dark:text-[#9ba0a9] text-[10px] font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-5">Course</th>
                    <th className="py-3 px-5">Topic</th>
                    <th className="py-3 px-5">Confidence Meter</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede6] dark:divide-[#22242f]">
                  {examTopics.map((topic) => {
                    const course = courses.find((c) => c.id === topic.courseId);
                    return (
                      <tr key={topic.id} className="hover:bg-[#faf8f5] dark:hover:bg-[#181924] transition-colors">
                        <td className="py-3 px-5 font-mono font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
                          {course?.code}
                        </td>
                        <td className="py-3 px-5 font-medium text-[#1c1d21] dark:text-[#f0eff4]">
                          {topic.topic}
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-28 bg-[#f4f1eb] dark:bg-[#1f212a] h-2 rounded-full overflow-hidden border border-[#e8e5df] dark:border-[#2b2e3c]">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  topic.status === 'critical'
                                    ? 'bg-rose-500'
                                    : topic.status === 'moderate'
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-600 dark:bg-emerald-500'
                                }`}
                                style={{ width: `${topic.confidencePercent}%` }}
                              />
                            </div>
                            <span className="font-mono font-semibold text-[#1c1d21] dark:text-[#f0eff4] text-[11px] w-8">
                              {topic.confidencePercent}%
                            </span>
                            {/* Confidence Nudges */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateTopicConfidence(topic.id, -5)}
                                title="Decrease confidence"
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f4f1eb] dark:bg-[#1e2029] text-[#787b84] hover:text-[#1c1d21] dark:hover:text-white cursor-pointer"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => updateTopicConfidence(topic.id, 5)}
                                title="Increase confidence"
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f4f1eb] dark:bg-[#1e2029] text-[#787b84] hover:text-[#1c1d21] dark:hover:text-white cursor-pointer"
                              >
                                +5
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          {topic.status === 'critical' ? (
                            <Badge variant="rose">Needs Practice</Badge>
                          ) : topic.status === 'moderate' ? (
                            <Badge variant="amber">In Progress</Badge>
                          ) : (
                            <Badge variant="emerald">Mastered</Badge>
                          )}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab('flashcards')}
                            className="text-xs font-semibold"
                          >
                            Drill
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: SPACED FLASHCARDS DRILL */}
      {activeTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
          {/* Deck Header & Progress */}
          <div className="flex items-center justify-between text-xs text-[#787b84] dark:text-[#8d929e]">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                Card {currentFlashcardIndex + 1} of {flashcards.length}
              </span>
              {activeCourse && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#f4f1eb] dark:bg-[#20222b] text-[#1c1d21] dark:text-[#f0eff4] border border-[#e8e5df] dark:border-[#2d303f]">
                  {activeCourse.code}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono">
                {Math.round(((currentFlashcardIndex + 1) / flashcards.length) * 100)}% deck
              </span>
            </div>
          </div>

          {/* Tactile 3D Flip Flashcard */}
          {activeFlashcard ? (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full min-h-[300px] rounded-2xl border-2 border-[#e8e5df] dark:border-[#2a2d3b] bg-white dark:bg-[#14151c] p-7 shadow-sm cursor-pointer select-none flex flex-col justify-between hover:border-[#1c1d21] dark:hover:border-white transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#787b84] dark:text-[#8d929e] mb-4">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-amber-600 dark:text-amber-400">
                    {isFlipped ? 'ANSWER / CONCEPT' : 'QUESTION'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[#787b84] dark:text-[#8d929e] group-hover:text-[#1c1d21] dark:group-hover:text-white transition-colors">
                    <RotateCw className="w-3 h-3" />
                    <span>Click to flip</span>
                  </span>
                </div>

                <div className="text-base sm:text-lg font-bold text-[#1c1d21] dark:text-[#f0eff4] leading-relaxed mt-2 whitespace-pre-line">
                  {isFlipped ? activeFlashcard.back : activeFlashcard.front}
                </div>
              </div>

              <div className="pt-4 border-t border-[#f4f1eb] dark:border-[#1e2029] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#787b84] dark:text-[#8d929e]">
                <div className="flex items-center gap-2">
                  <span>
                    Difficulty: <strong className="text-[#1c1d21] dark:text-[#f0eff4] capitalize">{activeFlashcard.difficulty}</strong>
                  </span>
                  <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-[#f4f1eb] dark:bg-[#1e2029] text-[#1c1d21] dark:text-[#f0eff4]">
                    EF {currentCardProgress?.easeFactor.toFixed(2) || '2.50'}
                  </span>
                  <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                    {cardRetention}% retention
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                  {isFlipped ? 'Rate recall accuracy below (SM-2)' : 'Tap to reveal answer'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#64676e] dark:text-[#9ba0a9]">
              No flashcards in deck.
            </div>
          )}

          {/* SuperMemo SM-2 Spaced Repetition Recall Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#787b84] dark:text-[#8d929e]">
              <span className="font-mono uppercase font-bold text-[10px]">SM-2 Interval Scheduling</span>
              <span>Next review dates auto-calculated</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button
                variant="outline"
                className="py-2.5 flex flex-col items-center text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                onClick={() => handleSM2Review(1)}
              >
                <span className="font-bold text-xs">Again</span>
                <span className="text-[10px] font-mono opacity-80">&lt;1 day • Reset</span>
              </Button>
              <Button
                variant="outline"
                className="py-2.5 flex flex-col items-center text-slate-700 dark:text-slate-300"
                onClick={() => handleSM2Review(2)}
              >
                <span className="font-bold text-xs">Hard</span>
                <span className="text-[10px] font-mono opacity-80">1 day • -EF</span>
              </Button>
              <Button
                variant="outline"
                className="py-2.5 flex flex-col items-center text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                onClick={() => handleSM2Review(3)}
              >
                <span className="font-bold text-xs">Good</span>
                <span className="text-[10px] font-mono opacity-80">
                  +{Math.max(1, Math.round((currentCardProgress?.intervalDays || 1) * (currentCardProgress?.easeFactor || 2.5)))}d
                </span>
              </Button>
              <Button
                variant="primary"
                className="py-2.5 flex flex-col items-center font-semibold"
                onClick={() => handleSM2Review(4)}
              >
                <span className="font-bold text-xs">Easy</span>
                <span className="text-[10px] font-mono opacity-80">
                  +{Math.max(2, Math.round((currentCardProgress?.intervalDays || 1) * (currentCardProgress?.easeFactor || 2.5) * 1.3))}d
                </span>
              </Button>
            </div>

            {/* Deck Navigation Controls */}
            <div className="flex items-center justify-between pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentFlashcardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                }}
                icon={<ChevronLeft className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Previous
              </Button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="text-xs text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white transition-colors cursor-pointer"
              >
                Flip Card (Space)
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentFlashcardIndex((prev) => (prev + 1) % flashcards.length);
                }}
                className="text-xs"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIMED MOCK EXAM */}
      {activeTab === 'mock' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <Card className="p-6 bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f4f1eb] dark:border-[#1e2029]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                  FALL '26 MIDTERM SIMULATOR
                </span>
                <h2 className="text-xl font-bold text-[#1c1d21] dark:text-[#f0eff4] mt-0.5 tracking-tight">
                  CS 106B Midterm Practice Test #2
                </h2>
                <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                  Algorithmic efficiency, recursive backtracking, pointers & heap invariants.
                </p>
              </div>

              {mockExamState.isSubmitted ? (
                <div className="text-right">
                  <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 block">
                    {mockExamState.score}%
                  </span>
                  <span className="text-xs text-[#787b84] dark:text-[#8d929e] font-mono">
                    Score Result
                  </span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4] block">
                    24:15
                  </span>
                  <span className="text-[11px] font-mono text-[#787b84] dark:text-[#8d929e]">
                    Timed Practice
                  </span>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6 my-4">
              {mockQuestions.map((q, qIndex) => {
                const selectedOption = mockExamState.answers[q.id];
                const isCorrect = selectedOption === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-[#fcfbf9] dark:bg-[#181922] border border-[#e8e5df] dark:border-[#242634] space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] bg-white dark:bg-[#20222c] border border-[#e8e5df] dark:border-[#2c2f3c] px-2 py-0.5 rounded">
                        Q{qIndex + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-[#1c1d21] dark:text-[#f0eff4] flex-1 leading-snug">
                        {q.question}
                      </p>
                    </div>

                    {q.codeSnippet && (
                      <pre className="p-3.5 rounded-xl bg-white dark:bg-[#111217] text-[#1c1d21] dark:text-[#f0eff4] font-mono text-xs border border-[#e8e5df] dark:border-[#262835] overflow-x-auto leading-relaxed">
                        {q.codeSnippet}
                      </pre>
                    )}

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIndex) => (
                        <button
                          key={optIndex}
                          disabled={mockExamState.isSubmitted}
                          onClick={() => answerMockQuestion(q.id, optIndex)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                            selectedOption === optIndex
                              ? 'bg-[#1c1d21] text-white dark:bg-white dark:text-[#121316] border-transparent font-semibold shadow-2xs'
                              : 'bg-white dark:bg-[#14151c] border-[#e8e5df] dark:border-[#262835] text-[#1c1d21] dark:text-[#f0eff4] hover:border-[#1c1d21] dark:hover:border-white'
                          } ${
                            mockExamState.isSubmitted && optIndex === q.correctIndex
                              ? '!border-emerald-500 !bg-emerald-50 dark:!bg-emerald-950/40 !text-emerald-800 dark:!text-emerald-300 font-bold'
                              : ''
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedOption === optIndex && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#121316] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    {mockExamState.isSubmitted && (
                      <div
                        className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                        }`}
                      >
                        <div className="font-bold mb-1 flex items-center gap-1.5">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Correct answer</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                              <span>Incorrect</span>
                            </>
                          )}
                        </div>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Exam Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#f4f1eb] dark:border-[#1e2029]">
              <Button
                variant="outline"
                size="sm"
                onClick={resetMockExam}
                className="text-xs font-semibold"
              >
                Reset & Retake
              </Button>

              {!mockExamState.isSubmitted ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleMockSubmit}
                  className="text-xs font-semibold"
                >
                  Submit Practice Exam
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Exam Completed & Logged
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
