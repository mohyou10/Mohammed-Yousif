export type Position =
  | 'Goalkeeper'
  | 'Centre-Back'
  | 'Full-Back'
  | 'Defensive Midfielder'
  | 'Central Midfielder'
  | 'Attacking Midfielder'
  | 'Winger'
  | 'Striker';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Academy / Semi-Pro';

export type MainCategory = 'Physical' | 'Technical' | 'Position-Specific' | 'Special';

export type SubCategory =
  // Physical
  | 'Legs'
  | 'Arms'
  | 'Core'
  | 'Speed'
  | 'Acceleration'
  | 'Agility'
  | 'Endurance'
  | 'Balance'
  | 'Explosiveness'
  | 'Mobility'
  // Technical
  | 'Shooting'
  | 'Passing'
  | 'Dribbling'
  | 'Ball Control'
  | 'First Touch'
  | 'Weak Foot'
  | 'Crossing'
  | 'Finishing'
  | 'Heading'
  | 'Ball Mastery'
  // Position-specific
  | 'Goalkeeper'
  | 'Defender'
  | 'Midfielder'
  | 'Winger'
  | 'Striker'
  // Special
  | 'Solo'
  | 'Partner'
  | 'Indoor'
  | 'Outdoor'
  | 'No-Equipment'
  | 'Advanced'
  | 'Beginner';

export type ExerciseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
export type ExerciseEquipment = 'No equipment' | 'Football only' | 'Cones' | 'Resistance bands' | 'Gym equipment';
export type ExerciseLocation = 'Indoor' | 'Outdoor' | 'Football pitch' | 'Home' | 'Gym';

export interface VideoSourceInfo {
  url4k: string;
  url1080p: string;
  thumbnailUrl: string;
  resolution: '4K Ultra HD (3840×2160)' | '1080p Full HD (1920×1080)';
  durationSeconds: number;
  fps: number;
  aspectRatio: '16:9';
}

export interface DetailedExercise {
  id: string;
  name: string;
  category: MainCategory;
  subCategory: SubCategory;
  difficulty: ExerciseDifficulty;
  durationMinutes: number;
  sets: number;
  reps: string;
  restSeconds: number;
  equipment: ExerciseEquipment;
  location: ExerciseLocation;
  targetedMusclesOrSkills: string[];
  benefits: string[];
  safetyTips: string[];
  description: string;
  instructions: string[];
  imageUrl: string;
  coverImage?: string;
  imageSource?: string;
  imageVerified?: boolean;
  videoUrl: string;
  youtubeVideoId?: string;
  youtubeVideoUrl?: string;
  videoTitle?: string;
  videoAuthor?: string;
  videoVerified?: boolean;
  videoInfo: VideoSourceInfo;
  commonMistakes?: string[];
  proTips?: string[];
  personalNotes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Technical' | 'Physical' | 'Tactical' | 'Warmup' | 'Finishing' | 'Recovery';
  durationMinutes: number;
  reps: string;
  sets: number;
  restSeconds: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  objective: string;
  explanation: string;
  coachTips: string;
  completed?: boolean;
}

export interface TrainingSession {
  id: string;
  date: string;
  title: string;
  type: 'Technical' | 'Physical' | 'Tactical' | 'Match Prep' | 'Recovery' | 'Position Specific' | 'Custom';
  durationMinutes: number;
  difficultyRating: number; // 1 to 10 RPE
  exercises: Exercise[];
  notes?: string;
  achievements?: string;
}

export interface GoalMilestone {
  text: string;
  completed: boolean;
}

export interface PlayerGoal {
  id: string;
  title: string;
  category: 'Technical' | 'Physical' | 'Tactical' | 'Mental' | 'Career';
  targetDate: string;
  progress: number; // 0 to 100
  milestones: GoalMilestone[];
  aiTip?: string;
}

export interface MentalJournalEntry {
  id: string;
  date: string;
  category: 'Confidence' | 'Mistake Reflection' | 'Match Mindset' | 'Motivation' | 'Trial Prep';
  moodRating: number; // 1 to 5
  notes: string;
  breakthrough?: string;
}

export interface RecoveryLog {
  id: string;
  date: string;
  sleepHours: number;
  sorenessLevel: number; // 1 to 5
  hydrationLiters: number;
  score: number; // 0 to 100
  notes?: string;
}

export interface PersonalRecords {
  jugglingRecord: number;
  sprintTime30m: number | null;
  wallPasses60s: number;
  beepTestLevel: number | null;
  pullUpsMax?: number;
  plankSeconds?: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  position: Position;
  experience: SkillLevel;
  preferredFoot: 'Left' | 'Right' | 'Both';
  trainingDaysPerWeek: number;
  availableTime: number; // in minutes
  equipment: string[];
  trainingLocation: string;
  strengths: string[];
  weaknesses: string[];
  goals: PlayerGoal[];
  sessions: TrainingSession[];
  bookmarks: string[];
  favoriteExerciseIds: string[];
  completedExerciseIds: string[];
  masteredSkills: string[];
  personalRecords: PersonalRecords;
  mentalJournal: MentalJournalEntry[];
  recoveryLogs: RecoveryLog[];
  unlockedBadges: string[];
  completedChallenges: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export interface DailyInsight {
  insight: string;
  dailyChallenge: string;
  focusArea: string;
  quote: string;
}
