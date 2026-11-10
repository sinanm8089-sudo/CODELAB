"use client";

import React, { useState, useEffect } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Coffee,
  Sparkles,
  Volume2,
  Calendar
} from "lucide-react";
import { ApiClient } from "../../services/api";
import { AmbientAudioEngine } from "../../services/audio";

export const FocusView: React.FC<{
  audioPlaying: boolean;
  setAudioPlaying: (p: boolean) => void;
  onRefreshAnalytics: () => void;
}> = ({ audioPlaying, setAudioPlaying, onRefreshAnalytics }) => {
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [customMinutes, setCustomMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const [summary, setSummary] = useState<any | null>(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const data = await ApiClient.getFocusSummary();
      setSummary(data);
    } catch {}
  };

  const handleModeChange = (newMode: "focus" | "shortBreak" | "longBreak") => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === "focus") {
      setSecondsLeft(customMinutes * 60);
    } else if (newMode === "shortBreak") {
      setSecondsLeft(5 * 60);
    } else {
      setSecondsLeft(15 * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive && !audioPlaying) {
      AmbientAudioEngine.play("rain", 0.4);
      setAudioPlaying(true);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === "focus") setSecondsLeft(customMinutes * 60);
    else if (mode === "shortBreak") setSecondsLeft(5 * 60);
    else setSecondsLeft(15 * 60);
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const handleSessionComplete = async () => {
    const duration = mode === "focus" ? customMinutes * 60 : mode === "shortBreak" ? 5 * 60 : 15 * 60;
    try {
      await ApiClient.logStudySession({
        duration_seconds: duration,
        session_type: mode,
      });
      setCompletedSessions((prev) => prev + 1);
      loadSummary();
      onRefreshAnalytics();
      alert(`🎉 Session completed! Great job maintaining focus.`);
    } catch {}
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalTime = mode === "focus" ? customMinutes * 60 : mode === "shortBreak" ? 5 * 60 : 15 * 60;
  const progressPercent = Math.round(((totalTime - secondsLeft) / totalTime) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Timer className="h-6 w-6 text-[#8B7BFF]" />
          Focus &amp; Productivity Studio
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Eliminate distractions, build study stamina, and log structured deep work cycles.
        </p>
      </div>

      {/* Main Circular Timer Card */}
      <div className="rounded-3xl border border-white/10 bg-[#171E2C] p-8 shadow-2xl flex flex-col items-center">
        {/* Cycle Tabs */}
        <div className="flex rounded-xl border border-white/10 bg-[#0B0D14] p-1 text-xs font-semibold">
          <button
            onClick={() => handleModeChange("focus")}
            className={`rounded-lg px-4 py-2 transition ${
              mode === "focus" ? "bg-[#8B7BFF] text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            Deep Work Focus ({customMinutes}m)
          </button>
          <button
            onClick={() => handleModeChange("shortBreak")}
            className={`rounded-lg px-4 py-2 transition ${
              mode === "shortBreak" ? "bg-emerald-500 text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => handleModeChange("longBreak")}
            className={`rounded-lg px-4 py-2 transition ${
              mode === "longBreak" ? "bg-[#76A9FF] text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Circular Display */}
        <div className="relative my-8 flex h-64 w-64 items-center justify-center rounded-full border-4 border-white/10 bg-[#0B0D14] shadow-2xl">
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#8B7BFF] transition-all duration-1000"
            style={{ transform: `rotate(${progressPercent * 3.6}deg)` }}
          />
          <div className="text-center z-10">
            <span className="text-5xl font-mono font-bold text-white tracking-wider">
              {formatTime(secondsLeft)}
            </span>
            <p className="text-xs font-semibold text-[#8B7BFF] uppercase tracking-widest mt-1">
              {isActive ? "Active Session" : "Paused"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetTimer}
            className="rounded-xl border border-white/10 bg-white/5 p-3 text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={toggleTimer}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#8B7BFF] to-[#76A9FF] px-8 py-3 text-sm font-bold text-white shadow-xl shadow-[#8B7BFF]/30 hover:brightness-110"
          >
            {isActive ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
            {isActive ? "Pause Focus" : "Start Focus Cycle"}
          </button>
        </div>
      </div>

      {/* Focus History & Goal Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 text-center">
          <span className="text-xs text-zinc-400 uppercase tracking-wider">Today&apos;s Focus</span>
          <p className="mt-2 text-2xl font-bold text-white">{summary?.today_study_minutes || 0} min</p>
          <p className="text-[11px] text-zinc-500">Goal: 60 minutes</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 text-center">
          <span className="text-xs text-zinc-400 uppercase tracking-wider">Total Time Invested</span>
          <p className="mt-2 text-2xl font-bold text-white">{summary?.total_study_minutes || 0} min</p>
          <p className="text-[11px] text-zinc-500">Lifetime logged in database</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 text-center">
          <span className="text-xs text-zinc-400 uppercase tracking-wider">Completed Cycles</span>
          <p className="mt-2 text-2xl font-bold text-emerald-400">{summary?.total_sessions_count || 0}</p>
          <p className="text-[11px] text-zinc-500">Focus sessions verified</p>
        </div>
      </div>
    </div>
  );
};

