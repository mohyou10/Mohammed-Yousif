import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Flame,
  Sun,
  Moon,
  Play,
  Menu,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNavigation: React.FC = () => {
  const { user, currentStreak, dailyScore, activeWorkout, startWorkout, theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', number: '01', ascii: '⌂' },
    { path: '/progress', label: 'Progress', number: '02', ascii: '↗' },
    { path: '/trainings', label: 'Trainings', number: '03', ascii: '⚡' },
    { path: '/categories', label: 'Categories', number: '04', ascii: '▤' },
    { path: '/ai-coach', label: 'AI Coach', number: '05', ascii: '◈' },
    { path: '/my-training', label: 'My Training', number: '06', ascii: '⏱' },
    { path: '/my-dream', label: 'My Dream', number: '07', ascii: '⚐' },
    { path: '/mental-game', label: 'Mental Game', number: '08', ascii: '🧠' },
    { path: '/recovery', label: 'Recovery', number: '09', ascii: '♥' },
    { path: '/knowledge', label: 'Knowledge', number: '10', ascii: '📖' },
    { path: '/achievements', label: 'Achievements', number: '11', ascii: '★' },
    { path: '/settings', label: 'Settings', number: '12', ascii: '⚙' },
    { path: '/media-manager', label: 'Media', number: '13', ascii: '🎬' },
  ];

  const handleStartTodayTraining = () => {
    if (activeWorkout.isActive) {
      navigate('/my-training');
      return;
    }

    const defaultDrills = [
      {
        id: 'drill-warmup-1',
        name: 'Dynamic Football Activation & Hip Mobilization',
        category: 'Warmup' as const,
        durationMinutes: 10,
        reps: '10 reps each side',
        sets: 2,
        restSeconds: 30,
        difficulty: 'Intermediate' as const,
        objective: 'Prime hips, ankles, and adductors for high-speed cutting.',
        explanation: 'Open/close the gate, lunge with torso twist, walking heel-to-toe sweeps, short acceleration bursts.',
        coachTips: 'Keep chest upright. Never train cold.'
      },
      {
        id: 'drill-tech-1',
        name: 'Wall Rhythm 1-Touch & 2-Touch Mastery',
        category: 'Technical' as const,
        durationMinutes: 15,
        reps: '50 touches per foot',
        sets: 3,
        restSeconds: 45,
        difficulty: 'Intermediate' as const,
        objective: 'Develop automatic ankle lock and clean cushion control.',
        explanation: 'Firm passes into solid wall or rebounder from 4-5m. Alternate left and right foot inside strikes.',
        coachTips: 'Keep standing foot pointed directly at target. Cushion the return with relaxed ankle bone.'
      },
      {
        id: 'drill-finishing-1',
        name: '45-Degree Angle Cut & Side-Netting Strike',
        category: 'Finishing' as const,
        durationMinutes: 15,
        reps: '8 strikes per side',
        sets: 3,
        restSeconds: 60,
        difficulty: 'Advanced' as const,
        objective: 'Lethal precision shooting past oncoming defenders.',
        explanation: 'Touch ball out at 45 degrees, 2 setup steps, curl or drive into far side netting.',
        coachTips: 'Keep eyes on ball at strike. Pick your corner before your run-up.'
      },
      {
        id: 'drill-cooldown-1',
        name: 'Hamstring & Calf Decompression Stretch',
        category: 'Recovery' as const,
        durationMinutes: 10,
        reps: 'Hold 45 seconds each',
        sets: 2,
        restSeconds: 15,
        difficulty: 'Beginner' as const,
        objective: 'Clear metabolic waste and restore muscle resting length.',
        explanation: 'Seated hamstring stretch, standing wall calf stretch, deep nasal diaphragmatic breathing.',
        coachTips: 'Breathe into tight zones. Slow heart rate down below 100 BPM.'
      }
    ];

    startWorkout("Today's Tactical & Technical Session", 'Technical', defaultDrills);
    navigate('/my-training');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-theme-main/95 backdrop-blur-md border-b border-theme shadow-md">
      {/* Upper Utility & Brand Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <Link
          to="/home"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xs bg-[#ccff00] text-black font-black flex items-center justify-center font-display text-base sm:text-lg tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
            P11
          </div>
          <div>
            <div className="text-theme-primary font-black tracking-wider text-base lg:text-lg font-display flex items-center gap-1">
              PRO<span className="text-[#ccff00]">11</span>
              <span className="text-[10px] uppercase font-mono-sport text-theme-muted tracking-widest hidden sm:inline-block ml-2 border-l border-theme pl-2">
                Football Intelligence
              </span>
            </div>
          </div>
        </Link>

        {/* Right Status & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Active Streak */}
          <div className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xs bg-theme-card border border-theme text-xs font-mono-sport">
            <Flame className="w-3.5 h-3.5 text-lime-accent fill-current" />
            <span className="text-lime-accent font-bold">{currentStreak}D</span>
            <span className="text-theme-muted hidden sm:inline uppercase text-[10px]">STREAK</span>
          </div>

          {/* Daily Score */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs bg-theme-card border border-theme text-xs font-mono-sport">
            <span className="text-theme-muted text-[10px] uppercase">SCORE</span>
            <span className="text-theme-primary font-bold">{dailyScore}</span>
            <span className="text-theme-muted text-[10px]">/100</span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-xs bg-theme-card border border-theme hover:border-[#ccff00] text-theme-primary text-xs font-mono-sport transition-colors cursor-pointer"
            title="Toggle Dark / Light Theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-lime-accent" />
                <span className="text-[11px] font-bold uppercase hidden lg:inline">LIGHT</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-lime-accent" />
                <span className="text-[11px] font-bold uppercase hidden lg:inline">DARK</span>
              </>
            )}
          </button>

          {/* Start Training Button */}
          <button
            onClick={handleStartTodayTraining}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#ccff00] hover:bg-[#b5e600] text-black text-xs font-black uppercase font-display rounded-xs transition-transform active:scale-95 shadow-sm cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>
              {activeWorkout.isActive ? 'RESUME SESSION' : 'START TRAINING'}
            </span>
          </button>

          {/* Athlete Avatar Badge */}
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="w-8 h-8 rounded-xs bg-theme-elevated border border-theme hover:border-[#ccff00] flex items-center justify-center text-xs font-bold text-lime-accent font-mono-sport transition-colors"
            title={`Logged in as ${user.name}`}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xs bg-theme-card border border-theme text-theme-secondary hover:text-theme-primary lg:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-lime-accent" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Horizontal Navigation Links Bar */}
      <nav className="hidden lg:block border-t border-theme-subtle bg-theme-card/60 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-start gap-1 py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/trainings' && location.pathname.startsWith('/trainings/'));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono-sport uppercase tracking-wider rounded-xs whitespace-nowrap transition-all duration-150 relative ${
                  isActive
                    ? 'text-black bg-[#ccff00] font-black shadow-xs'
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-elevated'
                }`}
              >
                <span className="text-[11px] opacity-75">{item.ascii}</span>
                <span className="text-[10px] opacity-60 font-mono-sport">{item.number}.</span>
                <span className="font-bold">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Mobile Responsive Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-theme bg-theme-main px-3 py-3 space-y-2 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="text-[10px] uppercase font-mono-sport text-theme-muted tracking-wider px-1 pb-1 border-b border-theme-subtle flex items-center justify-between">
            <span>Main Navigation</span>
            <span className="text-lime-accent">{user.position}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-1.5 p-2 rounded-xs text-xs font-mono-sport uppercase tracking-wide transition-colors ${
                    isActive
                      ? 'bg-[#ccff00] text-black font-black'
                      : 'bg-theme-card text-theme-secondary hover:text-theme-primary border border-theme'
                  }`}
                >
                  <span className="text-xs shrink-0">{item.ascii}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] opacity-70 leading-none">{item.number}</span>
                    <span className="font-bold truncate text-[11px]">{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>

          {/* Quick Actions in Mobile Menu */}
          <div className="pt-3 border-t border-theme space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleStartTodayTraining();
              }}
              className="w-full py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Today&apos;s Training Session</span>
            </button>
            <div className="flex items-center justify-between text-xs font-mono-sport text-theme-muted p-2 rounded-xs bg-theme-card border border-theme">
              <span>Athlete: {user.name}</span>
              <span className="text-lime-accent font-bold">Streak: {currentStreak}d</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
