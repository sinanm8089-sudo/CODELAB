"use client";

import React, { useState } from "react";
import {
  Palette,
  Volume2,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  Sliders,
  Sparkles,
  BookOpen,
  Monitor
} from "lucide-react";
import { AmbientAudioEngine } from "../../services/audio";

interface PersonalizationProps {
  preferences: any;
  onUpdatePreferences: (pref: any) => void;
  audioPlaying: boolean;
  setAudioPlaying: (playing: boolean) => void;
}

export const PersonalizationView: React.FC<PersonalizationProps> = ({
  preferences,
  onUpdatePreferences,
  audioPlaying,
  setAudioPlaying,
}) => {
  const [theme, setTheme] = useState(preferences?.theme || "dark");
  const [accentColor, setAccentColor] = useState(preferences?.accent_color || "#8B7BFF");
  const [wallpaper, setWallpaper] = useState(preferences?.wallpaper || "charcoal");
  const [wallpaperBlur, setWallpaperBlur] = useState<number>(preferences?.wallpaper_blur || 0);
  const [wallpaperOpacity, setWallpaperOpacity] = useState<number>(preferences?.wallpaper_opacity || 1.0);
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState("");
  
  // Audio state
  const [audioPreset, setAudioPreset] = useState(preferences?.audio_preferences?.preset || "rain");
  const [audioVolume, setAudioVolume] = useState(preferences?.audio_preferences?.volume || 0.5);
  const [customAudioUrl, setCustomAudioUrl] = useState(preferences?.audio_preferences?.custom_url || "");

  // Learning preferences
  const [learningLang, setLearningLang] = useState(preferences?.learning_preferences?.learning_language || "python");
  const [explanationLang, setExplanationLang] = useState(preferences?.learning_preferences?.explanation_language || "english");
  const [difficulty, setDifficulty] = useState(preferences?.learning_preferences?.difficulty || "beginner");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const ACCENT_COLORS = [
    { label: "CODELAB Indigo", value: "#6366F1" },
    { label: "Electric Blue", value: "#38BDF8" },
    { label: "Emerald Matrix", value: "#10B981" },
    { label: "Solar Amber", value: "#F59E0B" },
    { label: "Rose Quartz", value: "#F43F5E" },
    { label: "Violet Glass", value: "#8B5CF6" },
  ];

  const WALLPAPER_PRESETS = [
    { id: "charcoal", name: "Deep Charcoal (Default)", bg: "linear-gradient(135deg, #0B0D14 0%, #111725 100%)" },
    { id: "aurora", name: "Aurora Glow", bg: "radial-gradient(ellipse at top, #1e1b4b, #0B0D14)" },
    { id: "midnight", name: "Midnight Studio", bg: "radial-gradient(circle at 50% 0%, #172554, #0B0D14 70%)" },
    { id: "emerald", name: "Deep Forest", bg: "radial-gradient(circle at top right, #064e3b, #0B0D14 80%)" },
    { id: "cyber", name: "Cyber Matrix", bg: "linear-gradient(to bottom, #030712, #111827)" },
  ];

  const AUDIO_PRESETS = [
    { id: "rain", name: "Gentle Rain", desc: "Soothing rainfall frequencies" },
    { id: "white_noise", name: "Pink / White Noise", desc: "Blocks outside office distractions" },
    { id: "lofi_drone", name: "Lofi Chord Ambience", desc: "Calm procedural synth pads" },
    { id: "binaural", name: "Alpha Binaural Beats", desc: "10 Hz frequency for cognitive focus" },
  ];

  const handleApplyAudio = (presetId: string) => {
    setAudioPreset(presetId);
    AmbientAudioEngine.play(presetId, audioVolume, customAudioUrl);
    setAudioPlaying(true);
  };

  const handleVolumeChange = (newVol: number) => {
    setAudioVolume(newVol);
    AmbientAudioEngine.setVolume(newVol);
  };

  const handleSaveAll = () => {
    const updated = {
      ...preferences,
      theme,
      accent_color: accentColor,
      wallpaper,
      wallpaper_blur: wallpaperBlur,
      wallpaper_opacity: wallpaperOpacity,
      audio_preferences: {
        enabled: audioPlaying,
        volume: audioVolume,
        preset: audioPreset,
        custom_url: customAudioUrl,
      },
      learning_preferences: {
        ...preferences?.learning_preferences,
        learning_language: learningLang,
        explanation_language: explanationLang,
        difficulty,
      },
    };
    onUpdatePreferences(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const exportSettingsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(preferences, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "codelab_preferences.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        onUpdatePreferences(imported);
        alert("Preferences successfully imported!");
      } catch {
        alert("Invalid JSON preferences file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Palette className="h-6 w-6 text-[#8B7BFF]" />
            Personalization Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Customize your entire educational experience. All settings automatically synchronize and persist in the database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportSettingsJson}
            title="Export Settings as JSON"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10">
            <Upload className="h-4 w-4" /> Import
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8B7BFF] to-[#76A9FF] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#8B7BFF]/25 hover:brightness-110"
          >
            {savedSuccess ? <Check className="h-4 w-4 text-white" /> : <Save className="h-4 w-4" />}
            {savedSuccess ? "Saved to Database!" : "Save Preferences"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Accent Colors & Theme */}
        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#8B7BFF]" /> Accent Color Palette
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setAccentColor(c.value)}
                className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium border transition ${
                  accentColor === c.value ? "border-white/40 bg-white/10 text-white" : "border-white/5 bg-[#0B0D14] text-zinc-400"
                }`}
              >
                <span className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: c.value }} />
                <span className="truncate">{c.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10">
            <label className="text-xs font-semibold text-zinc-300">Interface Theme</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {["dark", "light", "system"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`rounded-xl py-2 text-xs font-medium capitalize border transition ${
                    theme === t ? "border-[#8B7BFF] bg-[#8B7BFF]/20 text-white" : "border-white/5 bg-[#0B0D14] text-zinc-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ambient Audio Studio */}
        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-emerald-400" /> Ambient Audio Studio
            </h2>
            <button
              onClick={() => {
                if (audioPlaying) {
                  AmbientAudioEngine.stop();
                  setAudioPlaying(false);
                } else {
                  handleApplyAudio(audioPreset);
                }
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                audioPlaying ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {audioPlaying ? "Stop Audio" : "Start Audio"}
            </button>
          </div>

          <div className="space-y-2">
            {AUDIO_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyAudio(p.id)}
                className={`w-full flex items-center justify-between rounded-xl p-3 text-left border transition ${
                  audioPreset === p.id && audioPlaying
                    ? "border-emerald-500/40 bg-emerald-500/10 text-white"
                    : "border-white/5 bg-[#0B0D14] text-zinc-400 hover:text-white"
                }`}
              >
                <div>
                  <p className="text-xs font-semibold">{p.name}</p>
                  <p className="text-[10px] text-zinc-500">{p.desc}</p>
                </div>
                {audioPreset === p.id && audioPlaying && (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Volume Control</span>
              <span>{Math.round(audioVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-[#8B7BFF]"
            />
          </div>
        </div>

        {/* Wallpaper & Blur Studio */}
        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-[#76A9FF]" /> Workspace Wallpaper & Glassmorphism
          </h2>

          <div className="space-y-2">
            {WALLPAPER_PRESETS.map((wp) => (
              <button
                key={wp.id}
                onClick={() => setWallpaper(wp.id)}
                className={`w-full flex items-center gap-3 rounded-xl p-2.5 border text-xs transition ${
                  wallpaper === wp.id ? "border-[#8B7BFF] bg-white/10 text-white" : "border-white/5 bg-[#0B0D14] text-zinc-400"
                }`}
              >
                <div className="h-6 w-12 rounded-lg border border-white/10" style={{ background: wp.bg }} />
                <span>{wp.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Background Blur Effect</span>
                <span>{wallpaperBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={wallpaperBlur}
                onChange={(e) => setWallpaperBlur(parseInt(e.target.value))}
                className="w-full accent-[#8B7BFF]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Background Opacity</span>
                <span>{Math.round(wallpaperOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={wallpaperOpacity}
                onChange={(e) => setWallpaperOpacity(parseFloat(e.target.value))}
                className="w-full accent-[#8B7BFF]"
              />
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400" /> Learning Path & Explanation Language
          </h2>

          <div>
            <label className="text-xs font-medium text-zinc-300">Primary Programming Language</label>
            <select
              value={learningLang}
              onChange={(e) => setLearningLang(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0D14] p-2.5 text-xs text-white focus:border-[#8B7BFF] focus:outline-none"
            >
              <option value="python">Python 3 (Recommended for Beginners)</option>
              <option value="javascript">JavaScript / TypeScript</option>
              <option value="c">C (Systems Programming & Pointers)</option>
              <option value="cpp">C++ (Object-Oriented & Algorithms)</option>
              <option value="java">Java (OOP & Enterprise)</option>
              <option value="sql">SQL (Databases & Queries)</option>
              <option value="bash">Bash / Shell Scripting</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300">Explanation Language</label>
            <select
              value={explanationLang}
              onChange={(e) => setExplanationLang(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0D14] p-2.5 text-xs text-white focus:border-[#8B7BFF] focus:outline-none"
            >
              <option value="english">English (Global Technical Standard)</option>
              <option value="malayalam">Malayalam (മലയാളം - അമ്മഭാഷാ വിശദീകരണം)</option>
              <option value="hindi">Hindi (हिन्दी)</option>
              <option value="spanish">Spanish (Español)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300">Learning Difficulty Pace</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {["beginner", "intermediate", "advanced"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-xl py-2 text-xs font-medium capitalize border transition ${
                    difficulty === d ? "border-[#8B7BFF] bg-[#8B7BFF]/20 text-white" : "border-white/5 bg-[#0B0D14] text-zinc-400"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* AI Engine Status Card */}
          <div className="pt-2 border-t border-white/10">
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  AI Intelligence Engine
                </span>
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-mono text-purple-300">
                  CODELAB AI Intelligence
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-300">
                Direct integration with CODELAB AI Intelligence for line-by-line mental models, autonomous bug diagnosis, and multi-lingual technical instruction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

