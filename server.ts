import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Local JSON Database for persistent user storage
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'pro11_store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface UserDataStore {
  users: Record<string, any>;
}

function loadDatabase(): UserDataStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  return { users: {} };
}

function saveDatabase(data: UserDataStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// Gemini AI Client helper
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// Health & System status
app.get('/api/health', (req: Request, res: Response) => {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    app: 'PRO11',
    aiConfigured: hasApiKey,
  });
});

// Authentication / Profile
app.post('/api/auth/login-or-register', (req: Request, res: Response) => {
  const { name, email, position, experience } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required' });
  }

  const userId = (email && email.trim()) ? email.trim().toLowerCase() : name.trim().toLowerCase().replace(/\s+/g, '_');
  const db = loadDatabase();

  if (!db.users[userId]) {
    // Create new clean profile without fake history
    db.users[userId] = {
      id: userId,
      name: name.trim(),
      email: email?.trim() || '',
      position: position || 'Central Midfielder',
      experience: experience || 'Intermediate',
      preferredFoot: 'Right',
      age: 18,
      createdAt: new Date().toISOString(),
      trainingDaysPerWeek: 4,
      equipment: ['Football', 'Cones', 'Wall/Rebounder'],
      trainingLocation: 'Pitch / Grass',
      strengths: ['Passing', 'Vision', 'Work rate'],
      weaknesses: ['Weak foot finishing', 'Acceleration over 10m'],
      goals: [
        {
          id: 'goal-1',
          title: 'Master 100 consecutive weak-foot wall passes',
          category: 'Technical',
          targetDate: '2026-12-01',
          progress: 0,
          milestones: [
            { text: 'Complete 30 clean touches against wall', completed: false },
            { text: 'Complete 60 two-touch weak-foot passes', completed: false },
            { text: 'Achieve 100 one-touch weak-foot rhythm', completed: false }
          ],
          aiTip: 'Keep your standing foot planted firmly 15cm from the ball, locking your weak ankle through impact.'
        }
      ],
      sessions: [],
      bookmarks: [],
      masteredSkills: [],
      personalRecords: {
        jugglingRecord: 0,
        sprintTime30m: null,
        wallPasses60s: 0,
        beepTestLevel: null
      },
      mentalJournal: [],
      recoveryLogs: [],
      unlockedBadges: []
    };
    saveDatabase(db);
  }

  return res.json({ user: db.users[userId] });
});

// Get user data
app.get('/api/user-data', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_player';
  const db = loadDatabase();
  const user = db.users[userId] || null;
  res.json({ user });
});

// Save user data
app.post('/api/user-data', (req: Request, res: Response) => {
  const { userId, data } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  const db = loadDatabase();
  db.users[userId] = {
    ...(db.users[userId] || {}),
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  res.json({ success: true, user: db.users[userId] });
});

// ----------------------------------------------------
// CENTRAL MEDIA DATABASE & VALIDATION ENGINE
// ----------------------------------------------------
const MEDIA_DB_FILE = path.join(DATA_DIR, 'media_database.json');

function loadMediaDatabase(): Record<string, any> {
  try {
    if (fs.existsSync(MEDIA_DB_FILE)) {
      const raw = fs.readFileSync(MEDIA_DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading media database file:', err);
  }
  return {};
}

function saveMediaDatabase(data: Record<string, any>) {
  try {
    fs.writeFileSync(MEDIA_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving media database file:', err);
  }
}

async function validateYouTubeOembed(videoIdOrUrl: string): Promise<{ valid: boolean; videoId?: string; title?: string; author?: string; error?: string }> {
  if (!videoIdOrUrl) {
    return { valid: false, error: 'Empty video ID or URL' };
  }
  const trimmed = videoIdOrUrl.trim();
  const rawMatch = trimmed.match(/^[a-zA-Z0-9_-]{11}$/);
  let id = rawMatch ? rawMatch[0] : null;

  if (!id) {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]{11})/i,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i,
      /(?:https?:\/\/)?(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
    ];
    for (const p of patterns) {
      const m = trimmed.match(p);
      if (m && m[1]) {
        id = m[1];
        break;
      }
    }
  }

  if (!id) {
    return { valid: false, error: 'Invalid YouTube URL or ID format' };
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    const res = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'PRO11-Media-Validator/1.0' },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data: any = await res.json();
      return {
        valid: true,
        videoId: id,
        title: data.title,
        author: data.author_name,
      };
    } else {
      return {
        valid: false,
        videoId: id,
        error: `YouTube oEmbed returned HTTP ${res.status} (video is private, deleted, or embeds disabled)`,
      };
    }
  } catch (err: any) {
    return { valid: false, videoId: id, error: `Validation request error: ${err.message}` };
  }
}

async function validateImageUrl(url: string): Promise<{ valid: boolean; contentType?: string; status?: number; error?: string }> {
  if (!url || !url.startsWith('http')) {
    return { valid: false, error: 'Invalid URL format' };
  }
  try {
    let res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'PRO11-Media-Validator/1.0' },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok && (res.status === 405 || res.status === 403)) {
      res = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'PRO11-Media-Validator/1.0',
          'Range': 'bytes=0-100',
        },
        signal: AbortSignal.timeout(6000),
      });
    }

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      return {
        valid: true,
        contentType,
        status: res.status,
      };
    } else {
      return {
        valid: false,
        status: res.status,
        error: `HTTP ${res.status}`,
      };
    }
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

// 1. Get all media records
app.get('/api/media', (req: Request, res: Response) => {
  const mediaDb = loadMediaDatabase();
  res.json({ records: Object.values(mediaDb), total: Object.keys(mediaDb).length });
});

// 2. Get media audit summary
app.get('/api/media/audit', (req: Request, res: Response) => {
  const mediaDb = loadMediaDatabase();
  const records = Object.values(mediaDb);
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

  const totalSlots = total * 2;
  const verifiedSlots = verifiedVideos + verifiedImages;
  const healthPercentage = totalSlots > 0 ? Math.round((verifiedSlots / totalSlots) * 100) : 0;

  res.json({
    totalExercises: total,
    verifiedVideos,
    verifiedImages,
    needsReviewVideos,
    needsReviewImages,
    brokenVideos,
    brokenImages,
    missingVideos,
    healthPercentage,
    lastAuditTimestamp: new Date().toISOString(),
  });
});

// 3. Get media for single exercise
app.get('/api/media/:exerciseId', (req: Request, res: Response) => {
  const { exerciseId } = req.params;
  const mediaDb = loadMediaDatabase();
  const record = mediaDb[exerciseId];
  if (!record) {
    return res.status(404).json({ error: `No media found for exercise ${exerciseId}` });
  }
  res.json({ record });
});

// 4. Update media for single exercise
app.put('/api/media/:exerciseId', async (req: Request, res: Response) => {
  const { exerciseId } = req.params;
  const { coverImageUrl, youtubeVideoUrl, imageSource, imageAlt, notes, runAutoVerify = true } = req.body;

  const mediaDb = loadMediaDatabase();
  const existing = mediaDb[exerciseId] || { id: exerciseId };

  let updatedRecord = {
    ...existing,
    ...(coverImageUrl !== undefined ? { coverImageUrl } : {}),
    ...(youtubeVideoUrl !== undefined ? { youtubeVideoUrl } : {}),
    ...(imageSource !== undefined ? { imageSource } : {}),
    ...(imageAlt !== undefined ? { imageAlt } : {}),
    ...(notes !== undefined ? { notes } : {}),
  };

  // If autoverify requested on update
  if (runAutoVerify) {
    if (updatedRecord.youtubeVideoUrl) {
      const vCheck = await validateYouTubeOembed(updatedRecord.youtubeVideoUrl);
      if (vCheck.valid) {
        updatedRecord.youtubeVideoId = vCheck.videoId;
        updatedRecord.videoTitle = vCheck.title || updatedRecord.videoTitle;
        updatedRecord.videoAuthor = vCheck.author || updatedRecord.videoAuthor;
        updatedRecord.videoVerified = true;
        updatedRecord.videoVerificationStatus = 'VERIFIED';
      } else {
        updatedRecord.videoVerified = false;
        updatedRecord.videoVerificationStatus = 'BROKEN';
        updatedRecord.notes = (updatedRecord.notes || '') + ` [Video error: ${vCheck.error}]`;
      }
      updatedRecord.videoLastChecked = new Date().toISOString();
    }

    if (updatedRecord.coverImageUrl) {
      const imgCheck = await validateImageUrl(updatedRecord.coverImageUrl);
      if (imgCheck.valid) {
        updatedRecord.imageVerified = true;
        updatedRecord.imageVerificationStatus = 'VERIFIED';
      } else {
        updatedRecord.imageVerified = false;
        updatedRecord.imageVerificationStatus = 'BROKEN';
      }
      updatedRecord.imageLastChecked = new Date().toISOString();
    }
  }

  mediaDb[exerciseId] = updatedRecord;
  saveMediaDatabase(mediaDb);

  res.json({ success: true, record: updatedRecord });
});

// 5. Validate single media item without saving
app.post('/api/media/validate-single', async (req: Request, res: Response) => {
  const { imageUrl, videoUrlOrId } = req.body;

  let imageResult = null;
  if (imageUrl) {
    imageResult = await validateImageUrl(imageUrl);
  }

  let videoResult = null;
  if (videoUrlOrId) {
    videoResult = await validateYouTubeOembed(videoUrlOrId);
  }

  res.json({
    image: imageResult,
    video: videoResult,
    timestamp: new Date().toISOString(),
  });
});

// 6. Automated batch validation engine
app.post('/api/media/validate-batch', async (req: Request, res: Response) => {
  const { limit = 30, offset = 0 } = req.body;
  const mediaDb = loadMediaDatabase();
  const allKeys = Object.keys(mediaDb);
  const targetKeys = allKeys.slice(offset, offset + limit);

  const results: any[] = [];
  const now = new Date().toISOString();

  for (const key of targetKeys) {
    const record = mediaDb[key];
    if (!record) continue;

    // Validate YouTube
    if (record.youtubeVideoUrl || record.youtubeVideoId) {
      const vTarget = record.youtubeVideoUrl || record.youtubeVideoId;
      const vCheck = await validateYouTubeOembed(vTarget);
      if (vCheck.valid) {
        record.videoVerified = true;
        record.videoVerificationStatus = 'VERIFIED';
        if (vCheck.title) record.videoTitle = vCheck.title;
        if (vCheck.author) record.videoAuthor = vCheck.author;
      } else {
        record.videoVerified = false;
        record.videoVerificationStatus = 'BROKEN';
      }
      record.videoLastChecked = now;
    } else {
      record.videoVerificationStatus = 'MISSING';
      record.videoVerified = false;
    }

    // Validate image
    if (record.coverImageUrl) {
      const imgCheck = await validateImageUrl(record.coverImageUrl);
      if (imgCheck.valid) {
        record.imageVerified = true;
        record.imageVerificationStatus = 'VERIFIED';
      } else {
        record.imageVerified = false;
        record.imageVerificationStatus = 'BROKEN';
      }
      record.imageLastChecked = now;
    }

    mediaDb[key] = record;
    results.push({
      id: key,
      videoStatus: record.videoVerificationStatus,
      imageStatus: record.imageVerificationStatus,
    });
  }

  saveMediaDatabase(mediaDb);

  res.json({
    processed: results.length,
    offset,
    totalRecords: allKeys.length,
    results,
    hasMore: offset + limit < allKeys.length,
  });
});


// ----------------------------------------------------
// AI COACH CHAT ENDPOINT
// ----------------------------------------------------
app.post('/api/coach/chat', async (req: Request, res: Response) => {
  const { message, history = [], userProfile = {} } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const ai = getGenAI();
  if (!ai) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please check your AI Studio Secrets panel.',
    });
  }

  try {
    const profileContext = `
Athlete Dossier:
- Name: ${userProfile.name || 'Athlete'}
- Position: ${userProfile.position || 'Footballer'}
- Age: ${userProfile.age || 'Not specified'}
- Preferred Foot: ${userProfile.preferredFoot || 'Right'}
- Experience Level: ${userProfile.experience || 'Developing'}
- Strengths: ${Array.isArray(userProfile.strengths) ? userProfile.strengths.join(', ') : 'Ball control'}
- Weaknesses to target: ${Array.isArray(userProfile.weaknesses) ? userProfile.weaknesses.join(', ') : 'Speed, weak foot'}
- Completed Training Sessions: ${userProfile.sessionCount || 0}
- Current Training Streak: ${userProfile.streak || 0} days
`;

    const systemInstruction = `
You are the Head Football Coach and Elite Performance Director at PRO11 — a personal 24/7 AI football coach.
You have the credentials and experience of a UEFA Pro Licensed Coach and elite Sports Scientist.

Your Coaching Philosophy:
- Direct, disciplined, highly motivating, realistic, and laser-focused on practical development.
- You treat every player like a future professional footballer, regardless of their current level.
- You do NOT give vague fluff like "just practice more". You provide concrete training parameters: sets, reps, distance, rest intervals, mechanical cues, ball placement, and body orientation.
- When an athlete says they struggle with a skill, diagnose the mechanics (e.g. standing foot placement, hip angle, weight shift, head position, scan timing).
- Ask clarifying diagnostic questions when needed to tailor the drill or tactical solution.
- For mentality & mental game, cultivate elite stoicism, focus on what the player controls, teach visualization, pre-game routines, and resilience after mistakes.
- If an athlete shares deep emotional distress or crisis, respond with genuine human warmth and empathy, and urge them to reach out to a trusted family member, coach, or qualified medical professional.

Format your responses with clean, punchy typography:
Use bullet points, bold key cues, and structured drill breakdowns. Keep it sharp and utilitarian.

${profileContext}
`;

    // Format chat contents
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role && item.text) {
          contents.push({
            role: item.role === 'coach' || item.role === 'model' ? 'model' : 'user',
            parts: [{ text: item.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'Keep your focus locked on the pitch. What specific drill or scenario shall we break down next?';
    res.json({ reply });
  } catch (err: any) {
    console.error('Gemini chat error:', err?.message || err);

    // If API quota or permission requires paid key, provide expert UEFA Pro coaching response
    const msgLower = message.toLowerCase();
    let expertResponse = '';

    if (msgLower.includes('dribbl') || msgLower.includes('ball control')) {
      expertResponse = `Let's break down your dribbling mechanics right now.\n\nFirst, we need to diagnose whether your breakdown is happening in:\n1. **Close Ball Control**: Touches drifting too far from your laces into the defender's reach.\n2. **Change of Direction**: Not dropping your center of gravity before the plant step.\n3. **Decisive Acceleration**: Beating the player on the first touch but not pulling away on the second.\n\n**Immediate Pitch Drill: The 4-Gate Chaos Slalom**\n- **Setup**: Place 4 cone gates (1m wide) in a 10x10m square.\n- **Execution**: 45 seconds of continuous tight-space sole rolls, outside-foot cuts, and sharp accelerations through any open gate.\n- **Repetitions**: 4 sets of 45 seconds (30s rest between sets).\n- **Coaching Point**: Stay on the balls of your feet. Your head must scan between touches, not remain locked on the ball.\n\nTell me which of the 3 areas you struggle with most so we can fine-tune your next session.`;
    } else if (msgLower.includes('weak foot') || msgLower.includes('left foot') || msgLower.includes('right foot')) {
      expertResponse = `Developing your weak foot is 80% mechanics and 20% neuromuscular habit.\n\n**The 3 Mechanical Flaws Most Players Make:**\n1. Standing foot planted too close or too far from the ball (optimal is 15-20cm parallel).\n2. Ankle bone loose at the moment of contact (you must lock the joint rigid).\n3. Rushing the follow-through instead of driving through the ball equator.\n\n**The Non-Negotiable Routine:**\n- 150 consecutive weak-foot wall passes every single morning before touching your dominant foot.\n- Start 3 meters from the wall, 1-touch rhythm, targeting a chalked 30x30cm square.\n\nLock the ankle and commit to the reps. What position are you playing so we tailor the pass distance?`;
    } else if (msgLower.includes('trial') || msgLower.includes('scout') || msgLower.includes('academy')) {
      expertResponse = `Here is the unfiltered truth about what academy scouts look for in the first 10 minutes of a trial:\n\n1. **Body Language After Errors**: If you misplace a pass and throw your hands up or look at the sky, scouts write you off. If you immediately clap your hands and sprint 5 meters to win it back, you jump to the top of their notes.\n2. **Head Scan Frequency**: Xavi and De Bruyne scan 4-6 times every 10 seconds. Scouts count your head checks before the ball reaches your boot.\n3. **Keep the First 3 Plays Simple**: Do not attempt a 40-yard rabona on your first touch. Play two clean 1-touch passes to settle your nervous system.\n4. **Communication Volume**: Be the loudest, most organized player on the pitch. Direct your full-backs and call for the ball with authority.\n\nWhat date is your trial, and what position are you showcasing?`;
    } else if (msgLower.includes('confiden') || msgLower.includes('mistake') || msgLower.includes('benched') || msgLower.includes('sad')) {
      expertResponse = `Every elite footballer—from Cristiano Ronaldo to Kevin De Bruyne—has suffered slumps and made humiliating mistakes in front of thousands.\n\n**The 3-Second Mistake Reset Protocol:**\n1. **Physical Trigger**: The moment you make an error, do NOT drop your head. Clap your hands once firmly.\n2. **Diaphragmatic Exhale**: Blow the breath out through pursed lips. This triggers your parasympathetic nervous system and stops adrenaline spikes.\n3. **Immediate Target**: Focus exclusively on the next 5 meters of pitch real estate. Win the next duel.\n\nYou cannot change what happened 10 seconds ago. You have 100% control over your next decision. We are going to build this mental resilience day by day.`;
    } else {
      expertResponse = `Understood, ${userProfile.name || 'Athlete'}. Let's address this from an elite football perspective.\n\nTo develop into a professional-standard ${userProfile.position || 'footballer'}, everything we do must be measured by **game-speed execution**, **tactical awareness**, and **physical resilience**.\n\nWhat is the exact scenario you encountered on the pitch or in training? Give me the specifics: pitch location, pressure level, and what your body felt.`;
    }

    res.json({
      reply: expertResponse + `\n\n*(Note: To unlock live streaming Gemini responses, configure a billing-enabled key in Settings > Secrets.)*`
    });
  }
});

// ----------------------------------------------------
// AI TRAINING PLAN GENERATOR
// ----------------------------------------------------
app.post('/api/training/generate-plan', async (req: Request, res: Response) => {
  const profile = req.body;
  const ai = getGenAI();
  if (!ai) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
  }

  try {
    const prompt = `
Create a comprehensive, personalized professional training curriculum for this footballer:
- Age: ${profile.age || 18}
- Position: ${profile.position || 'Midfielder'}
- Experience: ${profile.experience || 'Club player'}
- Preferred Foot: ${profile.preferredFoot || 'Right'}
- Available Training Time per session: ${profile.availableTime || 60} minutes
- Equipment: ${Array.isArray(profile.equipment) ? profile.equipment.join(', ') : profile.equipment || 'Ball and cones'}
- Training Location: ${profile.trainingLocation || 'Pitch / Grass'}
- Days per week: ${profile.daysPerWeek || 4}
- Key Strengths: ${Array.isArray(profile.strengths) ? profile.strengths.join(', ') : profile.strengths || 'Stamina'}
- Critical Weaknesses to fix: ${Array.isArray(profile.weaknesses) ? profile.weaknesses.join(', ') : profile.weaknesses || 'First touch, weak foot'}
- Primary Goal: ${profile.goals || 'Sign for academy or make first team'}

Generate a structured plan with:
1. "weeklySchedule": array of 7 day objects (Day 1 to Day 7) with { day: string, type: "Technical" | "Physical" | "Tactical" | "Match Prep" | "Recovery", title: string, durationMinutes: number, focus: string }
2. "dailyTrainingPlan": array of 4 to 6 detailed exercises for Today's Primary Session.
Each exercise must strictly have:
- id: unique string
- name: string (e.g. "Cone Weave to Weak-Foot Wall Strike")
- category: "Technical" | "Physical" | "Tactical" | "Warmup" | "Finishing"
- durationMinutes: number
- reps: string (e.g. "12 reps per foot")
- sets: number (e.g. 3)
- restSeconds: number (e.g. 45)
- difficulty: "Beginner" | "Intermediate" | "Advanced" | "Pro"
- objective: string
- explanation: string (step by step execution instructions)
- coachTips: string (pro mechanics advice)
3. "monthlyThemes": array of 4 week themes (Week 1 to Week 4) for this month's microcycle.

Return ONLY a valid JSON object matching this structure. Do not include markdown code block backticks if possible, or standard JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: 'You are an elite sports scientist and UEFA Pro coach producing a rigorous, high-performance training plan in valid JSON format only.',
      },
    });

    const raw = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // fallback if regex needed
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    }

    res.json(parsed);
  } catch (err: any) {
    console.error('Plan generation error:', err?.message || err);
    // Dynamic UEFA fallback tailored to position and parameters
    res.json({
      weeklySchedule: [
        { day: 'Day 1 (Mon)', type: 'Technical', title: `${profile.position || 'Midfield'} Ball Mastery & First Touch`, durationMinutes: 60, focus: 'Wall passes, 1-touch receiving under pressure' },
        { day: 'Day 2 (Tue)', type: 'Physical', title: 'First 10m Acceleration & Deceleration Agility', durationMinutes: 50, focus: 'Explosive drive strides, pro agility 5-10-5' },
        { day: 'Day 3 (Wed)', type: 'Tactical', title: `${profile.position || 'Positional'} Space Creation & Scanning`, durationMinutes: 50, focus: 'Half-space infiltration, 360 shoulder checks' },
        { day: 'Day 4 (Thu)', type: 'Recovery', title: 'Active Hip Mobility, Foam Rolling & Sleep Reset', durationMinutes: 40, focus: 'Adductor release, ankle dorsiflexion, diaphragmatic breathing' },
        { day: 'Day 5 (Fri)', type: 'Match Prep', title: 'High-Tempo Finishing & Set-Piece Polish', durationMinutes: 50, focus: 'Edge of box shooting, 1v1 separation' },
        { day: 'Day 6 (Sat)', type: 'Technical', title: 'Full Match Play / High-Speed Scrimmage', durationMinutes: 90, focus: 'Game-speed competitive execution' },
        { day: 'Day 7 (Sun)', type: 'Recovery', title: 'Full Physiological Reset & Tactical Film Review', durationMinutes: 30, focus: 'Down-regulate central nervous system' }
      ],
      dailyTrainingPlan: [
        {
          id: `drill-w1-${Date.now()}`,
          name: 'Dynamic FIFA 11+ Muscle Priming',
          category: 'Warmup',
          durationMinutes: 10,
          reps: '10 reps each leg',
          sets: 2,
          restSeconds: 30,
          difficulty: 'Intermediate',
          objective: 'Lubricate hip joints and elevate core temperature for explosive cutting.',
          explanation: 'Open/close the gate, walking hamstring sweeps, adductor lunges, acceleration bursts.',
          coachTips: 'Keep chest upright. Never train cold.'
        },
        {
          id: `drill-tech-${Date.now()}`,
          name: `${profile.position || 'Player'} Signature Cone Weave to Weak-Foot Wall Ping`,
          category: 'Technical',
          durationMinutes: 15,
          reps: '15 strikes per foot',
          sets: 3,
          restSeconds: 45,
          difficulty: 'Intermediate',
          objective: `Build automatic non-dominant foot striking mechanics. Targeting weakness: ${profile.weaknesses || 'weak foot'}.`,
          explanation: 'Weave through 5 cones with dominant foot, explode into space, strike firm 1-touch pass into wall using non-dominant foot.',
          coachTips: 'Plant standing foot 15cm from ball pointing directly at target. Lock ankle rigid through impact.'
        },
        {
          id: `drill-phys-${Date.now()}`,
          name: '10-Meter Maximal Velocity Drive Bursts',
          category: 'Physical',
          durationMinutes: 15,
          reps: '6 maximal reps',
          sets: 2,
          restSeconds: 60,
          difficulty: 'Advanced',
          objective: 'Horizontal ground force production in the initial 3 acceleration strides.',
          explanation: 'From athletic split stance, push the pitch away behind you with 45-degree forward torso lean.',
          coachTips: 'Violent arm swing cheek to pocket. Do not pop upright too early.'
        },
        {
          id: `drill-finish-${Date.now()}`,
          name: '45-Degree Angle Cut & Side-Netting Placement',
          category: 'Finishing',
          durationMinutes: 15,
          reps: '8 strikes per side',
          sets: 2,
          restSeconds: 60,
          difficulty: 'Advanced',
          objective: 'Lethal precision shooting past oncoming defenders.',
          explanation: 'Touch ball out at 45 degrees, 2 setup steps, curl into far side netting or drive low past goalkeeper.',
          coachTips: 'Keep eyes on ball at strike. Pick your corner before your run-up.'
        },
        {
          id: `drill-rec-${Date.now()}`,
          name: 'Adductor & Posterior Chain Decompression',
          category: 'Recovery',
          durationMinutes: 10,
          reps: 'Hold 45s each',
          sets: 2,
          restSeconds: 15,
          difficulty: 'Beginner',
          objective: 'Flush metabolic waste and down-regulate sympathetic nervous system.',
          explanation: 'Half-kneeling hip flexor stretch, seated hamstring reach, box breathing.',
          coachTips: 'Deep diaphragmatic nasal breathing. Slow heart rate down.'
        }
      ],
      monthlyThemes: [
        { week: 'Week 1', title: 'Baseline Mechanics & Technical Precision', focus: 'Ankle locking, short pass weight, 10m acceleration' },
        { week: 'Week 2', title: 'High-Speed Execution & 1v1 Dominance', focus: 'Change of direction, feints, shooting under pressure' },
        { week: 'Week 3', title: 'Tactical Intelligence & Half-Space Infiltration', focus: 'Pocket receiving, shoulder scan frequency, pressing triggers' },
        { week: 'Week 4', title: 'Match Sharpness & Peak Performance Taper', focus: 'High-quality explosive reps, low volume, mental focus' }
      ]
    });
  }
});

// ----------------------------------------------------
// AI PERFORMANCE ANALYZER
// ----------------------------------------------------
app.post('/api/performance/analyze', async (req: Request, res: Response) => {
  const { sessions = [], profile = {} } = req.body;
  const ai = getGenAI();

  try {
    if (!ai) throw new Error('GEMINI_API_KEY not configured');

    const summary = sessions.map((s: any, idx: number) => ({
      index: idx + 1,
      date: s.date,
      title: s.title || s.type,
      durationMinutes: s.durationMinutes,
      difficultyRating: s.difficultyRating,
      completedExercises: s.exercises?.length || 0,
      notes: s.notes,
    }));

    const prompt = `
Analyze the actual recorded training data for this footballer:
Player: ${profile.name || 'Player'}, Position: ${profile.position || 'Midfielder'}
Recorded Training History:
${JSON.stringify(summary, null, 2)}

Provide an honest, data-grounded UEFA coach performance evaluation.
Do NOT fabricate numbers or measure things not recorded. If only 1 or 2 sessions are recorded, acknowledge it as early days.
Return a valid JSON object with:
- "strongestSkills": string[]
- "weakestOrNeglectedAreas": string[]
- "consistencyRating": string
- "potentialImbalances": string
- "weeklyReportSummary": string
- "nextWeekPriorities": string[]
- "coachGrade": string
- "motivationalCharge": string
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: 'You are an elite sports scientist analyzing real training logs. Return strictly valid JSON.',
      },
    });

    const raw = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    }

    res.json(parsed);
  } catch (err: any) {
    console.error('Performance analysis error:', err?.message || err);

    const totalMinutes = sessions.reduce((acc: number, s: any) => acc + (s.durationMinutes || 0), 0);
    const sessionCount = sessions.length;

    res.json({
      strongestSkills: ['Ball Mastery & Ankle Lock Discipline', 'Short Passing Rhythm', 'Dynamic Warm-Up Activation'],
      weakestOrNeglectedAreas: ['Weak Foot Finishing Under Match Pressure', 'Aerial Duels & Heading Mechanics', 'Repeat-Sprint Aerobic Recovery'],
      consistencyRating: sessionCount >= 3 ? 'High Progression Track' : sessionCount >= 1 ? 'Developing Habit' : 'Early Phase',
      potentialImbalances: 'Technical touch volume is solid, but physical repeat-sprint threshold requires higher aerobic intervals to sustain intensity for full 90 minutes.',
      weeklyReportSummary: sessionCount > 0
        ? `You have logged ${totalMinutes} verified minutes across ${sessionCount} training sessions. Your commitment to ball mastery drills is developing neuromuscular sharpness. To elevate to academy standard, increase match-speed finishing and weak-foot repetition.`
        : `No sessions have been recorded yet this week. Consistency is the sole differentiator between amateur and professional players. Complete today's prescribed training session to initialize your weekly report.`,
      nextWeekPriorities: [
        'Execute 150 consecutive weak-foot wall strikes before starting dominant-foot drills',
        'Add 2 weekly sessions of 10m maximal acceleration bursts with 60s recovery',
        'Incorporate 10 minutes of active hip mobility after every high-intensity workout'
      ],
      coachGrade: sessionCount >= 4 ? 'A-' : sessionCount >= 2 ? 'B+' : 'B',
      motivationalCharge: 'Chasing the professional dream requires doing on bad days what average players only do on good days. Keep grinding.'
    });
  }
});

// ----------------------------------------------------
// AI MENTAL GAME ADVISOR
// ----------------------------------------------------
app.post('/api/mental/advice', async (req: Request, res: Response) => {
  const { struggle, context = '', userProfile = {} } = req.body;
  const ai = getGenAI();

  try {
    if (!ai) throw new Error('GEMINI_API_KEY not configured');

    const prompt = `
The athlete is experiencing this mental hurdle in football:
"${struggle}"
Context / Situation: "${context}"
Player: ${userProfile.name || 'Athlete'}, Position: ${userProfile.position || 'Footballer'}

As an elite sports psychologist and head coach:
1. Provide an empathetic yet disciplined perspective on why this happens to top footballers.
2. Give 3 actionable mental tools/exercises they can execute today.
3. If this mentions serious clinical depression or self-harm, respond with compassionate guidance to consult a medical professional.

Return clean, structured text with strong headings and practical bullet points.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite sports psychologist for professional football clubs. Deliver calm, grounded, empowering sports psychology advice.',
      },
    });

    res.json({ advice: response.text });
  } catch (err: any) {
    console.error('Mental advice error:', err?.message || err);
    res.json({
      advice: `### UEFA Sports Psychology Protocol: Reclaiming Match Composure\n\n**1. Why Elite Players Face This**\nEven Ballon d'Or winners and Premier League captains experience dips in confidence, missed chances, and trial anxiety. The brain naturally treats high-stakes matches like physical threats, triggering adrenaline surges that stiffen your muscles and narrow your peripheral vision.\n\n**2. Three Actionable Tools for Today**\n- **The 1-Clap Mistake Reset**: When you commit a turnover, clap your hands once with purpose, exhale forcefully through pursed lips, and immediately sprint 5 meters into your defensive pressing shadow. Refuse to let mistakes linger for more than 3 seconds.\n- **Sensory Visualization Anchor**: Tonight, spend 8 minutes in a quiet room with your eyes closed. Vividly visualize 3 specific scenarios in your position: winning a tackle, shielding the ball, and executing a crisp through-ball.\n- **Control the Controllables**: You cannot control the referee's whistle or the coach's mood. You have 100% control over your work rate, communication, and body language.\n\n*Safety Note: If you ever feel overwhelmed by emotional distress or deep sadness, reach out to a trusted mentor, coach, or medical professional.*`
    });
  }
});

// ----------------------------------------------------
// AI DAILY COACH MESSAGE
// ----------------------------------------------------
app.post('/api/coach/daily-insight', async (req: Request, res: Response) => {
  const { userProfile = {}, currentStreak = 0 } = req.body;
  const ai = getGenAI();
  if (!ai) {
    return res.json({
      insight: 'Excellence is not an accident; it is the daily accumulation of disciplined touches. Lace up and command your session.',
      focus: 'First touch under pressure',
      quote: 'The vision of a champion is someone who is bent over, drenched in sweat, at the point of exhaustion, when nobody else is watching.',
    });
  }

  try {
    const prompt = `
Generate a quick, razor-sharp daily morning coach briefing for footballer ${userProfile.name || 'Athlete'} (Position: ${userProfile.position || 'Midfielder'}, Current Streak: ${currentStreak} days).
Return JSON with:
{
  "insight": "1-2 sentences of fierce, practical tactical/technical focus for today",
  "dailyChallenge": "A specific practical challenge with a football, e.g. 150 wall passes alternating feet",
  "focusArea": "Specific skill name",
  "quote": "A quote from a legendary football figure or master"
}
`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err) {
    res.json({
      insight: 'Elite players do on bad days what average players only do on good days. Commit to the fundamentals today.',
      dailyChallenge: '150 wall passes alternating feet with 1-touch control',
      focusArea: 'Ball Mastery & Weak Foot',
      quote: 'Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.',
    });
  }
});

// Serve public static folder (videos, images, audio) with partial content range support
app.use(express.static(path.resolve(process.cwd(), 'public')));

// ----------------------------------------------------
// VITE SETUP (DEV vs PROD)
// ----------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PRO11 server running at http://0.0.0.0:${PORT} [${isProduction ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
