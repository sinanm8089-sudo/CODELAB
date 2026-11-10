import React from "react";
import { Code2, Shield, Cpu, Sparkles, Terminal } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#07090E]/90 py-8 text-xs text-slate-400 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          {/* Left: Branding & Developer Credit */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 shadow-md shadow-indigo-500/20">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold tracking-tight text-white">CODELAB IDE</p>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  v2.0 Universal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Architected & Engineered by <span className="font-semibold text-indigo-400">Sinan Mohammed</span>
              </p>
            </div>
          </div>

          {/* Center: System status indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Compiler Isolation Active
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Cpu className="h-3 w-3 text-slate-400" /> Multi-Language Engine
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="h-3 w-3 text-indigo-400" /> CODELAB AI Intelligence
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Shield className="h-3 w-3 text-slate-400" /> Sandboxed Runtime
            </span>
          </div>

          {/* Right: Copyright & Version */}
          <div className="text-center text-[11px] text-slate-400 md:text-right">
            <p>© 2026 CODELAB IDE. All rights reserved.</p>
            <p>Product Owner & Developer: Sinan Mohammed</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
