"use client";

import React from "react";
import {
  BarChart3,
  Award,
  BookOpen,
  Terminal,
  Clock,
  Flame,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu
} from "lucide-react";

interface AnalyticsProps {
  analytics: any;
  onNavigate: (tab: string, params?: any) => void;
}

export const AnalyticsView: React.FC<AnalyticsProps> = ({ analytics, onNavigate }) => {
  if (!analytics) {
    return <div className="py-20 text-center text-zinc-500">Loading learning analytics...</div>;
  }

  const langEntries = Object.entries(analytics.language_breakdown || {});
  const totalRuns = Object.values(analytics.language_breakdown || {}).reduce((a: any, b: any) => a + b, 0) as number;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[#8B7BFF]" />
            Student Progress Analytics
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Empirical learning telemetry computed directly from your database records.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171E2C] px-3.5 py-1.5 font-mono text-xs text-[#8B7BFF]">
          Student ID: {analytics.student_id}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg">
          <span className="text-xs text-zinc-400">Curriculum Completed</span>
          <p className="mt-2 text-2xl font-bold text-white">{analytics.completion_percentage}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B7BFF] to-emerald-400"
              style={{ width: `${analytics.completion_percentage}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-zinc-500">{analytics.lessons_completed_count} of {analytics.total_lessons_count} lessons</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg">
          <span className="text-xs text-zinc-400">Total Code Runs</span>
          <p className="mt-2 text-2xl font-bold text-white">{analytics.programs_executed_count}</p>
          <p className="mt-2 text-[10px] text-emerald-400 font-semibold">Subprocess execution verified</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg">
          <span className="text-xs text-zinc-400">Exams Solved</span>
          <p className="mt-2 text-2xl font-bold text-white">
            {analytics.problems_solved_count} / {analytics.total_problems_count}
          </p>
          <p className="mt-2 text-[10px] text-zinc-500">Passed hidden test-case suites</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg">
          <span className="text-xs text-zinc-400">Active Daily Streak</span>
          <p className="mt-2 text-2xl font-bold text-amber-400 flex items-center gap-1.5">
            <Flame className="h-6 w-6" /> {analytics.current_streak_days} Days
          </p>
          <p className="mt-2 text-[10px] text-zinc-500">{analytics.total_study_minutes} minutes studied</p>
        </div>
      </div>

      {/* Language Breakdown & Weak Concepts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Language Breakdown */}
        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[#76A9FF]" /> Programming Language Distribution
          </h2>
          <div className="space-y-3">
            {langEntries.map(([lang, count]: [string, any]) => {
              const pct = totalRuns > 0 ? Math.round((count / totalRuns) * 100) : 100;
              return (
                <div key={lang}>
                  <div className="flex justify-between text-xs text-zinc-300 mb-1">
                    <span className="capitalize font-semibold">{lang}</span>
                    <span className="font-mono text-zinc-400">{count} runs ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8B7BFF] to-[#76A9FF]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Concepts Analysis */}
        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" /> Targeted Concept Refinement
          </h2>
          <p className="text-xs text-zinc-400">
            Detected areas for review based on compiler diagnostics and failed test-case edge conditions:
          </p>
          <div className="space-y-2">
            {analytics.weak_concepts?.map((concept: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-[#0B0D14] p-3 text-xs text-zinc-300"
              >
                <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span>{concept}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized AI Recommendations */}
      <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-6 shadow-2xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#8B7BFF]" /> Personalized Next Steps &amp; Recommendations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {analytics.recommendations?.map((rec: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-white/5 bg-[#0B0D14] p-4 text-xs space-y-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-[#8B7BFF]">{rec.type}</span>
                <h3 className="mt-1 font-bold text-white">{rec.title}</h3>
                <p className="mt-1 text-zinc-400 text-[11px] leading-relaxed">{rec.description}</p>
              </div>
              <button
                onClick={() => {
                  if (rec.type === "lesson") onNavigate("academy");
                  else if (rec.type === "practice") onNavigate("examination");
                  else onNavigate("algorithms");
                }}
                className="flex items-center justify-between text-[#8B7BFF] font-semibold text-xs hover:underline"
              >
                <span>Start Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

