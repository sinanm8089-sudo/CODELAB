"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AuthModal } from "../features/auth/AuthModal";
import { DashboardView } from "../features/dashboard/DashboardView";
import { AcademyView } from "../features/academy/AcademyView";
import { IdeView } from "../features/ide/IdeView";
import { AlgorithmsView } from "../features/algorithms/AlgorithmsView";
import { DataStructuresView } from "../features/data-structures/DataStructuresView";
import { DebuggerView } from "../features/debugger/DebuggerView";
import { ExaminationView } from "../features/examination/ExaminationView";
import { LanguageExplorerView } from "../features/language-explorer/LanguageExplorerView";
import { AiTutorView } from "../features/ai-tutor/AiTutorView";
import { FocusView } from "../features/focus/FocusView";
import { AnalyticsView } from "../features/analytics/AnalyticsView";
import { PersonalizationView } from "../features/personalization/PersonalizationView";
import { AdminView } from "../features/admin/AdminView";
import { ApiClient } from "../services/api";
import { AmbientAudioEngine } from "../services/audio";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [preferences, setPreferences] = useState<any | null>(null);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Audio state
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPreset, setAudioPreset] = useState("rain");

  // IDE preloaded state
  const [idePreloadCode, setIdePreloadCode] = useState<string | undefined>(undefined);
  const [idePreloadLang, setIdePreloadLang] = useState<string>("python");

  // Problem ID for exam lab navigation
  const [examProblemId, setExamProblemId] = useState<number>(1);
  const [algoIdParam, setAlgoIdParam] = useState<string>("bubble-sort");

  useEffect(() => {
    checkCurrentUser();
    loadAnalytics();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const user = await ApiClient.getMe();
      setCurrentUser(user);
      loadPreferences();
      loadNotifications();
    } catch {
      // Not logged in or guest
    }
  };

  const loadPreferences = async () => {
    try {
      const pref = await ApiClient.getPreferences();
      setPreferences(pref);
      if (pref?.audio_preferences?.preset) {
        setAudioPreset(pref.audio_preferences.preset);
      }
    } catch {}
  };

  const loadAnalytics = async () => {
    try {
      const data = await ApiClient.getAnalyticsOverview();
      setAnalytics(data);
    } catch {}
  };

  const loadNotifications = async () => {
    try {
      const notis = await ApiClient.getNotifications();
      setNotifications(notis);
    } catch {}
  };

  const handleLogout = () => {
    ApiClient.removeToken();
    setCurrentUser(null);
    setPreferences(null);
    AmbientAudioEngine.stop();
    setAudioPlaying(false);
  };

  const handleNavigate = (tab: string, params?: any) => {
    if (params?.code && params?.lang) {
      setIdePreloadCode(params.code);
      setIdePreloadLang(params.lang);
    }
    if (params?.problemId) {
      setExamProblemId(params.problemId);
    }
    if (params?.algo) {
      setAlgoIdParam(params.algo);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenInIde = (code: string, language: string) => {
    setIdePreloadCode(code);
    setIdePreloadLang(language);
    setActiveTab("ide");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdatePreferences = async (newPref: any) => {
    setPreferences(newPref);
    try {
      await ApiClient.updatePreferences(newPref);
    } catch {}
  };

  // Compute theme identifier
  const themeMode = preferences?.theme === "light"
    ? "light-glass"
    : preferences?.theme === "high_contrast"
    ? "oled-black"
    : "dark-glass";

  // Compute dynamic wallpaper styling
  const wallpaperStyle: React.CSSProperties = {};
  if (preferences?.wallpaper === "aurora") {
    wallpaperStyle.background = "radial-gradient(ellipse at top, #1e1b4b 0%, #07090E 80%)";
  } else if (preferences?.wallpaper === "midnight") {
    wallpaperStyle.background = "radial-gradient(circle at 50% 0%, #172554 0%, #07090E 70%)";
  } else if (preferences?.wallpaper === "emerald") {
    wallpaperStyle.background = "radial-gradient(circle at top right, #064e3b 0%, #07090E 80%)";
  } else if (preferences?.wallpaper === "cyber") {
    wallpaperStyle.background = "linear-gradient(to bottom, #030712, #0B101E)";
  }

  return (
    <div
      data-theme={themeMode}
      className="min-h-screen flex flex-col transition-all duration-500 bg-[#07090E]"
      style={wallpaperStyle}
    >
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        audioPlaying={audioPlaying}
        setAudioPlaying={setAudioPlaying}
        audioPreset={audioPreset}
        notifications={notifications}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 max-w-7xl mx-auto w-full">
        {activeTab === "dashboard" && (
          <DashboardView
            currentUser={currentUser}
            analytics={analytics}
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
          />
        )}

        {activeTab === "academy" && (
          <AcademyView
            onOpenInIde={handleOpenInIde}
            currentUser={currentUser}
            onRefreshAnalytics={loadAnalytics}
          />
        )}

        {activeTab === "ide" && (
          <IdeView
            initialCode={idePreloadCode}
            initialLanguage={idePreloadLang}
            currentUser={currentUser}
            onRefreshAnalytics={loadAnalytics}
          />
        )}

        {activeTab === "algorithms" && (
          <AlgorithmsView initialAlgoId={algoIdParam} onOpenInIde={handleOpenInIde} />
        )}

        {activeTab === "data-structures" && (
          <DataStructuresView />
        )}

        {activeTab === "debugger" && (
          <DebuggerView />
        )}

        {activeTab === "examination" && (
          <ExaminationView
            initialProblemId={examProblemId}
            onRefreshAnalytics={loadAnalytics}
          />
        )}

        {activeTab === "languages" && (
          <LanguageExplorerView onOpenInIde={handleOpenInIde} />
        )}

        {activeTab === "ai-tutor" && (
          <AiTutorView />
        )}

        {activeTab === "focus" && (
          <FocusView
            audioPlaying={audioPlaying}
            setAudioPlaying={setAudioPlaying}
            onRefreshAnalytics={loadAnalytics}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsView analytics={analytics} onNavigate={handleNavigate} />
        )}

        {activeTab === "personalization" && (
          <PersonalizationView
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            audioPlaying={audioPlaying}
            setAudioPlaying={setAudioPlaying}
          />
        )}

        {activeTab === "admin" && (
          <AdminView />
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          loadPreferences();
          loadAnalytics();
        }}
      />

      {/* Floating AI Assistant Quick Pill */}
      {activeTab !== "ai-tutor" && (
        <button
          onClick={() => {
            setActiveTab("ai-tutor");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-purple-500/40 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xl shadow-purple-500/40 backdrop-blur-xl transition hover:scale-105 active:scale-95"
          title="Open CODELAB AI Studio"
        >
          <Sparkles className="h-4 w-4 text-purple-200 animate-pulse" />
          <span>Ask AI Assistant</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
