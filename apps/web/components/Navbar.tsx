"use client";

import React, { useState } from "react";
import {
  Code2,
  Terminal,
  BookOpen,
  GitFork,
  Layers,
  Bug,
  Award,
  Globe,
  Sparkles,
  Timer,
  BarChart3,
  Palette,
  ShieldCheck,
  Volume2,
  VolumeX,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Laptop
} from "lucide-react";
import { AmbientAudioEngine } from "../services/audio";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  onOpenAuth: () => void;
  onLogout: () => void;
  audioPlaying: boolean;
  setAudioPlaying: (playing: boolean) => void;
  audioPreset: string;
  notifications: any[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  audioPlaying,
  setAudioPlaying,
  audioPreset,
  notifications,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleAudio = () => {
    if (audioPlaying) {
      AmbientAudioEngine.stop();
      setAudioPlaying(false);
    } else {
      AmbientAudioEngine.play(audioPreset || "rain", 0.5);
      setAudioPlaying(true);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "academy", label: "Academy", icon: BookOpen },
    { id: "ide", label: "IDE", icon: Terminal },
    { id: "algorithms", label: "Algorithms", icon: GitFork },
    { id: "data-structures", label: "DSA Lab", icon: Layers },
    { id: "debugger", label: "Debugger", icon: Bug },
    { id: "examination", label: "Practice & Exam", icon: Award },
    { id: "languages", label: "Languages", icon: Globe },
    { id: "ai-tutor", label: "AI Studio", icon: Sparkles },
    { id: "focus", label: "Focus", icon: Timer },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "personalization", label: "Studio", icon: Palette },
  ];

  if (currentUser && (currentUser.role === "admin" || currentUser.role === "teacher")) {
    navItems.push({ id: "admin", label: "Admin", icon: ShieldCheck });
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07090E]/90 backdrop-blur-2xl transition-all">
        {/* Top Persistent AI Engine Ribbon */}
        <div className="w-full border-b border-purple-500/20 bg-gradient-to-r from-[#170F2C] via-[#10142B] to-[#170F2C] px-4 py-1.5 text-xs text-purple-200">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              <span className="font-semibold text-white">AI Engine:</span>
              <span className="rounded-md border border-purple-400/40 bg-purple-500/25 px-2 py-0.5 font-bold text-white shadow-sm">
                CODELAB AI Code Intelligence
              </span>
              <span className="hidden sm:inline text-[11px] text-purple-300">
                • Sub-Second Code Intelligence &amp; Autonomous Debugging
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE &amp; CONNECTED
              </span>
              <button
                onClick={() => setActiveTab("ai-tutor")}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-purple-300 hover:text-white underline decoration-purple-400/50"
              >
                Launch Studio &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setMobileMenuOpen(false);
              }}
              className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 focus:outline-none"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/25">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0A0D18]/90">
                  <Code2 className="h-5 w-5 text-indigo-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-tight text-white sm:text-lg">CODELAB IDE</span>
                  <span className="rounded-full border border-purple-500/40 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 px-2 py-0.5 text-[10px] font-bold tracking-wide text-purple-200 flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-2.5 w-2.5 text-purple-400" /> CODELAB AI
                  </span>
                </div>
                <p className="text-[10px] font-medium tracking-wide text-slate-400">
                  By <span className="text-indigo-300 font-semibold">Sinan Mohammed</span> • <span className="text-purple-300 font-semibold">CODELAB AI Intelligence</span>
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1 shadow-inner backdrop-blur-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isAi = item.id === "ai-tutor";
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? isAi
                        ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/30"
                        : "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/30"
                      : isAi
                      ? "text-purple-300 hover:bg-purple-500/15 hover:text-white"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isAi ? "text-purple-400 animate-pulse" : ""}`} />
                  <span>{item.label}</span>
                  {isAi && (
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live AI Badge */}
            <button
              onClick={() => setActiveTab("ai-tutor")}
              title="CODELAB AI Intelligence Active"
              className="hidden md:flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-sky-500/15 px-3 py-1.5 text-xs font-semibold text-purple-200 shadow-sm transition hover:border-purple-500/50 hover:bg-purple-500/20 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              <span className="bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200 bg-clip-text text-transparent font-bold">
                CODELAB AI
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            {/* Audio Ambient Generator */}
            <button
              onClick={toggleAudio}
              title={audioPlaying ? "Mute Study Soundscape" : "Start Study Soundscape"}
              className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                audioPlaying
                  ? "border-sky-500/40 bg-sky-500/15 text-sky-300 shadow-md shadow-sky-500/20"
                  : "border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-slate-200"
              }`}
            >
              {audioPlaying ? <Volume2 className="h-4 w-4 animate-pulse" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 transition hover:text-slate-200"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0E1322]/95 p-4 shadow-2xl backdrop-blur-2xl">
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Notifications
                    </span>
                    <span className="text-[11px] text-slate-400">{notifications.length} total</span>
                  </div>
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-400">No new notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-2.5 text-xs transition hover:bg-white/[0.05]"
                        >
                          <p className="font-medium text-slate-200">{n.title}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 transition hover:bg-white/[0.08]"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 text-[11px] font-bold text-white">
                    {currentUser.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="hidden text-left text-xs sm:block">
                    <p className="max-w-[100px] truncate font-medium text-slate-200">
                      {currentUser.full_name || currentUser.username}
                    </p>
                    <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">
                      {currentUser.role}
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0E1322]/95 p-2 shadow-2xl backdrop-blur-2xl">
                    <div className="border-b border-white/10 px-3 py-2">
                      <p className="text-xs font-semibold text-slate-200">{currentUser.full_name}</p>
                      <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                      <span className="mt-1 inline-block rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                        ID: {currentUser.student_id}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab("personalization");
                        setShowUserMenu(false);
                      }}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.06]"
                    >
                      <Palette className="h-3.5 w-3.5 text-indigo-400" />
                      Personalization Studio
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-rose-400 transition hover:bg-rose-500/10"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="glass-button-primary rounded-xl px-4 py-1.5 text-xs font-semibold shadow-md"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-white/10 bg-[#07090E]/95 px-4 py-3 backdrop-blur-2xl lg:hidden space-y-2.5">
            <div className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-500/10 p-2.5 text-xs text-purple-200">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" /> CODELAB AI Intelligence
              </span>
              <span className="text-emerald-400 font-semibold text-[10px]">ONLINE</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
