export type MediaVerificationStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'BROKEN' | 'MISSING';

export interface ExerciseMediaRecord {
  id: string; // unique exercise ID (e.g. 'phys-leg-1')
  exerciseName: string;
  category: string;
  subCategory: string;
  coverImageUrl: string;
  imageSource: string;
  imageAlt: string;
  imageVerified: boolean;
  imageVerificationStatus: MediaVerificationStatus;
  imageLastChecked?: string;
  youtubeVideoId: string;
  youtubeVideoUrl: string;
  videoTitle: string;
  videoAuthor?: string;
  videoVerified: boolean;
  videoVerificationStatus: MediaVerificationStatus;
  videoLastChecked?: string;
  notes?: string;
}

export interface MediaAuditSummary {
  totalExercises: number;
  verifiedVideos: number;
  verifiedImages: number;
  needsReviewVideos: number;
  needsReviewImages: number;
  brokenVideos: number;
  brokenImages: number;
  missingVideos: number;
  healthPercentage: number;
  lastAuditTimestamp: string;
}
