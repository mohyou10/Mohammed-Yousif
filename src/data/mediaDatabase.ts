import { ExerciseMediaRecord, MediaAuditSummary } from '../types/media';
import mediaDataRaw from '../../data/media_database.json';

// In-memory typed cache of the media database
let mediaDatabaseMap: Record<string, ExerciseMediaRecord> = { ...mediaDataRaw } as Record<string, ExerciseMediaRecord>;

/**
 * Returns media record for a specific exercise by ID
 */
export function getMediaForExercise(exerciseId: string): ExerciseMediaRecord | null {
  if (!exerciseId) return null;
  return mediaDatabaseMap[exerciseId] || null;
}

/**
 * Returns all media records as an array
 */
export function getAllMediaRecords(): ExerciseMediaRecord[] {
  return Object.values(mediaDatabaseMap);
}

/**
 * Updates an in-memory record (client side update or after sync)
 */
export function updateClientMediaRecord(record: ExerciseMediaRecord): void {
  mediaDatabaseMap[record.id] = { ...record };
}

/**
 * Replaces full client database (after backend fetch)
 */
export function setClientMediaDatabase(records: Record<string, ExerciseMediaRecord>): void {
  mediaDatabaseMap = { ...records };
}

/**
 * Computes live audit metrics across the database
 */
export function getMediaAuditSummary(): MediaAuditSummary {
  const records = getAllMediaRecords();
  const total = records.length;

  let verifiedVideos = 0;
  let needsReviewVideos = 0;
  let brokenVideos = 0;
  let missingVideos = 0;

  let verifiedImages = 0;
  let needsReviewImages = 0;
  let brokenImages = 0;

  for (const r of records) {
    if (r.videoVerificationStatus === 'VERIFIED') verifiedVideos++;
    else if (r.videoVerificationStatus === 'NEEDS_REVIEW') needsReviewVideos++;
    else if (r.videoVerificationStatus === 'BROKEN') brokenVideos++;
    else if (r.videoVerificationStatus === 'MISSING') missingVideos++;

    if (r.imageVerificationStatus === 'VERIFIED') verifiedImages++;
    else if (r.imageVerificationStatus === 'NEEDS_REVIEW') needsReviewImages++;
    else if (r.imageVerificationStatus === 'BROKEN') brokenImages++;
  }

  // Calculate health as percentage of verified media
  const totalSlots = total * 2;
  const verifiedSlots = verifiedVideos + verifiedImages;
  const healthPercentage = totalSlots > 0 ? Math.round((verifiedSlots / totalSlots) * 100) : 0;

  return {
    totalExercises: total,
    verifiedVideos,
    verifiedImages,
    needsReviewVideos,
    needsReviewImages,
    brokenVideos,
    brokenImages,
    missingVideos,
    healthPercentage,
    lastAuditTimestamp: new Date().toISOString()
  };
}
