import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  PlusCircle,
  RefreshCw,
  Flame,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';

export const CoachChat: React.FC = () => {
  const { user, currentStreak } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'coach',
      text: `Welcome to the coaching room, ${user.name}. I am your PRO11 Head Coach.\n\nWhether you need to dissect your weak foot technique, design a position-specific workout for ${user.position}, prepare mentally for an upcoming academy trial, or fix a slump in confidence — I am here 24/7.\n\nWhat is our top training priority today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'I struggle with my weak foot passing and finishing under pressure.',
    'How do I stand out to scouts at an academy trial next week?',
    'I feel like my progress has stalled. How do I break through this plateau?',
    `What are the 3 non-negotiable tactical habits for a top ${user.position}?`,
    'I made a crucial mistake in my last match and lost my confidence.',
    'Build me a 45-minute explosive speed and change-of-direction session.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      // Build conversation history payload
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: historyPayload,
          userProfile: {
            name: user.name,
            position: user.position,
            age: user.age,
            experience: user.experience,
            preferredFoot: user.preferredFoot,
            strengths: user.strengths,
            weaknesses: user.weaknesses,
            sessionCount: user.sessions.length,
            streak: currentStreak
          }
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server returned an error');
      }

      const data = await res.json();
      const coachMessage: ChatMessage = {
        id: `coach-${Date.now()}`,
        role: 'coach',
        text: data.reply || 'Solid point. Let us break this down into executable reps on the pitch.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, coachMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'coach',
        text: `Coach Alert: I ran into an issue connecting to the tactical database (${err.message}). Make sure your Gemini API key is configured in the Settings > Secrets panel. In the meantime, focus on your fundamental ball touches.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'coach',
        text: `New coaching session started. Ready to analyze your game, ${user.name}. What are we tackling?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto bg-[#101015] border border-[#242432] rounded-sm overflow-hidden">
      {/* Coach Header Bar */}
      <div className="px-5 py-3.5 bg-[#14141c] border-b border-[#242432] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-sm bg-[#ccff00] text-black font-black flex items-center justify-center font-display text-sm">
              AI
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#14141c]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
                UEFA PRO AI COACH
              </span>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-xs font-mono-sport">
                UEFA Pro & Sports Science
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono-sport">
              Dossier Loaded: {user.name} ({user.position} · {user.preferredFoot} Footed)
            </p>
          </div>
        </div>

        <button
          onClick={handleNewConversation}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-bold rounded-sm border border-zinc-700 transition-colors font-mono-sport"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#ccff00]" />
          <span>New Session</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4">
        {messages.map(msg => {
          const isCoach = msg.role === 'coach';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isCoach ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-sm shrink-0 flex items-center justify-center text-xs font-bold font-mono-sport ${
                  isCoach ? 'bg-[#ccff00] text-black' : 'bg-zinc-800 text-white border border-zinc-700'
                }`}
              >
                {isCoach ? 'AI' : user.name.slice(0, 1)}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-sm p-4 text-xs lg:text-sm leading-relaxed relative group ${
                  isCoach
                    ? 'bg-[#16161f] border border-[#272736] text-zinc-200'
                    : 'bg-zinc-800 border border-zinc-700 text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono-sport text-zinc-400">
                  <span className={isCoach ? 'text-[#ccff00] font-bold' : 'text-zinc-300'}>
                    {isCoach ? 'HEAD COACH' : user.name.toUpperCase()}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.text}
                </div>

                {isCoach && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy coaching cues"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto max-w-xl">
            <div className="w-8 h-8 rounded-sm bg-[#ccff00] text-black shrink-0 flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <div className="bg-[#16161f] border border-[#272736] rounded-sm p-3.5 text-xs text-zinc-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce [animation-delay:0.4s]" />
              <span className="font-mono-sport text-zinc-400 ml-1">Analyzing player mechanics & tactical data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2 bg-[#121218] border-t border-[#22222d] overflow-x-auto flex gap-2 no-scrollbar">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="shrink-0 px-2.5 py-1 rounded-sm bg-[#181822] hover:bg-[#20202d] text-zinc-300 text-[11px] font-mono-sport border border-[#2a2a38] transition-colors hover:border-[#ccff00]/40 disabled:opacity-40"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 lg:p-4 bg-[#14141c] border-t border-[#242432]">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Ask Coach about drills, positioning, trials, weak foot, or mentality...`}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#0a0a0d] border border-[#272735] text-xs lg:text-sm text-white rounded-sm focus:border-[#ccff00] focus:outline-hidden disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase font-display rounded-sm hover:bg-[#bceb00] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono-sport mt-2">
          <span>PRO11 AI Coach · UEFA Pro & Sports Science Engine</span>
          <span>Powered by Gemini 3.8 Flash</span>
        </div>
      </div>
    </div>
  );
};
