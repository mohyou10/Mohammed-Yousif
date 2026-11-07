import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  CheckCircle2,
  Play,
  Clock,
  Dumbbell,
  Shield,
  Layers,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Check,
  Save,
  Share2,
  Calendar,
  Zap,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_EXERCISES } from '../data/exercisesData';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { DetailedExercise } from '../types';

export const ExerciseDetailPage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const {
    user,
    toggleFavoriteExercise,
    markExerciseCompleted,
    startSingleExercise,
    activeWorkout
  } = useApp();

  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find exercise in library
  const exercise = ALL_EXERCISES.find(e => e.id === exerciseId) || ALL_EXERCISES[0];

  const isFavorite = user.favoriteExerciseIds?.includes(exercise.id);
  const isCompleted = user.completedExerciseIds?.includes(exercise.id);

  // Load existing personal notes if any
  useEffect(() => {
    const savedNotes = localStorage.getItem(`pro11_notes_${exercise.id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [exercise.id]);

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`pro11_notes_${exercise.id}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Related drills in same category
  const relatedDrills = ALL_EXERCISES
    .filter(e => e.id !== exercise.id && (e.category === exercise.category || e.subCategory === exercise.subCategory))
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-theme">
        <Link
          to="/trainings"
          className="inline-flex items-center gap-2 text-xs font-mono-sport uppercase tracking-wider text-theme-muted hover:text-[#ccff00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercise Library</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xs bg-theme-card border border-theme hover:border-[#ccff00] text-theme-secondary hover:text-theme-primary text-xs font-mono-sport flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy direct drill link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-lime-accent" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => toggleFavoriteExercise(exercise.id)}
            className={`px-3 py-1.5 rounded-xs border text-xs font-mono-sport flex items-center gap-1.5 transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-950/40 border-rose-500 text-rose-400 font-bold'
                : 'bg-theme-card border-theme text-theme-secondary hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
          </button>

          {/* Mark Completed Toggle */}
          <button
            onClick={() => markExerciseCompleted(exercise.id)}
            className={`px-3 py-1.5 rounded-xs border text-xs font-mono-sport flex items-center gap-1.5 transition-colors cursor-pointer ${
              isCompleted
                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400 font-bold'
                : 'bg-theme-card border-theme text-theme-secondary hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
          </button>
        </div>
      </div>

      {/* 1. TOP SECTION: Title, Badges, Summary */}
      <div className="bg-theme-card border border-theme rounded-sm p-6 lg:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-sport">
              <span className="px-2.5 py-0.5 rounded-xs bg-[#ccff00] text-black font-black uppercase">
                {exercise.subCategory}
              </span>
              <span className="px-2.5 py-0.5 rounded-xs bg-theme-elevated border border-theme text-theme-secondary uppercase">
                {exercise.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-xs bg-theme-elevated border border-theme text-theme-secondary uppercase">
                {exercise.difficulty}
              </span>
              <span className="px-2.5 py-0.5 rounded-xs bg-theme-elevated border border-theme text-theme-secondary uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-lime-accent" />
                {exercise.durationMinutes} Mins
              </span>
              <span className="px-2.5 py-0.5 rounded-xs bg-theme-elevated border border-theme text-theme-secondary uppercase">
                {exercise.location}
              </span>
            </div>

            {/* Exercise Title */}
            <h1 className="text-2xl lg:text-4xl font-black font-display text-theme-primary uppercase tracking-tight">
              {exercise.name}
            </h1>

            {/* Description */}
            <p className="text-sm lg:text-base text-theme-secondary leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* Quick Launch Call-To-Action */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            <button
              onClick={() => startSingleExercise(exercise)}
              className="w-full py-3.5 px-6 bg-[#ccff00] hover:bg-[#b8e600] text-black font-black font-display text-sm uppercase rounded-sm flex items-center justify-center gap-2 shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{activeWorkout.isActive ? 'Resume Session' : 'Start Training'}</span>
            </button>
            <div className="text-center text-[11px] font-mono-sport text-theme-muted">
              {exercise.sets} Sets × {exercise.reps} · {exercise.restSeconds}s Rest
            </div>
          </div>
        </div>
      </div>

      {/* 2. VIDEO SECTION: Large High-Performance 4K/1080p Video Player */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-pulse" />
            <h2 className="text-sm font-bold text-theme-primary font-display uppercase tracking-wider">
              Instructional Video Demonstration
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-sport text-theme-muted">
            <span className="text-lime-accent font-bold">4K ULTRA HD</span>
            <span>/</span>
            <span>1080P HD FLUID</span>
          </div>
        </div>

        <VideoPlayer
          src1080p={exercise.videoInfo?.url1080p || exercise.videoUrl}
          src4k={exercise.videoInfo?.url4k}
          youtubeVideoId={exercise.youtubeVideoId}
          youtubeVideoUrl={exercise.youtubeVideoUrl}
          videoAuthor={exercise.videoAuthor}
          exerciseId={exercise.id}
          poster={exercise.imageUrl}
          title={exercise.name}
          instructions={exercise.instructions}
          tips={exercise.proTips || exercise.benefits}
          durationMinutes={exercise.durationMinutes}
        />
      </div>

      {/* 3. TRAINING INFORMATION METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-theme-card border border-theme rounded-sm">
          <div className="text-[10px] text-theme-muted uppercase font-mono-sport mb-1">Target Volume</div>
          <div className="text-base font-bold text-theme-primary font-mono-sport">
            {exercise.sets} Sets × {exercise.reps}
          </div>
          <div className="text-[10px] text-theme-muted mt-0.5">Strict execution speed</div>
        </div>

        <div className="p-4 bg-theme-card border border-theme rounded-sm">
          <div className="text-[10px] text-theme-muted uppercase font-mono-sport mb-1">Rest Interval</div>
          <div className="text-base font-bold text-lime-accent font-mono-sport">
            {exercise.restSeconds} Seconds
          </div>
          <div className="text-[10px] text-theme-muted mt-0.5">High neuromuscular recovery</div>
        </div>

        <div className="p-4 bg-theme-card border border-theme rounded-sm">
          <div className="text-[10px] text-theme-muted uppercase font-mono-sport mb-1">Required Equipment</div>
          <div className="text-base font-bold text-theme-primary font-display truncate">
            {exercise.equipment}
          </div>
          <div className="text-[10px] text-theme-muted mt-0.5">{exercise.location}</div>
        </div>

        <div className="p-4 bg-theme-card border border-theme rounded-sm">
          <div className="text-[10px] text-theme-muted uppercase font-mono-sport mb-1">Difficulty Tier</div>
          <div className="text-base font-bold text-theme-primary font-display">
            {exercise.difficulty.toUpperCase()}
          </div>
          <div className="text-[10px] text-theme-muted mt-0.5">Recommended {exercise.durationMinutes} mins</div>
        </div>
      </div>

      {/* 4. INSTRUCTIONS SECTION: Step-by-Step, Correct Technique, Common Mistakes & Pro Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Step-by-Step Instructions & Mistakes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step-by-Step Instructions */}
          <div className="bg-theme-card border border-theme p-6 rounded-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-theme pb-3">
              <Layers className="w-4 h-4 text-lime-accent" />
              <h3 className="text-sm font-bold text-theme-primary font-display uppercase tracking-wide">
                Step-by-Step Movement Instructions
              </h3>
            </div>

            <div className="space-y-3.5">
              {exercise.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xs bg-theme-elevated border border-theme">
                  <div className="w-7 h-7 rounded-xs bg-[#ccff00] text-black font-black font-mono-sport text-xs flex items-center justify-center shrink-0">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-theme-primary leading-relaxed pt-1">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes & Coach Fixes */}
          <div className="bg-theme-card border border-theme p-6 rounded-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-theme pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-theme-primary font-display uppercase tracking-wide">
                Common Technical Mistakes & Fixes
              </h3>
            </div>

            <div className="space-y-3">
              {(exercise.commonMistakes && exercise.commonMistakes.length > 0 ? exercise.commonMistakes : [
                'Collapsing the plant foot ankle upon impact',
                'Leaning back during the strike causing ball to fly over target',
                'Rushing the repetition before body is completely balanced'
              ]).map((mistake, idx) => (
                <div key={idx} className="p-3.5 rounded-xs bg-amber-950/20 border border-amber-900/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-display">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>MISTAKE {idx + 1}: {mistake}</span>
                  </div>
                  <div className="text-xs text-theme-secondary pl-3.5 border-l border-amber-500/40 italic">
                    Coach Fix: Lock ankle joint rigid, keep chin tucked, and follow through toward target corner.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Athlete Personal Notes */}
          <form onSubmit={handleSaveNotes} className="bg-theme-card border border-theme p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <h3 className="text-sm font-bold text-theme-primary font-display uppercase tracking-wide">
                Athlete Training Notes & Cues
              </h3>
              {notesSaved && (
                <span className="text-xs font-mono-sport text-emerald-400 flex items-center gap-1 font-bold">
                  <Check className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Record personal cues (e.g., 'Plant foot 12cm beside ball', 'Focus on 45-degree angle setup touch', 'Reps felt sharpest on left foot')..."
              rows={3}
              className="w-full bg-theme-elevated border border-theme rounded-xs p-3 text-xs text-theme-primary placeholder-theme-muted focus:outline-hidden focus:border-[#ccff00]"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-theme-elevated border border-theme hover:border-[#ccff00] text-theme-primary hover:text-[#ccff00] text-xs font-mono-sport uppercase font-bold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Targeted Muscles, Benefits, Safety & Pro Tips */}
        <div className="space-y-6">
          {/* Targeted Muscles or Skills */}
          <div className="bg-theme-card border border-theme p-6 rounded-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-theme pb-2.5">
              <Target className="w-4 h-4 text-lime-accent" />
              <h4 className="text-xs font-bold text-theme-primary uppercase font-mono-sport">
                Targeted Muscles & Skills
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exercise.targetedMusclesOrSkills.map((m, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-xs bg-theme-elevated border border-theme text-xs font-mono-sport text-theme-primary"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Training Benefits */}
          <div className="bg-theme-card border border-theme p-6 rounded-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-theme pb-2.5">
              <Sparkles className="w-4 h-4 text-lime-accent" />
              <h4 className="text-xs font-bold text-theme-primary uppercase font-mono-sport">
                Verified Football Benefits
              </h4>
            </div>
            <div className="space-y-2">
              {exercise.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-theme-secondary">
                  <Check className="w-3.5 h-3.5 text-lime-accent shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Protocol */}
          <div className="bg-theme-card border border-theme p-6 rounded-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-theme pb-2.5">
              <Shield className="w-4 h-4 text-lime-accent" />
              <h4 className="text-xs font-bold text-theme-primary uppercase font-mono-sport">
                Safety Protocol & Biomechanics
              </h4>
            </div>
            <div className="space-y-2">
              {exercise.safetyTips.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-theme-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-accent shrink-0 mt-1.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Professional UEFA Pro Tips */}
          <div className="bg-theme-card border border-theme p-6 rounded-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-theme pb-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-theme-primary uppercase font-mono-sport">
                UEFA Pro Master Tips
              </h4>
            </div>
            <p className="text-xs text-theme-secondary leading-relaxed italic">
              &ldquo;{exercise.proTips?.[0] || 'Quality of repetition always trumps quantity. Perform every rep with match-day pace, match-day intensity, and 100% focus.'}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* 5. RELATED DRILLS IN THIS CATEGORY */}
      {relatedDrills.length > 0 && (
        <div className="pt-6 border-t border-theme space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-theme-primary font-display uppercase tracking-wide">
              More {exercise.subCategory} Training Drills
            </h3>
            <Link
              to={`/trainings?category=${encodeURIComponent(exercise.subCategory)}`}
              className="text-xs font-mono-sport text-lime-accent hover:underline uppercase"
            >
              View All {exercise.subCategory} ({ALL_EXERCISES.filter(e => e.subCategory === exercise.subCategory).length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedDrills.map((rel) => (
              <Link
                key={rel.id}
                to={`/trainings/${rel.id}`}
                className="group bg-theme-card border border-theme hover:border-[#ccff00] rounded-sm overflow-hidden flex flex-col transition-all"
              >
                <div className="relative h-32 w-full overflow-hidden bg-black">
                  <img
                    src={rel.imageUrl}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-black/80 text-[10px] font-mono-sport text-[#ccff00] font-bold">
                    4K VIDEO
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-xs bg-black/80 text-[10px] font-mono-sport text-theme-secondary">
                    {rel.durationMinutes}m
                  </div>
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono-sport text-theme-muted uppercase mb-1">
                      {rel.difficulty} · {rel.category}
                    </div>
                    <div className="text-xs font-bold text-theme-primary font-display group-hover:text-lime-accent transition-colors line-clamp-1">
                      {rel.name}
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] font-mono-sport text-lime-accent flex items-center justify-between">
                    <span>View Drill</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
