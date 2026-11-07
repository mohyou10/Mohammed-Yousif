import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractYouTubeId,
  validateYouTubeUrlFormat,
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
  getYouTubeThumbnailUrl,
  identifyYouTubeFormat,
} from './youtube.js';

describe('YouTube Utility Tests', () => {
  const sampleId = 'Yn7aqLkeF0U';

  test('correctly parses all 5 YouTube URL formats', () => {
    // 1. Standard watch URL
    const watchUrl = `https://www.youtube.com/watch?v=${sampleId}&feature=share`;
    assert.equal(extractYouTubeId(watchUrl), sampleId);
    assert.equal(identifyYouTubeFormat(watchUrl), 'watch_param');

    // 2. youtu.be short URL
    const shortUrl = `https://youtu.be/${sampleId}?t=30`;
    assert.equal(extractYouTubeId(shortUrl), sampleId);
    assert.equal(identifyYouTubeFormat(shortUrl), 'short_domain');

    // 3. YouTube Shorts URL
    const shortsUrl = `https://www.youtube.com/shorts/${sampleId}`;
    assert.equal(extractYouTubeId(shortsUrl), sampleId);
    assert.equal(identifyYouTubeFormat(shortsUrl), 'shorts');

    // 4. YouTube Live URL
    const liveUrl = `https://www.youtube.com/live/${sampleId}`;
    assert.equal(extractYouTubeId(liveUrl), sampleId);
    assert.equal(identifyYouTubeFormat(liveUrl), 'live');

    // 5. YouTube Embed URL (including youtube-nocookie)
    const embedUrl = `https://www.youtube-nocookie.com/embed/${sampleId}`;
    assert.equal(extractYouTubeId(embedUrl), sampleId);
    assert.equal(identifyYouTubeFormat(embedUrl), 'embed');
  });

  test('supports bare 11-character video ID', () => {
    assert.equal(extractYouTubeId(sampleId), sampleId);
    assert.equal(identifyYouTubeFormat(sampleId), 'raw_id');
    assert.equal(validateYouTubeUrlFormat(sampleId), true);
  });

  test('rejects invalid or malformed strings', () => {
    assert.equal(extractYouTubeId(''), null);
    assert.equal(extractYouTubeId('not-a-youtube-url'), null);
    assert.equal(extractYouTubeId('https://vimeo.com/123456789'), null);
    assert.equal(extractYouTubeId('https://youtube.com/watch?v=tooShort'), null);
    assert.equal(validateYouTubeUrlFormat('fake_id'), false);
  });

  test('generates valid privacy-enhanced embed URL', () => {
    const embedUrl = getYouTubeEmbedUrl(sampleId, { start: 15, autoplay: true });
    assert.ok(embedUrl.startsWith('https://www.youtube-nocookie.com/embed/Yn7aqLkeF0U?'));
    assert.ok(embedUrl.includes('enablejsapi=1'));
    assert.ok(embedUrl.includes('modestbranding=1'));
    assert.ok(embedUrl.includes('autoplay=1'));
    assert.ok(embedUrl.includes('start=15'));
  });

  test('generates canonical watch URL', () => {
    const watchUrl = getYouTubeWatchUrl(`https://youtu.be/${sampleId}`);
    assert.equal(watchUrl, `https://www.youtube.com/watch?v=${sampleId}`);
  });

  test('generates proper thumbnail URLs', () => {
    const hqThumb = getYouTubeThumbnailUrl(sampleId, 'hqdefault');
    assert.equal(hqThumb, `https://i.ytimg.com/vi/${sampleId}/hqdefault.jpg`);

    const maxThumb = getYouTubeThumbnailUrl(sampleId, 'maxresdefault');
    assert.equal(maxThumb, `https://i.ytimg.com/vi/${sampleId}/maxresdefault.jpg`);
  });
});
