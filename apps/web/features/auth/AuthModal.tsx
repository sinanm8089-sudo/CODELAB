"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User, Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { ApiClient } from "../../services/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredStudentId, setRegisteredStudentId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const res = await ApiClient.register({ name, email, password, role });
        ApiClient.setToken(res.access_token);
        setRegisteredStudentId(res.user.student_id);
        setTimeout(() => {
          onSuccess(res.user);
          onClose();
        }, 1800);
      } else {
        const res = await ApiClient.login({ email, password });
        ApiClient.setToken(res.access_token);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111725] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {registeredStudentId ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Registration Successful!</h3>
            <p className="mt-1 text-xs text-zinc-400">Your unique Student Identity has been minted:</p>
            <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 py-3 font-mono text-lg font-bold text-indigo-400">
              {registeredStudentId}
            </div>
            <p className="mt-3 text-[11px] text-slate-400">Entering CODELAB IDE workspace...</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {isRegister ? "Join CODELAB IDE" : "Welcome Back"}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {isRegister
                  ? "Create your developer identity and begin your programming journey"
                  : "Sign in to access your projects, preferences, and learning progress"}
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="mt-5 flex rounded-xl border border-white/10 bg-[#0B0D14] p-1">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                }}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                  !isRegister ? "bg-[#8B7BFF] text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                }}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                  isRegister ? "bg-[#8B7BFF] text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {isRegister && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Full Name</label>
                  <div className="relative mt-1">
                    <User className="absolute top-2.5 left-3 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sinan Mohammed"
                      className="w-full rounded-xl border border-white/10 bg-[#171E2C] py-2 pr-3 pl-9 text-xs text-white placeholder-zinc-500 focus:border-[#8B7BFF] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute top-2.5 left-3 h-4 w-4 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@codelab.io"
                    className="w-full rounded-xl border border-white/10 bg-[#171E2C] py-2 pr-3 pl-9 text-xs text-white placeholder-zinc-500 focus:border-[#8B7BFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute top-2.5 left-3 h-4 w-4 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-[#171E2C] py-2 pr-3 pl-9 text-xs text-white placeholder-zinc-500 focus:border-[#8B7BFF] focus:outline-none"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Account Role</label>
                  <div className="relative mt-1">
                    <Shield className="absolute top-2.5 left-3 h-4 w-4 text-zinc-400" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#171E2C] py-2 pr-3 pl-9 text-xs text-white focus:border-[#8B7BFF] focus:outline-none"
                    >
                      <option value="student">Student (Learner)</option>
                      <option value="teacher">Teacher (Educator)</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B7BFF] to-[#76A9FF] py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#8B7BFF]/25 transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {isRegister ? "Complete Registration" : "Sign In to Workspace"}
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

