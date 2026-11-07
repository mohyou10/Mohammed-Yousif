/**
 * PRO11 YouTube Media Utility
 * Handles parsing all 5 standard YouTube URL formats, embed URL generation,
 * thumbnail retrieval, and format validation.
 */

// Regex for the 5 standard YouTube URL variations and raw 11-char ID
// 1. youtube.com/watch?v=ID
// 2. youtu.be/ID
// 3. youtube.com/shorts/ID
// 4. youtube.com/live/ID
// 5. youtube.com/embed/ID
const YOUTUBE_PATTERNS = [
  // standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]{11})(?:&.*)?/i,
  // short URL: https://youtu.be/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?/i,
  // shorts: https://www.youtube.com/shorts/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:\?.*)?/i,
  // live: https://www.youtube.com/live/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})(?:\?.*)?/i,
  // embed: https://www.youtube.com/embed/VIDEO_ID or youtube-nocookie.com/embed/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?.*)?/i,
];

// Raw 11-character alphanumeric/dash/underscore video ID
const RAW_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extracts a valid 11-character YouTube Video ID from any of the 5 URL formats or bare ID.
 */
export function extractYouTubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-character ID
  if (RAW_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  // Test against each format pattern
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1] && RAW_ID_PATTERN.test(match[1])) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validates if the input is in one of the 5 allowed YouTube URL formats or a valid ID.
 */
export function validateYouTubeUrlFormat(input: string | null | undefined): boolean {
  return extractYouTubeId(input) !== null;
}

/**
 * Generates privacy-enhanced YouTube embed URL (youtube-nocookie.com)
 * with standard player options for reliable inline playback.
 */
export function getYouTubeEmbedUrl(
  input: string,
  options: {
    autoplay?: boolean;
    start?: number;
    enableJsApi?: boolean;
    controls?: boolean;
    rel?: number;
  } = {}
): string {
  const videoId = extractYouTubeId(input);
  if (!videoId) return '';

  const {
    autoplay = false,
    start,
    enableJsApi = true,
    controls = true,
    rel = 0,
  } = options;

  const params = new URLSearchParams();
  if (enableJsApi) params.set('enablejsapi', '1');
  if (controls) params.set('controls', '1');
  else params.set('controls', '0');
  params.set('rel', String(rel));
  params.set('modestbranding', '1');
  params.set('playsinline', '1');
  params.set('origin', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  if (autoplay) params.set('autoplay', '1');
  if (typeof start === 'number' && start > 0) params.set('start', String(Math.floor(start)));

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Returns canonical standard YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
 */
export function getYouTubeWatchUrl(input: string): string {
  const videoId = extractYouTubeId(input);
  if (!videoId) return '';
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Returns standard YouTube video thumbnail URL
 * Qualities:
 * - 'maxresdefault' (1280x720)
 * - 'hqdefault' (480x360)
 * - 'mqdefault' (320x180)
 */
export function getYouTubeThumbnailUrl(
  input: string,
  quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' = 'hqdefault'
): string {
  const videoId = extractYouTubeId(input);
  if (!videoId) return '';
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Identifies the format name of the provided YouTube URL for debugging/audit logs
 */
export function identifyYouTubeFormat(url: string): string {
  if (RAW_ID_PATTERN.test(url.trim())) return 'raw_id';
  if (/youtube\.com\/watch/i.test(url)) return 'watch_param';
  if (/youtu\.be/i.test(url)) return 'short_domain';
  if (/youtube\.com\/shorts/i.test(url)) return 'shorts';
  if (/youtube\.com\/live/i.test(url)) return 'live';
  if (/youtube(?:-nocookie)?\.com\/embed/i.test(url)) return 'embed';
  return 'unknown';
}
