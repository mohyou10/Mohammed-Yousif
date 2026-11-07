import React from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DAILY_CHALLENGES } from '../../data/challenges';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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

  // Get current day's challenge (1-7)
  const dayOfWeek = new Date().getDay() || 7;
  const todayChallenge = DAILY_CHALLENGES.find(c => c.dayIndex === dayOfWeek) || DAILY_CHALLENGES[0];
  const isChallengeCompleted = user.completedChallenges?.includes(todayChallenge.id);

  // Football Level progression calculation
  const getFootballLevel = (minutes: number, sessionsCount: number) => {
    if (sessionsCount >= 20 || minutes >= 1000) return 'Elite Academy Prospect (U-21)';
    if (sessionsCount >= 10 || minutes >= 450) return 'Academy Development Track';
    if (sessionsCount >= 4 || minutes >= 150) return 'Semi-Pro Aspirant';
    return 'Junior Development Player';
  };

  const level = getFootballLevel(totalMinutesTrained, user.sessions.length);

  // Weekly stats calculation (last 7 days)
  const now = new Date();
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const weeklySessions = user.sessions.filter(s => past7Days.includes(s.date.slice(0, 10)));
  const weeklyMinutes = weeklySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const weeklyDrillsCompleted = weeklySessions.reduce(
    (acc, s) => acc + (s.exercises ? s.exercises.filter(e => e.completed).length : 0),
    0
  );

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
    <div className="space-y-6">
      {/* Top Welcome & Motivational Banner */}
      <div className="bg-[#121217] border border-[#242430] rounded-sm p-5 lg:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
              <span>WELCOME BACK, ATHLETE</span>
              <span>·</span>
              <span className="text-[#ccff00] font-bold">{user.position}</span>
              <span>·</span>
              <span>{user.experience}</span>
            </div>
            <h2 className="text-xl lg:text-3xl font-black text-white font-display tracking-tight">
              {user.name.toUpperCase()}
            </h2>
            <p className="text-xs lg:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              {dailyInsight?.insight ||
                'Excellence is not an accident; it is the daily accumulation of disciplined touches. Train with intent today.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartToday}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-[#ccff00] text-black font-black text-xs lg:text-sm uppercase font-display tracking-wider rounded-sm hover:bg-[#b8e600] active:scale-98 transition-all shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{activeWorkout.isActive ? 'RESUME ACTIVE WORKOUT' : "START TODAY'S TRAINING"}</span>
            </button>
            <button
              onClick={() => navigate('/ai-coach')}
              className="flex items-center gap-2 px-4 py-3.5 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-bold uppercase font-display rounded-sm hover:border-zinc-500 transition-colors"
            >
              <Brain className="w-4 h-4 text-[#ccff00]" />
              <span>Ask AI Coach</span>
            </button>
          </div>
        </div>

        {dailyInsight?.quote && (
          <div className="mt-4 pt-3 border-t border-[#22222c] flex items-center gap-2 text-[11px] text-zinc-400 italic">
            <span className="text-[#ccff00] font-bold not-italic font-mono-sport">COACH CUE:</span>
            <span>"{dailyInsight.quote}"</span>
          </div>
        )}
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {/* Daily Performance Score */}
        <div className="bg-[#121216] border border-[#242430] p-4 rounded-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono-sport mb-2">
            <span>TODAY'S SCORE</span>
            <Activity className="w-4 h-4 text-[#ccff00]" />
          </div>
          <div className="text-2xl lg:text-3xl font-black font-mono-sport text-white">
            {dailyScore}
            <span className="text-xs text-zinc-500 font-normal"> / 100</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-2 font-mono-sport flex items-center gap-1">
            {todaySession ? (
              <span className="text-emerald-400 font-medium">✓ Session Completed</span>
            ) : (
              <span>No session logged yet today</span>
            )}
          </div>
        </div>

        {/* Current Training Streak */}
        <div className="bg-[#121216] border border-[#242430] p-4 rounded-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono-sport mb-2">
            <span>ACTIVE STREAK</span>
            <Flame className="w-4 h-4 text-[#ccff00] fill-[#ccff00]" />
          </div>
          <div className="text-2xl lg:text-3xl font-black font-mono-sport text-white">
            {currentStreak}
            <span className="text-xs text-zinc-500 font-normal"> DAYS</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-2 font-mono-sport">
            {currentStreak > 0 ? 'Consecutive training recorded' : 'Complete today to begin streak'}
          </div>
        </div>

        {/* Total Time Trained */}
        <div className="bg-[#121216] border border-[#242430] p-4 rounded-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono-sport mb-2">
            <span>CAREER MINUTES</span>
            <Clock className="w-4 h-4 text-[#ccff00]" />
          </div>
          <div className="text-2xl lg:text-3xl font-black font-mono-sport text-white">
            {totalMinutesTrained}
            <span className="text-xs text-zinc-500 font-normal"> MINS</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-2 font-mono-sport">
            Across {user.sessions.length} verified sessions
          </div>
        </div>

        {/* Current Football Level */}
        <div className="bg-[#121216] border border-[#242430] p-4 rounded-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono-sport mb-2">
            <span>DEVELOPMENT LEVEL</span>
            <Shield className="w-4 h-4 text-[#ccff00]" />
          </div>
          <div className="text-sm lg:text-base font-bold text-white font-display truncate">
            {level}
          </div>
          <div className="text-[10px] text-[#ccff00] mt-2 font-mono-sport truncate">
            Position: {user.position}
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Training Plan & Challenge of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Training Session Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121217] border border-[#242430] rounded-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono-sport text-[#ccff00] tracking-wider font-bold">
                  SESSION FOCUS
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  {todaySession ? "Today's Completed Session" : "Today's Prescribed Plan"}
                </h3>
              </div>
              <button
                onClick={() => navigate('/my-training')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono-sport"
              >
                <span>Full Planner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaySession ? (
              <div className="p-4 bg-[#171720] border border-[#282836] rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">{todaySession.title}</span>
                  </div>
                  <span className="text-xs font-mono-sport text-zinc-400">
                    {todaySession.durationMinutes} Minutes · RPE {todaySession.difficultyRating}/10
                  </span>
                </div>
                {todaySession.notes && (
                  <p className="text-xs text-zinc-300 italic border-l-2 border-emerald-500 pl-2.5">
                    "{todaySession.notes}"
                  </p>
                )}
                <div className="text-xs text-zinc-400 font-mono-sport">
                  {todaySession.exercises.filter(e => e.completed).length} of {todaySession.exercises.length}{' '}
                  drills marked complete.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 bg-[#171720] border border-[#242432] rounded-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Ball Mastery & Ankle Locking Rhythm</div>
                    <div className="text-[11px] text-zinc-400">
                      Technical · 15 mins · 50 touches per foot against wall
                    </div>
                  </div>
                  <span className="text-xs font-mono-sport text-[#ccff00]">INTERMEDIATE</span>
                </div>
                <div className="p-3.5 bg-[#171720] border border-[#242432] rounded-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Explosive 10m First-Step Acceleration</div>
                    <div className="text-[11px] text-zinc-400">
                      Physical · 15 mins · 8 maximal burst sprints with 60s rest
                    </div>
                  </div>
                  <span className="text-xs font-mono-sport text-[#ccff00]">ADVANCED</span>
                </div>
                <div className="p-3.5 bg-[#171720] border border-[#242432] rounded-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">45-Degree Angle Cut & Far-Post Strike</div>
                    <div className="text-[11px] text-zinc-400">
                      Finishing · 20 mins · Instep curl into side netting
                    </div>
                  </div>
                  <span className="text-xs font-mono-sport text-[#ccff00]">ADVANCED</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-mono-sport">
                    Estimated Time: 50 Mins · 4 Drills
                  </span>
                  <button
                    onClick={handleStartToday}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#ccff00] text-black text-xs font-black uppercase font-display rounded-sm hover:bg-[#b5e600]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Session Now</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Weekly Statistics Block */}
          <div className="bg-[#121217] border border-[#242430] rounded-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono-sport text-zinc-400 tracking-wider">
                  PAST 7 DAYS ACTIVITY
                </span>
                <h3 className="text-base font-bold text-white font-display">Weekly Workload Volume</h3>
              </div>
              <button
                onClick={() => navigate('/progress')}
                className="text-xs text-[#ccff00] hover:underline font-mono-sport"
              >
                Deep Analysis
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-[#16161c] border border-[#262634] rounded-sm">
                <div className="text-[10px] text-zinc-400 uppercase font-mono-sport">Sessions</div>
                <div className="text-lg font-bold text-white font-mono-sport">{weeklySessions.length}</div>
              </div>
              <div className="p-3 bg-[#16161c] border border-[#262634] rounded-sm">
                <div className="text-[10px] text-zinc-400 uppercase font-mono-sport">Minutes</div>
                <div className="text-lg font-bold text-white font-mono-sport">{weeklyMinutes}m</div>
              </div>
              <div className="p-3 bg-[#16161c] border border-[#262634] rounded-sm">
                <div className="text-[10px] text-zinc-400 uppercase font-mono-sport">Drills Done</div>
                <div className="text-lg font-bold text-white font-mono-sport">{weeklyDrillsCompleted}</div>
              </div>
            </div>

            {/* 7-Day Bar chart representation */}
            <div className="grid grid-cols-7 gap-2 pt-2 text-center">
              {past7Days.map((dStr, idx) => {
                const daySessions = user.sessions.filter(s => s.date.slice(0, 10) === dStr);
                const dayMins = daySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(dStr).getDay()];
                const isToday = dStr === now.toISOString().slice(0, 10);

                return (
                  <div key={dStr} className="space-y-1.5">
                    <div className="h-20 bg-[#171720] rounded-sm flex items-end p-1">
                      <div
                        style={{ height: `${Math.min(100, (dayMins / 60) * 100)}%` }}
                        className={`w-full rounded-xs transition-all ${
                          dayMins > 0 ? 'bg-[#ccff00]' : 'bg-transparent'
                        }`}
                      />
                    </div>
                    <div
                      className={`text-[10px] font-mono-sport ${
                        isToday ? 'text-[#ccff00] font-bold' : 'text-zinc-500'
                      }`}
                    >
                      {dayName}
                    </div>
                    <div className="text-[9px] font-mono-sport text-zinc-400">{dayMins}m</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Challenge of the Day, Personal Goals, Recovery Rec */}
        <div className="space-y-6">
          {/* CHALLENGE OF THE DAY */}
          <div className="bg-[#121217] border border-[#242430] rounded-sm p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#ccff00]" />
              <span className="text-[10px] uppercase font-mono-sport text-[#ccff00] font-bold tracking-wider">
                CHALLENGE OF THE DAY
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-display mb-1">
              {todayChallenge.title}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed mb-3">
              {todayChallenge.description}
            </p>

            <div className="p-2.5 bg-[#171720] border border-[#242430] rounded-sm mb-3">
              <div className="text-[10px] text-zinc-400 uppercase font-mono-sport">Target:</div>
              <div className="text-xs font-bold text-white font-mono-sport">{todayChallenge.target}</div>
            </div>

            <div className="text-[11px] text-zinc-400 italic mb-3">
              Tip: {todayChallenge.proTip}
            </div>

            <button
              onClick={() => completeChallenge(todayChallenge.id)}
              disabled={isChallengeCompleted}
              className={`w-full py-2 px-3 text-xs font-bold rounded-sm flex items-center justify-center gap-1.5 transition-colors ${
                isChallengeCompleted
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600 cursor-default'
                  : 'bg-[#ccff00] text-black hover:bg-[#bceb00]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isChallengeCompleted ? 'Challenge Completed!' : 'Mark Challenge Done'}</span>
            </button>
          </div>

          {/* ACTIVE GOALS SNAPSHOT */}
          <div className="bg-[#121217] border border-[#242430] rounded-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-mono-sport text-zinc-400 tracking-wider">
                CAREER TARGETS
              </span>
              <button
                onClick={() => navigate('/my-dream')}
                className="text-xs text-[#ccff00] hover:underline font-mono-sport"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {user.goals.slice(0, 2).map(goal => (
                <div key={goal.id} className="p-3 bg-[#171720] border border-[#252533] rounded-sm">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span className="truncate pr-2">{goal.title}</span>
                    <span className="text-[#ccff00] font-mono-sport">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
                    <div
                      style={{ width: `${goal.progress}%` }}
                      className="h-full bg-[#ccff00] transition-all"
                    />
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono-sport">
                    Target: {goal.targetDate} · {goal.milestones.filter(m => m.completed).length}/
                    {goal.milestones.length} milestones
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECOVERY RECOMMENDATION */}
          <div className="bg-[#121217] border border-[#242430] rounded-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#ccff00]" />
                <span className="text-[10px] uppercase font-mono-sport text-zinc-400 font-bold tracking-wider">
                  RECOVERY STATUS
                </span>
              </div>
              <button
                onClick={() => navigate('/recovery')}
                className="text-xs text-[#ccff00] hover:underline font-mono-sport"
              >
                Log Status
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-3">
              {todaySession
                ? 'High training stimulus logged today. Target 8+ hours of sleep, 3L water, and 10 minutes of hip mobility before bed.'
                : 'Your neuromuscular system is ready for intense training. Warm up properly with dynamic adductor mobility before your session.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Optimal training window active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
