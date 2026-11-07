import React from 'react';
import { TrainingPlanner } from '../components/training/TrainingPlanner';
import { Activity, Clock, Flame, Calendar, Dumbbell, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyTrainingPage: React.FC = () => {
  const { user, totalMinutesTrained, currentStreak, activeWorkout } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-theme-card border border-theme rounded-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-theme-elevated border border-theme text-[11px] font-mono-sport text-lime-accent uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            Training Planner & Active Sessions
          </div>
          <h1 className="text-2xl font-black font-display text-theme-primary uppercase tracking-tight">
            My Training Schedule
          </h1>
          <p className="text-xs text-theme-secondary mt-1">
            Build AI-tailored daily, weekly, and monthly routines. Execute drills with real-time timers and track your logged volume.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 text-xs font-mono-sport">
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Total Volume</span>
            <span className="text-sm font-bold text-theme-primary">{(totalMinutesTrained / 60).toFixed(1)}h</span>
          </div>
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Streak</span>
            <span className="text-sm font-bold text-lime-accent flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {currentStreak}d
            </span>
          </div>
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Sessions</span>
            <span className="text-sm font-bold text-theme-primary">{user.sessions.length}</span>
          </div>
        </div>
      </div>

      {/* Embedded Full Training Planner Component */}
      <TrainingPlanner />
    </div>
  );
};
