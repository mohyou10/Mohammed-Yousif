import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  FastForward,
  Settings,
  Subtitles,
  Sparkles,
  Check
} from 'lucide-react';
import { YouTubePlayer } from './YouTubePlayer';
import { extractYouTubeId } from '../../utils/youtube';

interface VideoPlayerProps {
  src1080p: string;
  src4k?: string;
  poster: string;
  title: string;
  instructions?: string[];
  tips?: string[];
  durationMinutes?: number;
  youtubeVideoId?: string;
  youtubeVideoUrl?: string;
  videoAuthor?: string;
  exerciseId?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src1080p,
  src4k,
  poster,
  title,
  instructions = [],
  tips = [],
  durationMinutes = 15,
  youtubeVideoId,
  youtubeVideoUrl,
  videoAuthor,
  exerciseId,
}) => {
  const ytTarget = youtubeVideoId || youtubeVideoUrl || (extractYouTubeId(src1080p) ? src1080p : (extractYouTubeId(src4k) ? src4k : null));

  if (ytTarget) {
    return (
      <YouTubePlayer
        videoIdOrUrl={ytTarget}
        title={title}
        author={videoAuthor}
        poster={poster}
        instructions={instructions}
        tips={tips}
        durationMinutes={durationMinutes}
        exerciseId={exerciseId}
      />
    );
  }

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [quality, setQuality] = useState<'4K' | '1080p'>(src4k ? '4K' : '1080p');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Active source determination
  const activeSrc = quality === '4K' && src4k ? src4k : src1080p;

  // Auto-hide controls
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
        setShowSettingsMenu(false);
      }, 3000);
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().catch(() => {});
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Seek handler
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar) return;

    const rect = bar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * (video.duration || 1);
  };

  // Skip 10s
  const handleSkip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
  };

  // Quality switch (preserves exact playback position)
  const handleQualityChange = (newQuality: '4K' | '1080p') => {
    if (newQuality === quality) return;
    const video = videoRef.current;
    if (!video) return;

    const currentPos = video.currentTime;
    const wasPlaying = !video.paused;

    setQuality(newQuality);
    setShowSettingsMenu(false);

    // After state updates and re-renders src, restore position
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentPos;
        if (wasPlaying) {
          videoRef.current.play().catch(() => {});
        }
      }
    }, 50);
  };

  // Speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
  };

  // Volume toggle
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMute = !isMuted;
    video.muted = nextMute;
    setIsMuted(nextMute);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSkip(-5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSkip(5);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  // Format time (00:00)
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compute active caption based on progress
  const currentStepIndex = duration > 0 && instructions.length > 0
    ? Math.min(instructions.length - 1, Math.floor((currentTime / duration) * instructions.length))
    : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video bg-black rounded-sm overflow-hidden select-none group border border-theme shadow-2xl"
    >
      {/* HTML5 Native Video Tag */}
      <video
        ref={videoRef}
        src={activeSrc}
        poster={poster}
        playsInline
        loop
        preload="auto"
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Big Initial / Paused Play Overlay Icon */}
      {(!isPlaying || !hasStarted) && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video demonstration"
          className="absolute inset-0 w-full h-full bg-black/40 backdrop-blur-xs flex items-center justify-center cursor-pointer transition-opacity text-left border-0"
        >
          <div className="w-20 h-20 rounded-full bg-[#ccff00] text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>

          {/* Top Resolution and Title Badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-xs bg-[#ccff00] text-black font-mono-sport text-[11px] font-black uppercase">
                {quality === '4K' ? '4K ULTRA HD' : '1080P HD'}
              </span>
              <span className="text-xs font-bold text-white font-display drop-shadow-md">
                {title}
              </span>
            </div>
            <div className="px-2 py-0.5 rounded-xs bg-black/80 border border-white/20 text-white font-mono-sport text-[10px]">
              60 FPS FLUID
            </div>
          </div>
        </button>
      )}

      {/* Live Tactical Step Overlay (Captions) */}
      {showCaptions && instructions.length > 0 && isPlaying && (
        <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex justify-center">
          <div className="max-w-xl bg-black/85 backdrop-blur-md border-l-4 border-[#ccff00] px-4 py-2 rounded-xs shadow-lg animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-[10px] font-mono-sport text-[#ccff00] font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3" />
              <span>COACH TECHNIQUE CUE · STEP {currentStepIndex + 1} OF {instructions.length}</span>
            </div>
            <div className="text-xs text-white font-medium">
              {instructions[currentStepIndex]}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-8 transition-opacity duration-200 ${
          controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubbable Progress Timeline */}
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="relative w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer mb-3 transition-all group/scrub"
        >
          <div
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            className="h-full bg-[#ccff00] rounded-full relative"
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover/scrub:scale-100 transition-transform" />
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between text-white text-xs font-mono-sport">
          {/* Left: Play/Pause, Replay, Skip, Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="p-1.5 hover:text-[#ccff00] transition-colors cursor-pointer"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => handleSkip(-10)}
              aria-label="Rewind 10 seconds"
              className="p-1 hover:text-[#ccff00] transition-colors cursor-pointer"
              title="Rewind 10s (Left Arrow)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSkip(10)}
              aria-label="Fast forward 10 seconds"
              className="p-1 hover:text-[#ccff00] transition-colors cursor-pointer"
              title="Fast Forward 10s (Right Arrow)"
            >
              <FastForward className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
                className="p-1 hover:text-[#ccff00] transition-colors cursor-pointer"
                title="Mute / Unmute (M)"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 accent-[#ccff00] cursor-pointer hidden group-hover/vol:inline-block transition-all"
              />
            </div>

            {/* Time Stamp */}
            <span className="text-[11px] text-zinc-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right: Quality Switcher, Speed, Captions, Fullscreen */}
          <div className="flex items-center gap-2.5 relative">
            {/* Resolution Selector Button */}
            <button
              onClick={() => handleQualityChange(quality === '4K' ? '1080p' : '4K')}
              className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                quality === '4K'
                  ? 'bg-[#ccff00] text-black border-[#ccff00]'
                  : 'bg-white/10 text-white border-white/20 hover:border-[#ccff00]'
              }`}
              title="Switch video resolution (4K Ultra HD / 1080p Full HD)"
            >
              {quality}
            </button>

            {/* Speed Selector Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="px-2 py-0.5 rounded-xs bg-white/10 hover:bg-white/20 text-[10px] font-bold uppercase transition-colors cursor-pointer border border-white/20"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {/* Speed Popover Menu */}
              {showSettingsMenu && (
                <div className="absolute bottom-8 right-0 bg-black/95 border border-theme p-1.5 rounded-xs shadow-2xl flex flex-col gap-1 w-28 z-40">
                  <div className="text-[9px] font-mono-sport text-theme-muted uppercase px-2 py-0.5">Speed</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`text-left px-2 py-1 text-[11px] rounded-xs flex items-center justify-between cursor-pointer ${
                        playbackSpeed === s ? 'text-[#ccff00] font-bold bg-white/10' : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{s}x {s === 1 ? '(Normal)' : ''}</span>
                      {playbackSpeed === s && <Check className="w-3 h-3 text-[#ccff00]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Captions Toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                showCaptions ? 'text-[#ccff00]' : 'text-zinc-400 hover:text-white'
              }`}
              title="Toggle Technique Cue Captions"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:text-[#ccff00] transition-colors cursor-pointer"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
