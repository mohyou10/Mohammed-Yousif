import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_EXERCISES, EXERCISES_LIBRARY, getVideoKeyForExercise, getCoverImageForExercise } from './exercisesData.js';

test('Exercise library has more than 150 professional exercises', () => {
  assert.ok(ALL_EXERCISES.length >= 150, `Expected at least 150 exercises, found ${ALL_EXERCISES.length}`);
});

test('100% of exercises have valid cover images (both imageUrl and coverImage)', () => {
  let missingImages = 0;
  for (const ex of ALL_EXERCISES) {
    if (!ex.imageUrl || !ex.imageUrl.startsWith('http') || !ex.coverImage || !ex.coverImage.startsWith('http')) {
      missingImages++;
    }
  }
  assert.equal(missingImages, 0, `All exercises must have valid HTTP/HTTPS cover image URLs`);
});

test('100% of exercises have valid 4K video URLs and 1080p fallback info', () => {
  let missingVideos = 0;
  for (const ex of ALL_EXERCISES) {
    if (!ex.videoUrl || !ex.videoUrl.endsWith('_4k.mp4')) {
      missingVideos++;
    }
    if (!ex.videoInfo || !ex.videoInfo.url1080p || !ex.videoInfo.url4k) {
      missingVideos++;
    }
  }
  assert.equal(missingVideos, 0, `All exercises must have 4K video URL and 1080p fallback info`);
});

test('getVideoKeyForExercise maps correctly across main football skills', () => {
  assert.equal(getVideoKeyForExercise({ name: 'Henry Far-Post Finish', subCategory: 'Finishing' }), 'finishing');
  assert.equal(getVideoKeyForExercise({ name: 'Wall Pass Rhythm', subCategory: 'Passing' }), 'passing');
  assert.equal(getVideoKeyForExercise({ name: 'Speed Ladder Sprint', subCategory: 'Speed' }), 'speed');
  assert.equal(getVideoKeyForExercise({ name: 'Goalkeeper Diving Save', subCategory: 'Goalkeeper' }), 'goalkeeper');
  assert.equal(getVideoKeyForExercise({ name: 'Core Plank Hold', subCategory: 'Core' }), 'core');
});

test('getCoverImageForExercise returns reliable photography image for any category', () => {
  const img = getCoverImageForExercise({ name: 'Speed Sprint Drill', subCategory: 'Speed' });
  assert.ok(img.startsWith('https://images.unsplash.com/'), 'Expected Unsplash football photo URL');
});
