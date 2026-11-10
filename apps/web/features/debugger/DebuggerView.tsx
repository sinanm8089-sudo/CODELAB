"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  RotateCcw,
  StepForward,
  Bug,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { ApiClient } from "../../services/api";

export const DebuggerView: React.FC = () => {
  const [sourceCode, setSourceCode] = useState<string>(
    `# Interactive Step-by-Step Execution Debugger\n# Watch variable memory state update at each step\n\na = 10\nb = 20\nsum_val = a + b\n\nfor i in range(1, 4):\n    factor = i * 2\n    print(f"Step {i}: factor={factor}")\n\nresult = sum_val * 2\nprint("Final Result:", result)\n`
  );

  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isTracing, setIsTracing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartTrace = async () => {
    setIsTracing(true);
    setErrorMsg(null);
    try {
      const res = await ApiClient.debugCode({
        language: "python",
        source_code: sourceCode,
      });

      if (res.status === "error") {
        setErrorMsg(res.error || "Execution error during debugging.");
        setSteps([]);
        setCurrentStepIdx(0);
      } else {
        setSteps(res.steps || []);
        setCurrentStepIdx(0);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to start debugger session.");
    } finally {
      setIsTracing(false);
    }
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
  };

  const currentStep = steps[currentStepIdx] || null;
  const currentLine = currentStep ? currentStep.line : null;
  const variables = currentStep ? currentStep.variables : {};
  const callStack = currentStep ? currentStep.call_stack : ["main"];
  const stdoutSoFar = currentStep ? currentStep.stdout_so_far : "";

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Header & Stepper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#8B7BFF] to-[#76A9FF]">
            <Bug className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">Interactive Visual Debugger</h1>
              <span className="flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                <Sparkles className="h-2.5 w-2.5 text-purple-400" /> AI Assisted
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Step-by-step memory inspection and stack trace</p>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-2">
          {steps.length === 0 ? (
            <button
              onClick={handleStartTrace}
              disabled={isTracing}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              {isTracing ? "Instrumenting..." : "Start Debug Session"}
            </button>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restart
              </button>

              <button
                onClick={handleStepBackward}
                disabled={currentStepIdx === 0}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 disabled:opacity-40"
              >
                Step Back
              </button>

              <div className="rounded-lg bg-[#0B0D14] px-3 py-1 text-xs font-mono text-[#8B7BFF]">
                Step {currentStepIdx + 1} / {steps.length}
              </div>

              <button
                onClick={handleStepForward}
                disabled={currentStepIdx >= steps.length - 1}
                className="flex items-center gap-1.5 rounded-xl bg-[#8B7BFF] px-4 py-1.5 text-xs font-bold text-white shadow-md hover:brightness-110 disabled:opacity-40"
              >
                <span>Step Forward</span>
                <StepForward className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Code Editor + Real-time Inspector */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Editor with Line Pointer */}
        <div className="rounded-2xl border border-white/10 bg-[#111725] p-3 lg:col-span-7 shadow-lg flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs text-zinc-400">
            <span>Source Code (Python)</span>
            {currentLine && (
              <span className="font-mono text-emerald-400">
                ▶ Active Execution: Line {currentLine}
              </span>
            )}
          </div>
          <div className="mt-2 flex-1 rounded-xl overflow-hidden min-h-[380px]">
            <Editor
              height="380px"
              language="python"
              value={sourceCode}
              onChange={(val) => setSourceCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', Consolas, monospace",
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                readOnly: steps.length > 0, // lock code while debugging
              }}
            />
          </div>
        </div>

        {/* Real-time State Inspector */}
        <div className="space-y-4 lg:col-span-5 flex flex-col">
          {/* Variables Table */}
          <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg flex-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/10">
              <Activity className="h-4 w-4 text-[#8B7BFF]" /> Live Variables In Scope
            </h3>

            <div className="mt-3 max-h-48 overflow-y-auto">
              {Object.keys(variables).length === 0 ? (
                <p className="py-6 text-center text-xs text-zinc-500 italic">
                  {steps.length === 0 ? "Click 'Start Debug Session' to trace variables." : "No local variables initialized yet."}
                </p>
              ) : (
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] text-zinc-500 uppercase">
                      <th className="pb-1.5">Variable</th>
                      <th className="pb-1.5">Current Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {Object.entries(variables).map(([key, val]: [string, any]) => (
                      <tr key={key} className="transition hover:bg-white/5">
                        <td className="py-1.5 text-[#76A9FF]">{key}</td>
                        <td className="py-1.5 text-emerald-300 font-bold">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Call Stack */}
          <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/10">
              <Layers className="h-4 w-4 text-amber-400" /> Call Stack Frames
            </h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-mono">
              {callStack.map((frame: string, idx: number) => (
                <span
                  key={idx}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-300"
                >
                  {frame}()
                </span>
              ))}
            </div>
          </div>

          {/* Output at Current Step */}
          <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/10">
              <Terminal className="h-4 w-4 text-emerald-400" /> Console Output So Far
            </h3>
            <div className="mt-2 rounded-xl bg-[#0B0D14] p-3 font-mono text-xs text-zinc-300 min-h-16 max-h-24 overflow-y-auto">
              {stdoutSoFar ? (
                <pre className="whitespace-pre-wrap">{stdoutSoFar}</pre>
              ) : (
                <span className="text-zinc-600 italic">No output printed yet at this step.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

