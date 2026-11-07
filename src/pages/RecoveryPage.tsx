import React from 'react';
import { RecoveryView } from '../components/recovery/RecoveryView';
import { HeartPulse, Droplets, Moon, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RecoveryPage: React.FC = () => {
  const { user } = useApp();
  const latestRecovery = user.recoveryLogs?.[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-theme-card border border-theme rounded-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-theme-elevated border border-theme text-[11px] font-mono-sport text-lime-accent uppercase tracking-wider mb-2">
            <HeartPulse className="w-3.5 h-3.5" />
            Athlete Readiness & Sports Science Recovery
          </div>
          <h1 className="text-2xl font-black font-display text-theme-primary uppercase tracking-tight">
            Recovery & Injury Prevention
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            You do not get better during training — you get better when you recover from it. Log your daily readiness, execute guided mobility routines, and avoid overtraining injuries.
          </p>
        </div>

        {/* Readiness Badge */}
        <div className="flex items-center gap-2 text-xs font-mono-sport">
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Readiness</span>
            <span className="text-sm font-bold text-lime-accent">
              {latestRecovery ? `${latestRecovery.score}/100` : 'Ready'}
            </span>
          </div>
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Sleep Last Night</span>
            <span className="text-sm font-bold text-theme-primary">
              {latestRecovery ? `${latestRecovery.sleepHours}h` : '8.0h'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Recovery View Component */}
      <RecoveryView />
    </div>
  );
};
