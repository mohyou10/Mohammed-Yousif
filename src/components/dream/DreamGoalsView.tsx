import React, { useState } from 'react';
import {
  Flag,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  Calendar,
  Target,
  Trash2,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlayerGoal } from '../../types';

export const DreamGoalsView: React.FC = () => {
  const { user, addGoal, updateGoal, deleteGoal } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Career');
  const [newTargetDate, setNewTargetDate] = useState('2026-12-31');
  const [newMilestones, setNewMilestones] = useState(['', '', '']);
  const [newAiTip, setNewAiTip] = useState('');

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const milestonesList = newMilestones
      .filter(m => m.trim().length > 0)
      .map(m => ({ text: m.trim(), completed: false }));

    await addGoal({
      title: newTitle.trim(),
      category: newCategory,
      targetDate: newTargetDate,
      progress: 0,
      milestones: milestonesList.length > 0 ? milestonesList : [{ text: 'Initiate daily practice habit', completed: false }],
      aiTip: newAiTip.trim() || 'Break big ambitions into non-negotiable daily training repetitions.'
    });

    setNewTitle('');
    setNewMilestones(['', '', '']);
    setNewAiTip('');
    setShowAddForm(false);
  };

  const toggleMilestone = async (goal: PlayerGoal, index: number) => {
    const updatedMilestones = goal.milestones.map((m, i) =>
      i === index ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    await updateGoal(goal.id, {
      milestones: updatedMilestones,
      progress
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121217] border border-[#242430] p-5 lg:p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
            <span>MY DREAM & CAREER BLUEPRINT</span>
            <span>·</span>
            <span className="text-[#ccff00] font-bold">THE ROAD TO PRO</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
            Chasing the Dream: Structured Milestones
          </h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl">
            A dream without a plan is just a wish. Deconstruct your ultimate football ambition into daily, verifiable milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600] transition-colors shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Add New Football Dream'}</span>
        </button>
      </div>

      {/* Add New Dream Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateGoal}
          className="bg-[#151520] border border-[#2c2c3e] p-5 rounded-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#242434] pb-2">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Define Your Next Football Goal / Dream
            </h3>
            <span className="text-xs text-zinc-400 font-mono-sport">PRO11 Path Tracker</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="md:col-span-2">
              <label className="text-zinc-400 font-mono-sport block mb-1">Goal / Dream Title:</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Sign for an Academy / Make High School First Team / Master Weak Foot"
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm focus:border-[#ccff00] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">Pillar:</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              >
                <option value="Career">Career & Club Signing</option>
                <option value="Technical">Technical Mastery</option>
                <option value="Physical">Physical Benchmark</option>
                <option value="Tactical">Tactical Command</option>
                <option value="Mental">Mental Discipline</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 font-mono-sport block mb-1">Target Completion Date:</label>
              <input
                type="date"
                value={newTargetDate}
                onChange={e => setNewTargetDate(e.target.value)}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <label className="text-zinc-400 font-mono-sport block">
              Break Down Into 3 Actionable Milestones:
            </label>
            {newMilestones.map((m, idx) => (
              <input
                key={idx}
                type="text"
                value={m}
                onChange={e => {
                  const arr = [...newMilestones];
                  arr[idx] = e.target.value;
                  setNewMilestones(arr);
                }}
                placeholder={`Milestone 0${idx + 1}: e.g. Complete 500 weak-foot wall strikes this month`}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            ))}
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-mono-sport block mb-1">
              Coach Recommendation / Mechanical Focus:
            </label>
            <input
              type="text"
              value={newAiTip}
              onChange={e => setNewAiTip(e.target.value)}
              placeholder="e.g. Focus on keeping hips square and locking ankle upon impact."
              className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-xs text-white rounded-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ccff00] text-black font-bold text-xs uppercase font-display rounded-sm hover:bg-[#b8e600]"
            >
              Save Football Dream
            </button>
          </div>
        </form>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {user.goals.length === 0 ? (
          <div className="p-8 text-center bg-[#121217] border border-[#242430] rounded-sm space-y-2">
            <Flag className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-white font-display">No Goals Defined Yet</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Every professional career starts with a clear vision. Click "Add New Football Dream" above to set your target.
            </p>
          </div>
        ) : (
          user.goals.map(goal => (
            <div
              key={goal.id}
              className="bg-[#121217] border border-[#242430] rounded-sm p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono-sport text-zinc-400 mb-1">
                    <span className="text-[#ccff00] font-bold uppercase">{goal.category}</span>
                    <span>·</span>
                    <span>Target: {goal.targetDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-display">{goal.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-black font-mono-sport text-[#ccff00]">
                      {goal.progress}%
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono-sport">Progress</div>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${goal.progress}%` }}
                  className="h-full bg-[#ccff00] transition-all duration-300"
                />
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono-sport uppercase font-bold text-zinc-400 block">
                  Actionable Milestones ({goal.milestones.filter(m => m.completed).length}/
                  {goal.milestones.length}):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {goal.milestones.map((milestone, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleMilestone(goal, idx)}
                      className={`p-2.5 rounded-sm border text-left flex items-start gap-2.5 transition-colors ${
                        milestone.completed
                          ? 'bg-emerald-950/40 border-emerald-700/60 text-zinc-300'
                          : 'bg-[#15151e] border-[#252533] text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          milestone.completed ? 'text-emerald-400 fill-emerald-950' : 'text-zinc-600'
                        }`}
                      />
                      <span className={milestone.completed ? 'line-through text-zinc-400' : 'text-white'}>
                        {milestone.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Coaching Directive */}
              {goal.aiTip && (
                <div className="text-xs text-zinc-300 bg-[#16161f] border-l-2 border-[#ccff00] p-3 rounded-sm">
                  <span className="text-[#ccff00] font-bold font-mono-sport">COACH DIRECTIVE: </span>
                  {goal.aiTip}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
