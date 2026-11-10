"use client";

import React, { useState } from "react";
import {
  Globe,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  Code2,
  FileCode,
  Sparkles
} from "lucide-react";

interface LanguageExplorerProps {
  onOpenInIde: (code: string, language: string) => void;
}

export const LanguageExplorerView: React.FC<LanguageExplorerProps> = ({ onOpenInIde }) => {
  const LANGUAGES = [
    {
      id: "python",
      name: "Python 3",
      category: "High-Level General Purpose",
      typing: "Dynamic, Strong",
      paradigm: "Multi-paradigm (OOP, Functional, Imperative)",
      compiler: "CPython Interpreter / Bytecode",
      desc: "Clean, human-readable syntax. Renowned for AI/ML, data science, automation, and beginner education.",
      starter: "def main():\n    print('Hello from Python 3 in CODELAB IDE!')\n\nif __name__ == '__main__':\n    main()\n",
    },
    {
      id: "javascript",
      name: "JavaScript",
      category: "Web & Runtime",
      typing: "Dynamic, Weak",
      paradigm: "Event-driven, Functional, Prototype-based",
      compiler: "V8 Engine / Node.js JIT",
      desc: "The universal language of the web, powering interactive browser frontends and server-side APIs via Node.js.",
      starter: "function main() {\n    console.log('Hello from JavaScript in CODELAB IDE!');\n}\nmain();\n",
    },
    {
      id: "typescript",
      name: "TypeScript",
      category: "Typed JavaScript Superset",
      typing: "Static (Compile-Time), Structural",
      paradigm: "Multi-paradigm, OOP, Functional",
      compiler: "TypeScript Compiler (tsc)",
      desc: "Adds robust type safety, interfaces, and compile-time diagnostics to JavaScript for large-scale production.",
      starter: "const greeting: string = 'Hello from TypeScript in CODELAB IDE!';\nconsole.log(greeting);\n",
    },
    {
      id: "c",
      name: "C",
      category: "Low-Level Systems",
      typing: "Static, Weak",
      paradigm: "Imperative, Procedural",
      compiler: "GCC / Clang Native Machine Code",
      desc: "Direct memory access, pointers, and raw hardware speed. Forms the foundation of operating systems and kernels.",
      starter: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello from C in CODELAB IDE!\\n\");\n    return 0;\n}\n",
    },
    {
      id: "cpp",
      name: "C++",
      category: "Systems & High Performance",
      typing: "Static, Strong",
      paradigm: "Multi-paradigm, OOP, Generic, RAII",
      compiler: "G++ / Clang++",
      desc: "Zero-overhead abstractions, STL containers, and extreme throughput for game engines and high-frequency trading.",
      starter: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello from C++ in CODELAB IDE!\" << std::endl;\n    return 0;\n}\n",
    },
    {
      id: "java",
      name: "Java",
      category: "Enterprise & Cross-Platform",
      typing: "Static, Strong",
      paradigm: "Object-Oriented, Class-based",
      compiler: "javac / JVM (Java Virtual Machine)",
      desc: "'Write Once, Run Anywhere' (WORA). Powers enterprise banking, Android applications, and distributed backends.",
      starter: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello from Java in CODELAB IDE!\");\n    }\n}\n",
    },
    {
      id: "sql",
      name: "SQL",
      category: "Relational Database Queries",
      typing: "Static Schema-Driven",
      paradigm: "Declarative",
      compiler: "SQLite / PostgreSQL Engine",
      desc: "Structured Query Language for querying, filtering, joining, and aggregating relational records in databases.",
      starter: "-- Select all students with GPA >= 3.5\nSELECT * FROM students WHERE gpa >= 3.5 ORDER BY gpa DESC;\n",
    },
    {
      id: "html",
      name: "HTML5 & CSS3",
      category: "Web Markup & Styling",
      typing: "Declarative Markup",
      paradigm: "DOM Rendering",
      compiler: "Browser Rendering Engine (Blink/Gecko)",
      desc: "Describes the structural elements and visual appearance of interactive web pages with real-time preview.",
      starter: "<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; background: #07090E; color: #F8FAFC; padding: 40px; text-align: center; }\n    h1 { color: #6366F1; }\n  </style>\n</head>\n<body>\n  <h1>Welcome to CODELAB IDE</h1>\n  <p>Live interactive browser sandbox</p>\n</body>\n</html>\n",
    },
    {
      id: "bash",
      name: "Bash / Shell",
      category: "OS Automation & Scripting",
      typing: "String-based",
      paradigm: "Imperative, Pipeline",
      compiler: "GNU Bash / Sh",
      desc: "Command-line scripting for automating Linux/Unix environments, deployment pipelines, and file processing.",
      starter: "#!/bin/bash\nNAME=\"CODELAB IDE\"\necho \"Hello from $NAME Shell Script!\"\n",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="h-6 w-6 text-[#76A9FF]" />
            Programming Language Explorer
          </h1>
          <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
            AI Tutoring Supported
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Explore language paradigms, compilation models, and launch starter templates directly into the Monaco IDE with AI Code Intelligence assistance.
        </p>
      </div>

      {/* Grid of Languages */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {LANGUAGES.map((lang) => (
          <div
            key={lang.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#171E2C] p-5 shadow-lg space-y-4 hover:border-[#8B7BFF]/40 transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#8B7BFF]/20 px-2 py-0.5 text-[10px] font-bold text-[#8B7BFF] uppercase">
                  {lang.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">{lang.typing}</span>
              </div>
              <h2 className="mt-2 text-lg font-bold text-white">{lang.name}</h2>
              <p className="mt-1 text-xs text-zinc-300 leading-relaxed">{lang.desc}</p>

              <div className="mt-3 rounded-xl border border-white/5 bg-[#0B0D14] p-2.5 font-mono text-[11px] text-zinc-400 space-y-1">
                <p><span className="text-zinc-500">Compiler:</span> {lang.compiler}</p>
                <p><span className="text-zinc-500">Paradigm:</span> {lang.paradigm}</p>
              </div>
            </div>

            <button
              onClick={() => onOpenInIde(lang.starter, lang.id)}
              className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-2.5 text-xs font-semibold text-white hover:bg-white/10 hover:border-[#8B7BFF]"
            >
              <span>Open in Monaco IDE</span>
              <ArrowRight className="h-4 w-4 text-[#8B7BFF]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

