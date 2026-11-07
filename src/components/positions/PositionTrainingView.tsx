import React, { useState } from 'react';
import {
  Target,
  Play,
  Shield,
  Zap,
  CheckCircle2,
  Users,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { POSITIONS_DATA, PositionProgram } from '../../data/positionsData';
import { Position } from '../../types';

export const PositionTrainingView: React.FC = () => {
  const { user, updateUser, startWorkout } = useApp();

  const [selectedPosition, setSelectedPosition] = useState<Position>(
    user.position || 'Central Midfielder'
  );

  const currentProgram =
    POSITIONS_DATA.find(p => p.position === selectedPosition) || POSITIONS_DATA[4];

  const handleSetPrimaryPosition = async (pos: Position) => {
    setSelectedPosition(pos);
    await updateUser({ position: pos });
  };

  const handleStartDrill = (drill: any) => {
    startWorkout(`${selectedPosition}: ${drill.title}`, 'Position Specific', [
      {
        id: `pos-${Date.now()}`,
        name: drill.title,
        category: 'Technical',
        durationMinutes: drill.durationMinutes,
        reps: '10 reps',
        sets: 3,
        restSeconds: 60,
        difficulty: 'Advanced',
        objective: drill.focus,
        explanation: drill.description,
        coachTips: `Pro positional benchmark: Train at 100% match speed to simulate game pressure.`
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121217] border border-[#242430] p-5 lg:p-6 rounded-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
              <span>POSITION MASTERY</span>
              <span>·</span>
              <span className="text-[#ccff00] font-bold">
                CURRENT ROLE: {user.position.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
              Specialized Positional Training
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
              Modern football positions demand unique physiological and tactical profiles. Master the exact habits of world-class professionals in your role.
            </p>
          </div>

          {selectedPosition !== user.position && (
            <button
              onClick={() => handleSetPrimaryPosition(selectedPosition)}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono-sport text-white rounded-sm border border-zinc-700"
            >
              Set {selectedPosition} as My Primary Position
            </button>
          )}
        </div>

        {/* 8 Position Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 mt-5 pt-4 border-t border-[#20202a]">
          {POSITIONS_DATA.map(pos => {
            const isSelected = selectedPosition === pos.position;
            const isUserPos = user.position === pos.position;

            return (
              <button
                key={pos.position}
                onClick={() => setSelectedPosition(pos.position)}
                className={`p-2 rounded-sm text-xs text-center transition-all flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-[#ccff00] text-black font-black'
                    : 'bg-[#161620] text-zinc-400 hover:text-white border border-[#262634]'
                }`}
              >
                <span className="truncate w-full font-mono-sport text-[11px]">{pos.position}</span>
                {isUserPos && (
                  <span
                    className={`text-[9px] uppercase font-bold tracking-wider ${
                      isSelected ? 'text-black' : 'text-[#ccff00]'
                    }`}
                  >
                    ★ My Role
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Position Deep-Dive Profile */}
      <div className="bg-[#121217] border border-[#242430] p-6 rounded-sm space-y-6">
        <div className="border-b border-[#22222e] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
              TACTICAL ROLE BLUEPRINT
            </span>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              {currentProgram.position}
            </h3>
            <p className="text-xs text-zinc-400 italic">"{currentProgram.tagline}"</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 bg-[#161620] px-3 py-1.5 rounded-sm border border-[#262634]">
            <Users className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>Pro References: </span>
            <span className="text-white font-bold">
              {currentProgram.proReferencePlayers.join(', ')}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed bg-[#161620] p-4 rounded-sm border border-[#262634]">
          {currentProgram.roleOverview}
        </p>

        {/* 3 Pillars: Responsibilities, Tactical Demands, Physical Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#15151e] border border-[#252533] rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00] block">
              Core Responsibilities:
            </span>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {currentProgram.keyResponsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#ccff00] font-mono-sport font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-[#15151e] border border-[#252533] rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport uppercase font-bold text-blue-400 block">
              Tactical Cues:
            </span>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {currentProgram.tacticalDemands.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 font-mono-sport font-bold">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-[#15151e] border border-[#252533] rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport uppercase font-bold text-amber-400 block">
              Physical Profile:
            </span>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {currentProgram.physicalRequirements.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-mono-sport font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specialized Positional Drills */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Position-Specific Signature Drills
            </h4>
            <span className="text-xs text-zinc-400 font-mono-sport">
              {currentProgram.specializedDrills.length} drills available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentProgram.specializedDrills.map((drill, idx) => (
              <div
                key={idx}
                className="bg-[#151520] border border-[#262634] p-4 rounded-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-sport mb-1">
                    <span className="text-[#ccff00] font-bold">{drill.intensity} Intensity</span>
                    <span className="text-zinc-400">{drill.durationMinutes} Mins</span>
                  </div>
                  <h5 className="text-sm font-bold text-white font-display">{drill.title}</h5>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{drill.description}</p>
                </div>

                <div className="pt-2 border-t border-[#222230] flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono-sport">
                    Focus: {drill.focus}
                  </span>
                  <button
                    onClick={() => handleStartDrill(drill)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ccff00] text-black text-xs font-black uppercase font-display rounded-sm hover:bg-[#b8e600] transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Train Drill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
