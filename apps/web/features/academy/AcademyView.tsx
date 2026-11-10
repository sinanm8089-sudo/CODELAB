"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  Play,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Code,
  Terminal,
  Sparkles
} from "lucide-react";
import { ApiClient } from "../../services/api";

interface AcademyProps {
  onOpenInIde: (code: string, language: string) => void;
  currentUser: any;
  onRefreshAnalytics: () => void;
}

export const AcademyView: React.FC<AcademyProps> = ({
  onOpenInIde,
  currentUser,
  onRefreshAnalytics,
}) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [currentLesson, setCurrentLesson] = useState<any | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [activeCodeLang, setActiveCodeLang] = useState<string>("python");

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const data = await ApiClient.listLessons();
      setLessons(data);
      if (data.length > 0 && !selectedLessonId) {
        setSelectedLessonId(data[0].id);
      }
    } catch {
      // handled
    }
  };

  useEffect(() => {
    if (selectedLessonId) {
      loadLessonDetail(selectedLessonId);
    }
  }, [selectedLessonId]);

  const loadLessonDetail = async (id: number) => {
    try {
      const detail = await ApiClient.getLesson(id);
      setCurrentLesson(detail);
      setSelectedQuizOption(null);
      setQuizResult(null);
      if (detail.example_codes && Object.keys(detail.example_codes).length > 0) {
        setActiveCodeLang(Object.keys(detail.example_codes)[0]);
      }
    } catch {
      // handled
    }
  };

  const handleQuizSubmit = async () => {
    if (selectedQuizOption === null || !currentLesson) return;
    setSubmittingQuiz(true);
    try {
      const res = await ApiClient.submitQuiz(currentLesson.id, selectedQuizOption);
      setQuizResult(res);
      loadLessons();
      onRefreshAnalytics();
    } catch {
      // handled
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const currentIndex = lessons.findIndex((l) => l.id === selectedLessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Sidebar: 25 Lessons Checklist */}
      <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 lg:col-span-1 shadow-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[#8B7BFF]" /> Beginner Academy
            </h2>
            <p className="text-[11px] text-zinc-400">Curriculum (Zero to Hero)</p>
          </div>
          <span className="rounded-full bg-[#8B7BFF]/20 px-2 py-0.5 text-[10px] font-bold text-[#8B7BFF]">
            {lessons.filter((l) => l.completed).length}/{lessons.length}
          </span>
        </div>

        <div className="mt-3 space-y-1.5">
          {lessons.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            return (
              <button
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                  isSelected
                    ? "bg-[#8B7BFF]/20 text-white border border-[#8B7BFF]/40 shadow-sm"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[10px] text-zinc-500">{lesson.order_index}.</span>
                  <span className="truncate font-medium">{lesson.title}</span>
                </div>
                {lesson.completed && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lesson Content */}
      <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-6 lg:col-span-3 shadow-xl space-y-6 max-h-[85vh] overflow-y-auto">
        {currentLesson ? (
          <>
            {/* Header */}
            <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#8B7BFF]/20 px-2 py-0.5 text-[10px] font-bold text-[#8B7BFF] uppercase">
                    Lesson {currentLesson.order_index}
                  </span>
                  <span className="text-xs text-zinc-400">• {currentLesson.category}</span>
                  <span className="text-xs text-zinc-400">• {currentLesson.estimated_minutes} min read</span>
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300 font-semibold flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-purple-400" /> AI Tutoring Supported
                  </span>
                </div>
                <h1 className="mt-1 text-2xl font-bold text-white">{currentLesson.title}</h1>
              </div>

              {currentLesson.completed && (
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Lesson Completed
                </div>
              )}
            </div>

            {/* Definition */}
            <div className="rounded-xl border border-white/5 bg-[#111725] p-4">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Concept Definition</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">{currentLesson.definition}</p>
            </div>

            {/* Real World Analogy Card */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4" /> Real-World Mental Model (Analogy)
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-300">{currentLesson.analogy}</p>
            </div>

            {/* Visual Diagram */}
            {currentLesson.visual_diagram && (
              <div className="rounded-xl border border-white/10 bg-[#0B0D14] p-4 font-mono text-xs text-[#76A9FF]">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 font-sans">
                  Visual Architecture Diagram
                </h3>
                <pre className="whitespace-pre-wrap">{currentLesson.visual_diagram}</pre>
              </div>
            )}

            {/* Runnable Example Code */}
            {currentLesson.example_codes && Object.keys(currentLesson.example_codes).length > 0 && (
              <div className="rounded-xl border border-white/10 bg-[#0B0D14] p-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-[#8B7BFF]" />
                    <span className="text-xs font-bold text-white">Runnable Example Code</span>
                    <div className="flex gap-1 ml-2">
                      {Object.keys(currentLesson.example_codes).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setActiveCodeLang(lang)}
                          className={`rounded px-2 py-0.5 text-[10px] font-mono capitalize ${
                            activeCodeLang === lang ? "bg-[#8B7BFF] text-white" : "text-zinc-500 hover:text-white"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onOpenInIde(currentLesson.example_codes[activeCodeLang] || "", activeCodeLang)
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#8B7BFF] to-[#76A9FF] px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:brightness-110"
                  >
                    <Terminal className="h-3.5 w-3.5" /> Run in Monaco IDE
                  </button>
                </div>

                <pre className="mt-3 overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed">
                  <code>{currentLesson.example_codes[activeCodeLang]}</code>
                </pre>
              </div>
            )}

            {/* Line-by-Line Breakdown */}
            {currentLesson.line_by_line && Object.keys(currentLesson.line_by_line).length > 0 && (
              <div className="rounded-xl border border-white/10 bg-[#111725] p-4">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
                  Line-by-Line Execution Breakdown
                </h3>
                <div className="space-y-2">
                  {Object.entries(currentLesson.line_by_line).map(([line, text]: [string, any]) => (
                    <div key={line} className="flex items-start gap-3 text-xs">
                      <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-[#8B7BFF]">
                        Line {line}
                      </span>
                      <p className="text-zinc-300">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Beginner Mistakes */}
            {currentLesson.common_mistakes && currentLesson.common_mistakes.length > 0 && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Common Beginner Pitfalls & Fixes
                </h3>
                <div className="mt-3 space-y-2">
                  {currentLesson.common_mistakes.map((m: any, i: number) => (
                    <div key={i} className="text-xs space-y-1">
                      <p className="font-semibold text-zinc-200">❌ Mistake: {m.mistake}</p>
                      <p className="text-emerald-400">✔️ Correction: {m.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Knowledge Check Quiz */}
            {currentLesson.quiz && currentLesson.quiz.question && (
              <div className="rounded-xl border border-[#8B7BFF]/30 bg-[#8B7BFF]/5 p-5">
                <h3 className="text-xs font-bold text-[#8B7BFF] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" /> Knowledge-Check Quiz
                </h3>
                <p className="mt-2 text-sm font-semibold text-white">{currentLesson.quiz.question}</p>

                <div className="mt-3 space-y-2">
                  {currentLesson.quiz.options?.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedQuizOption(idx)}
                      className={`w-full flex items-center justify-between rounded-xl p-3 text-left text-xs border transition ${
                        selectedQuizOption === idx
                          ? "border-[#8B7BFF] bg-[#8B7BFF]/20 text-white"
                          : "border-white/10 bg-[#0B0D14] text-zinc-300 hover:bg-white/5"
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          selectedQuizOption === idx ? "border-[#8B7BFF] bg-[#8B7BFF]" : "border-white/30"
                        }`}
                      >
                        {selectedQuizOption === idx && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedQuizOption === null || submittingQuiz}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8B7BFF] to-[#76A9FF] px-4 py-2 text-xs font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {submittingQuiz ? "Validating..." : "Submit Answer"}
                  </button>

                  {quizResult && (
                    <span
                      className={`text-xs font-semibold ${
                        quizResult.correct ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {quizResult.correct ? "Correct! 100% Score" : "Incorrect. Try again!"}
                    </span>
                  )}
                </div>

                {quizResult && (
                  <div className="mt-3 rounded-lg bg-black/40 p-3 text-xs text-zinc-300">
                    <p className="font-semibold text-white mb-0.5">Explanation:</p>
                    <p>{quizResult.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Lesson Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {prevLesson ? (
                <button
                  onClick={() => setSelectedLessonId(prevLesson.id)}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous: {prevLesson.title}
                </button>
              ) : (
                <div />
              )}

              {nextLesson && (
                <button
                  onClick={() => setSelectedLessonId(nextLesson.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#8B7BFF] hover:underline"
                >
                  Next: {nextLesson.title} <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="py-20 text-center text-zinc-500">Loading lesson...</div>
        )}
      </div>
    </div>
  );
};

