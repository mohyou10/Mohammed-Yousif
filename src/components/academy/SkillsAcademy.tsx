import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Clock,
  Play,
  Bookmark,
  ChevronDown,
  Dumbbell,
  Shield,
  Brain,
  Crosshair,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SKILLS_CURRICULUM, AcademyLesson } from '../../data/skillsCurriculum';

export const SkillsAcademy: React.FC = () => {
  const { user, toggleMasteredSkill, toggleBookmark, startWorkout } = useApp();

  const [selectedPillar, setSelectedPillar] = useState<'All' | 'Technical' | 'Physical' | 'Tactical' | 'Mental'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(SKILLS_CURRICULUM[0]?.id || null);

  const filteredLessons = SKILLS_CURRICULUM.filter(lesson => {
    const matchesPillar = selectedPillar === 'All' || lesson.pillar === selectedPillar;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.objective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPillar && matchesSearch;
  });

  const handleStartDrill = (lesson: AcademyLesson) => {
    startWorkout(`Academy: ${lesson.title}`, lesson.pillar as any, [
      {
        id: `drill-${lesson.id}`,
        name: lesson.title,
        category: (lesson.pillar === 'Technical' ? 'Technical' : 'Physical') as any,
        durationMinutes: lesson.durationMinutes,
        reps: lesson.fieldDrill.repsAndSets,
        sets: 3,
        restSeconds: 60,
        difficulty: lesson.difficulty,
        objective: lesson.objective,
        explanation: lesson.fieldDrill.instructions.join(' '),
        coachTips: lesson.coachingPoints[0] || 'Focus on clean mechanics.'
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121217] border border-[#242430] p-5 lg:p-6 rounded-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
              <span>PRO11 SKILLS ACADEMY</span>
              <span>·</span>
              <span className="text-[#ccff00] font-bold">
                {user.masteredSkills?.length || 0} of {SKILLS_CURRICULUM.length} MASTERED
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
              Professional Development Curriculum
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-xl">
              Master the exact drills, technical mechanics, physical standards, and tactical cues used in elite European academies.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search skills, drills, categories..."
              className="w-full pl-9 pr-3 py-2 bg-[#0a0a0d] border border-[#272735] text-xs text-white rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Pillar Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-[#20202a]">
          {(['All', 'Technical', 'Physical', 'Tactical', 'Mental'] as const).map(pillar => {
            const count =
              pillar === 'All'
                ? SKILLS_CURRICULUM.length
                : SKILLS_CURRICULUM.filter(l => l.pillar === pillar).length;
            const isSelected = selectedPillar === pillar;

            return (
              <button
                key={pillar}
                onClick={() => setSelectedPillar(pillar)}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-mono-sport transition-colors flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#ccff00] text-black font-bold'
                    : 'bg-[#181822] text-zinc-400 hover:text-white border border-[#262634]'
                }`}
              >
                <span>{pillar}</span>
                <span className={`text-[10px] ${isSelected ? 'text-black' : 'text-zinc-500'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curriculum Lesson Cards */}
      <div className="space-y-4">
        {filteredLessons.map(lesson => {
          const isMastered = user.masteredSkills?.includes(lesson.id);
          const isBookmarked = user.bookmarks?.includes(lesson.id);
          const isExpanded = expandedLessonId === lesson.id;

          return (
            <div
              key={lesson.id}
              className={`bg-[#121217] border rounded-sm transition-all overflow-hidden ${
                isMastered
                  ? 'border-emerald-600/60 bg-[#121815]'
                  : isExpanded
                  ? 'border-[#38384a] bg-[#14141c]'
                  : 'border-[#242432]'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                className="p-4 lg:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-sm shrink-0 mt-0.5 ${
                      lesson.pillar === 'Technical'
                        ? 'bg-amber-950/40 text-amber-400 border border-amber-800'
                        : lesson.pillar === 'Physical'
                        ? 'bg-red-950/40 text-red-400 border border-red-800'
                        : lesson.pillar === 'Tactical'
                        ? 'bg-blue-950/40 text-blue-400 border border-blue-800'
                        : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono-sport text-zinc-400 mb-1">
                      <span className="text-[#ccff00] font-bold uppercase">{lesson.pillar}</span>
                      <span>·</span>
                      <span>{lesson.category}</span>
                      <span>·</span>
                      <span className="text-zinc-500">{lesson.difficulty}</span>
                    </div>
                    <h3 className="text-sm lg:text-base font-bold text-white font-display">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">{lesson.objective}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 shrink-0">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleMasteredSkill(lesson.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono-sport transition-colors ${
                      isMastered
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                        : 'bg-[#181822] text-zinc-400 hover:text-white border border-[#282836]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleBookmark(lesson.id);
                    }}
                    className={`p-1.5 rounded-sm border ${
                      isBookmarked
                        ? 'border-[#ccff00] text-[#ccff00] bg-zinc-900'
                        : 'border-[#282836] text-zinc-500 hover:text-white'
                    }`}
                    title="Bookmark Drill"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>

                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform ${
                      isExpanded ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Lesson Deep-Dive */}
              {isExpanded && (
                <div className="p-5 border-t border-[#22222d] bg-[#0f0f14] space-y-5 animate-in fade-in duration-150">
                  {/* Coaching Points */}
                  <div>
                    <h4 className="text-xs font-bold text-[#ccff00] uppercase font-mono-sport mb-2">
                      Key Mechanical Coaching Points:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {lesson.coachingPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#14141c] border border-[#242432] rounded-sm text-zinc-300 flex items-start gap-2"
                        >
                          <span className="text-[#ccff00] font-mono-sport font-bold">0{idx + 1}.</span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practical Field Drill */}
                  <div className="bg-[#14141b] border border-[#282838] p-4 rounded-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
                        Field Drill Setup & Instructions
                      </span>
                      <span className="text-xs text-zinc-400 font-mono-sport flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{lesson.durationMinutes} Minutes</span>
                      </span>
                    </div>

                    <div className="text-xs text-zinc-400">
                      <span className="text-zinc-300 font-bold">Pitch Setup: </span>
                      {lesson.fieldDrill.setup}
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase font-mono-sport">
                        Execution Sequence:
                      </span>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-300">
                        {lesson.fieldDrill.instructions.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="pt-2 border-t border-[#222230] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-sport">
                      <div>
                        <span className="text-zinc-500 uppercase text-[10px]">Reps & Sets:</span>
                        <div className="text-white font-bold">{lesson.fieldDrill.repsAndSets}</div>
                      </div>
                      <div>
                        <span className="text-[#ccff00] uppercase text-[10px]">Pro Benchmark Standard:</span>
                        <div className="text-zinc-300">{lesson.fieldDrill.proStandard}</div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleStartDrill(lesson)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600] transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Practice This Drill In Live Runner</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
