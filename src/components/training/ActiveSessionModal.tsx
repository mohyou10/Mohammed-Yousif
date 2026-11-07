import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Dumbbell,
  Clock,
  Flame,
  Award,
  Coffee
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ActiveSessionModal: React.FC = () => {
  const {
    activeWorkout,
    pauseWorkout,
    resumeWorkout,
    cancelWorkout,
    toggleActiveExercise,
    nextExercise,
    prevExercise,
    finishWorkout,
    startRestTimer
  } = useApp();

  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [rpe, setRpe] = useState(7);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeWorkout.isActive) return null;

  const currentExercise = activeWorkout.exercises[activeWorkout.currentExerciseIndex] || {
    id: 'placeholder',
    name: 'General Warm-up and Ball Mastery',
    category: 'Technical',
    durationMinutes: 15,
    reps: '15 reps',
    sets: 3,
    restSeconds: 45,
    objective: 'Build muscle memory and sharp technical rhythm',
    explanation: 'Stay on the balls of your feet and maintain high ball speed.',
    coachTips: 'Lock ankle upon impact. Keep your eye on the ball.'
  };

  const isCurrentCompleted = activeWorkout.completedExerciseIds.includes(currentExercise.id);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await finishWorkout(rpe, notes);
      setShowFinishDialog(false);
    } catch (err) {
      console.error('Failed to save session:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-theme-main border border-theme rounded-sm overflow-hidden flex flex-col max-h-[92vh] shadow-2xl">
        {/* Top bar */}
        <div className="px-5 py-3.5 bg-theme-card border-b border-theme flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-ping" />
            <div>
              <div className="text-[10px] uppercase font-mono-sport text-lime-accent tracking-wider font-bold">
                LIVE TRAINING SESSION
              </div>
              <h2 className="text-sm sm:text-base font-bold text-theme-primary tracking-tight">
                {activeWorkout.sessionTitle}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFinishDialog(true)}
              className="px-3.5 py-1.5 btn-lime font-black text-xs uppercase font-display rounded-sm shadow-sm"
            >
              Complete Workout
            </button>
            <button
              onClick={cancelWorkout}
              className="p-1.5 text-theme-muted hover:text-theme-primary rounded-sm hover:bg-theme-elevated"
              title="Cancel session without saving"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stopwatch & Stats Bar */}
        <div className="px-5 py-4 bg-theme-elevated border-b border-theme grid grid-cols-3 gap-4 items-center">
          {/* Timer Display */}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-lime-accent" />
            <div>
              <div className="text-[10px] font-mono-sport text-theme-muted uppercase">Elapsed Time</div>
              <div className="text-xl sm:text-2xl font-black font-mono-sport text-theme-primary tracking-wider">
                {formatTime(activeWorkout.secondsElapsed)}
              </div>
            </div>
          </div>

          {/* Drill Progress & Rest Status */}
          <div className="text-center">
            {activeWorkout.isResting ? (
              <div className="animate-pulse">
                <div className="text-[10px] font-mono-sport text-cyan-400 font-bold uppercase flex items-center justify-center gap-1">
                  <Coffee className="w-3 h-3" />
                  <span>REST PERIOD</span>
                </div>
                <div className="text-lg font-black font-mono-sport text-cyan-400">
                  {activeWorkout.restSecondsRemaining}s left
                </div>
              </div>
            ) : (
              <div>
                <div className="text-[10px] font-mono-sport text-theme-muted uppercase">Drills Completed</div>
                <div className="text-sm sm:text-base font-bold text-theme-primary font-mono-sport">
                  <span className="text-lime-accent">{activeWorkout.completedExerciseIds.length}</span> /{' '}
                  {activeWorkout.exercises.length}
                </div>
              </div>
            )}
          </div>

          {/* Timer Play/Pause & Rest Controls */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => startRestTimer(currentExercise.restSeconds || 45)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-theme-card hover:bg-theme-main border border-theme text-[11px] font-mono-sport font-bold rounded-sm text-theme-secondary hover:text-theme-primary"
              title="Start Rest Timer"
            >
              <Coffee className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rest ({currentExercise.restSeconds || 45}s)</span>
            </button>

            {activeWorkout.isPaused ? (
              <button
                onClick={resumeWorkout}
                className="flex items-center gap-1.5 px-3 py-1.5 btn-lime text-xs font-bold rounded-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </button>
            ) : (
              <button
                onClick={pauseWorkout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-theme-card text-theme-primary text-xs font-bold rounded-sm border border-theme hover:bg-theme-main"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Drill Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-sport text-theme-secondary">
              Drill {activeWorkout.currentExerciseIndex + 1} of {activeWorkout.exercises.length} ·{' '}
              <span className="text-lime-accent uppercase font-bold">{currentExercise.category}</span>
            </span>
            <button
              onClick={() => toggleActiveExercise(currentExercise.id)}
              className={`flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-bold transition-all ${
                isCurrentCompleted
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600'
                  : 'bg-theme-card text-theme-primary border border-theme hover:border-zinc-500'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCurrentCompleted ? 'text-emerald-400' : 'text-theme-muted'}`} />
              <span>{isCurrentCompleted ? 'Completed' : 'Mark Drill Complete'}</span>
            </button>
          </div>

          <div className="bg-theme-card border border-theme p-4 rounded-sm">
            <h3 className="text-base sm:text-lg font-bold text-theme-primary font-display mb-1">
              {currentExercise.name}
            </h3>
            <p className="text-xs text-theme-secondary mb-4">{currentExercise.objective}</p>

            {/* Drill Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="p-2.5 bg-theme-elevated border border-theme rounded-sm">
                <div className="text-[10px] text-theme-muted uppercase font-mono-sport">Duration</div>
                <div className="text-xs font-bold text-theme-primary">{currentExercise.durationMinutes} Mins</div>
              </div>
              <div className="p-2.5 bg-theme-elevated border border-theme rounded-sm">
                <div className="text-[10px] text-theme-muted uppercase font-mono-sport">Sets & Reps</div>
                <div className="text-xs font-bold text-theme-primary">
                  {currentExercise.sets} Sets × {currentExercise.reps}
                </div>
              </div>
              <div className="p-2.5 bg-theme-elevated border border-theme rounded-sm">
                <div className="text-[10px] text-theme-muted uppercase font-mono-sport">Rest Interval</div>
                <div className="text-xs font-bold text-theme-primary">{currentExercise.restSeconds}s Rest</div>
              </div>
              <div className="p-2.5 bg-theme-elevated border border-theme rounded-sm">
                <div className="text-[10px] text-theme-muted uppercase font-mono-sport">Difficulty</div>
                <div className="text-xs font-bold text-lime-accent">{currentExercise.difficulty}</div>
              </div>
            </div>

            {/* Execution Instructions */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-bold uppercase text-theme-muted tracking-wider font-mono-sport block mb-1">
                  Step-by-Step Execution:
                </span>
                <p className="text-theme-secondary leading-relaxed bg-theme-elevated p-3 rounded-sm border border-theme">
                  {currentExercise.explanation}
                </p>
              </div>

              {currentExercise.coachTips && (
                <div>
                  <span className="text-[11px] font-bold uppercase text-lime-accent tracking-wider font-mono-sport block mb-1">
                    AI Coach Mechanical Cue:
                  </span>
                  <p className="text-theme-secondary leading-relaxed bg-theme-elevated border-l-2 border-[#ccff00] p-3 rounded-sm">
                    {currentExercise.coachTips}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Drill Pagination Bar */}
        <div className="p-4 bg-theme-card border-t border-theme flex items-center justify-between">
          <button
            onClick={prevExercise}
            disabled={activeWorkout.currentExerciseIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-theme-elevated text-xs font-bold text-theme-primary border border-theme disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-main"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Drill</span>
          </button>

          <span className="text-xs text-theme-muted font-mono-sport">
            {activeWorkout.currentExerciseIndex + 1} / {activeWorkout.exercises.length}
          </span>

          <button
            onClick={nextExercise}
            disabled={activeWorkout.currentExerciseIndex === activeWorkout.exercises.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-sm btn-lime text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next Drill</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion Modal Dialog */}
      {showFinishDialog && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-theme-main border border-theme rounded-sm p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-lime-accent" />
              <div>
                <h3 className="text-base font-bold text-theme-primary font-display">Log & Finish Session</h3>
                <p className="text-xs text-theme-muted">Save verified workout metrics to your career database.</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-theme-muted font-mono-sport">Rate Perceived Exertion (RPE 1-10):</span>
                <span className="text-lime-accent font-bold font-mono-sport">{rpe}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={rpe}
                onChange={e => setRpe(parseInt(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
              <div className="flex justify-between text-[10px] text-theme-muted font-mono-sport mt-1">
                <span>1 - Very Light</span>
                <span>5 - Moderate</span>
                <span>10 - Maximal Match Pace</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-theme-muted font-mono-sport block mb-1">
                Session Notes & Breakthroughs:
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Ball striking felt sharp today, completed all weak-foot sets without losing rhythm..."
                rows={3}
                className="w-full p-2.5 bg-theme-card border border-theme text-xs text-theme-primary rounded-sm focus:border-[#ccff00] focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFinishDialog(false)}
                className="px-3.5 py-1.5 text-xs text-theme-muted hover:text-theme-primary"
              >
                Back to Drill
              </button>
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="px-4 py-2 btn-lime font-bold text-xs uppercase font-display rounded-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save & Log to Career'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
