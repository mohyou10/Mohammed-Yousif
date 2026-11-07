import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Gauge,
  Clock,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
  getYouTubeThumbnailUrl
} from '../../utils/youtube';

interface YouTubePlayerProps {
  videoIdOrUrl: string;
  title: string;
  author?: string;
  poster?: string;
  instructions?: string[];
  tips?: string[];
  durationMinutes?: number;
  exerciseId?: string;
  onVideoError?: (error: string) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoIdOrUrl,
  title,
  author,
  poster,
  instructions = [],
  tips = [],
  durationMinutes = 15,
  exerciseId,
  onVideoError,
}) => {
  const videoId = extractYouTubeId(videoIdOrUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<number>(1);
  const [activeCueIndex, setActiveCueIndex] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback poster if none supplied
  const effectivePoster =
    poster || (videoId ? getYouTubeThumbnailUrl(videoId, 'maxresdefault') : '');

  const embedUrl = videoId
    ? getYouTubeEmbedUrl(videoId, {
        autoplay: isPlaying,
        enableJsApi: true,
        controls: true,
        rel: 0,
      })
    : '';

  const watchUrl = videoId ? getYouTubeWatchUrl(videoId) : '';

  // Reset state on video change
  useEffect(() => {
    setIsPlaying(false);
    setIsLoading(true);
    setHasError(false);
    setActiveCueIndex(0);
  }, [videoId]);

  // Send command to YouTube IFrame API via postMessage
  const postYouTubeCommand = (func: string, args: any[] = []) => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func,
          args,
        }),
        '*'
      );
    } catch {
      // Ignore cross-origin frame postMessage restrictions
    }
  };

  const handleStartPlayback = () => {
    setIsPlaying(true);
    setIsLoading(true);
    // Post playVideo command shortly after iframe mounts
    setTimeout(() => {
      postYouTubeCommand('playVideo');
    }, 500);
  };

  const handleSpeedChange = (speed: number) => {
    setSelectedSpeed(speed);
    postYouTubeCommand('setPlaybackRate', [speed]);
  };

  const handleSeekToCue = (index: number, seconds: number) => {
    setActiveCueIndex(index);
    if (!isPlaying) {
      setIsPlaying(true);
      setTimeout(() => {
        postYouTubeCommand('seekTo', [seconds, true]);
        postYouTubeCommand('playVideo');
      }, 500);
    } else {
      postYouTubeCommand('seekTo', [seconds, true]);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Build tactical step cues
  const stepCues = instructions.length > 0
    ? instructions.map((text, i) => ({
        step: i + 1,
        timeSeconds: i * 20,
        label: text.length > 60 ? text.slice(0, 57) + '...' : text,
        fullText: text,
      }))
    : [
        { step: 1, timeSeconds: 0, label: 'Preparation & Athletic Stance', fullText: 'Set body posture with low center of mass' },
        { step: 2, timeSeconds: 20, label: 'Primary Mechanical Execution', fullText: 'Strike or cut with explosive locked ankle' },
        { step: 3, timeSeconds: 40, label: 'Match-Speed Repetition Rhythm', fullText: 'Maintain high velocity throughout repetition sets' },
      ];

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-[#0d0e12] border border-yellow-500/30 rounded-sm flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-10 h-10 text-yellow-400 mb-2" />
        <h3 className="text-base font-bold text-white font-display uppercase tracking-wide">
          Video Tutorial Pending Assignment
        </h3>
        <p className="text-xs text-gray-400 max-w-md mt-1 mb-4">
          No YouTube video ID mapped for {title}. You can assign a verified video tutorial in the Media Manager.
        </p>
        {exerciseId && (
          <a
            href={`/media-manager?search=${exerciseId}`}
            className="px-4 py-2 bg-[#ccff00] text-black text-xs font-bold font-mono-sport uppercase tracking-wider rounded-sm hover:bg-[#b8e600] transition-colors"
          >
            Open in Media Manager
          </a>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#080809] border border-theme rounded-sm overflow-hidden flex flex-col group"
    >
      {/* 1. TOP VIDEO HEADER BAR */}
      <div className="bg-[#0f1015] border-b border-white/10 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#ccff00]/15 text-[#ccff00] font-mono-sport text-[10px] font-bold uppercase tracking-wider shrink-0 border border-[#ccff00]/30">
            <ShieldCheck className="w-3 h-3" />
            Verified YouTube Drill
          </span>
          <span className="text-white/80 font-display font-medium truncate">
            {title}
          </span>
          {author && (
            <span className="text-theme-muted text-[11px] shrink-0 hidden sm:inline">
              · by {author}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono-sport font-bold text-theme-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
            title="Open video on YouTube in a new tab"
          >
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. 16:9 RESPONSIVE EMBED CONTAINER */}
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        {!isPlaying ? (
          // Pre-play Hero Poster with Play Trigger
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer group/poster" onClick={handleStartPlayback}>
            <img
              src={effectivePoster}
              alt={title}
              className="w-full h-full object-cover filter brightness-[0.7] group-hover/poster:brightness-[0.85] transition-all duration-300 scale-100 group-hover/poster:scale-[1.02]"
              onError={(e) => {
                // If maxres fails, fallback to hqdefault
                const target = e.target as HTMLImageElement;
                if (videoId && !target.src.includes('hqdefault')) {
                  target.src = getYouTubeThumbnailUrl(videoId, 'hqdefault');
                }
              }}
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

            {/* Center Big Play Button */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleStartPlayback}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ccff00] text-black flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.4)] group-hover/poster:scale-110 group-hover/poster:shadow-[0_0_45px_rgba(204,255,0,0.7)] transition-all duration-200 cursor-pointer"
                aria-label={`Play demonstration video for ${title}`}
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
              </button>
              <div className="text-center px-4">
                <div className="text-xs sm:text-sm font-bold text-white font-display tracking-wider uppercase drop-shadow-md">
                  Click To Play Instructional Video
                </div>
                <div className="text-[11px] font-mono-sport text-[#ccff00] mt-0.5">
                  16:9 Full HD Stream · YouTube Player
                </div>
              </div>
            </div>

            {/* Bottom Meta Overlay */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono-sport text-white/70">
              <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-xs">
                <Clock className="w-3 h-3 text-[#ccff00]" />
                {durationMinutes} min workout
              </span>
              <span className="bg-black/60 backdrop-blur-xs px-2 py-1 rounded-xs text-[#ccff00]">
                PRO11 Video Engine
              </span>
            </div>
          </div>
        ) : (
          // Active YouTube IFrame
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-10 gap-2">
                <div className="w-8 h-8 border-2 border-theme-border border-t-[#ccff00] rounded-full animate-spin" />
                <span className="text-xs font-mono-sport text-theme-muted uppercase">
                  Loading YouTube Stream...
                </span>
              </div>
            )}

            {hasError ? (
              <div className="absolute inset-0 bg-[#0d0e12] flex flex-col items-center justify-center p-6 text-center z-20">
                <AlertTriangle className="w-10 h-10 text-red-400 mb-2" />
                <h4 className="text-sm font-bold text-white font-display uppercase">
                  YouTube Playback Interrupted
                </h4>
                <p className="text-xs text-gray-400 max-w-sm mt-1 mb-4">
                  The video could not be played inside the embedded frame. You can open it directly on YouTube.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#ccff00] text-black text-xs font-bold font-mono-sport uppercase tracking-wider rounded-sm hover:bg-[#b8e600] transition-colors"
                  >
                    Open on YouTube.com
                  </a>
                  <button
                    onClick={() => {
                      setHasError(false);
                      setIsPlaying(false);
                    }}
                    className="px-3 py-2 bg-white/10 text-white text-xs font-mono-sport uppercase rounded-sm hover:bg-white/20 transition-colors"
                  >
                    Reset Player
                  </button>
                </div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={handleIframeLoad}
                onError={() => {
                  setHasError(true);
                  if (onVideoError) onVideoError('YouTube iframe failed to load');
                }}
              />
            )}
          </>
        )}
      </div>

      {/* 3. TACTICAL CONTROLS & STEP MARKERS */}
      <div className="bg-[#0f1015] border-t border-white/10 p-3 flex flex-col gap-2.5">
        {/* Playback speed presets and tools */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono-sport uppercase text-theme-muted flex items-center gap-1 mr-1">
              <Gauge className="w-3 h-3 text-[#ccff00]" />
              Analysis Speed:
            </span>
            {[0.5, 0.75, 1].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleSpeedChange(rate)}
                className={`px-2 py-0.5 text-[11px] font-mono-sport font-bold rounded-xs transition-colors cursor-pointer ${
                  selectedSpeed === rate
                    ? 'bg-[#ccff00] text-black'
                    : 'bg-white/5 text-theme-muted hover:text-white hover:bg-white/10'
                }`}
                title={rate === 0.5 ? 'Slow-motion mechanical analysis' : `${rate}x speed`}
              >
                {rate}x {rate === 0.5 && '(Slow-Mo)'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setIsLoading(true);
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono-sport text-theme-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
              title="Reset player to cover"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleFullscreen}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono-sport text-theme-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Step Breakdown Timeline Cues */}
        {stepCues.length > 0 && (
          <div className="border-t border-white/5 pt-2">
            <div className="text-[10px] font-mono-sport uppercase tracking-wider text-theme-muted mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#ccff00]" />
              Drill Execution Milestones
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {stepCues.map((cue, idx) => (
                <button
                  key={cue.step}
                  type="button"
                  onClick={() => handleSeekToCue(idx, cue.timeSeconds)}
                  className={`text-left p-2 rounded-xs border transition-all cursor-pointer ${
                    activeCueIndex === idx
                      ? 'border-[#ccff00] bg-[#ccff00]/10 text-white'
                      : 'border-white/5 bg-white/2 hover:border-white/20 text-theme-muted hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-sport font-bold mb-0.5">
                    <span className="text-[#ccff00]">PHASE 0{cue.step}</span>
                    <span className="opacity-70">~0:{String(cue.timeSeconds).padStart(2, '0')}</span>
                  </div>
                  <div className="text-[11px] font-medium leading-tight truncate">
                    {cue.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Key Coaching Tips Banner */}
        {tips.length > 0 && (
          <div className="bg-[#ccff00]/5 border border-[#ccff00]/20 rounded-xs px-3 py-2 text-[11px] flex items-start gap-2">
            <span className="text-[#ccff00] font-bold uppercase font-mono-sport tracking-wider text-[10px] shrink-0 mt-0.5">
              PRO CUE:
            </span>
            <span className="text-gray-300">
              {tips[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
