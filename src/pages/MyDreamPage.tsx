import React from 'react';
import { DreamGoalsView } from '../components/dream/DreamGoalsView';
import { Flag, Target, Award, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyDreamPage: React.FC = () => {
  const { user } = useApp();

  const totalGoals = user.goals?.length || 0;
  const completedGoals = user.goals?.filter(g => g.progress === 100).length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-theme-card border border-theme rounded-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-theme-elevated border border-theme text-[11px] font-mono-sport text-lime-accent uppercase tracking-wider mb-2">
            <Flag className="w-3.5 h-3.5" />
            Football Career Roadmap & Milestones
          </div>
          <h1 className="text-2xl font-black font-display text-theme-primary uppercase tracking-tight">
            My Football Dream
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            From youth academy trials to senior professional football. Define measurable, timestamped milestones and execute the habits needed to achieve them.
          </p>
        </div>

        {/* Quick Goal Counter */}
        <div className="flex items-center gap-2 text-xs font-mono-sport">
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Active Goals</span>
            <span className="text-sm font-bold text-theme-primary">{totalGoals}</span>
          </div>
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Completed</span>
            <span className="text-sm font-bold text-lime-accent">{completedGoals}</span>
          </div>
        </div>
      </div>

      {/* Main Dream Goals View */}
      <DreamGoalsView />
    </div>
  );
};
