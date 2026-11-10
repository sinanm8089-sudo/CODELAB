"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Award,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Lock,
  RotateCcw,
  Check,
  ChevronRight,
  Search,
  BookOpen,
  Filter,
  CheckCheck
} from "lucide-react";
import { ApiClient } from "../../services/api";

export const ExaminationView: React.FC<{ initialProblemId?: number; onRefreshAnalytics: () => void }> = ({
  initialProblemId = 1,
  onRefreshAnalytics,
}) => {
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState<number>(initialProblemId);
  const [problemDetail, setProblemDetail] = useState<any | null>(null);

  const [language, setLanguage] = useState("python");
  const [sourceCode, setSourceCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // Problem view tabs: Question vs Editorial vs AI Hint
  const [activeTab, setActiveTab] = useState<"statement" | "editorial" | "hint">("statement");
  const [aiHint, setAiHint] = useState<string>("");
  const [loadingHint, setLoadingHint] = useState(false);

  const handleRequestAiHint = async () => {
    setActiveTab("hint");
    if (aiHint || loadingHint || !problemDetail) return;
    setLoadingHint(true);
    try {
      const res = await ApiClient.tutorChat({
        messages: [
          {
            role: "user",
            content: `I am solving the practice problem: "${problemDetail.title}".\nDescription: ${problemDetail.description}\nPlease give me an intuitive conceptual hint and mental model for the optimal approach, without giving away the complete code.`,
          },
        ],
        language,
        mode: "simple",
      });
      setAiHint(res.response || "Think about the data structures that allow optimal lookup time.");
    } catch {
      setAiHint("Think about the data structures (e.g. hash maps, sorting, or two pointers) that minimize time complexity.");
    } finally {
      setLoadingHint(false);
    }
  };

  // Timed exam mode
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30 * 60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const data = await ApiClient.listProblems();
      setProblems(data);
      if (data.length > 0 && !selectedProblemId) {
        setSelectedProblemId(data[0].id);
      }
    } catch {}
  };

  useEffect(() => {
    if (selectedProblemId) {
      loadProblemDetail(selectedProblemId);
    }
  }, [selectedProblemId]);

  const loadProblemDetail = async (id: number) => {
    try {
      const detail = await ApiClient.getProblem(id);
      setProblemDetail(detail);
      setSubmissionResult(null);
      setAiHint("");
      setActiveTab("statement");

      const starter =
        detail.starter_codes?.[language] ||
        detail.starter_codes?.["python"] ||
        "# Write your solution here\n";
      setSourceCode(starter);
    } catch {}
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (problemDetail?.starter_codes?.[newLang]) {
      setSourceCode(problemDetail.starter_codes[newLang]);
    }
  };

  const handleSubmitSolution = async () => {
    if (!problemDetail) return;
    setIsSubmitting(true);
    setSubmissionResult(null);
    try {
      const res = await ApiClient.submitSolution(problemDetail.id, {
        language,
        source_code: sourceCode,
      });
      setSubmissionResult(res);
      loadProblems();
      onRefreshAnalytics();
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining <= 0) {
      setTimerActive(false);
      alert("Practical Examination Time has elapsed! Please submit your code.");
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Extract categories
  const categories = ["All", ...Array.from(new Set(problems.map((p) => p.category)))];

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesCat && matchesDiff;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Automated Evaluation System
              </span>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                Hidden Test Suites
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Coding Practice & Examination Lab
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              Practice real technical interview questions and practical examination problems with compiler verification, memory profiling, and edge-case test suites.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isTimedMode ? (
              <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 font-mono text-sm font-bold text-amber-300 shadow-md">
                <Clock className="h-4 w-4" />
                <span>{formatTimer(secondsRemaining)}</span>
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="ml-2 text-xs text-white underline"
                >
                  {timerActive ? "Pause" : "Resume"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsTimedMode(true);
                  setTimerActive(true);
                }}
                className="glass-button flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-300"
              >
                <Clock className="h-3.5 w-3.5 text-amber-400" /> Start Timed Exam
              </button>
            )}

            <button
              onClick={handleSubmitSolution}
              disabled={isSubmitting}
              className="glass-button-primary flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-lg transition disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-white" />
              {isSubmitting ? "Evaluating Test Cases..." : "Submit Solution"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Problems Sidebar List */}
        <div className="glass-card rounded-3xl p-4 lg:col-span-4 shadow-xl max-h-[85vh] flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-400" /> Challenge Catalog
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">{filteredProblems.length} available</span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#07090E]/80 pl-9 pr-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-lg px-2.5 py-1 font-medium transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-white/[0.04] text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-1 text-[10px]">
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`flex-1 rounded-lg py-1 font-medium text-center transition ${
                  selectedDifficulty === diff
                    ? "bg-slate-700 text-white"
                    : "bg-white/[0.02] text-slate-400 hover:text-slate-200"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Problems list */}
          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            {filteredProblems.map((p) => {
              const isSelected = p.id === selectedProblemId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProblemId(p.id)}
                  className={`w-full flex items-center justify-between rounded-2xl p-3 text-left text-xs transition border ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-600/20 text-white shadow-md shadow-indigo-500/10"
                      : "border-white/[0.05] bg-[#07090E]/60 text-slate-400 hover:text-slate-200 hover:border-white/10"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-white truncate max-w-[190px]">{p.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                      <span className={
                        p.difficulty === "Easy" ? "text-emerald-400" : p.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                      }>
                        {p.difficulty}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{p.category}</span>
                    </div>
                  </div>
                  {p.solved ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Workspace */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header & Tabs */}
          <div className="glass-card rounded-3xl p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                    problemDetail?.difficulty === "Easy"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : problemDetail?.difficulty === "Medium"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}>
                    {problemDetail?.difficulty || "Easy"}
                  </span>
                  <span className="text-xs text-slate-400">• {problemDetail?.category}</span>
                  <span className="text-xs text-slate-400">• Time Limit: {problemDetail?.time_limit_sec || 2}s</span>
                </div>
                <h2 className="mt-1.5 text-xl font-bold text-white">{problemDetail?.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("statement")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "statement" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Problem
                </button>
                <button
                  onClick={() => setActiveTab("editorial")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "editorial" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="inline mr-1 h-3.5 w-3.5" /> Editorial
                </button>
                <button
                  onClick={handleRequestAiHint}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "hint"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25"
                      : "border border-purple-500/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                  <span>AI Hint</span>
                </button>
              </div>
            </div>

            {/* Statement View */}
            {activeTab === "statement" && problemDetail && (
              <div className="mt-4 space-y-3 text-xs leading-relaxed">
                <p className="text-slate-200 text-sm">{problemDetail.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl border border-white/[0.06] bg-[#07090E]/80 p-3">
                    <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Input Format:</p>
                    <p className="text-slate-300 whitespace-pre-wrap">{problemDetail.input_format}</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-[#07090E]/80 p-3">
                    <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Output Format:</p>
                    <p className="text-slate-300 whitespace-pre-wrap">{problemDetail.output_format}</p>
                  </div>
                </div>

                {problemDetail.constraints && (
                  <div className="rounded-2xl border border-white/[0.06] bg-[#07090E]/80 p-3">
                    <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Constraints:</p>
                    <p className="font-mono text-slate-300">{problemDetail.constraints}</p>
                  </div>
                )}

                {problemDetail.sample_input && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono">
                    <div className="rounded-2xl border border-white/[0.06] bg-[#07090E]/80 p-3">
                      <p className="font-bold text-slate-400 text-[10px] font-sans mb-1">Sample Input:</p>
                      <pre className="text-slate-200">{problemDetail.sample_input}</pre>
                    </div>
                    <div className="rounded-2xl border border-white/[0.06] bg-[#07090E]/80 p-3">
                      <p className="font-bold text-slate-400 text-[10px] font-sans mb-1">Sample Output:</p>
                      <pre className="text-emerald-400">{problemDetail.sample_output}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Editorial View */}
            {activeTab === "editorial" && problemDetail && (
              <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-300">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="font-semibold text-purple-300 uppercase text-[10px] flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-purple-400" />
                    AI Editorial Guidance
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Sinan Mohammed Lab</span>
                </div>

                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                  <span className="font-semibold text-indigo-300 uppercase text-[10px]">Optimal Solution Approach</span>
                  <p className="mt-1 text-slate-200">
                    Solve this challenge with standard I/O streaming using optimal time and space data structures.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-[#07090E]/80 p-4 space-y-2">
                  <h4 className="font-bold text-white">Recommended Strategy</h4>
                  <p className="text-slate-300">
                    {problemDetail.sample_explanation || "Analyze the problem constraints to choose between hash-map lookups O(N), two pointers O(N log N), or dynamic programming memoization."}
                  </p>
                </div>
              </div>
            )}

            {/* AI Hint View */}
            {activeTab === "hint" && (
              <div className="mt-4 space-y-3 text-xs leading-relaxed">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                  <span className="font-bold text-purple-300 text-xs flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                    CODELAB AI Pedagogical Hint
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> ONLINE
                  </span>
                </div>

                {loadingHint ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 text-purple-200">
                    <Sparkles className="h-4 w-4 animate-spin text-purple-400" />
                    <span>AI Assistant is analyzing problem constraints to synthesize a mental hint...</span>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
                    <span className="font-semibold text-purple-300 uppercase text-[10px]">Conceptual Guidance</span>
                    <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-xs">
                      {aiHint || "Think about the best time complexity and consider hashing or pointers."}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Monaco Editor */}
          <div className="glass-card rounded-3xl p-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Language:</span>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#07090E] px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript (Node.js)</option>
                </select>
              </div>
              <span className="text-slate-500 text-[11px] font-mono">Standard I/O Auto-Evaluated</span>
            </div>

            <div className="mt-3 rounded-2xl overflow-hidden min-h-[320px] border border-white/[0.06]">
              <Editor
                height="320px"
                language={language}
                value={sourceCode}
                onChange={(v) => setSourceCode(v || "")}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', Consolas, monospace",
                  minimap: { enabled: false },
                  tabSize: 4,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Test Case Evaluation Results Card */}
          {submissionResult && (
            <div className="glass-card rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  {submissionResult.status === "passed" ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCheck className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <XCircle className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {submissionResult.status === "passed"
                        ? "Accepted — 100% Correct Solution!"
                        : "Evaluation Completed"}
                    </h3>
                    <p className="text-xs text-slate-400">{submissionResult.feedback}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {submissionResult.rubric_score}%
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Passed {submissionResult.passed_count} of {submissionResult.total_count} test cases
                  </p>
                </div>
              </div>

              {/* Test Case Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {submissionResult.results?.map((tc: any, i: number) => (
                  <div
                    key={i}
                    className={`rounded-2xl border p-3.5 text-xs space-y-1.5 ${
                      tc.passed
                        ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                        : "border-rose-500/30 bg-rose-500/[0.06]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-white">
                        {tc.is_hidden && <Lock className="h-3 w-3 text-slate-400" />}
                        Test Case #{tc.test_case_number} {tc.is_hidden && "(Hidden Edge Case)"}
                      </span>
                      <span className={tc.passed ? "text-emerald-400 font-mono text-[11px]" : "text-rose-400 font-mono text-[11px]"}>
                        {tc.passed ? "PASSED" : "FAILED"}
                      </span>
                    </div>

                    {!tc.is_hidden && (
                      <div className="font-mono text-[11px] text-slate-400 space-y-1 pt-1">
                        <p>Expected: <span className="text-emerald-400">{tc.expected_output}</span></p>
                        <p>Actual: <span className="text-white">{tc.actual_output}</span></p>
                      </div>
                    )}

                    {tc.error && (
                      <p className="text-rose-400 font-mono text-[10px] mt-1">{tc.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
