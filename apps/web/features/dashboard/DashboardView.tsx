"use client";

import React, { useState } from "react";
import {
  Flame,
  Clock,
  BookOpen,
  Terminal,
  Sparkles,
  GitFork,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  FolderCode,
  LayoutGrid,
  Eye,
  EyeOff,
  Compass,
  Code2,
  Cpu,
  Layers,
  ChevronRight
} from "lucide-react";

interface DashboardProps {
  currentUser: any;
  analytics: any;
  onNavigate: (tab: string, params?: any) => void;
  onOpenAuth: () => void;
  preferences: any;
  onUpdatePreferences: (pref: any) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  currentUser,
  analytics,
  onNavigate,
  onOpenAuth,
  preferences,
  onUpdatePreferences,
}) => {
  const [isConfiguringLayout, setIsConfiguringLayout] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const defaultWidgets = ["streak", "experience_path", "active_lesson", "quick_ide", "timer", "algo_daily", "recent_projects", "ai_tutor"];
  const enabledWidgets: string[] = preferences?.dashboard_layout?.enabled_widgets || defaultWidgets;

  const toggleWidget = (widgetId: string) => {
    let updated: string[];
    if (enabledWidgets.includes(widgetId)) {
      updated = enabledWidgets.filter((w) => w !== widgetId);
    } else {
      updated = [...enabledWidgets, widgetId];
    }
    const newPref = {
      ...preferences,
      dashboard_layout: {
        ...preferences?.dashboard_layout,
        enabled_widgets: updated,
      },
    };
    onUpdatePreferences(newPref);
  };

  const isVisible = (widgetId: string) => enabledWidgets.includes(widgetId);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="space-y-6">
      {/* Top Banner: Greeting & Profile */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121828]/85 via-[#0D1220]/80 to-[#07090E]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                CODELAB IDE Universal Workspace
              </span>
              {currentUser && (
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 font-mono text-[11px] text-slate-300">
                  {currentUser.student_id}
                </span>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {greeting}, {currentUser ? currentUser.full_name || currentUser.username : "Developer"}!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Welcome to <span className="text-white font-medium">CODELAB IDE</span> architected by{" "}
              <span className="text-indigo-300 font-medium">Sinan Mohammed</span>. Learn programming from first principles with real isolated compiler execution, step-by-step DSA visualizers, and conversational AI tutoring.
            </p>

            {/* AI Spotlight Badge Bar */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <div
                onClick={() => onNavigate("ai-tutor")}
                className="cursor-pointer flex items-center gap-2 rounded-xl border border-purple-500/40 bg-gradient-to-r from-purple-500/20 via-indigo-500/15 to-purple-500/20 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:border-purple-500/60 transition"
              >
                <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                <span>AI Engine: CODELAB AI Intelligence</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">ONLINE</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">
                <span className="font-semibold text-white">Sub-Second</span> Latency (~240ms)
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">
                Universal Code Intelligence
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsConfiguringLayout(!isConfiguringLayout)}
              className="glass-button flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:text-white"
            >
              <LayoutGrid className="h-4 w-4 text-indigo-400" />
              Customize Layout
            </button>
            <button
              onClick={() => onNavigate("ide")}
              className="glass-button-primary flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-lg transition"
            >
              <Terminal className="h-4 w-4" />
              Launch IDE
            </button>
          </div>
        </div>

        {/* Layout Configuration Drawer */}
        {isConfiguringLayout && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#07090E]/90 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Dashboard Widget Visibility</h3>
              <button
                onClick={() => {
                  onUpdatePreferences({
                    ...preferences,
                    dashboard_layout: { enabled_widgets: defaultWidgets, widget_order: defaultWidgets }
                  });
                }}
                className="text-[11px] text-indigo-400 hover:underline"
              >
                Reset to Default
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "streak", label: "Stats & Streak" },
                { id: "experience_path", label: "Level & Curriculum" },
                { id: "active_lesson", label: "Active Lesson" },
                { id: "quick_ide", label: "Quick Compiler" },
                { id: "timer", label: "Focus Timer" },
                { id: "algo_daily", label: "Algorithm Spotlight" },
                { id: "recent_projects", label: "Recent Projects" },
                { id: "ai_tutor", label: "AI Teacher" }
              ].map((w) => {
                const active = isVisible(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWidget(w.id)}
                    className={`flex items-center justify-between rounded-xl p-2.5 text-xs transition ${
                      active ? "bg-indigo-500/20 text-white border border-indigo-500/40" : "bg-white/[0.03] text-slate-500 border border-transparent"
                    }`}
                  >
                    <span>{w.label}</span>
                    {active ? <Eye className="h-3.5 w-3.5 text-indigo-400" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Experience Level Selector & Adaptive Guidance */}
      {isVisible("experience_path") && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Select Your Programming Experience Level</h3>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                CODELAB adapts recommended roadmaps, explanations, and challenge difficulties to match your goals.
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1">
              {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                    selectedLevel === level
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedLevel === "beginner" && (
              <>
                <div
                  onClick={() => onNavigate("academy")}
                  className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.05]"
                >
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase">Recommended Path</span>
                  <p className="mt-1 text-xs font-semibold text-white">Beginner Academy — Zero to Coder</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">25 interactive lessons covering variables, loops, logic, and memory.</p>
                </div>
                <div
                  onClick={() => onNavigate("languages")}
                  className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.05]"
                >
                  <span className="text-[10px] font-semibold text-sky-400 uppercase">First Language</span>
                  <p className="mt-1 text-xs font-semibold text-white">Python or JavaScript Track</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">High-readability syntax with instant feedback and line explainer.</p>
                </div>
                <div
                  onClick={() => onNavigate("ai-tutor")}
                  className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.05]"
                >
                  <span className="text-[10px] font-semibold text-indigo-400 uppercase">AI Mentorship</span>
                  <p className="mt-1 text-xs font-semibold text-white">Patient Analogy Teacher</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">Ask any conceptual doubt in English or Malayalam without jargon.</p>
                </div>
              </>
            )}

            {selectedLevel === "intermediate" && (
              <>
                <div
                  onClick={() => onNavigate("data-structures")}
                  className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.05]"
                >
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase">Core Mastery</span>
                  <p className="mt-1 text-xs font-semibold text-white">Data Structures Laboratory</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">Interactive mutation for Stacks, Queues, Linked Lists, Trees, and Heaps.</p>
                </div>
                <div
                  onClick={() => onNavigate("algorithms")}
                  className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.05]"
                >
                  <span className="text-[10px] font-semibold text-sky-400 uppercase">Algorithms</span>
                  <p className="mt-1 text-xs font-semibold text-white">Sorting & Searching Visualizer</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">Step-by-step comparisons, swap tracking, and side-by-side benchmarking.</p>
                </div>
                <div
                  onClick={() => onNavigate("examination")}
                  className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.05]"
                >
                  <span className="text-[10px] font-semibold text-indigo-400 uppercase">Practice</span>
                  <p className="mt-1 text-xs font-semibold text-white">Medium Coding Challenges</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">Test case evaluation with hidden test cases and time limit enforcement.</p>
                </div>
              </>
            )}

            {selectedLevel === "advanced" && (
              <>
                <div
                  onClick={() => onNavigate("ide")}
                  className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.05]"
                >
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase">Multi-File IDE</span>
                  <p className="mt-1 text-xs font-semibold text-white">Professional IDE & Git</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">C, C++, Rust, Go, TypeScript development with Monaco and local runner.</p>
                </div>
                <div
                  onClick={() => onNavigate("debugger")}
                  className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.05]"
                >
                  <span className="text-[10px] font-semibold text-sky-400 uppercase">Introspection</span>
                  <p className="mt-1 text-xs font-semibold text-white">Visual Debugger & Tracer</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">sys.settrace variable mutations and call-stack frame analysis.</p>
                </div>
                <div
                  onClick={() => onNavigate("algorithms", { algo: "dijkstra" })}
                  className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.05]"
                >
                  <span className="text-[10px] font-semibold text-indigo-400 uppercase">Optimization</span>
                  <p className="mt-1 text-xs font-semibold text-white">Graph Theory & DP</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">Dijkstra, Bellman-Ford, and dynamic programming state transitions.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      {isVisible("streak") && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Learning Streak</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-white tracking-tight">{analytics?.current_streak_days || 1} Days</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Daily practice logged</p>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Study Time</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-white tracking-tight">{analytics?.total_study_minutes || 0} min</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Pomodoro focus engine</p>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Curriculum Progress</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-white tracking-tight">
              {analytics?.lessons_completed_count || 0} / {analytics?.total_lessons_count || 25}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">{analytics?.completion_percentage || 0}% completed</p>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Executions</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Terminal className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-white tracking-tight">{analytics?.programs_executed_count || 0}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Isolated runtime executions</p>
          </div>
        </div>
      )}

      {/* Main Grid Widgets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Lesson Widget */}
        {isVisible("active_lesson") && (
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Beginner Academy</span>
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                  Module 1
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-white">Introduction to Programming</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Understand algorithms as cooking recipes, explore memory variables, and execute your first program with line-by-line feedback.
              </p>
              <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#07090E]/80 p-3 font-mono text-xs text-slate-300">
                <span className="text-indigo-400">print</span>(<span className="text-emerald-400">&quot;Hello from CODELAB IDE!&quot;</span>)
              </div>
            </div>
            <button
              onClick={() => onNavigate("academy")}
              className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.08]"
            >
              <span>Continue Lesson</span>
              <ArrowRight className="h-4 w-4 text-indigo-400" />
            </button>
          </div>
        )}

        {/* Algorithm of the Day */}
        {isVisible("algo_daily") && (
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Algorithm Visualizer</span>
                <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 font-mono">
                  O(N log N)
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-white">Merge Sort & Quick Sort</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Step through divide-and-conquer recursion with live index comparisons, swap animations, and comparison benchmarking.
              </p>
              {/* Mini visual preview */}
              <div className="mt-4 flex h-14 items-end gap-1.5 rounded-xl border border-white/[0.08] bg-[#07090E]/80 p-2.5">
                {[30, 70, 45, 90, 20, 60, 85].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-sm transition-all duration-300 ${
                      i === 2 || i === 3 ? "bg-indigo-500" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => onNavigate("algorithms", { algo: "quick-sort" })}
              className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.08]"
            >
              <span>Launch Visualizer</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>
          </div>
        )}

        {/* AI Tutor Card */}
        {isVisible("ai_tutor") && (
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent shadow-lg shadow-purple-500/5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                  CODELAB AI Intelligence
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  ONLINE
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-white">AI Professor & Code Mentor</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Powered by CODELAB AI Intelligence. Ask any coding question in plain English, Malayalam, or Hindi. Get line-by-line mental models, real-world analogies, and instant bug fixes.
              </p>
              <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#07090E]/80 p-3 text-xs text-slate-300">
                💡 <span className="italic">&quot;Why does my loop execute one too many times?&quot;</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate("ai-tutor")}
              className="mt-5 flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-500/15 p-2.5 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/25 shadow-sm"
            >
              <span>Launch AI Studio</span>
              <Sparkles className="h-4 w-4 text-purple-400" />
            </button>
          </div>
        )}
      </div>

      {/* Focus Timer & Recent Projects row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isVisible("timer") && (
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Focus & Productivity Studio</h3>
                <p className="text-xs text-slate-400">Structured Pomodoro cycles with Web Audio procedural soundscapes</p>
              </div>
              <button
                onClick={() => onNavigate("focus")}
                className="text-xs font-medium text-indigo-400 hover:underline"
              >
                Open Studio →
              </button>
            </div>
            <div className="mt-4 flex items-center justify-around rounded-xl border border-white/[0.08] bg-[#07090E]/80 p-4 text-center">
              <div>
                <p className="text-2xl font-bold font-mono text-white">25:00</p>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">Deep Work</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-2xl font-bold font-mono text-emerald-400">05:00</p>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">Short Break</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-2xl font-bold font-mono text-sky-400">15:00</p>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">Long Break</p>
              </div>
            </div>
          </div>
        )}

        {isVisible("recent_projects") && (
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Coding Practice & Exam Platform</h3>
                <p className="text-xs text-slate-400">Solve real coding problems with hidden test case evaluation</p>
              </div>
              <button
                onClick={() => onNavigate("examination")}
                className="text-xs font-medium text-indigo-400 hover:underline"
              >
                Enter Practice Lab →
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <div
                onClick={() => onNavigate("examination", { problemId: 1 })}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.05] bg-[#07090E]/80 p-3 text-xs transition hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Sum of Two Numbers</p>
                    <p className="text-[10px] text-slate-400">Fundamentals • Easy</p>
                  </div>
                </div>
                <span className="text-indigo-400 font-medium">Solve →</span>
              </div>
              <div
                onClick={() => onNavigate("examination", { problemId: 2 })}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.05] bg-[#07090E]/80 p-3 text-xs transition hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Find Maximum Element</p>
                    <p className="text-[10px] text-slate-400">Arrays • Easy</p>
                  </div>
                </div>
                <span className="text-indigo-400 font-medium">Solve →</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
