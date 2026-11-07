import React from 'react';
import { KnowledgeCenterView } from '../components/knowledge/KnowledgeCenterView';
import { BookOpen, Sparkles, Compass, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KnowledgePage: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-theme-card border border-theme rounded-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-theme-elevated border border-theme text-[11px] font-mono-sport text-lime-accent uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Tactical Theory & Elite Academy Vault
          </div>
          <h1 className="text-2xl font-black font-display text-theme-primary uppercase tracking-tight">
            Football Knowledge Center
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            Football IQ separates good players from great players. Deep-dive into modern tactical frameworks, Gegenpress triggers, half-space geometry, and match nutrition protocols.
          </p>
        </div>

        {/* Quick Info Badges */}
        <div className="flex items-center gap-2 text-xs font-mono-sport">
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Bookmarked</span>
            <span className="text-sm font-bold text-lime-accent">{user.bookmarks?.length || 0}</span>
          </div>
          <div className="px-3 py-2 rounded-sm bg-theme-elevated border border-theme flex flex-col">
            <span className="text-[10px] text-theme-muted uppercase">Curriculum</span>
            <span className="text-sm font-bold text-theme-primary">Pro Level</span>
          </div>
        </div>
      </div>

      {/* Main Knowledge Component */}
      <KnowledgeCenterView />
    </div>
  );
};
