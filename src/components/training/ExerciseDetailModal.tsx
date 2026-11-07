import React from 'react';
import {
  X,
  Play,
  Heart,
  CheckCircle2,
  Clock,
  Dumbbell,
  MapPin,
  ShieldAlert,
  Sparkles,
  Award
} from 'lucide-react';
import { DetailedExercise } from '../../types';
import { useApp } from '../../context/AppContext';

interface ExerciseDetailModalProps {
  exercise: DetailedExercise | null;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ exercise, onClose }) => {
  const { user, toggleFavoriteExercise, markExerciseCompleted, startSingleExercise } = useApp();

  if (!exercise) return null;

  const isFavorite = user.favoriteExerciseIds?.includes(exercise.id);
  const isCompleted = user.completedExerciseIds?.includes(exercise.id);

  const handleStart = () => {
    startSingleExercise(exercise);
    onClose();
  };

  const handleMarkComplete = async () => {
    await markExerciseCompleted(exercise.id, exercise.durationMinutes);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-theme-main border border-theme rounded-sm overflow-hidden flex flex-col max-h-[92vh] shadow-2xl">
        {/* Top Image Banner */}
        <div className="relative h-48 sm:h-64 w-full bg-zinc-900 overflow-hidden shrink-0">
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="w-full h-full object-cover object-center opacity-85 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Close & Favorite Floating Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteExercise(exercise.id)}
              className={`p-2 rounded-sm backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-[#ccff00] text-black'
                  : 'bg-black/60 text-white hover:bg-black/90'
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-sm bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title on Hero */}
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 text-[10px] font-mono-sport text-zinc-300 mb-1">
              <span className="text-[#ccff00] font-bold uppercase">{exercise.category}</span>
              <span>·</span>
              <span>{exercise.subCategory}</span>
              <span>·</span>
              <span className="text-zinc-400">{exercise.difficulty}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white font-display">
              {exercise.name}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-theme-card border border-theme rounded-sm">
              <div className="text-[10px] font-mono-sport text-theme-muted uppercase">Duration</div>
              <div className="text-sm font-bold text-theme-primary">{exercise.durationMinutes} Mins</div>
            </div>
            <div className="p-3 bg-theme-card border border-theme rounded-sm">
              <div className="text-[10px] font-mono-sport text-theme-muted uppercase">Sets & Reps</div>
              <div className="text-sm font-bold text-theme-primary">{exercise.sets} × {exercise.reps}</div>
            </div>
            <div className="p-3 bg-theme-card border border-theme rounded-sm">
              <div className="text-[10px] font-mono-sport text-theme-muted uppercase">Rest Interval</div>
              <div className="text-sm font-bold text-theme-primary">{exercise.restSeconds}s Rest</div>
            </div>
            <div className="p-3 bg-theme-card border border-theme rounded-sm">
              <div className="text-[10px] font-mono-sport text-theme-muted uppercase">Equipment</div>
              <div className="text-sm font-bold text-lime-accent truncate">{exercise.equipment}</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-theme-primary font-display uppercase tracking-wider">
              Overview & Objectives
            </h4>
            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed bg-theme-card p-3.5 rounded-sm border border-theme">
              {exercise.description}
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-theme-primary font-display uppercase tracking-wider">
              Step-by-Step Instructions
            </h4>
            <ol className="space-y-2">
              {exercise.instructions.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-theme-secondary p-2.5 bg-theme-card rounded-sm border border-theme"
                >
                  <span className="w-5 h-5 rounded-sm bg-theme-elevated text-lime-accent font-bold font-mono-sport flex items-center justify-center shrink-0 text-[11px]">
                    0{idx + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Targeted Muscles and Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-theme-card border border-theme rounded-sm space-y-2">
              <span className="text-[10px] font-mono-sport uppercase font-bold text-lime-accent block">
                Targeted Muscles & Skills:
              </span>
              <ul className="space-y-1 text-xs text-theme-secondary">
                {exercise.targetedMusclesOrSkills.map((m, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-theme-card border border-theme rounded-sm space-y-2">
              <span className="text-[10px] font-mono-sport uppercase font-bold text-theme-primary block">
                Training Benefits:
              </span>
              <ul className="space-y-1 text-xs text-theme-secondary">
                {exercise.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Safety Tips */}
          {exercise.safetyTips && exercise.safetyTips.length > 0 && (
            <div className="p-3.5 bg-theme-card border-l-2 border-amber-500 rounded-sm text-xs text-theme-secondary flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-theme-primary font-mono-sport uppercase block text-[11px] mb-0.5">
                  Safety Protocol:
                </span>
                <span>{exercise.safetyTips.join(' ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Bottom Bar */}
        <div className="p-4 bg-theme-card border-t border-theme flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteExercise(exercise.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-mono-sport border transition-colors ${
                isFavorite
                  ? 'bg-zinc-900 border-[#ccff00] text-[#ccff00]'
                  : 'bg-theme-main border-theme text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}</span>
            </button>

            <button
              onClick={handleMarkComplete}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-mono-sport border transition-colors ${
                isCompleted
                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400'
                  : 'bg-theme-main border-theme text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-400' : ''}`} />
              <span>{isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs text-theme-muted hover:text-theme-primary font-mono-sport"
            >
              Close
            </button>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-5 py-2.5 btn-lime text-xs font-black uppercase font-display rounded-sm shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Interactive Training</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
