import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  BookOpen,
  Award,
  Send,
  Shield,
  HeartPulse,
  PlusCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MentalGameView: React.FC = () => {
  const { user, addMentalJournalEntry } = useApp();

  const [struggleInput, setStruggleInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  // Journal form state
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [journalCategory, setJournalCategory] = useState<any>('Confidence');
  const [journalMood, setJournalMood] = useState(3);
  const [journalNotes, setJournalNotes] = useState('');
  const [journalBreakthrough, setJournalBreakthrough] = useState('');

  const mentalPrompts = [
    'I lost my confidence after playing poorly in front of the head coach.',
    'I feel paralyzed by fear of making mistakes during high-stakes trials.',
    'I got benched and I feel frustrated, unseen, and discouraged.',
    'I am struggling with motivation to train alone in cold/rainy weather.',
    'My parents and coaches put so much pressure on me that I feel anxious before matches.'
  ];

  const handleConsultAI = async (selectedStruggle?: string) => {
    const text = selectedStruggle || struggleInput;
    if (!text.trim() || loadingAdvice) return;

    setLoadingAdvice(true);
    setAiAdvice(null);
    try {
      const res = await fetch('/api/mental/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          struggle: text.trim(),
          context: contextInput.trim(),
          userProfile: {
            name: user.name,
            position: user.position
          }
        })
      });

      if (!res.ok) throw new Error('Failed to fetch mental game advice');
      const data = await res.json();
      setAiAdvice(data.advice);
      if (!selectedStruggle) setStruggleInput('');
    } catch (err: any) {
      console.error('Mental advice error:', err);
      setAiAdvice(`Coach Mindset Cue: Football is 90% played in the mind. Focus on what you control: your breath, your next 5 meters of work rate, and your reaction to errors. Let go of what you cannot dictate.`);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalNotes.trim()) return;

    await addMentalJournalEntry({
      category: journalCategory,
      moodRating: journalMood,
      notes: journalNotes.trim(),
      breakthrough: journalBreakthrough.trim() || undefined
    });

    setJournalNotes('');
    setJournalBreakthrough('');
    setShowJournalForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121217] border border-[#242430] p-5 lg:p-6 rounded-sm">
        <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
          <span>SPORTS PSYCHOLOGY LAB</span>
          <span>·</span>
          <span className="text-[#ccff00] font-bold">THE INNER GAME</span>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
          Mental Game: Stoic Discipline & Match Resilience
        </h2>
        <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
          Physical talent gets you onto the pitch. Mental resilience, composure under pressure, and relentless discipline determine whether you make it to the top.
        </p>

        {/* Safety Disclaimer */}
        <div className="mt-4 p-3 bg-[#16161f] border-l-2 border-zinc-600 rounded-sm text-[11px] text-zinc-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          <span>
            PRO11 provides performance sports psychology and mindset coaching for athletes. If you or someone you know is experiencing severe depression, emotional crisis, or distress, please speak to a trusted family member, guardian, or qualified healthcare professional.
          </span>
        </div>
      </div>

      {/* Main Grid: AI Mindset Advisor & Reflection Journal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: AI Mindset Consultation */}
        <div className="space-y-4">
          <div className="bg-[#121217] border border-[#242430] p-5 rounded-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-mono-sport text-[#ccff00] font-bold">
                CONFIDENTIAL COACHING SESSION
              </span>
              <h3 className="text-base font-bold text-white font-display">
                Talk with the Mindset Coach
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Struggling with confidence, fear of failure, bad games, or benching? Ask for grounded sports psychology tools.
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono-sport text-zinc-500 uppercase">Common Hurdles:</span>
              <div className="space-y-1">
                {mentalPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleConsultAI(p)}
                    disabled={loadingAdvice}
                    className="w-full text-left p-2 rounded-sm bg-[#171720] hover:bg-[#1f1f2c] border border-[#262634] text-xs text-zinc-300 hover:text-white transition-colors flex items-center justify-between group disabled:opacity-50"
                  >
                    <span className="truncate pr-2">"{p}"</span>
                    <Sparkles className="w-3 h-3 text-[#ccff00] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Struggle Input */}
            <div className="space-y-2 pt-2 border-t border-[#22222e]">
              <textarea
                value={struggleInput}
                onChange={e => setStruggleInput(e.target.value)}
                placeholder="Describe specifically what is on your mind or how your last match felt..."
                rows={3}
                className="w-full p-2.5 bg-[#0a0a0d] border border-[#272735] text-xs text-white rounded-sm focus:border-[#ccff00] focus:outline-hidden"
              />
              <button
                onClick={() => handleConsultAI()}
                disabled={!struggleInput.trim() || loadingAdvice}
                className="w-full py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#b8e600] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>{loadingAdvice ? 'Consulting Sports Psychologist...' : 'Get Mindset Protocol'}</span>
              </button>
            </div>
          </div>

          {/* AI Response Card */}
          {aiAdvice && (
            <div className="bg-[#151520] border-2 border-[#ccff00]/60 p-5 rounded-sm space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-mono-sport text-[#ccff00] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>COACH MINDSET PROTOCOL</span>
              </div>
              <div className="text-xs lg:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                {aiAdvice}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Mental Reflection Journal */}
        <div className="space-y-4">
          <div className="bg-[#121217] border border-[#242430] p-5 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono-sport text-zinc-400 tracking-wider">
                  SELF-AWARENESS
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  Reflection Journal & Log
                </h3>
              </div>
              <button
                onClick={() => setShowJournalForm(!showJournalForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171720] hover:bg-[#20202e] border border-zinc-700 text-xs font-mono-sport text-zinc-200 rounded-sm"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>{showJournalForm ? 'Cancel' : 'New Entry'}</span>
              </button>
            </div>

            {/* Entry Form */}
            {showJournalForm && (
              <form onSubmit={handleSaveJournal} className="p-4 bg-[#171722] border border-[#2c2c3e] rounded-sm space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-zinc-400 font-mono-sport block mb-1">Focus Area:</label>
                    <select
                      value={journalCategory}
                      onChange={e => setJournalCategory(e.target.value as any)}
                      className="w-full p-2 bg-[#0e0e13] border border-[#272733] text-white rounded-sm"
                    >
                      <option value="Confidence">Confidence & Belief</option>
                      <option value="Mistake Reflection">Mistake Reflection</option>
                      <option value="Match Mindset">Match Mindset</option>
                      <option value="Motivation">Motivation & Grind</option>
                      <option value="Trial Prep">Trial / Selection Prep</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-400 font-mono-sport block mb-1">
                      Mindset State (1-5):
                    </label>
                    <select
                      value={journalMood}
                      onChange={e => setJournalMood(Number(e.target.value))}
                      className="w-full p-2 bg-[#0e0e13] border border-[#272733] text-white rounded-sm"
                    >
                      <option value={1}>1 - Frustrated / Struggling</option>
                      <option value={2}>2 - Low Confidence</option>
                      <option value={3}>3 - Neutral / Grounded</option>
                      <option value={4}>4 - Confident / Focused</option>
                      <option value={5}>5 - Unshakeable Flow State</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-mono-sport block mb-1">
                    What happened & how did you respond mentally?
                  </label>
                  <textarea
                    value={journalNotes}
                    onChange={e => setJournalNotes(e.target.value)}
                    placeholder="Reflect honestly on your mental discipline, thoughts during mistakes, or pre-game nerves..."
                    rows={3}
                    className="w-full p-2.5 bg-[#0a0a0d] border border-[#272733] text-xs text-white rounded-sm focus:border-[#ccff00] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-mono-sport block mb-1">
                    Key Lesson / Breakthrough to take into the next session:
                  </label>
                  <input
                    type="text"
                    value={journalBreakthrough}
                    onChange={e => setJournalBreakthrough(e.target.value)}
                    placeholder="e.g. Next time I give away the ball, 1 clap reset and sprint 5 meters to press."
                    className="w-full p-2 bg-[#0a0a0d] border border-[#272733] text-xs text-white rounded-sm focus:border-[#ccff00] focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ccff00] text-black font-bold text-xs uppercase font-display rounded-sm hover:bg-[#b8e600]"
                  >
                    Save Reflection
                  </button>
                </div>
              </form>
            )}

            {/* Previous Journal Entries */}
            <div className="space-y-3">
              {user.mentalJournal.length === 0 ? (
                <div className="p-6 text-center bg-[#0d0d12] rounded-sm border border-[#202028] text-xs text-zinc-400">
                  No reflection entries logged yet. Top footballers review their mental reactions weekly to eliminate emotional paralysis on the pitch.
                </div>
              ) : (
                user.mentalJournal.map(entry => (
                  <div
                    key={entry.id}
                    className="p-3.5 bg-[#16161f] border border-[#252533] rounded-sm space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono-sport">
                      <span className="text-[#ccff00] font-bold uppercase">{entry.category}</span>
                      <span className="text-zinc-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed">{entry.notes}</p>
                    {entry.breakthrough && (
                      <div className="text-[11px] text-emerald-400 font-mono-sport border-l-2 border-emerald-500 pl-2">
                        Lesson: {entry.breakthrough}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
