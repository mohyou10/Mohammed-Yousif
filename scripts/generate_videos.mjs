import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const VIDEOS_DIR = path.resolve(process.cwd(), 'public/videos');
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

const CATEGORIES = [
  'shooting',
  'finishing',
  'passing',
  'crossing',
  'dribbling',
  'ball_control',
  'first_touch',
  'weak_foot',
  'heading',
  'ball_mastery',
  'speed',
  'acceleration',
  'agility',
  'endurance',
  'legs',
  'core',
  'arms',
  'mobility',
  'goalkeeper',
  'defender',
  'midfield',
  'striker',
  'solo',
  'partner'
];

console.log(`Generating 4K and 1080p video clips with ultrafast preset for ${CATEGORIES.length} categories...`);

for (const id of CATEGORIES) {
  const file1080p = path.join(VIDEOS_DIR, `${id}_1080p.mp4`);
  const file4k = path.join(VIDEOS_DIR, `${id}_4k.mp4`);

  if (!fs.existsSync(file1080p)) {
    console.log(`[1080p] ${id}...`);
    execSync(
      `ffmpeg -f lavfi -i testsrc=duration=3:size=1920x1080:rate=24 \
      -vf "drawbox=x=0:y=0:w=1920:h=1080:color=black@0.4:t=fill,drawbox=x=60:y=60:w=1800:h=960:color=white@0.2:t=4" \
      -c:v libx264 -preset ultrafast -pix_fmt yuv420p -y "${file1080p}" 2>/dev/null`
    );
  }

  if (!fs.existsSync(file4k)) {
    console.log(`[4K] ${id}...`);
    execSync(
      `ffmpeg -f lavfi -i testsrc=duration=3:size=3840x2160:rate=24 \
      -vf "drawbox=x=0:y=0:w=3840:h=2160:color=black@0.4:t=fill,drawbox=x=120:y=120:w=3600:h=1920:color=white@0.2:t=8" \
      -c:v libx264 -preset ultrafast -pix_fmt yuv420p -y "${file4k}" 2>/dev/null`
    );
  }
}

console.log('ALL 4K and 1080p videos generated successfully!');
