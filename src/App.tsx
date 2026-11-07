/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavigation } from './components/layout/TopNavigation';
import { ActiveSessionModal } from './components/training/ActiveSessionModal';
import { Award, X } from 'lucide-react';
import { ALL_BADGES } from './data/challenges';

// 12 Dedicated Route Pages + Dedicated Exercise Detail Page
import { HomePage } from './pages/HomePage';
import { ProgressPage } from './pages/ProgressPage';
import { TrainingsPage } from './pages/TrainingsPage';
import { ExerciseDetailPage } from './pages/ExerciseDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AICoachPage } from './pages/AICoachPage';
import { MyTrainingPage } from './pages/MyTrainingPage';
import { MyDreamPage } from './pages/MyDreamPage';
import { MentalGamePage } from './pages/MentalGamePage';
import { RecoveryPage } from './pages/RecoveryPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SettingsPage } from './pages/SettingsPage';
import { MediaManagerPage } from './pages/MediaManagerPage';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout: React.FC = () => {
  const { newBadgeUnlocked, dismissBadgeNotification } = useApp();

  const unlockedBadgeObj = newBadgeUnlocked
    ? ALL_BADGES.find(b => b.id === newBadgeUnlocked)
    : null;

  return (
    <div className="min-h-screen bg-theme-main text-theme-primary flex flex-col transition-colors duration-200">
      <ScrollToTop />

      {/* Main Horizontal Top Navigation (NO SIDEBAR) */}
      <TopNavigation />

      {/* Main Full-Width Content Canvas */}
      <div className="flex flex-col flex-1 w-full">
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/trainings" element={<TrainingsPage />} />
            <Route path="/trainings/:exerciseId" element={<ExerciseDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/ai-coach" element={<AICoachPage />} />
            <Route path="/my-training" element={<MyTrainingPage />} />
            <Route path="/my-dream" element={<MyDreamPage />} />
            <Route path="/mental-game" element={<MentalGamePage />} />
            <Route path="/recovery" element={<RecoveryPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/media-manager" element={<MediaManagerPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      </div>

      {/* Full-Screen Live Workout Stopwatch & Drill Modal */}
      <ActiveSessionModal />

      {/* Real Badge Unlocked Toast Notification */}
      {unlockedBadgeObj && (
        <div className="fixed bottom-6 right-6 z-50 bg-theme-elevated border-2 border-[#ccff00] p-4 rounded-sm shadow-2xl flex items-center gap-3.5 animate-in slide-in-from-bottom duration-300 max-w-sm">
          <div className="w-10 h-10 rounded-sm bg-[#ccff00] text-black flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono-sport uppercase font-bold text-lime-accent">
              NEW BADGE UNLOCKED!
            </div>
            <div className="text-xs font-bold text-theme-primary font-display truncate">
              {unlockedBadgeObj.title}
            </div>
            <div className="text-[11px] text-theme-secondary line-clamp-2">{unlockedBadgeObj.description}</div>
          </div>
          <button
            onClick={dismissBadgeNotification}
            className="p-1 text-theme-muted hover:text-theme-primary cursor-pointer"
            aria-label="Dismiss badge notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
