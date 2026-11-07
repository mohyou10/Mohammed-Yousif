import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  TrainingSession,
  Exercise,
  DetailedExercise,
  PlayerGoal,
  MentalJournalEntry,
  RecoveryLog,
  PersonalRecords,
  DailyInsight
} from '../types';
import { ALL_BADGES, DAILY_CHALLENGES } from '../data/challenges';
import { ALL_EXERCISES } from '../data/exercisesData';

export type AppTheme = 'dark' | 'light';

interface ActiveWorkoutState {
  isActive: boolean;
  sessionTitle: string;
  sessionType: TrainingSession['type'];
  exercises: Exercise[];
  currentExerciseIndex: number;
  secondsElapsed: number;
  isPaused: boolean;
  completedExerciseIds: string[];
  isResting?: boolean;
  restSecondsRemaining?: number;
}

interface AppContextType {
  user: UserProfile;
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  toggleTheme: () => void;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  logSession: (session: Omit<TrainingSession, 'id' | 'date'>) => Promise<void>;
  addGoal: (goal: Omit<PlayerGoal, 'id'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<PlayerGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addMentalJournalEntry: (entry: Omit<MentalJournalEntry, 'id' | 'date'>) => Promise<void>;
  logRecovery: (recovery: Omit<RecoveryLog, 'id' | 'date'>) => Promise<void>;
  updatePersonalRecords: (records: Partial<PersonalRecords>) => Promise<void>;
  toggleBookmark: (id: string) => Promise<void>;
  toggleFavoriteExercise: (id: string) => Promise<void>;
  markExerciseCompleted: (exerciseId: string, durationMinutes?: number) => Promise<void>;
  toggleMasteredSkill: (id: string) => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
  dailyInsight: DailyInsight | null;
  refreshDailyInsight: () => Promise<void>;
  // Active Workout Runner
  activeWorkout: ActiveWorkoutState;
  startWorkout: (title: string, type: TrainingSession['type'], exercises: Exercise[]) => void;
  startSingleExercise: (exercise: DetailedExercise) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  finishWorkout: (rpe: number, notes: string) => Promise<void>;
  cancelWorkout: () => void;
  toggleActiveExercise: (id: string) => void;
  nextExercise: () => void;
  prevExercise: () => void;
  startRestTimer: (seconds?: number) => void;
  // Stats
  totalMinutesTrained: number;
  currentStreak: number;
  todaySession: TrainingSession | null;
  dailyScore: number;
  unlockedBadgesList: string[];
  newBadgeUnlocked: string | null;
  dismissBadgeNotification: () => void;
}

const STORAGE_KEY = 'pro11_player_profile';
const THEME_KEY = 'pro11_theme';

const DEFAULT_USER: UserProfile = {
  id: 'player_default',
  name: 'Alex Rivera',
  email: 'alex.rivera@pro11.club',
  age: 18,
  position: 'Central Midfielder',
  experience: 'Intermediate',
  preferredFoot: 'Right',
  trainingDaysPerWeek: 4,
  availableTime: 60,
  equipment: ['Football', 'Cones', 'Pitch Wall'],
  trainingLocation: 'Club Ground / Pitch',
  strengths: ['Vision & Spatial Awareness', 'Short Passing', 'Work Ethic'],
  weaknesses: ['Weak Foot Finishing', 'First 10m Explosiveness', 'Air Duels'],
  goals: [
    {
      id: 'goal-weak-foot',
      title: 'Master 100 consecutive weak-foot wall passes',
      category: 'Technical',
      targetDate: '2026-12-15',
      progress: 35,
      milestones: [
        { text: 'Complete 30 clean 2-touch passes against wall', completed: true },
        { text: 'Achieve 60 one-touch weak-foot passes in rhythm', completed: false },
        { text: 'Complete 100 continuous alternating touches', completed: false }
      ],
      aiTip: 'Lock your ankle and strike with the hard instep. Keep standing foot planted 15cm from ball.'
    },
    {
      id: 'goal-speed-accel',
      title: 'Achieve sub-1.80s 10m sprint split',
      category: 'Physical',
      targetDate: '2026-12-30',
      progress: 20,
      milestones: [
        { text: 'Drill 45-degree acceleration angle mechanics', completed: true },
        { text: 'Log 8 high-effort sprint intervals weekly', completed: false },
        { text: 'Perform electronic or video timed 10m trial', completed: false }
      ],
      aiTip: 'Focus on horizontal ground drive on strides 1 through 3 instead of popping upright.'
    }
  ],
  sessions: [],
  bookmarks: ['tact-gegenpress', 'acad-trial-prep'],
  favoriteExerciseIds: ['tech-pass-2', 'phys-spd-1', 'tech-drib-1'],
  completedExerciseIds: [],
  masteredSkills: [],
  personalRecords: {
    jugglingRecord: 42,
    sprintTime30m: null,
    wallPasses60s: 38,
    beepTestLevel: null
  },
  mentalJournal: [],
  recoveryLogs: [],
  unlockedBadges: [],
  completedChallenges: [],
  createdAt: new Date().toISOString()
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY) as AppTheme;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {
      // ignore
    }
    return 'dark';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load local profile:', e);
    }
    return DEFAULT_USER;
  });

  const [dailyInsight, setDailyInsight] = useState<DailyInsight | null>(null);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<string | null>(null);

  // Active workout runner state
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState>({
    isActive: false,
    sessionTitle: '',
    sessionType: 'Technical',
    exercises: [],
    currentExerciseIndex: 0,
    secondsElapsed: 0,
    isPaused: false,
    completedExerciseIds: [],
    isResting: false,
    restSecondsRemaining: 0
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Workout timer & Rest ticker
  useEffect(() => {
    let timer: any;
    if (activeWorkout.isActive && !activeWorkout.isPaused) {
      timer = setInterval(() => {
        setActiveWorkout(prev => {
          if (prev.isResting && (prev.restSecondsRemaining || 0) > 0) {
            const nextRest = (prev.restSecondsRemaining || 1) - 1;
            return {
              ...prev,
              secondsElapsed: prev.secondsElapsed + 1,
              restSecondsRemaining: nextRest,
              isResting: nextRest > 0
            };
          }
          return {
            ...prev,
            secondsElapsed: prev.secondsElapsed + 1
          };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeWorkout.isActive, activeWorkout.isPaused]);

  // Sync state to server & localStorage
  const persistUser = async (updated: UserProfile) => {
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: updated.id, data: updated })
      });
    } catch (err) {
      console.warn('Saved locally:', err);
    }
  };

  // Initial load from server
  useEffect(() => {
    async function loadServerData() {
      try {
        const res = await fetch(`/api/user-data?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setUser(prev => ({ ...prev, ...data.user }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, ...data.user }));
          }
        }
      } catch (e) {
        console.log('Using local user data cache');
      }
    }
    loadServerData();
    refreshDailyInsight();
  }, []);

  const refreshDailyInsight = async () => {
    try {
      const res = await fetch('/api/coach/daily-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: user,
          currentStreak: calculateStreak(user.sessions)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDailyInsight(data);
      }
    } catch (err) {
      console.error('Failed to fetch daily coach insight:', err);
    }
  };

  // Streak calculation based on real session dates
  function calculateStreak(sessions: TrainingSession[]): number {
    if (!sessions || sessions.length === 0) return 0;

    const dateSet = new Set(sessions.map(s => s.date.slice(0, 10)));
    const sortedDates = Array.from(dateSet).sort().reverse();
    if (sortedDates.length === 0) return 0;

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    const mostRecent = sortedDates[0];
    if (mostRecent !== todayStr && mostRecent !== yesterday) {
      return 0; // Streak broken
    }

    let streak = 0;
    let expectedDate = new Date(mostRecent);

    for (const dStr of sortedDates) {
      const current = new Date(dStr);
      const diffDays = Math.round((expectedDate.getTime() - current.getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 1) {
        streak++;
        expectedDate = current;
      } else {
        break;
      }
    }

    return streak;
  }

  // Check and unlock badges based on real activity
  function checkBadges(currentProfile: UserProfile): { updatedBadges: string[]; justUnlocked: string | null } {
    const existing = new Set(currentProfile.unlockedBadges || []);
    let justUnlocked: string | null = null;

    const totalMinutes = currentProfile.sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const streak = calculateStreak(currentProfile.sessions);

    if (currentProfile.sessions.length >= 1 && !existing.has('badge-first-session')) {
      existing.add('badge-first-session');
      justUnlocked = 'badge-first-session';
    }
    if (streak >= 3 && !existing.has('badge-streak-3')) {
      existing.add('badge-streak-3');
      justUnlocked = 'badge-streak-3';
    }
    if (streak >= 7 && !existing.has('badge-streak-7')) {
      existing.add('badge-streak-7');
      justUnlocked = 'badge-streak-7';
    }
    if (totalMinutes >= 100 && !existing.has('badge-centurion-100m')) {
      existing.add('badge-centurion-100m');
      justUnlocked = 'badge-centurion-100m';
    }
    if ((currentProfile.completedExerciseIds || []).length >= 5 && !existing.has('badge-academy-scholar')) {
      existing.add('badge-academy-scholar');
      justUnlocked = 'badge-academy-scholar';
    }
    if ((currentProfile.mentalJournal || []).length >= 2 && !existing.has('badge-mindset-pro')) {
      existing.add('badge-mindset-pro');
      justUnlocked = 'badge-mindset-pro';
    }
    if ((currentProfile.completedChallenges || []).length >= 2 && !existing.has('badge-challenge-ace')) {
      existing.add('badge-challenge-ace');
      justUnlocked = 'badge-challenge-ace';
    }
    if (
      ((currentProfile.personalRecords?.jugglingRecord || 0) > 50 ||
        (currentProfile.personalRecords?.wallPasses60s || 0) > 40) &&
      !existing.has('badge-record-setter')
    ) {
      existing.add('badge-record-setter');
      justUnlocked = 'badge-record-setter';
    }

    return {
      updatedBadges: Array.from(existing),
      justUnlocked
    };
  }

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ccff00', '#ffffff', '#22c55e']
      });
    } catch (e) {
      // ignore
    }
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    const updated = { ...user, ...updates };
    const { updatedBadges, justUnlocked } = checkBadges(updated);
    updated.unlockedBadges = updatedBadges;
    if (justUnlocked) {
      setNewBadgeUnlocked(justUnlocked);
      triggerCelebration();
    }
    await persistUser(updated);
  };

  const logSession = async (sessionData: Omit<TrainingSession, 'id' | 'date'>) => {
    const newSession: TrainingSession = {
      ...sessionData,
      id: `session-${Date.now()}`,
      date: new Date().toISOString()
    };

    const updatedSessions = [newSession, ...user.sessions];
    const updatedUser: UserProfile = {
      ...user,
      sessions: updatedSessions
    };

    const { updatedBadges, justUnlocked } = checkBadges(updatedUser);
    updatedUser.unlockedBadges = updatedBadges;

    if (justUnlocked) {
      setNewBadgeUnlocked(justUnlocked);
    }
    triggerCelebration();

    await persistUser(updatedUser);
  };

  const addGoal = async (goalData: Omit<PlayerGoal, 'id'>) => {
    const newGoal: PlayerGoal = {
      ...goalData,
      id: `goal-${Date.now()}`
    };
    await updateUser({ goals: [newGoal, ...user.goals] });
  };

  const updateGoal = async (id: string, updates: Partial<PlayerGoal>) => {
    const updatedGoals = user.goals.map(g => (g.id === id ? { ...g, ...updates } : g));
    await updateUser({ goals: updatedGoals });
  };

  const deleteGoal = async (id: string) => {
    const filtered = user.goals.filter(g => g.id !== id);
    await updateUser({ goals: filtered });
  };

  const addMentalJournalEntry = async (entry: Omit<MentalJournalEntry, 'id' | 'date'>) => {
    const newEntry: MentalJournalEntry = {
      ...entry,
      id: `mj-${Date.now()}`,
      date: new Date().toISOString()
    };
    await updateUser({ mentalJournal: [newEntry, ...user.mentalJournal] });
  };

  const logRecovery = async (recovery: Omit<RecoveryLog, 'id' | 'date'>) => {
    const newLog: RecoveryLog = {
      ...recovery,
      id: `rec-${Date.now()}`,
      date: new Date().toISOString()
    };
    await updateUser({ recoveryLogs: [newLog, ...user.recoveryLogs] });
  };

  const updatePersonalRecords = async (records: Partial<PersonalRecords>) => {
    await updateUser({
      personalRecords: {
        ...user.personalRecords,
        ...records
      }
    });
  };

  const toggleBookmark = async (id: string) => {
    const set = new Set(user.bookmarks || []);
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    await updateUser({ bookmarks: Array.from(set) });
  };

  const toggleFavoriteExercise = async (id: string) => {
    const set = new Set(user.favoriteExerciseIds || []);
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    await updateUser({ favoriteExerciseIds: Array.from(set) });
  };

  const markExerciseCompleted = async (exerciseId: string, durationMinutes: number = 15) => {
    const set = new Set(user.completedExerciseIds || []);
    set.add(exerciseId);

    const exerciseObj = ALL_EXERCISES.find(e => e.id === exerciseId);
    const title = exerciseObj ? exerciseObj.name : 'Completed Training Drill';

    const newSession: TrainingSession = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      title,
      type: exerciseObj?.category === 'Physical' ? 'Physical' : 'Technical',
      durationMinutes: exerciseObj?.durationMinutes || durationMinutes,
      difficultyRating: 8,
      exercises: [
        {
          id: exerciseId,
          name: title,
          category: exerciseObj?.category === 'Physical' ? 'Physical' : 'Technical',
          durationMinutes: exerciseObj?.durationMinutes || durationMinutes,
          reps: exerciseObj?.reps || '10 reps',
          sets: exerciseObj?.sets || 3,
          restSeconds: exerciseObj?.restSeconds || 45,
          difficulty: exerciseObj?.difficulty || 'Intermediate',
          objective: exerciseObj?.benefits?.[0] || 'Technical Mastery',
          explanation: exerciseObj?.description || '',
          coachTips: exerciseObj?.safetyTips?.[0] || 'Clean mechanics.',
          completed: true
        }
      ],
      achievements: `Mastered drill: ${title}`
    };

    const updatedUser: UserProfile = {
      ...user,
      completedExerciseIds: Array.from(set),
      sessions: [newSession, ...user.sessions]
    };

    const { updatedBadges, justUnlocked } = checkBadges(updatedUser);
    updatedUser.unlockedBadges = updatedBadges;
    if (justUnlocked) {
      setNewBadgeUnlocked(justUnlocked);
    }
    triggerCelebration();

    await persistUser(updatedUser);
  };

  const toggleMasteredSkill = async (id: string) => {
    const set = new Set(user.masteredSkills || []);
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    await updateUser({ masteredSkills: Array.from(set) });
  };

  const completeChallenge = async (challengeId: string) => {
    const set = new Set(user.completedChallenges || []);
    set.add(challengeId);
    await updateUser({ completedChallenges: Array.from(set) });
  };

  // Workout runner controls
  const startWorkout = (title: string, type: TrainingSession['type'], exercises: Exercise[]) => {
    setActiveWorkout({
      isActive: true,
      sessionTitle: title,
      sessionType: type,
      exercises,
      currentExerciseIndex: 0,
      secondsElapsed: 0,
      isPaused: false,
      completedExerciseIds: [],
      isResting: false,
      restSecondsRemaining: 0
    });
  };

  const startSingleExercise = (exercise: DetailedExercise) => {
    startWorkout(exercise.name, exercise.category === 'Physical' ? 'Physical' : 'Technical', [
      {
        id: exercise.id,
        name: exercise.name,
        category: exercise.category === 'Physical' ? 'Physical' : 'Technical',
        durationMinutes: exercise.durationMinutes,
        reps: exercise.reps,
        sets: exercise.sets,
        restSeconds: exercise.restSeconds,
        difficulty: exercise.difficulty,
        objective: exercise.benefits[0] || exercise.description,
        explanation: exercise.instructions.join(' '),
        coachTips: exercise.safetyTips[0] || 'Focus on sharp mechanics.'
      }
    ]);
  };

  const pauseWorkout = () => {
    setActiveWorkout(prev => ({ ...prev, isPaused: true }));
  };

  const resumeWorkout = () => {
    setActiveWorkout(prev => ({ ...prev, isPaused: false }));
  };

  const cancelWorkout = () => {
    setActiveWorkout({
      isActive: false,
      sessionTitle: '',
      sessionType: 'Technical',
      exercises: [],
      currentExerciseIndex: 0,
      secondsElapsed: 0,
      isPaused: false,
      completedExerciseIds: [],
      isResting: false,
      restSecondsRemaining: 0
    });
  };

  const toggleActiveExercise = (id: string) => {
    setActiveWorkout(prev => {
      const set = new Set(prev.completedExerciseIds);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return { ...prev, completedExerciseIds: Array.from(set) };
    });
  };

  const nextExercise = () => {
    setActiveWorkout(prev => ({
      ...prev,
      currentExerciseIndex: Math.min(prev.exercises.length - 1, prev.currentExerciseIndex + 1),
      isResting: false
    }));
  };

  const prevExercise = () => {
    setActiveWorkout(prev => ({
      ...prev,
      currentExerciseIndex: Math.max(0, prev.currentExerciseIndex - 1),
      isResting: false
    }));
  };

  const startRestTimer = (seconds: number = 45) => {
    setActiveWorkout(prev => ({
      ...prev,
      isResting: true,
      restSecondsRemaining: seconds
    }));
  };

  const finishWorkout = async (rpe: number, notes: string) => {
    const durationMins = Math.max(1, Math.round(activeWorkout.secondsElapsed / 60));
    const completedIds = activeWorkout.completedExerciseIds;

    const newCompleted = new Set(user.completedExerciseIds || []);
    completedIds.forEach(id => newCompleted.add(id));

    await logSession({
      title: activeWorkout.sessionTitle || 'Training Session',
      type: activeWorkout.sessionType,
      durationMinutes: durationMins,
      difficultyRating: rpe,
      exercises: activeWorkout.exercises.map(ex => ({
        ...ex,
        completed: completedIds.includes(ex.id)
      })),
      notes,
      achievements: `${completedIds.length}/${activeWorkout.exercises.length} drills completed in ${durationMins}m`
    });

    await updateUser({ completedExerciseIds: Array.from(newCompleted) });
    cancelWorkout();
  };

  const dismissBadgeNotification = () => {
    setNewBadgeUnlocked(null);
  };

  const totalMinutesTrained = user.sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const currentStreak = calculateStreak(user.sessions);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySession = user.sessions.find(s => s.date.slice(0, 10) === todayStr) || null;

  const dailyScore = todaySession
    ? Math.min(
        100,
        Math.round(
          50 +
            (todaySession.exercises.filter(e => e.completed).length / Math.max(1, todaySession.exercises.length)) * 30 +
            Math.min(20, todaySession.durationMinutes / 3)
        )
      )
    : 0;

  return (
    <AppContext.Provider
      value={{
        user,
        theme,
        setTheme,
        toggleTheme,
        updateUser,
        logSession,
        addGoal,
        updateGoal,
        deleteGoal,
        addMentalJournalEntry,
        logRecovery,
        updatePersonalRecords,
        toggleBookmark,
        toggleFavoriteExercise,
        markExerciseCompleted,
        toggleMasteredSkill,
        completeChallenge,
        dailyInsight,
        refreshDailyInsight,
        activeWorkout,
        startWorkout,
        startSingleExercise,
        pauseWorkout,
        resumeWorkout,
        finishWorkout,
        cancelWorkout,
        toggleActiveExercise,
        nextExercise,
        prevExercise,
        startRestTimer,
        totalMinutesTrained,
        currentStreak,
        todaySession,
        dailyScore,
        unlockedBadgesList: user.unlockedBadges || [],
        newBadgeUnlocked,
        dismissBadgeNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
