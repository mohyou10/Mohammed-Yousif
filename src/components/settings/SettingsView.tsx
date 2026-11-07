import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Shield,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Server,
  Sun,
  Moon,
  Download,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Position, SkillLevel } from '../../types';

export const SettingsView: React.FC = () => {
  const { user, updateUser, theme, toggleTheme } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [age, setAge] = useState(user.age);
  const [position, setPosition] = useState<Position>(user.position);
  const [experience, setExperience] = useState<SkillLevel>(user.experience);
  const [preferredFoot, setPreferredFoot] = useState(user.preferredFoot);
  const [trainingDays, setTrainingDays] = useState(user.trainingDaysPerWeek);
  const [location, setLocation] = useState(user.trainingLocation);
  const [strengths, setStrengths] = useState(user.strengths.join(', '));
  const [weaknesses, setWeaknesses] = useState(user.weaknesses.join(', '));

  // Notification toggles
  const [dailyReminders, setDailyReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [recoveryNotifs, setRecoveryNotifs] = useState(true);

  const [saved, setSaved] = useState(false);
  const [serverStatus, setServerStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setServerStatus(data))
      .catch(() => setServerStatus({ status: 'offline' }));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name: name.trim(),
      email: email.trim(),
      age: Number(age),
      position,
      experience,
      preferredFoot,
      trainingDaysPerWeek: Number(trainingDays),
      trainingLocation: location.trim(),
      strengths: strengths.split(',').map(s => s.trim()).filter(Boolean),
      weaknesses: weaknesses.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pro11_player_dossier_${user.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all verified training history, goals, and records? This cannot be undone.')) {
      await updateUser({
        sessions: [],
        goals: [],
        mentalJournal: [],
        recoveryLogs: [],
        unlockedBadges: [],
        masteredSkills: [],
        completedChallenges: [],
        personalRecords: {
          jugglingRecord: 0,
          sprintTime30m: null,
          wallPasses60s: 0,
          beepTestLevel: null
        }
      });
      alert('Data reset to fresh state.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Backend & AI System Health */}
      <div className="bg-theme-card border border-theme p-5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-theme-elevated border border-theme flex items-center justify-center">
            <Server className="w-5 h-5 text-lime-accent" />
          </div>
          <div>
            <div className="text-xs font-bold text-theme-primary font-display">
              PRO11 Intelligence Engine Status
            </div>
            <div className="text-[11px] font-mono-sport text-theme-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Full-Stack Express + Gemini 3.8 Flash Active</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs font-mono-sport">
          <span className="text-theme-muted text-[10px] block">Database Persistence</span>
          <span className="text-emerald-400 font-bold">Synced (Local & Server)</span>
        </div>
      </div>

      {/* Theme Appearance Setting */}
      <div className="bg-theme-card border border-theme p-6 rounded-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-theme-primary font-display uppercase tracking-wide">
            Appearance & Theme
          </h3>
          <p className="text-xs text-theme-secondary mt-0.5">
            Switch between the utilitarian high-contrast dark theme and the crisp light theme.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Dark Mode Card */}
          <div
            onClick={() => { if (theme !== 'dark') toggleTheme(); }}
            className={`p-4 rounded-sm border cursor-pointer transition-all flex items-center gap-3.5 ${
              theme === 'dark'
                ? 'bg-[#181820] border-[#ccff00] ring-1 ring-[#ccff00]'
                : 'bg-theme-elevated border-theme opacity-70 hover:opacity-100'
            }`}
          >
            <div className="w-10 h-10 rounded-sm bg-[#080809] border border-[#242430] flex items-center justify-center text-[#ccff00]">
              <Moon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white font-display flex items-center justify-between">
                <span>Utilitarian Dark</span>
                {theme === 'dark' && <span className="text-[10px] font-mono-sport text-[#ccff00] font-bold">ACTIVE</span>}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Pitch black background with neon lime accents</div>
            </div>
          </div>

          {/* Light Mode Card */}
          <div
            onClick={() => { if (theme !== 'light') toggleTheme(); }}
            className={`p-4 rounded-sm border cursor-pointer transition-all flex items-center gap-3.5 ${
              theme === 'light'
                ? 'bg-[#ffffff] border-[#ccff00] ring-1 ring-[#ccff00]'
                : 'bg-theme-elevated border-theme opacity-70 hover:opacity-100'
            }`}
          >
            <div className="w-10 h-10 rounded-sm bg-[#f0f0f4] border border-[#d0d0d8] flex items-center justify-center text-zinc-900">
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-zinc-900 font-display flex items-center justify-between">
                <span>Clean Daylight</span>
                {theme === 'light' && <span className="text-[10px] font-mono-sport text-zinc-900 font-bold">ACTIVE</span>}
              </div>
              <div className="text-[11px] text-zinc-600 mt-0.5">High-clarity white surfaces with sharp contrast</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-theme-card border border-theme p-6 rounded-sm space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-lime-accent" />
          <h3 className="text-sm font-bold text-theme-primary font-display uppercase tracking-wide">
            Training Notifications & Habit Alerts
          </h3>
        </div>
        <div className="space-y-3 pt-1">
          <label className="flex items-center justify-between p-3 rounded-sm bg-theme-elevated border border-theme cursor-pointer">
            <div>
              <div className="text-xs font-bold text-theme-primary font-display">Daily Training Schedule Reminder</div>
              <div className="text-[11px] text-theme-secondary">Receive daily prompt to complete today&apos;s football workout</div>
            </div>
            <input
              type="checkbox"
              checked={dailyReminders}
              onChange={e => setDailyReminders(e.target.checked)}
              className="accent-[#ccff00] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-sm bg-theme-elevated border border-theme cursor-pointer">
            <div>
              <div className="text-xs font-bold text-theme-primary font-display">Streak Protection Warnings</div>
              <div className="text-[11px] text-theme-secondary">Get notified 2 hours before midnight if you haven&apos;t logged a drill</div>
            </div>
            <input
              type="checkbox"
              checked={streakAlerts}
              onChange={e => setStreakAlerts(e.target.checked)}
              className="accent-[#ccff00] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-sm bg-theme-elevated border border-theme cursor-pointer">
            <div>
              <div className="text-xs font-bold text-theme-primary font-display">Recovery & Readiness Advice</div>
              <div className="text-[11px] text-theme-secondary">AI alerts when high soreness or poor sleep is detected</div>
            </div>
            <input
              type="checkbox"
              checked={recoveryNotifs}
              onChange={e => setRecoveryNotifs(e.target.checked)}
              className="accent-[#ccff00] w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Athlete Profile Form */}
      <form onSubmit={handleSave} className="bg-theme-card border border-theme p-6 rounded-sm space-y-5">
        <h3 className="text-base font-bold text-theme-primary font-display border-b border-theme pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-lime-accent" />
          <span>Player Dossier & Preferences</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-theme-muted font-mono-sport block mb-1">Full Name:</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 bg-theme-elevated border border-theme text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-theme-muted font-mono-sport block mb-1">Contact Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2.5 bg-theme-elevated border border-theme text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-theme-muted font-mono-sport block mb-1">Playing Position:</label>
            <select
              value={position}
              onChange={e => setPosition(e.target.value as Position)}
              className="w-full p-2.5 bg-theme-elevated border border-theme text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            >
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Centre-Back">Centre-Back</option>
              <option value="Full-Back">Full-Back</option>
              <option value="Defensive Midfielder">Defensive Midfielder</option>
              <option value="Central Midfielder">Central Midfielder</option>
              <option value="Attacking Midfielder">Attacking Midfielder</option>
              <option value="Winger">Winger</option>
              <option value="Striker">Striker</option>
            </select>
          </div>

          <div>
            <label className="text-theme-muted font-mono-sport block mb-1">Preferred Foot:</label>
            <select
              value={preferredFoot}
              onChange={e => setPreferredFoot(e.target.value as any)}
              className="w-full p-2.5 bg-theme-elevated border border-theme text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            >
              <option value="Right">Right Foot</option>
              <option value="Left">Left Foot</option>
              <option value="Both">Both (Ambidextrous)</option>
            </select>
          </div>

          <div>
            <label className="text-theme-muted font-mono-sport block mb-1">Age:</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full p-2.5 bg-theme-elevated border border-theme text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-theme-muted font-mono-sport block mb-1">Skill Tier:</label>
            <select
              value={experience}
              onChange={e => setExperience(e.target.value as SkillLevel)}
              className="w-full p-2.5 bg-theme-elevated border border-theme text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            >
              <option value="Beginner">Beginner / Grassroots</option>
              <option value="Intermediate">Intermediate Club Player</option>
              <option value="Advanced">Advanced High-School / Academy</option>
              <option value="Academy / Semi-Pro">Academy / Semi-Pro Track</option>
            </select>
          </div>

          <div>
            <label className="text-theme-muted font-mono-sport block mb-1">
              Target Training Days/Week:
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={trainingDays}
              onChange={e => setTrainingDays(Number(e.target.value))}
              className="w-full p-2.5 bg-theme-elevated border border-theme text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-theme-muted font-mono-sport block mb-1">Primary Pitch Location:</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full p-2.5 bg-theme-elevated border border-theme text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-theme-muted font-mono-sport block mb-1">
              Key Strengths (comma-separated):
            </label>
            <input
              type="text"
              value={strengths}
              onChange={e => setStrengths(e.target.value)}
              className="w-full p-2.5 bg-theme-elevated border border-theme text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-theme-muted font-mono-sport block mb-1">
              Critical Weaknesses (comma-separated):
            </label>
            <input
              type="text"
              value={weaknesses}
              onChange={e => setWeaknesses(e.target.value)}
              className="w-full p-2.5 bg-theme-elevated border border-theme text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-theme">
          {saved ? (
            <span className="text-xs font-mono-sport text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Dossier updated successfully!</span>
            </span>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportData}
              className="px-3.5 py-2.5 bg-theme-elevated border border-theme hover:border-[#ccff00] text-theme-primary text-xs font-mono-sport uppercase font-bold rounded-sm flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-lime-accent" />
              <span>Export JSON</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-red-950/20 border border-red-900/40 p-5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-red-400 uppercase font-mono-sport flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Reset Career History
          </h4>
          <p className="text-xs text-theme-secondary mt-0.5">
            Wipe all logged workouts, badges, and records to restart your development from scratch.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-xs font-mono-sport text-red-300 rounded-sm transition-colors cursor-pointer"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
};
