import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Flame,
  Calendar,
  Clock,
  Download,
  Share2,
  CheckCircle2,
  Edit2,
  Zap,
  Shield,
  BookOpen,
  Brain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_BADGES } from '../../data/challenges';

export const AchievementsView: React.FC = () => {
  const {
    user,
    totalMinutesTrained,
    currentStreak,
    updatePersonalRecords
  } = useApp();

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [juggling, setJuggling] = useState(user.personalRecords?.jugglingRecord || 0);
  const [sprint30m, setSprint30m] = useState<string>(
    user.personalRecords?.sprintTime30m ? String(user.personalRecords.sprintTime30m) : ''
  );
  const [wallPasses, setWallPasses] = useState(user.personalRecords?.wallPasses60s || 0);
  const [beepTest, setBeepTest] = useState<string>(
    user.personalRecords?.beepTestLevel ? String(user.personalRecords.beepTestLevel) : ''
  );

  const [activeTab, setActiveTab] = useState<'badges' | 'records' | 'calendar' | 'report'>('badges');

  const handleSaveRecords = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePersonalRecords({
      jugglingRecord: Number(juggling),
      sprintTime30m: sprint30m ? parseFloat(sprint30m) : null,
      wallPasses60s: Number(wallPasses),
      beepTestLevel: beepTest ? parseFloat(beepTest) : null
    });
    setShowRecordModal(false);
  };

  // Calendar dates computation (current month)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleString('default', { month: 'long' });

  // Map of active days from user.sessions
  const sessionDatesSet = new Set(user.sessions.map(s => s.date.slice(0, 10)));

  const handleExportReport = () => {
    const reportText = `
PRO11 FOOTBALL DEVELOPMENT DOSSIER
=====================================
Athlete: ${user.name}
Position: ${user.position} (${user.preferredFoot} Foot)
Experience Level: ${user.experience}
Age: ${user.age}

VERIFIED CAREER METRICS
- Total Verified Training Minutes: ${totalMinutesTrained} Minutes
- Recorded Training Sessions: ${user.sessions.length} Sessions
- Active Consecutive Day Streak: ${currentStreak} Days
- Skills Mastered in Academy: ${user.masteredSkills?.length || 0}
- Badges Earned: ${user.unlockedBadges?.length || 0} of ${ALL_BADGES.length}

PERSONAL ATHLETIC BENCHMARKS
- Keep-Up Juggling Record: ${user.personalRecords?.jugglingRecord || 0} touches
- 60-Second Wall Passing Rhythm: ${user.personalRecords?.wallPasses60s || 0} passes
- 30-Meter Sprint Split: ${user.personalRecords?.sprintTime30m || 'Not yet recorded'}s
- Beep Test Level: ${user.personalRecords?.beepTestLevel || 'Not yet recorded'}

CURRENT PLAYER GOALS
${user.goals.map(g => `- [${g.progress}%] ${g.title} (Target: ${g.targetDate})`).join('\n')}

Generated via PRO11 AI Football Coaching Platform
Date: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PRO11_Dossier_${user.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121217] border border-[#242430] p-5 lg:p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
            <span>CAREER RECOGNITION</span>
            <span>·</span>
            <span className="text-[#ccff00] font-bold">
              {user.unlockedBadges?.length || 0} OF {ALL_BADGES.length} BADGES UNLOCKED
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
            Achievements & Personal Records
          </h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl">
            Badges and records in PRO11 are never handed out for free. Every badge reflects verified training minutes, completed drills, and consistency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRecordModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-bold text-zinc-200 rounded-sm font-mono-sport"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>Update Personal Records</span>
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600] shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Player Dossier</span>
          </button>
        </div>
      </div>

      {/* Segmented Controls */}
      <div className="flex items-center gap-1 p-1 bg-[#121217] border border-[#242432] rounded-sm w-fit text-xs font-mono-sport">
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-3.5 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'badges' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Badges & Honors ({user.unlockedBadges?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-3.5 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'records' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Athletic Personal Records
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-3.5 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'calendar' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Training Calendar
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-3.5 py-1.5 rounded-sm font-bold transition-colors ${
            activeTab === 'report' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Player Progress Dossier
        </button>
      </div>

      {/* TAB 1: BADGES */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_BADGES.map(badge => {
            const isUnlocked = user.unlockedBadges?.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-sm border transition-all flex flex-col justify-between space-y-3 ${
                  isUnlocked
                    ? 'bg-[#151520] border-[#ccff00]/60'
                    : 'bg-[#101014] border-[#22222c] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-sm flex items-center justify-center font-bold ${
                        isUnlocked
                          ? 'bg-[#ccff00] text-black'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-mono-sport uppercase font-bold px-2 py-0.5 rounded-xs ${
                        isUnlocked
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-display mb-1">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{badge.description}</p>
                </div>

                <div className="pt-2 border-t border-[#202028] text-[10px] text-zinc-500 font-mono-sport">
                  {isUnlocked ? 'Verified by AI Studio Engine' : 'Requirement not yet completed'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ATHLETIC PERSONAL RECORDS */}
      {activeTab === 'records' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121217] border border-[#242430] p-5 rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport text-zinc-400 uppercase">
              Keep-Up Juggling High Score
            </span>
            <div className="text-3xl font-black font-mono-sport text-[#ccff00]">
              {user.personalRecords?.jugglingRecord || 0}
            </div>
            <div className="text-xs text-zinc-400">
              Consecutive touches without ground contact.
            </div>
          </div>

          <div className="bg-[#121217] border border-[#242430] p-5 rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport text-zinc-400 uppercase">
              60-Second Wall Pass Reps
            </span>
            <div className="text-3xl font-black font-mono-sport text-white">
              {user.personalRecords?.wallPasses60s || 0}
            </div>
            <div className="text-xs text-zinc-400">
              Clean passes against wall in 60s rhythm.
            </div>
          </div>

          <div className="bg-[#121217] border border-[#242430] p-5 rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport text-zinc-400 uppercase">
              30-Meter Sprint Split
            </span>
            <div className="text-3xl font-black font-mono-sport text-white">
              {user.personalRecords?.sprintTime30m ? `${user.personalRecords.sprintTime30m}s` : '--'}
            </div>
            <div className="text-xs text-zinc-400">
              Timed electronic or stopwatch acceleration.
            </div>
          </div>

          <div className="bg-[#121217] border border-[#242430] p-5 rounded-sm space-y-2">
            <span className="text-[10px] font-mono-sport text-zinc-400 uppercase">
              Beep Test / Yo-Yo Level
            </span>
            <div className="text-3xl font-black font-mono-sport text-white">
              {user.personalRecords?.beepTestLevel ? `L${user.personalRecords.beepTestLevel}` : '--'}
            </div>
            <div className="text-xs text-zinc-400">
              Aerobic shuttle endurance threshold.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRAINING CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-[#121217] border border-[#242430] p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#22222e] pb-3">
            <div>
              <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
                {year} SCHEDULE
              </span>
              <h3 className="text-base font-bold text-white font-display">
                {monthName} Training Consistency Grid
              </h3>
            </div>
            <span className="text-xs font-mono-sport text-zinc-400">
              Green indicator = Recorded pitch session
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div
                key={day}
                className="text-center text-[10px] uppercase font-mono-sport text-zinc-500 font-bold py-1"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const hasSession = sessionDatesSet.has(dateStr);
              const isToday = dayNum === today.getDate();

              return (
                <div
                  key={dayNum}
                  className={`h-16 p-2 rounded-sm border flex flex-col justify-between transition-colors ${
                    hasSession
                      ? 'bg-[#152018] border-[#ccff00]/60'
                      : 'bg-[#14141a] border-[#22222c]'
                  } ${isToday ? 'ring-1 ring-[#ccff00]' : ''}`}
                >
                  <div className="flex items-center justify-between text-xs font-mono-sport">
                    <span className={isToday ? 'text-[#ccff00] font-bold' : 'text-zinc-400'}>
                      {dayNum}
                    </span>
                    {hasSession && <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00]" />}
                  </div>
                  {hasSession && (
                    <span className="text-[9px] font-mono-sport text-emerald-400 truncate">
                      Trained ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PLAYER PROGRESS DOSSIER */}
      {activeTab === 'report' && (
        <div className="bg-[#121217] border border-[#242430] p-6 rounded-sm space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#242430] pb-4">
            <div>
              <div className="text-[10px] uppercase font-mono-sport text-[#ccff00] font-bold">
                OFFICIAL PLAYER DOSSIER
              </div>
              <h3 className="text-xl font-bold text-white font-display uppercase tracking-wider">
                {user.name}
              </h3>
              <p className="text-xs text-zinc-400 font-mono-sport">
                {user.position} · {user.age} Years Old · {user.preferredFoot} Footed
              </p>
            </div>
            <button
              onClick={handleExportReport}
              className="px-3.5 py-1.5 bg-[#ccff00] text-black font-bold text-xs uppercase font-display rounded-sm flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Text File</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#151520] border border-[#242432] rounded-sm">
              <div className="text-[10px] text-zinc-400 font-mono-sport">CAREER MINUTES</div>
              <div className="text-xl font-black font-mono-sport text-white">{totalMinutesTrained}m</div>
            </div>
            <div className="p-3 bg-[#151520] border border-[#242432] rounded-sm">
              <div className="text-[10px] text-zinc-400 font-mono-sport">SESSIONS LOGGED</div>
              <div className="text-xl font-black font-mono-sport text-white">{user.sessions.length}</div>
            </div>
            <div className="p-3 bg-[#151520] border border-[#242432] rounded-sm">
              <div className="text-[10px] text-zinc-400 font-mono-sport">ACTIVE STREAK</div>
              <div className="text-xl font-black font-mono-sport text-[#ccff00]">{currentStreak} Days</div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-white font-display uppercase">Active Goals:</span>
            <div className="space-y-1.5">
              {user.goals.map(g => (
                <div key={g.id} className="p-3 bg-[#151520] rounded-sm flex justify-between text-xs">
                  <span className="text-zinc-200">{g.title}</span>
                  <span className="text-[#ccff00] font-mono-sport font-bold">{g.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Record Update Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveRecords}
            className="w-full max-w-md bg-[#121217] border border-[#2c2c3e] p-6 rounded-sm space-y-4"
          >
            <h3 className="text-base font-bold text-white font-display">Update Athletic Records</h3>

            <div>
              <label className="text-xs text-zinc-400 font-mono-sport block mb-1">
                Keep-Up Juggling High Score:
              </label>
              <input
                type="number"
                value={juggling}
                onChange={e => setJuggling(Number(e.target.value))}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-mono-sport block mb-1">
                60-Second Wall Pass Repetitions:
              </label>
              <input
                type="number"
                value={wallPasses}
                onChange={e => setWallPasses(Number(e.target.value))}
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-mono-sport block mb-1">
                30-Meter Sprint Time (Seconds):
              </label>
              <input
                type="text"
                value={sprint30m}
                onChange={e => setSprint30m(e.target.value)}
                placeholder="e.g. 4.12"
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-mono-sport block mb-1">
                Beep Test / Yo-Yo Level:
              </label>
              <input
                type="text"
                value={beepTest}
                onChange={e => setBeepTest(e.target.value)}
                placeholder="e.g. 18.2"
                className="w-full p-2 bg-[#0e0e13] border border-[#262633] text-white rounded-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRecordModal(false)}
                className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#ccff00] text-black font-bold text-xs uppercase font-display rounded-sm hover:bg-[#b8e600]"
              >
                Save Records
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
