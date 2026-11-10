"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Save,
  Download,
  Plus,
  Trash2,
  FileCode,
  Terminal as TerminalIcon,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  FolderDown,
  Eye,
  X,
  GitBranch,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  FileText,
  Upload,
  BookTemplate
} from "lucide-react";
import { ApiClient } from "../../services/api";

interface IdeFile {
  id?: number;
  filename: string;
  content: string;
  language: string;
}

interface GitCommitItem {
  hash: string;
  author: string;
  message: string;
  timestamp: string;
  branch: string;
}

interface IdeProps {
  initialCode?: string;
  initialLanguage?: string;
  currentUser: any;
  onRefreshAnalytics: () => void;
}

export const IdeView: React.FC<IdeProps> = ({
  initialCode,
  initialLanguage = "python",
  currentUser,
  onRefreshAnalytics,
}) => {
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [files, setFiles] = useState<IdeFile[]>([
    {
      filename: `main.${initialLanguage === "python" ? "py" : initialLanguage === "javascript" ? "js" : initialLanguage === "c" ? "c" : "txt"}`,
      content:
        initialCode ||
        `# CODELAB IDE Universal Workspace\n# Developer: Sinan Mohammed\n\ndef main():\n    print("Hello from CODELAB IDE!")\n    numbers = [34, 12, 89, 5, 23]\n    print(f"Sorted sequence: {sorted(numbers)}")\n\nif __name__ == "__main__":\n    main()\n`,
      language: initialLanguage,
    },
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [stdin, setStdin] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<{
    status: string;
    stdout: string;
    stderr: string;
    executionTimeMs?: number;
    errorDetails?: any;
  } | null>(null);

  // Bottom pane tab: Terminal vs Git vs Copilot
  const [bottomTab, setBottomTab] = useState<"terminal" | "git" | "copilot">("terminal");
  const [copied, setCopied] = useState(false);

  // AI Copilot State
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I am your AI Copilot inside CODELAB IDE. I have full context of your active file. How can I assist you with your code right now?"
    }
  ]);

  const handleSendCopilot = async (customPrompt?: string) => {
    const promptText = customPrompt || copilotInput;
    if (!promptText.trim() || copilotLoading) return;

    const next = [...copilotMessages, { role: "user", content: promptText.trim() }];
    setCopilotMessages(next);
    setCopilotInput("");
    setCopilotLoading(true);

    try {
      const res = await ApiClient.tutorChat({
        messages: next,
        language,
        mode: "code_demo",
        context_code: activeFile.content,
      });
      setCopilotMessages([
        ...next,
        {
          role: "assistant",
          content: res.response || "Code intelligence synthesized by CODELAB AI."
        }
      ]);
    } catch (err: any) {
      setCopilotMessages([
        ...next,
        {
          role: "assistant",
          content: `AI Copilot Notice: ${err.message || "Failed to contact AI engine. Check connectivity."}`
        }
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  // Git state
  const [currentBranch, setCurrentBranch] = useState("main");
  const [commitMessage, setCommitMessage] = useState("");
  const [commitHistory, setCommitHistory] = useState<GitCommitItem[]>([
    {
      hash: "8f4a1c9",
      author: "Sinan Mohammed",
      message: "feat: initialize CODELAB IDE v2.0 multi-language workspace",
      timestamp: "Just now",
      branch: "main",
    },
  ]);
  const [lastCommittedContent, setLastCommittedContent] = useState<Record<string, string>>({});

  // AI Modal states
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorAnalysis, setErrorAnalysis] = useState<any | null>(null);
  const [explainingError, setExplainingError] = useState(false);

  const [showLineExplainer, setShowLineExplainer] = useState(false);
  const [lineExplanation, setLineExplanation] = useState<any | null>(null);
  const [explainingCode, setExplainingCode] = useState(false);

  // Sync initialCode if passed from outside
  useEffect(() => {
    if (initialCode) {
      setFiles((prev) => {
        const copy = [...prev];
        copy[0] = {
          ...copy[0],
          content: initialCode,
          language: initialLanguage,
          filename: `main.${initialLanguage === "python" ? "py" : initialLanguage === "javascript" ? "js" : "txt"}`,
        };
        return copy;
      });
      setLanguage(initialLanguage);
    }
  }, [initialCode, initialLanguage]);

  const activeFile = files[activeFileIndex] || files[0];

  const handleCodeChange = (newVal: string | undefined) => {
    const updated = [...files];
    updated[activeFileIndex] = {
      ...updated[activeFileIndex],
      content: newVal || "",
    };
    setFiles(updated);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const extMap: Record<string, string> = {
      python: "py",
      javascript: "js",
      typescript: "ts",
      c: "c",
      cpp: "cpp",
      java: "java",
      csharp: "cs",
      go: "go",
      rust: "rs",
      php: "php",
      ruby: "rb",
      sql: "sql",
      html: "html",
      css: "css",
      bash: "sh",
    };
    const ext = extMap[newLang] || "txt";
    const updated = [...files];
    updated[activeFileIndex] = {
      ...updated[activeFileIndex],
      filename: `main.${ext}`,
      language: newLang,
    };
    setFiles(updated);
  };

  const handleApplyTemplate = (templateName: string) => {
    if (templateName === "python") {
      setLanguage("python");
      setFiles([
        {
          filename: "main.py",
          language: "python",
          content: `# Python 3 Starter Template\n# CODELAB IDE — Sinan Mohammed\n\ndef solve():\n    data = [10, 5, 23, 78, 4]\n    print(f"Data: {data}")\n    print(f"Sum: {sum(data)}, Max: {max(data)}")\n\nif __name__ == '__main__':\n    solve()\n`,
        },
      ]);
    } else if (templateName === "javascript") {
      setLanguage("javascript");
      setFiles([
        {
          filename: "index.js",
          language: "javascript",
          content: `// Node.js Starter Template\n// CODELAB IDE — Sinan Mohammed\n\nfunction main() {\n    const items = ['Algorithms', 'Data Structures', 'AI Mentorship'];\n    items.forEach((item, i) => console.log(\`\${i + 1}. \${item}\`));\n}\n\nmain();\n`,
        },
      ]);
    } else if (templateName === "web") {
      setLanguage("html");
      setFiles([
        {
          filename: "index.html",
          language: "html",
          content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>CODELAB IDE Web Preview</title>\n  <style>\n    body { background: #07090E; color: #F8FAFC; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }\n    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2rem; backdrop-filter: blur(20px); text-align: center; }\n    h1 { color: #818CF8; margin-bottom: 0.5rem; }\n    p { color: #94A3B8; font-size: 14px; }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <h1>CODELAB IDE Web Canvas</h1>\n    <p>Live sandboxed DOM rendering in real-time.</p>\n  </div>\n</body>\n</html>`,
        },
      ]);
    } else if (templateName === "c") {
      setLanguage("c");
      setFiles([
        {
          filename: "main.c",
          language: "c",
          content: `// C Language Starter\n// CODELAB IDE — Sinan Mohammed\n\n#include <stdio.h>\n\nint main() {\n    printf("Welcome to CODELAB IDE native compiler engine!\\n");\n    int a = 15, b = 27;\n    printf("Sum: %d + %d = %d\\n", a, b, a + b);\n    return 0;\n}\n`,
        },
      ]);
    } else if (templateName === "cpp") {
      setLanguage("cpp");
      setFiles([
        {
          filename: "main.cpp",
          language: "cpp",
          content: `// C++ STL Starter\n// CODELAB IDE — Sinan Mohammed\n\n#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v = {45, 12, 89, 3, 56};\n    std::sort(v.begin(), v.end());\n    std::cout << "Sorted STL Vector: ";\n    for(int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}\n`,
        },
      ]);
    } else if (templateName === "java") {
      setLanguage("java");
      setFiles([
        {
          filename: "Main.java",
          language: "java",
          content: `// Java Starter\n// CODELAB IDE — Sinan Mohammed\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("CODELAB IDE Java Engine active.");\n    }\n}\n`,
        },
      ]);
    } else if (templateName === "sql") {
      setLanguage("sql");
      setFiles([
        {
          filename: "query.sql",
          language: "sql",
          content: `-- SQLite In-Memory Database Sandbox\n-- CODELAB IDE — Sinan Mohammed\n\nSELECT * FROM students;\nSELECT course_name, credits FROM courses;\n`,
        },
      ]);
    }
    setActiveFileIndex(0);
  };

  const handleAddFile = () => {
    const name = prompt("Enter file name (e.g. utils.py, style.css, helpers.ts):");
    if (!name || !name.trim()) return;
    const newFile: IdeFile = {
      filename: name.trim(),
      content: `// ${name.trim()} - CODELAB IDE\n`,
      language,
    };
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
  };

  const handleDeleteFile = (idx: number) => {
    if (files.length <= 1) {
      alert("A project must maintain at least one file.");
      return;
    }
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    setActiveFileIndex(Math.max(0, activeFileIndex - 1));
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setTerminalOutput(null);
    setBottomTab("terminal");
    try {
      const res = await ApiClient.runCode({
        language,
        source_code: activeFile.content,
        stdin,
      });
      setTerminalOutput({
        status: res.status,
        stdout: res.stdout,
        stderr: res.stderr,
        executionTimeMs: res.execution_time_ms,
        errorDetails: res.error_details,
      });

      if (res.status === "error" && res.stderr) {
        explainErrorAutomatically(res.stderr, res.stdout);
      }
      onRefreshAnalytics();
    } catch (err: any) {
      setTerminalOutput({
        status: "error",
        stdout: "",
        stderr: err.message || "Failed to execute code in sandbox.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const explainErrorAutomatically = async (stderr: string, stdout?: string) => {
    setExplainingError(true);
    try {
      const explanation = await ApiClient.explainError({
        language,
        source_code: activeFile.content,
        stderr,
        stdout,
      });
      setErrorAnalysis(explanation);
      setShowErrorModal(true);
    } catch {
      // handled
    } finally {
      setExplainingError(false);
    }
  };

  const handleExplainCode = async () => {
    setExplainingCode(true);
    try {
      const data = await ApiClient.explainCode({
        language,
        source_code: activeFile.content,
        mode: "simple",
      });
      setLineExplanation(data);
      setShowLineExplainer(true);
    } catch (err: any) {
      alert(`AI explanation error: ${err.message}`);
    } finally {
      setExplainingCode(false);
    }
  };

  const handleSaveProject = async () => {
    try {
      const title = prompt("Enter project title:", "CODELAB Project");
      if (!title) return;
      const proj = await ApiClient.createProject({
        title,
        description: `Project in ${language} saved from CODELAB IDE`,
        language,
        initial_content: activeFile.content,
      });
      if (files.length > 1 && proj?.id) {
        for (let i = 1; i < files.length; i++) {
          await ApiClient.saveProjectFile(proj.id, {
            filename: files[i].filename,
            content: files[i].content,
            language: files[i].language,
          });
        }
      }
      alert("Project saved successfully to your cloud profile!");
      onRefreshAnalytics();
    } catch (err: any) {
      alert(`Save project error: ${err.message}`);
    }
  };

  const handleDownloadSource = () => {
    const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportZip = () => {
    const projectPayload = {
      product: "CODELAB IDE",
      developer: "Sinan Mohammed",
      version: "2.0",
      language,
      files,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(projectPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `codelab-project-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyTerminal = () => {
    if (!terminalOutput) return;
    const text = `${terminalOutput.stdout}\n${terminalOutput.stderr}`.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Git operations
  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    const randomHash = Math.random().toString(16).substring(2, 9);
    const newCommit: GitCommitItem = {
      hash: randomHash,
      author: currentUser?.full_name || "Sinan Mohammed",
      message: commitMessage.trim(),
      timestamp: "Just now",
      branch: currentBranch,
    };
    setCommitHistory([newCommit, ...commitHistory]);
    setLastCommittedContent((prev) => ({
      ...prev,
      [activeFile.filename]: activeFile.content,
    }));
    setCommitMessage("");
  };

  const isFileModified = (file: IdeFile) => {
    const last = lastCommittedContent[file.filename];
    return last !== undefined && last !== file.content;
  };

  return (
    <div className="space-y-4">
      {/* Top IDE Toolbar */}
      <div className="glass-panel rounded-3xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Language selector & Starter templates */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#07090E] px-3 py-1.5 text-xs font-semibold text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="python">Python 3.10</option>
            <option value="javascript">JavaScript (Node.js v24)</option>
            <option value="typescript">TypeScript</option>
            <option value="c">C (GCC Native)</option>
            <option value="cpp">C++ (G++ Native)</option>
            <option value="java">Java 21</option>
            <option value="csharp">C# (.NET)</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="sql">SQL (In-Memory SQLite)</option>
            <option value="bash">Bash / PowerShell</option>
            <option value="html">HTML5 / CSS3 Web</option>
          </select>

          {/* Templates dropdown */}
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                handleApplyTemplate(e.target.value);
                e.target.value = "";
              }
            }}
            className="rounded-xl border border-white/10 bg-[#07090E] px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="" disabled>
              Starters...
            </option>
            <option value="python">Python Starter</option>
            <option value="javascript">Node.js Starter</option>
            <option value="web">HTML/CSS Web App</option>
            <option value="c">C Program Starter</option>
            <option value="cpp">C++ STL Starter</option>
            <option value="java">Java Object Starter</option>
            <option value="sql">SQL Database Starter</option>
          </select>

          {/* Multi-file tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-sm">
            {files.map((file, idx) => {
              const isActive = idx === activeFileIndex;
              const modified = isFileModified(file);
              return (
                <div
                  key={idx}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`group flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-medium transition ${
                    isActive
                      ? "border-indigo-500/50 bg-indigo-600/30 text-white shadow-sm"
                      : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileCode className="h-3 w-3 text-indigo-400" />
                  <span>{file.filename}</span>
                  {modified && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Modified" />}
                  {files.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(idx);
                      }}
                      className="ml-1 text-slate-500 hover:text-rose-400"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
            <button
              onClick={handleAddFile}
              className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
              title="Add File"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Explain */}
          <button
            onClick={handleExplainCode}
            disabled={explainingCode}
            className="glass-button flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-500/20 transition shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
            <span>{explainingCode ? "AI Analyzing..." : "AI Explain"}</span>
          </button>

          <button
            onClick={handleSaveProject}
            title="Save Project to Cloud Profile"
            className="glass-button flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-slate-300 hover:text-white"
          >
            <Save className="h-3.5 w-3.5" /> Save
          </button>

          <button
            onClick={handleExportZip}
            title="Export Project JSON / Package"
            className="glass-button flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-slate-300 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="glass-button-primary flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-bold text-white shadow-lg disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            {isRunning ? "Executing..." : "Run Program"}
          </button>
        </div>
      </div>

      {/* Editor & Web Browser Split View */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 min-h-[460px]">
        {/* Monaco Editor Pane */}
        <div
          className={`glass-card rounded-3xl overflow-hidden ${
            language === "html" ? "lg:col-span-7" : "lg:col-span-12"
          }`}
        >
          <Editor
            height="460px"
            language={
              language === "c" || language === "cpp"
                ? "c"
                : language === "bash"
                ? "shell"
                : language === "csharp"
                ? "csharp"
                : language
            }
            value={activeFile.content}
            theme="vs-dark"
            onChange={handleCodeChange}
            options={{
              fontSize: 13.5,
              fontFamily: "'JetBrains Mono', Consolas, monospace",
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: "on",
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>

        {/* Live Browser Preview (Active for HTML/CSS) */}
        {language === "html" && (
          <div className="lg:col-span-5 glass-card rounded-3xl overflow-hidden flex flex-col bg-white">
            <div className="flex items-center justify-between bg-slate-100 px-4 py-2 border-b text-[11px] font-mono text-slate-600">
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-indigo-600" /> Sandboxed Browser Frame
              </span>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded">100% Zoom</span>
            </div>
            <iframe
              srcDoc={activeFile.content}
              title="Browser Preview"
              sandbox="allow-scripts"
              className="w-full flex-1 border-0"
            />
          </div>
        )}
      </div>

      {/* Bottom Terminal & Git Inspection Panel */}
      <div className="glass-card rounded-3xl p-5 shadow-2xl">
        {/* Panel Tabs: Terminal vs Git Inspector */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBottomTab("terminal")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                bottomTab === "terminal" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <TerminalIcon className="h-3.5 w-3.5" />
              Terminal
            </button>

            <button
              onClick={() => setBottomTab("git")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                bottomTab === "git" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <GitBranch className="h-3.5 w-3.5 text-sky-400" />
              Git Inspector
            </button>

            <button
              onClick={() => setBottomTab("copilot")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                bottomTab === "copilot"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20"
                  : "text-purple-300 hover:text-white border border-purple-500/20 bg-purple-500/10"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              <span>AI Copilot</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </button>
          </div>

          {/* Right Action Icons for Terminal */}
          {bottomTab === "terminal" && (
            <div className="flex items-center gap-2">
              {terminalOutput && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    terminalOutput.status === "success"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {terminalOutput.status}
                </span>
              )}
              {terminalOutput?.executionTimeMs !== undefined && (
                <span className="font-mono text-[11px] text-slate-400">
                  {terminalOutput.executionTimeMs} ms
                </span>
              )}
              {terminalOutput?.errorDetails && (
                <button
                  onClick={() => setShowErrorModal(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/20 px-2.5 py-1 text-[11px] font-semibold text-purple-200 hover:bg-purple-500/30 transition shadow-sm"
                >
                  <Sparkles className="h-3 w-3 text-purple-400" /> Diagnose with AI
                </button>
              )}
              <button
                onClick={handleCopyTerminal}
                className="glass-button rounded-lg px-2.5 py-1 text-[11px] text-slate-300"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => setTerminalOutput(null)}
                className="glass-button rounded-lg px-2.5 py-1 text-[11px] text-slate-300"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: Execution Terminal */}
        {bottomTab === "terminal" && (
          <div className="space-y-3 pt-3">
            {/* Standard Input Input Field */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-slate-400 shrink-0">Stdin &gt;</span>
              <input
                type="text"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter input for interactive program prompts (e.g. 5 10)..."
                className="w-full rounded-xl border border-white/10 bg-[#07090E]/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Output Stream Box */}
            <div className="min-h-[140px] max-h-[220px] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#07090E] p-4 font-mono text-xs text-slate-200">
              {isRunning && (
                <p className="text-indigo-400 animate-pulse">&gt; Executing in secure sandbox worker...</p>
              )}

              {!isRunning && !terminalOutput && (
                <p className="text-slate-600">&gt; Program output will stream here upon execution.</p>
              )}

              {terminalOutput && (
                <div className="space-y-2">
                  {terminalOutput.stdout && (
                    <pre className="text-slate-100 whitespace-pre-wrap">{terminalOutput.stdout}</pre>
                  )}
                  {terminalOutput.stderr && (
                    <pre className="text-rose-400 whitespace-pre-wrap">{terminalOutput.stderr}</pre>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Git Inspector */}
        {bottomTab === "git" && (
          <div className="space-y-4 pt-3 text-xs">
            {/* Branch & Commit Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Branch:</span>
                <select
                  value={currentBranch}
                  onChange={(e) => setCurrentBranch(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="main">main</option>
                  <option value="dev">dev</option>
                  <option value="feature/dsa-engine">feature/dsa-engine</option>
                </select>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/20">
                  Working Tree Clean
                </span>
              </div>

              {/* Commit Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Commit message (e.g. feat: add binary search)..."
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-64 rounded-xl border border-white/10 bg-[#07090E] px-3 py-1.5 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handleCommit}
                  className="glass-button-primary rounded-xl px-3.5 py-1.5 text-xs font-semibold text-white"
                >
                  <GitCommit className="inline mr-1 h-3.5 w-3.5" /> Commit
                </button>
              </div>
            </div>

            {/* Commit History Log */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Commit History</span>
                <span>Branch: {currentBranch}</span>
              </div>
              <div className="mt-3 space-y-2">
                {commitHistory.map((c, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.02] p-2.5 font-mono text-[11px]">
                    <div className="flex items-center gap-2.5">
                      <span className="text-indigo-400 font-bold">{c.hash}</span>
                      <span className="text-slate-200">{c.message}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                      <span>{c.author}</span>
                      <span>{c.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI Copilot */}
        {bottomTab === "copilot" && (
          <div className="space-y-4 pt-3 text-xs">
            <div className="flex items-center justify-between rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                  <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">CODELAB AI Copilot</h4>
                  <p className="text-[10px] text-purple-200">Active File Context: <strong className="font-mono text-white">{activeFile.filename}</strong> ({language})</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
              {[
                "Explain how this code works step-by-step",
                "Find any edge cases or logic bugs in this file",
                "Optimize this code for lower time complexity",
                "Add clean comments and docstrings to this code"
              ].map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => handleSendCopilot(promptText)}
                  className="shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-slate-300 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-200 transition"
                >
                  {promptText}
                </button>
              ))}
            </div>

            {/* Messages History */}
            <div className="max-h-60 overflow-y-auto space-y-3 rounded-2xl border border-white/[0.08] bg-[#05070B] p-4 font-sans">
              {copilotMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-1 rounded-2xl p-3 ${
                    msg.role === "user"
                      ? "ml-8 bg-indigo-600/30 border border-indigo-500/30 text-white"
                      : "mr-8 bg-white/[0.03] border border-white/[0.08] text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold">
                    <span className={msg.role === "user" ? "text-indigo-300" : "text-purple-300 flex items-center gap-1"}>
                      {msg.role === "user" ? "You" : <><Sparkles className="h-3 w-3 text-purple-400" /> CODELAB AI</>}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed text-xs">
                    {msg.content}
                  </div>
                </div>
              ))}

              {copilotLoading && (
                <div className="flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-3 text-xs text-purple-200">
                  <Sparkles className="h-4 w-4 animate-spin text-purple-400" />
                  <span>AI Copilot is analyzing your code in real time...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendCopilot()}
                placeholder="Ask AI Copilot anything about your code..."
                className="w-full rounded-2xl border border-white/[0.08] bg-[#07090E] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
              />
              <button
                onClick={() => handleSendCopilot()}
                disabled={copilotLoading || !copilotInput.trim()}
                className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md disabled:opacity-40"
              >
                <Sparkles className="h-3.5 w-3.5" /> Ask
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Explanation Modal */}
      {showErrorModal && errorAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Diagnostic Report</h3>
                  <p className="text-[10px] text-purple-300 font-medium">Powered by CODELAB AI Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setShowErrorModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
                <span className="font-semibold text-rose-300 uppercase text-[10px]">Root Cause Diagnosis</span>
                <p className="mt-1 text-slate-200">
                  {errorAnalysis.root_cause || errorAnalysis.cause || errorAnalysis.summary || errorAnalysis.meaning || "Execution stopped due to a runtime constraint violation."}
                </p>
              </div>

              {(errorAnalysis.mental_model || errorAnalysis.meaning) && (
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                  <span className="font-semibold text-indigo-300 uppercase text-[10px]">Analogy & Mental Model</span>
                  <p className="mt-1 text-slate-200">{errorAnalysis.mental_model || errorAnalysis.meaning}</p>
                </div>
              )}

              {(errorAnalysis.fix_code || errorAnalysis.how_to_fix || errorAnalysis.corrected_code) && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-4">
                  <span className="font-semibold text-emerald-400 uppercase text-[10px]">Recommended Fix</span>
                  <pre className="mt-2 font-mono text-[11px] text-slate-200 whitespace-pre-wrap">
                    {errorAnalysis.fix_code || errorAnalysis.how_to_fix || errorAnalysis.corrected_code}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5 text-purple-300">
                <Sparkles className="h-3 w-3 text-purple-400" /> CODELAB AI Online
              </span>
              <button
                onClick={() => setShowErrorModal(false)}
                className="glass-button rounded-xl px-4 py-1.5 text-xs font-semibold text-white"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Line Explainer Modal */}
      {showLineExplainer && lineExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{lineExplanation.title || "Line-by-Line Code Breakdown"}</h3>
                  <p className="text-[10px] text-purple-300 font-medium">Synthesized by CODELAB AI Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setShowLineExplainer(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#07090E]/80 p-4 space-y-2">
              <span className="font-semibold text-purple-300 uppercase text-[10px] tracking-wider">Semantic Purpose</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {lineExplanation.high_level_purpose || lineExplanation.explanation || "This code statement instructs runtime memory to evaluate expressions and mutate program state."}
              </p>
            </div>

            {lineExplanation.concept && (
              <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-xs text-purple-200">
                <span className="font-bold text-white uppercase text-[10px]">Target Concept:</span>
                <span>{lineExplanation.concept}</span>
              </div>
            )}

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {((lineExplanation.line_explanations && lineExplanation.line_explanations.length > 0)
                ? lineExplanation.line_explanations
                : (lineExplanation.breakdown || [])
              ).map((item: any, i: number) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-[#07090E]/80 p-3 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-indigo-400 font-bold">Line {item.line_number || i + 1}:</span>
                    <span className="text-slate-100">{item.code || item.token || `Statement #${i + 1}`}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pl-4">{item.explanation || item.role || "Statement evaluated in memory."}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5 text-purple-300">
                <Sparkles className="h-3 w-3 text-purple-400" /> CODELAB AI Online
              </span>
              <button
                onClick={() => setShowLineExplainer(false)}
                className="glass-button rounded-xl px-4 py-1.5 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
