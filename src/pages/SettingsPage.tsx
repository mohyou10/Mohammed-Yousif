import { Link } from 'react-router-dom';
import { SettingsView } from '../components/settings/SettingsView';
import { Settings, Shield, Sliders, Moon, Sun, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { user, theme, toggleTheme } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-theme-card border border-theme rounded-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-theme-elevated border border-theme text-[11px] font-mono-sport text-lime-accent uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5" />
            Athlete Profile & Platform Configuration
          </div>
          <h1 className="text-2xl font-black font-display text-theme-primary uppercase tracking-tight">
            Account & System Settings
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            Configure your biometric data, playing position, weekly target frequency, theme appearance (Dark / Light), and manage your stored local training history.
          </p>
        </div>

        {/* Current Active Theme Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono-sport">
          <button
            onClick={toggleTheme}
            className="px-3.5 py-2 rounded-sm bg-theme-elevated border border-theme hover:border-[#ccff00] text-theme-primary flex items-center gap-2 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-lime-accent" />
                <span>Theme: <strong>Dark Utilitarian</strong></span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-lime-accent" />
                <span>Theme: <strong>Clean Light</strong></span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Central Media Manager Navigation Card */}
      <div className="bg-theme-card border border-theme hover:border-[#ccff00] rounded-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xs bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
              CENTRAL MEDIA DATABASE & VALIDATION ENGINE
            </div>
            <h3 className="text-base font-bold font-display text-theme-primary uppercase">
              PRO11 Media Manager & Audit
            </h3>
            <p className="text-xs text-theme-secondary mt-0.5">
              Inspect cover photos, test YouTube oEmbed playback, run batch verification, and edit video URLs across all 165 drills.
            </p>
          </div>
        </div>

        <Link
          to="/media-manager"
          className="px-4 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black font-mono-sport font-black text-xs uppercase rounded-xs transition-colors shrink-0"
        >
          Open Media Manager →
        </Link>
      </div>

      {/* Main Settings Component */}
      <SettingsView />
    </div>
  );
};
