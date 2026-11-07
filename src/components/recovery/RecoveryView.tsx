import React, { useState } from 'react';
import {
  HeartPulse,
  Droplets,
  Moon,
  Activity,
  AlertTriangle,
  Play,
  CheckCircle2,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RecoveryView: React.FC = () => {
  const { user, logRecovery, startWorkout } = useApp();

  const [sleepHours, setSleepHours] = useState(8);
  const [soreness, setSoreness] = useState(2); // 1 (none) to 5 (extreme)
  const [hydrationLiters, setHydrationLiters] = useState(2.5);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute calculated recovery score (0 to 100)
  // 8h sleep = 40 pts, soreness 1-5 (50 pts max when 1), hydration 2.5L+ = 10 pts
  const calculatedScore = Math.min(
    100,
    Math.round(
      Math.min(40, (sleepHours / 8) * 40) +
        Math.max(10, (6 - soreness) * 10) +
        Math.min(10, (hydrationLiters / 3) * 10)
    )
  );

  const handleLogRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    await logRecovery({
      sleepHours,
      sorenessLevel: soreness,
      hydrationLiters,
      score: calculatedScore,
      notes: notes.trim() || undefined
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleStartMobility = () => {
    startWorkout('Full Body Post-Match Mobility & Decompression', 'Recovery', [
      {
        id: 'rec-1',
        name: 'Half-Kneeling Hip Flexor & Psoas Opener',
        category: 'Recovery',
        durationMinutes: 4,
        reps: 'Hold 60s per side',
        sets: 2,
        restSeconds: 15,
        difficulty: 'Beginner',
        objective: 'Relieve hip tightness caused by intense kicking and sprinting.',
        explanation: 'Kneel on back knee, tuck tailbone under, gently push hips forward while raising opposite arm.',
        coachTips: 'Do not arch lower back. Squeeze glute of trailing leg.'
      },
      {
        id: 'rec-2',
        name: '90/90 Hip Internal & External Rotations',
        category: 'Recovery',
        durationMinutes: 4,
        reps: '10 smooth transitions per side',
        sets: 2,
        restSeconds: 15,
        difficulty: 'Intermediate',
        objective: 'Restore rotational freedom to hip capsules for cutting agility.',
        explanation: 'Sit with both legs bent at 90 degrees on the floor, rotate knees side to side with upright spine.',
        coachTips: 'Keep chest proud and breathe through your nose.'
      },
      {
        id: 'rec-3',
        name: 'Adductor Frog Stretch with Gentle Rocking',
        category: 'Recovery',
        durationMinutes: 3,
        reps: 'Hold 90 seconds',
        sets: 1,
        restSeconds: 15,
        difficulty: 'Intermediate',
        objective: 'Prevent groin pulls and maintain wide passing range.',
        explanation: 'Knees wide on pitch grass or mat, inner feet flat, rock hips gently backward.',
        coachTips: 'Never force past mild discomfort.'
      },
      {
        id: 'rec-4',
        name: 'Calf & Achilles Wall Stretch',
        category: 'Recovery',
        durationMinutes: 3,
        reps: 'Hold 45s per foot',
        sets: 2,
        restSeconds: 10,
        difficulty: 'Beginner',
        objective: 'Decompress calves following high acceleration and braking forces.',
        explanation: 'Hands on wall, back leg straight with heel grounded firmly. Repeat with knee slightly bent.',
        coachTips: 'Keep back heel glued to the floor.'
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121217] border border-[#242430] p-5 lg:p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
            <span>PHYSIOLOGICAL RESTORATION</span>
            <span>·</span>
            <span className="text-[#ccff00] font-bold">RECOVERY & HEALTH</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
            Athlete Recovery & Injury Prevention Center
          </h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl">
            Training breaks muscle tissue down; recovery rebuilds you faster and stronger. Track sleep, soreness, and execute guided hip and ankle mobility.
          </p>
        </div>

        <button
          onClick={handleStartMobility}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600] transition-colors shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch 14-Min Mobility Routine</span>
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 bg-[#14141d] border-l-2 border-red-500 rounded-sm text-xs text-zinc-300 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white uppercase font-mono-sport block mb-0.5">
            Injury Prevention & Safety Directive:
          </span>
          Always listen to acute physical signals. If you experience sharp joint pain, swelling, dizziness, or chest tightness, STOP exercising immediately and consult a qualified physiotherapist or physician. Never train through sharp structural pain.
        </div>
      </div>

      {/* Grid: Daily Recovery Calculator & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recovery Calculator */}
        <form
          onSubmit={handleLogRecovery}
          className="lg:col-span-2 bg-[#121217] border border-[#242430] p-6 rounded-sm space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#22222e] pb-3">
            <div>
              <span className="text-[10px] uppercase font-mono-sport text-[#ccff00] font-bold">
                DAILY READINESS METRICS
              </span>
              <h3 className="text-base font-bold text-white font-display">
                Calculate Today's Recovery Index
              </h3>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black font-mono-sport text-[#ccff00]">
                {calculatedScore} / 100
              </div>
              <div className="text-[10px] text-zinc-400 font-mono-sport">Readiness Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sleep */}
            <div className="p-4 bg-[#15151e] border border-[#252533] rounded-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-sport">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sleep:</span>
                </span>
                <span className="text-white font-bold">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={e => setSleepHours(Number(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
              <span className="text-[10px] text-zinc-500 font-mono-sport block">
                Target: 8-9 hours deep sleep
              </span>
            </div>

            {/* Soreness */}
            <div className="p-4 bg-[#15151e] border border-[#252533] rounded-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-sport">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Soreness:</span>
                </span>
                <span className="text-white font-bold">{soreness} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={soreness}
                onChange={e => setSoreness(Number(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
              <span className="text-[10px] text-zinc-500 font-mono-sport block">
                1: Fresh · 5: Extreme DOMS
              </span>
            </div>

            {/* Hydration */}
            <div className="p-4 bg-[#15151e] border border-[#252533] rounded-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-sport">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hydration:</span>
                </span>
                <span className="text-white font-bold">{hydrationLiters}L</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.25"
                value={hydrationLiters}
                onChange={e => setHydrationLiters(Number(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
              <span className="text-[10px] text-zinc-500 font-mono-sport block">
                Target: 2.5 - 3.5L daily
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-mono-sport block mb-1">
              Recovery Notes (Muscles tight, fatigue level, nutrition):
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Left hamstring slightly tight after yesterday's sprint drills..."
              className="w-full p-2.5 bg-[#0a0a0d] border border-[#272735] text-xs text-white rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess && (
              <span className="text-xs font-mono-sport text-emerald-400">
                ✓ Daily recovery score logged to database!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600]"
            >
              Log Daily Recovery Status
            </button>
          </div>
        </form>

        {/* Right Col: Science-Backed Protocols */}
        <div className="space-y-4">
          <div className="bg-[#121217] border border-[#242430] p-5 rounded-sm space-y-3">
            <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
              REST-DAY PROTOCOL
            </span>
            <h4 className="text-sm font-bold text-white font-display">Active Recovery Guidelines</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Complete rest does not mean staying in bed all day. 20 minutes of brisk walking, light swimming, or mobility work flushes metabolic waste twice as fast as complete immobility.
            </p>
          </div>

          <div className="bg-[#121217] border border-[#242430] p-5 rounded-sm space-y-3">
            <span className="text-[10px] font-mono-sport uppercase font-bold text-blue-400">
              SLEEP SANCTUARY
            </span>
            <h4 className="text-sm font-bold text-white font-display">Growth Hormone Windows</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              95% of human growth hormone is secreted during slow-wave non-REM sleep. Stop looking at screens 45 minutes before sleep to avoid melatonin suppression.
            </p>
          </div>

          <div className="bg-[#121217] border border-[#242430] p-5 rounded-sm space-y-3">
            <span className="text-[10px] font-mono-sport uppercase font-bold text-cyan-400">
              ELECTROLYTE REHYDRATION
            </span>
            <h4 className="text-sm font-bold text-white font-display">Sodium & Potassium Balance</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Water alone does not fully rehydrate muscle cells. Always include a pinch of unrefined sea salt or coconut water to replenish electrolyte ions lost in sweat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
