import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Sliders,
  Plus,
  Dumbbell,
  Shield,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Exercise, TrainingSession } from '../../types';

export const TrainingPlanner: React.FC = () => {
  const { user, updateUser, startWorkout, activeWorkout } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Form state initialized with user profile
  const [formData, setFormData] = useState({
    age: user.age || 18,
    position: user.position || 'Central Midfielder',
    experience: user.experience || 'Intermediate',
    preferredFoot: user.preferredFoot || 'Right',
    availableTime: user.availableTime || 60,
    equipment: user.equipment ? user.equipment.join(', ') : 'Football, Cones, Wall',
    trainingLocation: user.trainingLocation || 'Pitch / Grass',
    daysPerWeek: user.trainingDaysPerWeek || 4,
    strengths: user.strengths ? user.strengths.join(', ') : 'Vision, Passing, Work rate',
    weaknesses: user.weaknesses ? user.weaknesses.join(', ') : 'Weak foot finishing, First 10m speed',
    goals: user.goals?.[0]?.title || 'Break into starting XI / Academy trial selection'
  });

  // Current generated training plan
  const [dailyExercises, setDailyExercises] = useState<Exercise[]>([
    {
      id: 'ex-1',
      name: 'Dynamic Football Activation & Hip Mobilization',
      category: 'Warmup',
      durationMinutes: 10,
      reps: '10 reps per side',
      sets: 2,
      restSeconds: 30,
      difficulty: 'Intermediate',
      objective: 'Prime hips, adductors, and hamstrings for explosive acceleration.',
      explanation: 'Open/close gate, lunges with torso rotation, walking sweeps, high knee acceleration strides.',
      coachTips: 'Keep chest high and core engaged. Never train cold.',
      completed: false
    },
    {
      id: 'ex-2',
      name: 'Cone Slalom to Weak-Foot Wall Ping',
      category: 'Technical',
      durationMinutes: 15,
      reps: '12 passes per foot',
      sets: 3,
      restSeconds: 45,
      difficulty: 'Intermediate',
      objective: 'Drill close ball manipulation into crisp non-dominant ankle lock.',
      explanation: 'Weave through 5 cones with dominant foot, explode out, and fire 1-touch pass into wall using non-dominant foot.',
      coachTips: 'Plant standing foot 15cm from ball pointing directly at target.',
      completed: false
    },
    {
      id: 'ex-3',
      name: 'First 10m Explosive Sprint Drive',
      category: 'Physical',
      durationMinutes: 15,
      reps: '6 maximal reps',
      sets: 2,
      restSeconds: 60,
      difficulty: 'Advanced',
      objective: 'Maximize horizontal ground force during initial 3 strides.',
      explanation: 'Staggered athletic stance, drive violently forward with 45-degree forward torso lean.',
      coachTips: 'Push the pitch away behind you. Do not stand tall prematurely.',
      completed: false
    },
    {
      id: 'ex-4',
      name: '45-Degree Angle Cut & Far-Post Curler',
      category: 'Finishing',
      durationMinutes: 15,
      reps: '8 strikes per side',
      sets: 2,
      restSeconds: 60,
      difficulty: 'Advanced',
      objective: 'Clinical edge-of-box finishing into side netting.',
      explanation: 'Touch ball out at 45 degrees, 2 setup touches, wrap foot around ball for far top-corner finish.',
      coachTips: 'Keep head steady and look at the ball at moment of impact.',
      completed: false
    },
    {
      id: 'ex-5',
      name: 'Post-Session Hamstring & Hip Decompression',
      category: 'Recovery',
      durationMinutes: 10,
      reps: 'Hold 45s each',
      sets: 2,
      restSeconds: 15,
      difficulty: 'Beginner',
      objective: 'Flush lactic acid and down-regulate sympathetic nervous system.',
      explanation: 'Half-kneeling hip flexor stretch, seated hamstring reach, box breathing.',
      coachTips: 'Deep diaphragmatic nasal breathing.',
      completed: false
    }
  ]);

  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Day 1 (Mon)', type: 'Technical', title: 'Ball Mastery, First Touch & Weak Foot Striking', durationMinutes: 60, focus: 'First touch cushion, wall passing rhythm' },
    { day: 'Day 2 (Tue)', type: 'Physical', title: 'Speed, Acceleration & Agility Deceleration', durationMinutes: 60, focus: '10m sprint bursts, 5-10-5 pro agility' },
    { day: 'Day 3 (Wed)', type: 'Tactical', title: 'Vision, Scanning & Half-Space Infiltration', durationMinutes: 50, focus: '360 shoulder scans, pocket receiving' },
    { day: 'Day 4 (Thu)', type: 'Recovery', title: 'Active Mobility, Core Stability & Foam Rolling', durationMinutes: 40, focus: 'Hip opening, ankle dorsiflexion, breathwork' },
    { day: 'Day 5 (Fri)', type: 'Match Prep', title: 'High-Tempo Finishing & Set-Piece Polish', durationMinutes: 50, focus: 'Shooting under fatigue, 1v1 isolation' },
    { day: 'Day 6 (Sat)', type: 'Technical', title: 'Match Simulation / Competitive Scrimmage', durationMinutes: 90, focus: 'Game intensity execution' },
    { day: 'Day 7 (Sun)', type: 'Recovery', title: 'Full Physiological Reset & Tactical Review', durationMinutes: 30, focus: 'Sleep optimization, match film analysis' }
  ]);

  const [monthlyThemes, setMonthlyThemes] = useState([
    { week: 'Week 1', title: 'Baseline Conditioning & Technical Precision', focus: 'Ankle locking, short passing accuracy, 10m acceleration' },
    { week: 'Week 2', title: 'High-Speed Execution & 1v1 Dominance', focus: 'Change of direction, feints, shooting under pressure' },
    { week: 'Week 3', title: 'Tactical Awareness & Positional Speed', focus: 'Half-space runs, scanning frequency, counter-pressing' },
    { week: 'Week 4', title: 'Match Sharpness & Peak Performance Taper', focus: 'High-quality explosive reps, low volume, mental focus' }
  ]);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/training/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to generate plan');
      const data = await res.json();

      if (data.dailyTrainingPlan && Array.isArray(data.dailyTrainingPlan)) {
        setDailyExercises(data.dailyTrainingPlan);
      }
      if (data.weeklySchedule && Array.isArray(data.weeklySchedule)) {
        setWeeklySchedule(data.weeklySchedule);
      }
      if (data.monthlyThemes && Array.isArray(data.monthlyThemes)) {
        setMonthlyThemes(data.monthlyThemes);
      }

      // Update user preferences
      await updateUser({
        age: Number(formData.age),
        position: formData.position as any,
        experience: formData.experience as any,
        preferredFoot: formData.preferredFoot as any,
        availableTime: Number(formData.availableTime),
        trainingDaysPerWeek: Number(formData.daysPerWeek),
        trainingLocation: formData.trainingLocation,
        strengths: formData.strengths.split(',').map(s => s.trim()),
        weaknesses: formData.weaknesses.split(',').map(s => s.trim())
      });

      setShowQuestionnaire(false);
    } catch (err) {
      console.error('Plan generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleExerciseCheck = (id: string) => {
    setDailyExercises(prev =>
      prev.map(ex => (ex.id === id ? { ...ex, completed: !ex.completed } : ex))
    );
  };

  const handleStartWorkoutRunner = () => {
    startWorkout("Today's AI Custom Training Plan", 'Technical', dailyExercises);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#121217] border border-[#242430] rounded-sm p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
            <span>AI TRAINING PLANNER</span>
            <span>·</span>
            <span className="text-[#ccff00] font-bold">{user.position}</span>
            <span>·</span>
            <span>{user.trainingDaysPerWeek} Days/Week</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
            Personalized Professional Training Curriculum
          </h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl">
            Custom engineered sessions built around your weaknesses: {user.weaknesses?.join(', ') || 'First touch, speed'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQuestionnaire(!showQuestionnaire)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs text-zinc-200 font-bold rounded-sm transition-colors font-mono-sport"
          >
            <Sliders className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>Modify Profile Inputs</span>
          </button>
          <button
            onClick={handleStartWorkoutRunner}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600] transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Live Session</span>
          </button>
        </div>
      </div>

      {/* 12-Question Diagnostic Form (Accordion/Modal) */}
      {showQuestionnaire && (
        <div className="bg-[#15151e] border border-[#2d2d3d] p-5 lg:p-6 rounded-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#242434] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                Football Profile & Training Parameters
              </h3>
              <p className="text-xs text-zinc-400">
                The AI Coach recalibrates your technical and physical load based on these 12 metrics.
              </p>
            </div>
            <button
              onClick={() => setShowQuestionnaire(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">1. Age:</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">2. Position:</label>
              <select
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value as any })}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              >
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Centre-Back">Centre-Back</option>
                <option value="Full-Back">Full-Back</option>
                <option value="Defensive Midfielder">Defensive Midfielder</option>
                <option value="Central Midfielder">Central Midfielder</option>
                <option value="Attacking Midfielder">Attacking Midfielder</option>
                <option value="Winger">Winger</option>
                <option value="Striker">Striker</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">3. Skill Level:</label>
              <select
                value={formData.experience}
                onChange={e => setFormData({ ...formData, experience: e.target.value as any })}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              >
                <option value="Beginner">Beginner / Grassroots</option>
                <option value="Intermediate">Intermediate Club Player</option>
                <option value="Advanced">Advanced High-School / Academy</option>
                <option value="Academy / Semi-Pro">Academy / Semi-Pro</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">4. Preferred Foot:</label>
              <select
                value={formData.preferredFoot}
                onChange={e => setFormData({ ...formData, preferredFoot: e.target.value as any })}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              >
                <option value="Right">Right Foot</option>
                <option value="Left">Left Foot</option>
                <option value="Both">Both (Ambidextrous)</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">5. Time Per Session (Mins):</label>
              <input
                type="number"
                value={formData.availableTime}
                onChange={e => setFormData({ ...formData, availableTime: Number(e.target.value) })}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">6. Training Days/Week:</label>
              <input
                type="number"
                min="1"
                max="7"
                value={formData.daysPerWeek}
                onChange={e => setFormData({ ...formData, daysPerWeek: Number(e.target.value) })}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-zinc-400 font-mono-sport block mb-1">7. Available Equipment:</label>
              <input
                type="text"
                value={formData.equipment}
                onChange={e => setFormData({ ...formData, equipment: e.target.value })}
                placeholder="e.g. Football, 8 cones, pitch wall, rebounder"
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">8. Training Location:</label>
              <input
                type="text"
                value={formData.trainingLocation}
                onChange={e => setFormData({ ...formData, trainingLocation: e.target.value })}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">9. Key Strengths:</label>
              <input
                type="text"
                value={formData.strengths}
                onChange={e => setFormData({ ...formData, strengths: e.target.value })}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">10. Critical Weaknesses to Fix:</label>
              <input
                type="text"
                value={formData.weaknesses}
                onChange={e => setFormData({ ...formData, weaknesses: e.target.value })}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-zinc-400 font-mono-sport block mb-1">11 & 12. Primary Football Goal & Milestone:</label>
              <input
                type="text"
                value={formData.goals}
                onChange={e => setFormData({ ...formData, goals: e.target.value })}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowQuestionnaire(false)}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="px-6 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600] disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'AI Generating Curriculum...' : 'Regenerate Plan with AI'}</span>
            </button>
          </div>
        </div>
      )}

      {/* View Tabs: Daily Session vs Weekly Schedule vs Monthly Plan */}
      <div className="flex items-center gap-1 p-1 bg-[#121217] border border-[#242432] rounded-sm w-fit text-xs font-mono-sport">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-sm font-bold transition-colors ${
            activeTab === 'daily'
              ? 'bg-[#ccff00] text-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Today's Drills ({dailyExercises.length})
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 rounded-sm font-bold transition-colors ${
            activeTab === 'weekly'
              ? 'bg-[#ccff00] text-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Weekly 7-Day Schedule
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2 rounded-sm font-bold transition-colors ${
            activeTab === 'monthly'
              ? 'bg-[#ccff00] text-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Monthly Development Microcycle
        </button>
      </div>

      {/* TAB 1: DAILY TRAINING EXERCISES */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono-sport">
            <span>
              {dailyExercises.filter(e => e.completed).length} of {dailyExercises.length} Drills Complete
            </span>
            <span>
              Total Duration: {dailyExercises.reduce((a, b) => a + (b.durationMinutes || 0), 0)} Mins
            </span>
          </div>

          <div className="space-y-3">
            {dailyExercises.map((drill, index) => (
              <div
                key={drill.id || index}
                className={`bg-[#121217] border p-4 rounded-sm transition-all ${
                  drill.completed ? 'border-emerald-700/60 bg-[#121815]' : 'border-[#242432]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleExerciseCheck(drill.id)}
                      className="mt-0.5 shrink-0"
                    >
                      <CheckCircle2
                        className={`w-5 h-5 transition-colors ${
                          drill.completed ? 'text-emerald-400 fill-emerald-950' : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                      />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono-sport font-bold uppercase text-[#ccff00]">
                          {drill.category}
                        </span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-[10px] font-mono-sport text-zinc-400">
                          {drill.difficulty}
                        </span>
                      </div>
                      <h3
                        className={`text-sm lg:text-base font-bold font-display ${
                          drill.completed ? 'text-zinc-400 line-through' : 'text-white'
                        }`}
                      >
                        {drill.name}
                      </h3>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                        {drill.explanation}
                      </p>
                      {drill.coachTips && (
                        <div className="mt-2.5 text-[11px] text-zinc-300 bg-[#16161f] border-l-2 border-[#ccff00] p-2.5 rounded-sm">
                          <span className="text-[#ccff00] font-bold font-mono-sport">COACH CUE: </span>
                          {drill.coachTips}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Drill Parameters */}
                  <div className="shrink-0 flex md:flex-col items-end gap-2 text-xs font-mono-sport">
                    <span className="px-2.5 py-1 bg-[#171720] border border-[#262634] rounded-sm text-zinc-300">
                      {drill.durationMinutes} mins
                    </span>
                    <span className="text-zinc-400 text-[11px]">
                      {drill.sets} sets × {drill.reps}
                    </span>
                    <span className="text-zinc-500 text-[10px]">{drill.restSeconds}s rest</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: WEEKLY SCHEDULE */}
      {activeTab === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weeklySchedule.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#121217] border border-[#242432] p-4 rounded-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono-sport">{item.day}</span>
                <span
                  className={`text-[10px] font-mono-sport uppercase font-bold px-2 py-0.5 rounded-xs ${
                    item.type === 'Recovery'
                      ? 'bg-blue-950/50 text-blue-400 border border-blue-800'
                      : item.type === 'Match Prep'
                      ? 'bg-amber-950/50 text-amber-400 border border-amber-800'
                      : 'bg-zinc-800 text-[#ccff00]'
                  }`}
                >
                  {item.type}
                </span>
              </div>
              <h4 className="text-sm font-bold text-zinc-200 font-display">{item.title}</h4>
              <p className="text-xs text-zinc-400">{item.focus}</p>
              <div className="pt-2 text-[10px] text-zinc-500 font-mono-sport flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{item.durationMinutes} minutes scheduled</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MONTHLY DEVELOPMENT PLAN */}
      {activeTab === 'monthly' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthlyThemes.map((theme, idx) => (
            <div
              key={idx}
              className="bg-[#121217] border border-[#242432] p-5 rounded-sm space-y-2 relative"
            >
              <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
                {theme.week} Microcycle
              </span>
              <h4 className="text-base font-bold text-white font-display">{theme.title}</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{theme.focus}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
