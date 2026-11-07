import React from 'react';
import { CoachChat } from '../components/coach/CoachChat';
import { Bot, Sparkles, Shield, Award, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AICoachPage: React.FC = () => {
  const { user, currentStreak, dailyScore } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Coach Intelligence Header */}
      <div className="bg-theme-card border border-theme rounded-sm p-4 lg:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-sm bg-[#ccff00] text-black flex items-center justify-center font-display font-black text-xl">
              <Bot className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black" title="Live Tactical Brain Online" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold font-display text-theme-primary uppercase tracking-tight">
                PRO11 Tactical Head Coach
              </h1>
              <span className="px-2 py-0.5 rounded-xs bg-theme-elevated text-[10px] font-mono-sport text-lime-accent uppercase border border-theme">
                UEFA Pro Intel
              </span>
            </div>
            <p className="text-xs text-theme-muted mt-0.5">
              Personalized for <span className="text-theme-primary font-semibold">{user.name}</span> ({user.position}) &bull; Active Training Streak: <span className="text-lime-accent font-bold">{currentStreak} Days</span>
            </p>
          </div>
        </div>

        {/* Quick Athlete Attributes */}
        <div className="flex items-center gap-2 text-xs font-mono-sport">
          <div className="px-3 py-1.5 rounded-sm bg-theme-elevated border border-theme text-theme-secondary flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-lime-accent" />
            <span>Score: <strong className="text-theme-primary">{dailyScore}</strong>/100</span>
          </div>
          <div className="px-3 py-1.5 rounded-sm bg-theme-elevated border border-theme text-theme-secondary flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-lime-accent" />
            <span>Foot: <strong className="text-theme-primary uppercase">{user.preferredFoot}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Full-Height Chat Component */}
      <div className="bg-theme-card border border-theme rounded-sm p-2 sm:p-4">
        <CoachChat />
      </div>
    </div>
  );
};
