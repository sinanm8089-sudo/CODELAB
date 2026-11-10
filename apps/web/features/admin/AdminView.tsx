"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Terminal,
  BookOpen,
  Award,
  Search,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { ApiClient } from "../../services/api";

export const AdminView: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [stuData, metData] = await Promise.all([
        ApiClient.listStudents(),
        ApiClient.getAdminMetrics(),
      ]);
      setStudents(stuData);
      setMetrics(metData);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            Educator &amp; Administrator Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Monitor student enrollment, verify real execution telemetry, and manage curriculum progress.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171E2C] px-3.5 py-1.5 font-mono text-xs text-emerald-400">
          Admin Portal Active
        </div>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg">
            <span className="text-xs text-zinc-400">Enrolled Students</span>
            <p className="mt-2 text-2xl font-bold text-white">{metrics.total_registered_students}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Verified unique student IDs</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg">
            <span className="text-xs text-zinc-400">Total Code Executions</span>
            <p className="mt-2 text-2xl font-bold text-white">{metrics.total_code_executions}</p>
            <p className="mt-1 text-[10px] text-emerald-400 font-semibold">Real runner executions</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg">
            <span className="text-xs text-zinc-400">Active Lessons</span>
            <p className="mt-2 text-2xl font-bold text-white">{metrics.total_active_lessons}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Curriculum catalog</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-4 shadow-lg">
            <span className="text-xs text-zinc-400">Practice Problems</span>
            <p className="mt-2 text-2xl font-bold text-white">{metrics.total_practice_problems}</p>
            <p className="mt-1 text-[10px] text-zinc-500">With multi-case testing suites</p>
          </div>
        </div>
      )}

      {/* Student Roster Table */}
      <div className="rounded-2xl border border-white/10 bg-[#171E2C] p-5 shadow-2xl space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center pb-3 border-b border-white/10">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-[#8B7BFF]" /> Student Roster &amp; Progression
            </h2>
            <p className="text-xs text-zinc-400">Directly queryable records from PostgreSQL</p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student ID, name, email..."
              className="rounded-xl border border-white/10 bg-[#0B0D14] py-1.5 pr-3 pl-8 text-xs text-white placeholder-zinc-500 focus:outline-none w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <p className="py-12 text-center text-xs text-zinc-500">Loading student roster...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="py-12 text-center text-xs text-zinc-500">No students found matching query.</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-[11px] font-semibold text-zinc-400 uppercase">
                  <th className="pb-3">Student ID</th>
                  <th className="pb-3">Full Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Completed Lessons</th>
                  <th className="pb-3">Total Runs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="transition hover:bg-white/5">
                    <td className="py-3 font-mono font-bold text-[#8B7BFF]">{s.student_id}</td>
                    <td className="py-3 font-medium text-white">{s.name}</td>
                    <td className="py-3 text-zinc-400">{s.email}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-300">
                        {s.role}
                      </span>
                    </td>
                    <td className="py-3 text-emerald-400 font-bold">{s.completed_lessons}</td>
                    <td className="py-3 font-mono text-zinc-300">{s.total_runs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

