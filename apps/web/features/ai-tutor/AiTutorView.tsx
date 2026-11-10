"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  Code2,
  HelpCircle,
  Lightbulb,
  Award,
  Layers,
  Globe,
  Bot,
  User,
  RotateCcw,
  Cpu,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Terminal
} from "lucide-react";
import { ApiClient } from "../../services/api";

export const AiTutorView: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; model?: string }>>([
    {
      role: "assistant",
      model: "CODELAB AI Intelligence",
      content:
        "Hello! I am your AI Programming Professor inside CODELAB IDE (architected by Sinan Mohammed).\n\nI am engineered to teach computer science and coding from absolute beginner zero up to engineering master level. I prioritize conceptual mental models and real-world analogies over rote memorization.\n\nWhat concept, algorithm, error, or programming doubt should we conquer together today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [teachingMode, setTeachingMode] = useState("simple");
  const [language, setLanguage] = useState("python");
  const [explanationLanguage, setExplanationLanguage] = useState("english");
  const [contextCode, setContextCode] = useState("");
  const [showCodeContext, setShowCodeContext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const TEACHING_MODES = [
    { id: "simple", label: "Simple Analogy", desc: "No jargon, beginner-first everyday metaphors", icon: Lightbulb },
    { id: "detailed", label: "Detailed Deep Dive", desc: "Formal technical precision & mechanics", icon: BookOpen },
    { id: "real_world", label: "Real-World Engineering", desc: "How Netflix, NASA or Google use it", icon: Globe },
    { id: "visual", label: "Visual Mental Model", desc: "Memory boxes, arrows & stack frames", icon: Layers },
    { id: "code_demo", label: "Code Demonstration", desc: "Step-by-step runnable example", icon: Code2 },
    { id: "exam", label: "Exam Preparation", desc: "Key questions, pitfalls & exam rubrics", icon: Award },
    { id: "qna", label: "Socratic Q&A", desc: "Guides you to discover the answer yourself", icon: HelpCircle },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: query.trim() }];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await ApiClient.tutorChat({
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        language,
        mode: teachingMode,
        explanation_language: explanationLanguage,
        context_code: showCodeContext ? contextCode : undefined,
      });

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          model: res.model || "CODELAB AI Intelligence",
          content: res.response,
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          model: "CODELAB AI Intelligence",
          content: `AI Code Intelligence Notice: ${err.message || "Failed to communicate with AI teacher."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Prominent AI Showcase */}
      <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-200 shadow-sm shadow-purple-500/20">
                <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                <span>CODELAB AI Intelligence</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Active Engine
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-slate-300">
                Universal Code Intelligence
              </span>
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              AI Teaching Studio — Powered by CODELAB AI Intelligence
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Personalized one-on-one computer science mentorship engineered by <span className="text-indigo-300 font-medium">Sinan Mohammed</span>. Designed to explain why code works, break down errors with zero shame, and teach programming through real-life mental models.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/[0.08] bg-[#07090E]/60 p-3 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Inference Speed</span>
              <p className="font-mono text-xs font-bold text-purple-300 flex items-center gap-1 justify-end">
                <Zap className="h-3 w-3 text-amber-400" /> ~240ms Sub-Second
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#07090E]/60 p-3 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Context Understanding</span>
              <p className="font-mono text-xs font-bold text-indigo-300 flex items-center gap-1 justify-end">
                <Cpu className="h-3 w-3 text-indigo-400" /> 1M Token Window
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 max-w-7xl mx-auto h-[76vh]">
        {/* Sidebar Controls */}
        <div className="glass-card rounded-3xl p-5 lg:col-span-4 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            {/* Model Profile Card */}
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">CODELAB AI Intelligence</span>
                </div>
                <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-mono text-purple-300">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Optimized for code generation, live diagnostics, step-by-step algorithms, and multilingual technical explanations.
              </p>
            </div>

            {/* Teaching Mode Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Pedagogical Mode</label>
                <span className="text-[10px] text-slate-500">7 Adaptive Modes</span>
              </div>
              <div className="space-y-1.5">
                {TEACHING_MODES.map((m) => {
                  const Icon = m.icon;
                  const isSelected = teachingMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setTeachingMode(m.id)}
                      className={`w-full flex items-center justify-between rounded-2xl px-3 py-2 text-left text-xs transition border ${
                        isSelected
                          ? "border-purple-500/50 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white font-medium shadow-md shadow-purple-500/15"
                          : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-purple-400" : "text-slate-400"}`} />
                        <div>
                          <p className="font-semibold text-white leading-tight">{m.label}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{m.desc}</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Code & Explanation Language */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.08]">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Target Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] p-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="c">C (C11)</option>
                  <option value="cpp">C++ (C++17)</option>
                  <option value="java">Java 17</option>
                  <option value="csharp">C# (.NET)</option>
                  <option value="go">Go (Golang)</option>
                  <option value="rust">Rust</option>
                  <option value="sql">SQL</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Teaching Language</label>
                <select
                  value={explanationLanguage}
                  onChange={(e) => setExplanationLanguage(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] p-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="english">English (Standard)</option>
                  <option value="malayalam">Malayalam (മലയാളം)</option>
                  <option value="hindi">Hindi (हिन्दी)</option>
                </select>
              </div>
            </div>

            {/* Code Context Attachment Drawer */}
            <div className="pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => setShowCodeContext(!showCodeContext)}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition"
              >
                <Terminal className="h-3.5 w-3.5" />
                {showCodeContext ? "Hide Attached Code Context" : "+ Attach Code Context for Analysis"}
              </button>
              {showCodeContext && (
                <div className="mt-2 space-y-1">
                  <textarea
                    value={contextCode}
                    onChange={(e) => setContextCode(e.target.value)}
                    placeholder="Paste code snippet for AI Assistant to analyze line-by-line..."
                    className="w-full h-28 rounded-2xl border border-white/[0.08] bg-[#05070B] p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50"
                  />
                  <p className="text-[10px] text-slate-500">AI Code Intelligence reads syntax, scope, and variable mutations directly.</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  model: "CODELAB AI Intelligence",
                  content: "Chat session reset. What programming concept or code problem should we conquer now?",
                },
              ])
            }
            className="glass-button mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] py-2.5 text-xs text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Chat Session
          </button>
        </div>

        {/* Main Conversation Stage */}
        <div className="glass-card rounded-3xl p-5 lg:col-span-8 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Header of Conversation */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/25">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">CODELAB AI Assistant</h3>
                  <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[9px] font-semibold text-purple-300">
                    Active Session
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Target: <strong className="text-indigo-300 capitalize">{language}</strong> • Mode: <strong className="text-purple-300 capitalize">{teachingMode.replace("_", " ")}</strong> • Language: <strong className="text-sky-300 capitalize">{explanationLanguage}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Safe Sandbox</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role !== "user" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-400 text-white shrink-0 shadow-md shadow-purple-500/25">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`rounded-3xl p-4 text-xs max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 rounded-tr-none"
                      : "border border-white/[0.08] bg-[#05070B]/90 text-slate-200 shadow-xl rounded-tl-none space-y-2"
                  }`}
                >
                  {m.role !== "user" && (
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 mb-1.5">
                      <span className="font-bold text-[11px] text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-purple-400" />
                        CODELAB AI Teacher
                      </span>
                      <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                        {m.model || "CODELAB AI"}
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap leading-relaxed">
                    {m.content}
                  </div>

                  {m.role !== "user" && (
                    <div className="pt-2 border-t border-white/[0.06] text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Synthesized in real-time by CODELAB AI Engine</span>
                      <span>Sinan Mohammed Architecture</span>
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/[0.08] text-white shrink-0 border border-white/10">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-3.5 text-xs text-purple-200">
                <Sparkles className="h-4 w-4 animate-spin text-purple-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">CODELAB AI is reasoning...</p>
                  <p className="text-[11px] text-purple-300/80">Synthesizing mental models, code semantics, and line-by-line pedagogical breakdown.</p>
                </div>
              </div>
            )}
          </div>

          {/* Input & Quick Prompts Bar */}
          <div className="mt-4 border-t border-white/[0.08] pt-3.5 space-y-3">
            {/* Quick Prompt Recommendation Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                "Explain variables with a real-life analogy",
                "Why does index start at 0 in arrays?",
                "How does recursion work in memory?",
                "Explain in Malayalam: What is a Pointer in C?",
                "Why do while loops sometimes freeze?",
                "What is Time Complexity O(N log N)?"
              ].map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(promptText)}
                  className="shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-slate-400 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-200 transition"
                >
                  {promptText}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask CODELAB AI anything about code, errors, algorithms, or mental models..."
                className="w-full rounded-2xl border border-white/[0.08] bg-[#05070B] px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 focus:outline-none transition"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 text-white shadow-lg shadow-purple-500/25 hover:brightness-110 active:scale-95 disabled:opacity-40 shrink-0 transition"
                title="Send to CODELAB AI"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
