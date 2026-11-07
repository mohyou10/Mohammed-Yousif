import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  Play,
  Award,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MatchPrepView: React.FC = () => {
  const { user, logSession, startWorkout } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'warmup' | 'checklist' | 'review'>('timeline');

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 'c1', text: 'Clean match boots & test stud grip on pitch surface', completed: false },
    { id: 'c2', text: 'Pack shin guards, grip socks, and tape', completed: false },
    { id: 'c3', text: 'Hydration: 500ml water + electrolytes consumed 2h prior', completed: false },
    { id: 'c4', text: 'Pre-match meal: High complex carbs, low fiber 3.5h prior', completed: false },
    { id: 'c5', text: 'Mental visualization: 10 minutes visual rehearsal of best plays', completed: false },
    { id: 'c6', text: 'Review position-specific responsibilities & set-piece duties', completed: false },
    { id: 'c7', text: 'Perform 1-clap mistake reset drill in locker room', completed: false }
  ]);

  // Post match review state
  const [tacticalRating, setTacticalRating] = useState(7);
  const [technicalRating, setTechnicalRating] = useState(8);
  const [physicalRating, setPhysicalRating] = useState(7);
  const [mentalRating, setMentalRating] = useState(8);
  const [matchNotes, setMatchNotes] = useState('');
  const [reviewSaved, setReviewSaved] = useState(false);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleStartWarmup = () => {
    startWorkout('Pre-Match FIFA 11+ Dynamic Warm-Up', 'Match Prep', [
      {
        id: 'warmup-1',
        name: 'Jogging & Dynamic Hip In/Out Mobility',
        category: 'Warmup',
        durationMinutes: 5,
        reps: '4 runs across penalty box',
        sets: 1,
        restSeconds: 20,
        difficulty: 'Beginner',
        objective: 'Lubricate synovial fluid in hip joints and raise core temperature.',
        explanation: 'Easy jog, open the gate (external rotation), close the gate (internal rotation).',
        coachTips: 'Keep chest upright, move with rhythm.'
      },
      {
        id: 'warmup-2',
        name: 'Hamstring Walking Sweeps & Adductor Lunges',
        category: 'Warmup',
        durationMinutes: 5,
        reps: '10 reps each leg',
        sets: 1,
        restSeconds: 20,
        difficulty: 'Beginner',
        objective: 'Dynamic elongation of posterior chain without passive stretching.',
        explanation: 'Heel on ground, sweep hands down to grass. Lateral lunges with weight on heels.',
        coachTips: 'Never perform static stretches before explosive match play.'
      },
      {
        id: 'warmup-3',
        name: 'Short Burst Accelerations & Decelerations',
        category: 'Warmup',
        durationMinutes: 5,
        reps: '6 progressive sprints (50% to 95%)',
        sets: 1,
        restSeconds: 30,
        difficulty: 'Intermediate',
        objective: 'Neuromuscular activation for game-speed change of pace.',
        explanation: 'Sprint 10m, brake hard in 2 steps, backpedal 5m, sprint out.',
        coachTips: 'Sink hips low when applying the deceleration brakes.'
      },
      {
        id: 'warmup-4',
        name: 'High-Tempo 2-Touch Passing Triangles',
        category: 'Warmup',
        durationMinutes: 5,
        reps: '30 crisp passes with partner or wall',
        sets: 1,
        restSeconds: 15,
        difficulty: 'Intermediate',
        objective: 'Calibrate boot contact and touch weight on the match pitch.',
        explanation: 'Firm passes with locked ankle, receive across body on the half-turn.',
        coachTips: 'Scan shoulder before receiving the return pass.'
      }
    ]);
  };

  const handleSavePostMatchReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const overallScore = Math.round(
      (tacticalRating + technicalRating + physicalRating + mentalRating) / 4
    );

    await logSession({
      title: `Match / Trial Competitive Performance`,
      type: 'Match Prep',
      durationMinutes: 90,
      difficultyRating: overallScore,
      exercises: [
        {
          id: `match-rev-${Date.now()}`,
          name: '90-Minute Competitive Match Play',
          category: 'Tactical',
          durationMinutes: 90,
          reps: 'Full Match',
          sets: 1,
          restSeconds: 0,
          difficulty: 'Pro',
          objective: 'Execute tactical role under referee and opponent pressure.',
          explanation: matchNotes || 'Full match minutes logged.',
          coachTips: `Tactical: ${tacticalRating}/10 · Technical: ${technicalRating}/10 · Physical: ${physicalRating}/10 · Mental: ${mentalRating}/10`,
          completed: true
        }
      ],
      notes: matchNotes,
      achievements: `Match Rating: ${overallScore}/10 (Tactical: ${tacticalRating}, Technical: ${technicalRating})`
    });

    setReviewSaved(true);
    setTimeout(() => setReviewSaved(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121217] border border-[#242430] p-5 lg:p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
            <span>COMPETITIVE READINESS</span>
            <span>·</span>
            <span className="text-[#ccff00] font-bold">MATCH & TRIAL PROTOCOL</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
            Match & Trial Preparation System
          </h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl">
            Pro players do not leave matchdays to chance. Follow the calibrated 24-hour countdown, dynamic FIFA 11+ warm-up, and post-match performance self-review.
          </p>
        </div>

        <button
          onClick={handleStartWarmup}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600] transition-colors shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Pre-Match Warmup</span>
        </button>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#121217] border border-[#242432] rounded-sm w-fit text-xs font-mono-sport">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3.5 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'timeline' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          24H Match Countdown
        </button>
        <button
          onClick={() => setActiveTab('warmup')}
          className={`px-3.5 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'warmup' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Dynamic Warm-Up
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-3.5 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'checklist' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Match Gear Checklist ({checklist.filter(c => c.completed).length}/{checklist.length})
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-3.5 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'review' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Post-Match Review
        </button>
      </div>

      {/* TAB 1: 24H COUNTDOWN TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-[#121217] border border-[#242430] p-6 rounded-sm space-y-5">
          <h3 className="text-base font-bold text-white font-display">
            The Professional 24-Hour Matchday Sequence
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-[#15151f] border-l-2 border-[#ccff00] rounded-sm space-y-1">
              <div className="flex items-center justify-between text-xs font-mono-sport">
                <span className="text-[#ccff00] font-bold">T - 24 HOURS (PRE-MATCH EVE)</span>
                <span className="text-zinc-400">Night Before</span>
              </div>
              <h4 className="text-sm font-bold text-white">Carbohydrate Priming & Mental Ease</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Consume high complex carbohydrate dinner (pasta, rice, sweet potato, lean poultry). Pack all gear so morning is zero-stress. 8.5 to 9 hours of uninterrupted sleep in a dark, cool room.
              </p>
            </div>

            <div className="p-4 bg-[#15151f] border-l-2 border-blue-400 rounded-sm space-y-1">
              <div className="flex items-center justify-between text-xs font-mono-sport">
                <span className="text-blue-400 font-bold">T - 3.5 HOURS</span>
                <span className="text-zinc-400">Pre-Match Meal</span>
              </div>
              <h4 className="text-sm font-bold text-white">The Final Fuel Window</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Easily digestible meal: White rice with grilled chicken breast and banana. Minimal fiber, zero heavy dairy or fried oils. Drink 500ml of water with pinch of sea salt or electrolyte.
              </p>
            </div>

            <div className="p-4 bg-[#15151f] border-l-2 border-amber-400 rounded-sm space-y-1">
              <div className="flex items-center justify-between text-xs font-mono-sport">
                <span className="text-amber-400 font-bold">T - 60 MINUTES</span>
                <span className="text-zinc-400">Pitch Arrival & Locker Room</span>
              </div>
              <h4 className="text-sm font-bold text-white">Mental Tunnel Vision & Boot Up</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Inspect pitch grass length and moisture. Lace boots firmly with grip socks. 5 minutes box breathing with eyes closed: visualize winning your first 1v1 duel and completing first 3 passes.
              </p>
            </div>

            <div className="p-4 bg-[#15151f] border-l-2 border-[#ccff00] rounded-sm space-y-1">
              <div className="flex items-center justify-between text-xs font-mono-sport">
                <span className="text-[#ccff00] font-bold">T - 25 MINUTES</span>
                <span className="text-zinc-400">Pitch Warm-Up</span>
              </div>
              <h4 className="text-sm font-bold text-white">FIFA 11+ Dynamic Muscle Activation</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Elevate heart rate progressively from 50% to 95%. High knees, deceleration stops, rapid 2-touch passing triangles, 3 short explosive sprints. Return to dressing room feeling warm and primed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC WARM-UP ROUTINE */}
      {activeTab === 'warmup' && (
        <div className="bg-[#121217] border border-[#242430] p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                FIFA 11+ Match Warm-Up Protocol (20 Mins)
              </h3>
              <p className="text-xs text-zinc-400">
                Scientifically proven to reduce ACL and groin injuries while optimizing sprint power.
              </p>
            </div>
            <button
              onClick={handleStartWarmup}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#ccff00] text-black text-xs font-black uppercase font-display rounded-sm hover:bg-[#b8e600]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Timer In Workout Runner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#15151e] border border-[#262634] rounded-sm space-y-2">
              <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
                Phase 1: Jogging & Joint Lubrication (5 Mins)
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Straight line jogging, open the gate (hip abduction), close the gate (hip adduction), sideways shuffling, and walking sweeps.
              </p>
            </div>

            <div className="p-4 bg-[#15151e] border border-[#262634] rounded-sm space-y-2">
              <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
                Phase 2: Deceleration & Cutting (5 Mins)
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Zig-zag cone deceleration, planting outer foot at 60 degrees, drop-step pivots, and core stabilization.
              </p>
            </div>

            <div className="p-4 bg-[#15151e] border border-[#262634] rounded-sm space-y-2">
              <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
                Phase 3: Ball Touch Calibration (5 Mins)
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                2-touch pass combinations, receiving on back foot, firm wall/partner strikes, and lofted driven passes.
              </p>
            </div>

            <div className="p-4 bg-[#15151e] border border-[#262634] rounded-sm space-y-2">
              <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
                Phase 4: Max Velocity Bursts (5 Mins)
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Three 15-meter sprints at 75%, 85%, and 100% velocity with full walk-back recovery. Priming fast-twitch fibers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="bg-[#121217] border border-[#242430] p-6 rounded-sm space-y-4">
          <h3 className="text-base font-bold text-white font-display">
            Pre-Match & Trial Preparation Checklist
          </h3>
          <p className="text-xs text-zinc-400">
            Never forget a piece of equipment or skip a hydration benchmark. Check every item before departing for the pitch.
          </p>

          <div className="space-y-2 pt-2">
            {checklist.map(item => (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-full p-3.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${
                  item.completed
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-zinc-400 line-through'
                    : 'bg-[#15151e] border-[#252533] text-white hover:border-zinc-500'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 shrink-0 ${
                    item.completed ? 'text-emerald-400 fill-emerald-950' : 'text-zinc-600'
                  }`}
                />
                <span className="text-xs font-mono-sport">{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: POST MATCH REVIEW */}
      {activeTab === 'review' && (
        <form onSubmit={handleSavePostMatchReview} className="bg-[#121217] border border-[#242430] p-6 rounded-sm space-y-5">
          <div>
            <span className="text-[10px] uppercase font-mono-sport text-[#ccff00] font-bold">
              POST-WHISTLE REFLECTION
            </span>
            <h3 className="text-base font-bold text-white font-display">
              Match / Trial Performance Self-Review
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Top footballers analyze their own matches within 24 hours while details are fresh. Rate your 4 performance pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#15151e] border border-[#252533] rounded-sm space-y-2">
              <div className="flex justify-between text-xs font-mono-sport">
                <span className="text-zinc-300">Tactical Discipline (Positioning & Pressing):</span>
                <span className="text-[#ccff00] font-bold">{tacticalRating}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={tacticalRating}
                onChange={e => setTacticalRating(Number(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
            </div>

            <div className="p-4 bg-[#15151e] border border-[#252533] rounded-sm space-y-2">
              <div className="flex justify-between text-xs font-mono-sport">
                <span className="text-zinc-300">Technical Execution (Passes, Touches, Shots):</span>
                <span className="text-[#ccff00] font-bold">{technicalRating}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={technicalRating}
                onChange={e => setTechnicalRating(Number(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
            </div>

            <div className="p-4 bg-[#15151e] border border-[#252533] rounded-sm space-y-2">
              <div className="flex justify-between text-xs font-mono-sport">
                <span className="text-zinc-300">Physical Workload (Sprint Intensity & Duels):</span>
                <span className="text-[#ccff00] font-bold">{physicalRating}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={physicalRating}
                onChange={e => setPhysicalRating(Number(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
            </div>

            <div className="p-4 bg-[#15151e] border border-[#252533] rounded-sm space-y-2">
              <div className="flex justify-between text-xs font-mono-sport">
                <span className="text-zinc-300">Mental Game (Reaction to Mistakes & Leadership):</span>
                <span className="text-[#ccff00] font-bold">{mentalRating}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={mentalRating}
                onChange={e => setMentalRating(Number(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-mono-sport block mb-1">
              Match Reflection Notes & Coach Takeaways:
            </label>
            <textarea
              value={matchNotes}
              onChange={e => setMatchNotes(e.target.value)}
              placeholder="e.g. Won 7 out of 9 aerial duels. Struggled with first touch when receiving facing my own goal. Need to scan twice before the ball reaches me next week..."
              rows={4}
              className="w-full p-3 bg-[#0a0a0d] border border-[#272735] text-xs text-white rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {reviewSaved ? (
              <span className="text-xs font-mono-sport text-emerald-400">
                ✓ Match performance review saved to your career history!
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600]"
            >
              Save Match Review to Career Logs
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
