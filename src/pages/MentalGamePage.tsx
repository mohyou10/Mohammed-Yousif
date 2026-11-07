import React from 'react';
import { MentalGameView } from '../components/mental/MentalGameView';
import { Brain, Sparkles, BookOpen, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MentalGamePage: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-theme-card border border-theme rounded-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-theme-elevated border border-theme text-[11px] font-mono-sport text-lime-accent uppercase tracking-wider mb-2">
            <Brain className="w-3.5 h-3.5" />
            Sports Psychology & High-Performance Mindset
          </div>
          <h1 className="text-2xl font-black font-display text-theme-primary uppercase tracking-tight">
            Mental Game & Composure
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            Elite football is won in the mind. Master the 5-second mistake flush, overcome bench frustration, handle academy trial pressure, and log your psychological breakthroughs.
          </p>
        </div>

        {/* Quick Journal Count */}
        <div className="flex items-center gap-2 text-xs font-mono-sport">
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Journal Entries</span>
            <span className="text-sm font-bold text-theme-primary">{user.mentalJournal?.length || 0}</span>
          </div>
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Mindset Protocol</span>
            <span className="text-sm font-bold text-lime-accent">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Mental Game View */}
      <MentalGameView />
    </div>
  );
};
