import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Flame,
  Award,
  Clock,
  Activity,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Brain,
  Shield,
  HeartPulse,
  Sparkles,
  ArrowRight,
  Dumbbell,
  Grid,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DAILY_CHALLENGES } from '../data/challenges';
import { ALL_EXERCISES } from '../data/exercisesData';

export const HomePage: React.FC = () => {
  const {
    user,
    totalMinutesTrained,
    currentStreak,
    todaySession,
    dailyScore,
    dailyInsight,
    activeWorkout,
    startWorkout,
    completeChallenge
  } = useApp();

  const navigate = useNavigate();

  // Day's challenge
  const dayOfWeek = new Date().getDay() || 7;
  const todayChallenge = DAILY_CHALLENGES.find(c => c.dayIndex === dayOfWeek) || DAILY_CHALLENGES[0];
  const isChallengeCompleted = user.completedChallenges?.includes(todayChallenge.id);

  // Recommended exercises based on position & weaknesses
  const recommendedExercises = ALL_EXERCISES.slice(0, 3);

  // Recently completed sessions/exercises
  const recentSessions = user.sessions.slice(0, 3);

  const handleStartToday = () => {
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
        explanation: 'Open/close the gate, lunge with torso twist, walking sweeps, short acceleration bursts.',
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
        coachTips: 'Keep standing foot pointed directly at target. Cushion with relaxed ankle bone.'
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
      }
    ];

    startWorkout("Today's Tactical & Technical Session", 'Technical', defaultDrills);
    navigate('/my-training');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 1. Football Hero Section */}
      <section className="relative rounded-sm overflow-hidden border border-theme bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80"
            alt="Football Training"
            className="w-full h-full object-cover object-center opacity-40 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-black/60 border border-[#ccff00]/40 text-xs font-mono-sport text-zinc-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-[#ccff00] font-bold">PRO11 ACADEMY</span>
            <span>·</span>
            <span>ATHLETE: {user.name.toUpperCase()}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-none uppercase">
            Train Smarter.<br />
            <span className="text-[#ccff00]">Play Better.</span><br />
            Become Pro.
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
            Your 24/7 UEFA Pro coaching system. Access over 160 verified drills, track real workload metrics, master position-specific tactics, and develop unbreakable match mentality.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleStartToday}
              className="flex items-center gap-2.5 px-6 py-3.5 btn-lime text-xs sm:text-sm font-black uppercase font-display rounded-sm shadow-xl tracking-wider"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{activeWorkout.isActive ? 'Resume Active Session' : "Start Today's Training"}</span>
            </button>

            <Link
              to="/trainings"
              className="flex items-center gap-2 px-5 py-3.5 bg-black/60 hover:bg-black/80 border border-zinc-700 text-white text-xs font-bold uppercase font-display rounded-sm transition-colors backdrop-blur-md"
            >
              <Dumbbell className="w-4 h-4 text-[#ccff00]" />
              <span>Explore 160+ Drills</span>
            </Link>
          </div>

          {dailyInsight?.quote && (
            <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 italic">
              <span className="text-[#ccff00] not-italic font-bold font-mono-sport mr-1.5">DAILY COACH MENTOR:</span>
              "{dailyInsight.quote}"
            </div>
          )}
        </div>
      </section>

      {/* 2. Quick Navigation Shortcut Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Link
          to="/trainings"
          className="p-4 bg-theme-card hover:bg-theme-elevated border border-theme rounded-sm transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <Dumbbell className="w-5 h-5 text-lime-accent group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono-sport text-theme-muted uppercase">160+ Drills</span>
          </div>
          <div className="text-sm font-bold text-theme-primary font-display">Training Library</div>
          <div className="text-xs text-theme-secondary mt-0.5">Physical, technical & positional drills</div>
        </Link>

        <Link
          to="/progress"
          className="p-4 bg-theme-card hover:bg-theme-elevated border border-theme rounded-sm transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-lime-accent group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono-sport text-theme-muted uppercase">{currentStreak}D Streak</span>
          </div>
          <div className="text-sm font-bold text-theme-primary font-display">Progress & Stats</div>
          <div className="text-xs text-theme-secondary mt-0.5">Verified workload, hours & charts</div>
        </Link>

        <Link
          to="/ai-coach"
          className="p-4 bg-theme-card hover:bg-theme-elevated border border-theme rounded-sm transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-5 h-5 text-lime-accent group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono-sport text-theme-muted uppercase">UEFA Pro</span>
          </div>
          <div className="text-sm font-bold text-theme-primary font-display">AI Coach Room</div>
          <div className="text-xs text-theme-secondary mt-0.5">24/7 personal tactical consultations</div>
        </Link>

        <Link
          to="/categories"
          className="p-4 bg-theme-card hover:bg-theme-elevated border border-theme rounded-sm transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <Grid className="w-5 h-5 text-lime-accent group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono-sport text-theme-muted uppercase">16 Categories</span>
          </div>
          <div className="text-sm font-bold text-theme-primary font-display">Category Explorer</div>
          <div className="text-xs text-theme-secondary mt-0.5">Visual category deep-dive browser</div>
        </Link>
      </section>

      {/* 3. Main Split: Today's Training & Challenge of the Day */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Session Preview & Personal Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-theme-card border border-theme p-5 sm:p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono-sport text-lime-accent font-bold tracking-wider">
                  TODAY'S SCHEDULE
                </span>
                <h3 className="text-lg font-bold text-theme-primary font-display">
                  {todaySession ? "Today's Verified Session Logged" : "Today's Prescribed Training"}
                </h3>
              </div>
              <Link
                to="/my-training"
                className="text-xs text-theme-secondary hover:text-theme-primary flex items-center gap-1 font-mono-sport"
              >
                <span>View Full Schedule</span>
                <ChevronRight className="w-3.5 h-3.5 text-lime-accent" />
              </Link>
            </div>

            {todaySession ? (
              <div className="p-4 bg-theme-elevated border border-theme rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-bold text-theme-primary">{todaySession.title}</span>
                  </div>
                  <span className="text-xs font-mono-sport text-theme-muted">
                    {todaySession.durationMinutes} Minutes · RPE {todaySession.difficultyRating}/10
                  </span>
                </div>
                {todaySession.notes && (
                  <p className="text-xs text-theme-secondary italic border-l-2 border-[#ccff00] pl-2.5">
                    "{todaySession.notes}"
                  </p>
                )}
                <div className="text-xs text-theme-muted font-mono-sport">
                  {todaySession.exercises.filter(e => e.completed).length} of {todaySession.exercises.length} drills completed.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 bg-theme-elevated border border-theme rounded-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-theme-primary">Ball Mastery & Ankle Locking Rhythm</div>
                    <div className="text-[11px] text-theme-muted">Technical · 15 mins · 50 touches per foot against wall</div>
                  </div>
                  <span className="text-xs font-mono-sport text-lime-accent">INTERMEDIATE</span>
                </div>
                <div className="p-3.5 bg-theme-elevated border border-theme rounded-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-theme-primary">Explosive 10m First-Step Acceleration</div>
                    <div className="text-[11px] text-theme-muted">Physical · 15 mins · 8 maximal burst sprints with 60s rest</div>
                  </div>
                  <span className="text-xs font-mono-sport text-lime-accent">ADVANCED</span>
                </div>
                <div className="p-3.5 bg-theme-elevated border border-theme rounded-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-theme-primary">45-Degree Angle Cut & Far-Post Strike</div>
                    <div className="text-[11px] text-theme-muted">Finishing · 20 mins · Instep curl into side netting</div>
                  </div>
                  <span className="text-xs font-mono-sport text-lime-accent">ADVANCED</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-theme-muted font-mono-sport">
                    Estimated Duration: 50 Mins · 4 Drills
                  </span>
                  <button
                    onClick={handleStartToday}
                    className="flex items-center gap-1.5 px-4 py-2 btn-lime text-xs font-black uppercase font-display rounded-sm shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Exercises Carousel/Grid */}
          <div className="bg-theme-card border border-theme p-5 sm:p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono-sport text-theme-muted tracking-wider">
                  CURATED FOR {user.position.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-theme-primary font-display">
                  Recommended Position Drills
                </h3>
              </div>
              <Link
                to="/trainings"
                className="text-xs text-lime-accent hover:underline font-mono-sport"
              >
                Browse All ({ALL_EXERCISES.length})
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recommendedExercises.map(ex => (
                <Link
                  key={ex.id}
                  to={`/trainings?exercise=${ex.id}`}
                  className="p-3 bg-theme-elevated hover:bg-theme-card border border-theme rounded-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-24 w-full rounded-xs overflow-hidden mb-2 bg-zinc-900">
                      <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <span className="text-[9px] font-mono-sport uppercase font-bold text-lime-accent">
                      {ex.category} · {ex.subCategory}
                    </span>
                    <h4 className="text-xs font-bold text-theme-primary font-display line-clamp-1 mt-0.5">
                      {ex.name}
                    </h4>
                  </div>
                  <div className="mt-2 text-[10px] font-mono-sport text-theme-muted flex items-center justify-between pt-1 border-t border-theme-subtle">
                    <span>{ex.durationMinutes}m</span>
                    <span className="text-theme-primary font-bold">{ex.difficulty}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Challenge of the Day & Quick Career Dossier */}
        <div className="space-y-6">
          {/* CHALLENGE OF THE DAY */}
          <div className="bg-theme-card border border-theme rounded-sm p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lime-accent" />
              <span className="text-[10px] uppercase font-mono-sport text-lime-accent font-bold tracking-wider">
                CHALLENGE OF THE DAY
              </span>
            </div>

            <h3 className="text-base font-bold text-theme-primary font-display">
              {todayChallenge.title}
            </h3>
            <p className="text-xs text-theme-secondary leading-relaxed">
              {todayChallenge.description}
            </p>

            <div className="p-2.5 bg-theme-elevated border border-theme rounded-sm">
              <div className="text-[10px] text-theme-muted uppercase font-mono-sport">Target:</div>
              <div className="text-xs font-bold text-theme-primary font-mono-sport">{todayChallenge.target}</div>
            </div>

            <div className="text-[11px] text-theme-muted italic">
              Tip: {todayChallenge.proTip}
            </div>

            <button
              onClick={() => completeChallenge(todayChallenge.id)}
              disabled={isChallengeCompleted}
              className={`w-full py-2.5 px-3 text-xs font-bold rounded-sm flex items-center justify-center gap-1.5 transition-colors ${
                isChallengeCompleted
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600 cursor-default'
                  : 'btn-lime'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isChallengeCompleted ? 'Challenge Completed!' : 'Mark Challenge Done'}</span>
            </button>
          </div>

          {/* Quick Performance Summary Card */}
          <div className="bg-theme-card border border-theme p-5 rounded-sm space-y-3">
            <div className="flex items-center justify-between border-b border-theme pb-2">
              <span className="text-[10px] uppercase font-mono-sport text-theme-muted font-bold">
                ATHLETE DOSSIER
              </span>
              <Link to="/progress" className="text-xs text-lime-accent hover:underline font-mono-sport">
                Deep Analytics
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono-sport">
              <div>
                <span className="text-theme-muted text-[10px] block">TOTAL HOURS</span>
                <span className="text-base font-bold text-theme-primary">
                  {(totalMinutesTrained / 60).toFixed(1)}h
                </span>
              </div>
              <div>
                <span className="text-theme-muted text-[10px] block">SESSIONS</span>
                <span className="text-base font-bold text-theme-primary">{user.sessions.length}</span>
              </div>
              <div>
                <span className="text-theme-muted text-[10px] block">STREAK</span>
                <span className="text-base font-bold text-lime-accent">{currentStreak} Days</span>
              </div>
              <div>
                <span className="text-theme-muted text-[10px] block">HONORS</span>
                <span className="text-base font-bold text-theme-primary">{user.unlockedBadges?.length || 0} Badges</span>
              </div>
            </div>
          </div>

          {/* Promotional Banner: TRAIN LIKE A PRO */}
          <div className="relative rounded-sm overflow-hidden border border-theme bg-zinc-950 p-5 text-white space-y-2">
            <img
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
              alt="Shoot like a pro"
              className="absolute inset-0 w-full h-full object-cover opacity-25 filter grayscale"
            />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
                MASTER YOUR WEAK FOOT
              </span>
              <h4 className="text-sm font-bold font-display uppercase tracking-wider">
                The 150-Wall Touch Routine
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Eliminate your technical weak side in 6 weeks of dedicated 15-minute daily wall repetitions.
              </p>
              <Link
                to="/trainings?search=weak+foot"
                className="inline-flex items-center gap-1.5 text-xs text-[#ccff00] font-bold font-mono-sport hover:underline pt-1"
              >
                <span>View Protocol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
