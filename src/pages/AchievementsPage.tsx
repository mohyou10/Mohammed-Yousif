import React from 'react';
import { AchievementsView } from '../components/achievements/AchievementsView';
import { Award, Trophy, Flame, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AchievementsPage: React.FC = () => {
  const { user, currentStreak, totalMinutesTrained } = useApp();
  const unlockedBadgesCount = user.unlockedBadges?.length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-theme-card border border-theme rounded-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-theme-elevated border border-theme text-[11px] font-mono-sport text-lime-accent uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Honors, Personal Bests & Scout Dossier
          </div>
          <h1 className="text-2xl font-black font-display text-theme-primary uppercase tracking-tight">
            Player Achievements & Records
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            Track tangible performance breakthroughs: benchmark fitness records (sprint, juggling, beep test), earn milestone badges, and export your official player training dossier.
          </p>
        </div>

        {/* Quick Badges Counter */}
        <div className="flex items-center gap-2 text-xs font-mono-sport">
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Badges</span>
            <span className="text-sm font-bold text-lime-accent">{unlockedBadgesCount} Unlocked</span>
          </div>
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Streak</span>
            <span className="text-sm font-bold text-theme-primary">{currentStreak} Days</span>
          </div>
        </div>
      </div>

      {/* Main Achievements Component */}
      <AchievementsView />
    </div>
  );
};
