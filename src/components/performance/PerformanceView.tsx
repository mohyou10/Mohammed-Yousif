import React, { useState } from 'react';
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Shield,
  Award,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PerformanceView: React.FC = () => {
  const { user, totalMinutesTrained, currentStreak } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Compute stats strictly from real session data
  const totalSessions = user.sessions.length;
  const avgRpe =
    totalSessions > 0
      ? (user.sessions.reduce((acc, s) => acc + (s.difficultyRating || 0), 0) / totalSessions).toFixed(1)
      : '0.0';

  const totalDrillsCompleted = user.sessions.reduce(
    (acc, s) => acc + (s.exercises ? s.exercises.filter(e => e.completed).length : 0),
    0
  );

  // Compute skill category frequency from actual exercises
  const categoryCounts: Record<string, number> = {};
  user.sessions.forEach(s => {
    s.exercises?.forEach(e => {
      if (e.completed) {
        categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
      }
    });
  });

  const handleGenerateReport = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/performance/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessions: user.sessions,
          profile: {
            name: user.name,
            position: user.position,
            experience: user.experience,
            strengths: user.strengths,
            weaknesses: user.weaknesses
          }
        })
      });

      if (!res.ok) throw new Error('Failed to analyze performance data');
      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(err.message || 'Could not connect to AI performance analyzer.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121217] border border-[#242430] p-5 lg:p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
            <span>PERFORMANCE LAB</span>
            <span>·</span>
            <span className="text-[#ccff00] font-bold">{totalSessions} VERIFIED SESSIONS</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
            AI Performance & Workload Analytics
          </h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl">
            Objective, sports science evaluation of your actual recorded training sessions and mechanical load.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600] disabled:opacity-50 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAnalyzing ? 'Analyzing Logs...' : 'Generate AI Report'}</span>
        </button>
      </div>

      {/* Real Statistics Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-[#121216] border border-[#242430] p-4 rounded-sm">
          <div className="text-xs text-zinc-400 font-mono-sport uppercase mb-1">Total Career Time</div>
          <div className="text-2xl font-black font-mono-sport text-white">
            {totalMinutesTrained} <span className="text-xs text-zinc-500 font-normal">MINS</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono-sport">
            Across {totalSessions} logged workouts
          </div>
        </div>

        <div className="bg-[#121216] border border-[#242430] p-4 rounded-sm">
          <div className="text-xs text-zinc-400 font-mono-sport uppercase mb-1">Average Exertion</div>
          <div className="text-2xl font-black font-mono-sport text-[#ccff00]">
            {avgRpe} <span className="text-xs text-zinc-500 font-normal">/ 10 RPE</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono-sport">
            {Number(avgRpe) > 7 ? 'High Match Pace' : totalSessions === 0 ? 'No sessions logged yet' : 'Moderate Training Load'}
          </div>
        </div>

        <div className="bg-[#121216] border border-[#242430] p-4 rounded-sm">
          <div className="text-xs text-zinc-400 font-mono-sport uppercase mb-1">Drills Mastered</div>
          <div className="text-2xl font-black font-mono-sport text-white">
            {totalDrillsCompleted} <span className="text-xs text-zinc-500 font-normal">REPS</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono-sport">
            Verified completed exercises
          </div>
        </div>

        <div className="bg-[#121216] border border-[#242430] p-4 rounded-sm">
          <div className="text-xs text-zinc-400 font-mono-sport uppercase mb-1">Consistency Streak</div>
          <div className="text-2xl font-black font-mono-sport text-white">
            {currentStreak} <span className="text-xs text-zinc-500 font-normal">DAYS</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono-sport">
            {currentStreak >= 3 ? 'Target Pace Maintained' : 'Building Habit'}
          </div>
        </div>
      </div>

      {/* AI Generated Weekly Performance Report Card */}
      {report && (
        <div className="bg-[#151520] border-2 border-[#ccff00]/60 p-5 lg:p-6 rounded-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2a38] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-sport text-[#ccff00] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>AI WEEKLY PERFORMANCE EVALUATION</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display mt-0.5">
                Head Coach Technical Assessment
              </h3>
            </div>
            {report.coachGrade && (
              <div className="px-3.5 py-1.5 bg-[#ccff00] text-black font-black text-sm uppercase font-display rounded-sm self-start">
                Grade: {report.coachGrade}
              </div>
            )}
          </div>

          <p className="text-xs lg:text-sm text-zinc-200 leading-relaxed bg-[#0d0d12] p-4 rounded-sm border border-[#242432]">
            {report.weeklyReportSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#121217] border border-[#252533] rounded-sm">
              <span className="text-[10px] font-mono-sport uppercase font-bold text-emerald-400 block mb-2">
                ✓ Strongest Practiced Skills:
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {report.strongestSkills?.map((s: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#121217] border border-[#252533] rounded-sm">
              <span className="text-[10px] font-mono-sport uppercase font-bold text-amber-400 block mb-2">
                ⚠ Weaknesses / Neglected Areas:
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {report.weakestOrNeglectedAreas?.map((w: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {report.nextWeekPriorities && (
            <div className="p-4 bg-[#121217] border border-[#252533] rounded-sm space-y-2">
              <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
                Next Week's 3 Primary Training Adjustments:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-300">
                {report.nextWeekPriorities.map((p: string, idx: number) => (
                  <li key={idx} className="leading-relaxed">
                    {p}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {report.motivationalCharge && (
            <div className="text-xs italic text-zinc-400 border-l-2 border-[#ccff00] pl-3 py-1">
              "{report.motivationalCharge}"
            </div>
          )}
        </div>
      )}

      {analysisError && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-sm">
          {analysisError}
        </div>
      )}

      {/* Verified Training History Feed */}
      <div className="bg-[#121217] border border-[#242430] p-5 rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase font-mono-sport text-zinc-400 tracking-wider">
              VERIFIED CHRONOLOGY
            </span>
            <h3 className="text-base font-bold text-white font-display">Training Session History</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono-sport">
            {user.sessions.length} recorded
          </span>
        </div>

        {user.sessions.length === 0 ? (
          <div className="p-8 text-center bg-[#0d0d12] rounded-sm border border-[#202028] space-y-2">
            <Clock className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-white font-display">No Recorded Sessions Yet</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              PRO11 only computes performance analysis from real activity. Hit "START TODAY'S TRAINING" to log your first verified pitch session.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.sessions.map(session => (
              <div
                key={session.id}
                className="p-4 bg-[#15151e] border border-[#242432] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono-sport font-bold uppercase text-[#ccff00]">
                      {session.type}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-[10px] font-mono-sport text-zinc-400">
                      {new Date(session.date).toLocaleDateString()} at{' '}
                      {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-display">{session.title}</h4>
                  {session.notes && (
                    <p className="text-xs text-zinc-400 mt-1 italic">"{session.notes}"</p>
                  )}
                  {session.achievements && (
                    <div className="text-[10px] text-emerald-400 font-mono-sport mt-1">
                      ✓ {session.achievements}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex sm:flex-col items-end gap-1 text-xs font-mono-sport">
                  <span className="text-white font-bold">{session.durationMinutes} Mins</span>
                  <span className="text-zinc-400 text-[11px]">RPE: {session.difficultyRating}/10</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
