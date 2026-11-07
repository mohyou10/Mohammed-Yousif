import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  Flame,
  Award,
  Activity,
  Calendar,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Dumbbell
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressPage: React.FC = () => {
  const { user, totalMinutesTrained, currentStreak, dailyScore } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'records'>('overview');

  const totalSessions = user.sessions.length;
  const totalHours = (totalMinutesTrained / 60).toFixed(1);
  const avgRpe =
    totalSessions > 0
      ? (user.sessions.reduce((acc, s) => acc + (s.difficultyRating || 0), 0) / totalSessions).toFixed(1)
      : '0.0';

  const totalDrillsCompleted = user.sessions.reduce(
    (acc, s) => acc + (s.exercises ? s.exercises.filter(e => e.completed).length : 0),
    0
  );

  // Past 7 Days activity breakdown
  const now = new Date();
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const weeklySessions = user.sessions.filter(s => past7Days.includes(s.date.slice(0, 10)));
  const weeklyMinutes = weeklySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

  // Calendar dates
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleString('default', { month: 'long' });
  const sessionDatesSet = new Set(user.sessions.map(s => s.date.slice(0, 10)));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-theme-card border border-theme p-5 sm:p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-sport text-theme-muted mb-1">
            <span>PERFORMANCE ANALYTICS</span>
            <span>·</span>
            <span className="text-lime-accent font-bold">VERIFIED CAREER TRACKER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-theme-primary font-display">
            Training Progress & Consistency
          </h2>
          <p className="text-xs text-theme-secondary mt-1 max-w-xl">
            Real athlete metrics calculated strictly from your recorded sessions. No fabricated stats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/my-training"
            className="px-4 py-2.5 btn-lime text-xs font-black uppercase font-display rounded-sm shadow-sm"
          >
            Start New Workout
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-theme-card border border-theme p-4 rounded-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted font-mono-sport mb-2">
            <span>TOTAL TIME</span>
            <Clock className="w-4 h-4 text-lime-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono-sport text-theme-primary">
            {totalHours}
            <span className="text-xs text-theme-muted font-normal"> HOURS</span>
          </div>
          <div className="text-[10px] text-theme-muted mt-2 font-mono-sport">
            {totalMinutesTrained} minutes across {totalSessions} sessions
          </div>
        </div>

        <div className="bg-theme-card border border-theme p-4 rounded-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted font-mono-sport mb-2">
            <span>STREAK</span>
            <Flame className="w-4 h-4 text-lime-accent fill-current" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono-sport text-theme-primary">
            {currentStreak}
            <span className="text-xs text-theme-muted font-normal"> DAYS</span>
          </div>
          <div className="text-[10px] text-theme-muted mt-2 font-mono-sport">
            {currentStreak > 0 ? 'Consistent daily training active' : 'Complete today to begin streak'}
          </div>
        </div>

        <div className="bg-theme-card border border-theme p-4 rounded-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted font-mono-sport mb-2">
            <span>COMPLETED DRILLS</span>
            <Dumbbell className="w-4 h-4 text-lime-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono-sport text-theme-primary">
            {totalDrillsCompleted}
            <span className="text-xs text-theme-muted font-normal"> REPS</span>
          </div>
          <div className="text-[10px] text-theme-muted mt-2 font-mono-sport">
            {user.completedExerciseIds?.length || 0} unique exercises mastered
          </div>
        </div>

        <div className="bg-theme-card border border-theme p-4 rounded-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted font-mono-sport mb-2">
            <span>AVERAGE RPE</span>
            <Activity className="w-4 h-4 text-lime-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono-sport text-lime-accent">
            {avgRpe}
            <span className="text-xs text-theme-muted font-normal"> / 10</span>
          </div>
          <div className="text-[10px] text-theme-muted mt-2 font-mono-sport">
            Perceived effort rating
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-theme-card border border-theme rounded-sm w-fit text-xs font-mono-sport">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'overview' ? 'btn-lime' : 'text-theme-secondary hover:text-theme-primary'
          }`}
        >
          Weekly & Monthly Workload
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'calendar' ? 'btn-lime' : 'text-theme-secondary hover:text-theme-primary'
          }`}
        >
          Training Calendar ({monthName})
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'records' ? 'btn-lime' : 'text-theme-secondary hover:text-theme-primary'
          }`}
        >
          Personal Records
        </button>
      </div>

      {/* TAB 1: WORKLOAD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 7-Day Chart */}
          <div className="bg-theme-card border border-theme p-5 sm:p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono-sport text-theme-muted tracking-wider">
                  PAST 7 DAYS
                </span>
                <h3 className="text-base font-bold text-theme-primary font-display">
                  Weekly Training Minutes
                </h3>
              </div>
              <span className="text-xs font-mono-sport text-lime-accent font-bold">
                {weeklyMinutes} Minutes Total This Week
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-4 text-center">
              {past7Days.map((dStr) => {
                const daySessions = user.sessions.filter(s => s.date.slice(0, 10) === dStr);
                const dayMins = daySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(dStr).getDay()];
                const isToday = dStr === now.toISOString().slice(0, 10);

                return (
                  <div key={dStr} className="space-y-2">
                    <div className="h-28 bg-theme-elevated rounded-sm flex items-end p-1">
                      <div
                        style={{ height: `${Math.min(100, (dayMins / 60) * 100)}%` }}
                        className={`w-full rounded-xs transition-all ${
                          dayMins > 0 ? 'bg-[#ccff00]' : 'bg-transparent'
                        }`}
                      />
                    </div>
                    <div className={`text-[10px] font-mono-sport ${isToday ? 'text-lime-accent font-bold' : 'text-theme-muted'}`}>
                      {dayName}
                    </div>
                    <div className="text-[9px] font-mono-sport text-theme-secondary">{dayMins}m</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session History Log */}
          <div className="bg-theme-card border border-theme p-5 sm:p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <h3 className="text-base font-bold text-theme-primary font-display">
                Recorded Session Chronology
              </h3>
              <span className="text-xs text-theme-muted font-mono-sport">
                {user.sessions.length} sessions verified
              </span>
            </div>

            {user.sessions.length === 0 ? (
              <div className="p-8 text-center bg-theme-elevated rounded-sm border border-theme text-xs text-theme-muted">
                No verified workouts logged yet. Hit "START TODAY'S TRAINING" to begin tracking real minutes and unlocking honors.
              </div>
            ) : (
              <div className="space-y-3">
                {user.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-theme-elevated border border-theme rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono-sport font-bold uppercase text-lime-accent">
                          {session.type}
                        </span>
                        <span className="text-theme-muted">·</span>
                        <span className="text-[10px] font-mono-sport text-theme-muted">
                          {new Date(session.date).toLocaleDateString()} at{' '}
                          {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-theme-primary font-display">{session.title}</h4>
                      {session.notes && <p className="text-xs text-theme-secondary mt-1 italic">"{session.notes}"</p>}
                    </div>

                    <div className="shrink-0 flex sm:flex-col items-end gap-1 text-xs font-mono-sport">
                      <span className="text-theme-primary font-bold">{session.durationMinutes} Mins</span>
                      <span className="text-theme-muted text-[11px]">RPE: {session.difficultyRating}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-theme-card border border-theme p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-theme pb-3">
            <div>
              <span className="text-[10px] font-mono-sport uppercase font-bold text-lime-accent">
                {year} ATHLETE SCHEDULE
              </span>
              <h3 className="text-base font-bold text-theme-primary font-display">
                {monthName} Training Consistency Grid
              </h3>
            </div>
            <span className="text-xs font-mono-sport text-theme-muted">
              Green border = Verified pitch session
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div
                key={day}
                className="text-center text-[10px] uppercase font-mono-sport text-theme-muted font-bold py-1"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const hasSession = sessionDatesSet.has(dateStr);
              const isToday = dayNum === now.getDate();

              return (
                <div
                  key={dayNum}
                  className={`h-16 p-2 rounded-sm border flex flex-col justify-between transition-colors ${
                    hasSession
                      ? 'bg-emerald-950/20 border-emerald-500'
                      : 'bg-theme-elevated border-theme'
                  } ${isToday ? 'ring-2 ring-[#ccff00]' : ''}`}
                >
                  <div className="flex items-center justify-between text-xs font-mono-sport">
                    <span className={isToday ? 'text-lime-accent font-bold' : 'text-theme-secondary'}>
                      {dayNum}
                    </span>
                    {hasSession && <CheckCircle2 className="w-3.5 h-3.5 text-lime-accent" />}
                  </div>
                  {hasSession && (
                    <span className="text-[9px] font-mono-sport text-emerald-400 truncate">
                      Trained ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PERSONAL RECORDS */}
      {activeTab === 'records' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-theme-card border border-theme p-5 rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport text-theme-muted uppercase">
              Keep-Up Juggling High Score
            </span>
            <div className="text-3xl font-black font-mono-sport text-lime-accent">
              {user.personalRecords?.jugglingRecord || 0}
            </div>
            <div className="text-xs text-theme-secondary">
              Consecutive touches without ground contact.
            </div>
          </div>

          <div className="bg-theme-card border border-theme p-5 rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport text-theme-muted uppercase">
              60-Second Wall Pass Reps
            </span>
            <div className="text-3xl font-black font-mono-sport text-theme-primary">
              {user.personalRecords?.wallPasses60s || 0}
            </div>
            <div className="text-xs text-theme-secondary">
              Clean passes against wall in 60s rhythm.
            </div>
          </div>

          <div className="bg-theme-card border border-theme p-5 rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport text-theme-muted uppercase">
              30-Meter Sprint Split
            </span>
            <div className="text-3xl font-black font-mono-sport text-theme-primary">
              {user.personalRecords?.sprintTime30m ? `${user.personalRecords.sprintTime30m}s` : '--'}
            </div>
            <div className="text-xs text-theme-secondary">
              Timed electronic or stopwatch acceleration.
            </div>
          </div>

          <div className="bg-theme-card border border-theme p-5 rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport text-theme-muted uppercase">
              Beep Test / Yo-Yo Level
            </span>
            <div className="text-3xl font-black font-mono-sport text-theme-primary">
              {user.personalRecords?.beepTestLevel ? `L${user.personalRecords.beepTestLevel}` : '--'}
            </div>
            <div className="text-xs text-theme-secondary">
              Aerobic shuttle endurance threshold.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
