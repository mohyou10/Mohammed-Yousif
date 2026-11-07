export interface DailyChallenge {
  id: string;
  dayIndex: number;
  title: string;
  category: 'Technical' | 'Physical' | 'Ball Mastery' | 'Weak Foot';
  target: string;
  description: string;
  proTip: string;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'dc-1',
    dayIndex: 1,
    title: '200 Touch Alternating Weak/Strong Wall Rhythm',
    category: 'Weak Foot',
    target: '200 touches (100 left, 100 right)',
    description: 'Stand 4 meters from a wall or rebounder. Execute continuous 1-touch or 2-touch passes alternating left and right feet without letting the ball stop.',
    proTip: 'Stay on the balls of your feet. Keep your ankles locked and stay in a slight forward lean.'
  },
  {
    id: 'dc-2',
    dayIndex: 2,
    title: 'Cone Slalom with Sole Roll Turns',
    category: 'Ball Mastery',
    target: '10 clean runs through 6 cones',
    description: 'Set up 6 cones 1 meter apart. Slalom through using inside, outside, and finish each run with an aggressive drag-back sole roll.',
    proTip: 'Keep your knees flexed low. Your head should scan up between cone cuts.'
  },
  {
    id: 'dc-3',
    dayIndex: 3,
    title: 'Keep-Up Juggling Pyramid',
    category: 'Technical',
    target: '100 total consecutive touches',
    description: 'Juggle: 10 right foot only, 10 left foot only, 10 alternating, 10 thighs, 10 headers, then reverse back down.',
    proTip: 'Cushion the ball with relaxed ankles. The ball should not spin excessively.'
  },
  {
    id: 'dc-4',
    dayIndex: 4,
    title: 'Explosive 10m Acceleration Bursts',
    category: 'Physical',
    target: '8 maximal effort sprints (60s rest)',
    description: 'From an athletic split-stance, drive out with violent arm action and low torso angle for 10 meters.',
    proTip: 'Focus on pushing the pitch away behind you during the first 3 strides.'
  },
  {
    id: 'dc-5',
    dayIndex: 5,
    title: 'Weak-Foot Instep Cross-Bar Challenge',
    category: 'Technical',
    target: 'Hit the crossbar 3 times with your weak foot',
    description: 'From 16-18 meters out, strike with your weak foot instep aiming squarely for the crossbar.',
    proTip: 'Keep your chest slightly tilted and lock your standing foot firmly pointed at the target.'
  },
  {
    id: 'dc-6',
    dayIndex: 6,
    title: '360 Quick Reaction Turn & Pass',
    category: 'Ball Mastery',
    target: '50 rapid turn touches',
    description: 'Receive ball against wall, execute a Cruyff or inside-hook turn, accelerate 3 meters, turn back and fire.',
    proTip: 'Sell the pass before executing the turn to simulate fooling an oncoming defender.'
  },
  {
    id: 'dc-7',
    dayIndex: 7,
    title: 'Full-Body Mobility & Active Recovery',
    category: 'Physical',
    target: '15 minutes of hip and ankle mobility',
    description: 'World greatest stretch, 90/90 hip openers, calf wall stretches, and deep diaphragmatic breathing.',
    proTip: 'Breathe slowly through your nose. Recovery is where adaptation and muscle repair occur.'
  }
];

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: 'badge-first-session',
    title: 'First Step',
    description: 'Completed your first recorded training session.',
    iconName: 'Flame'
  },
  {
    id: 'badge-streak-3',
    title: 'Hat-Trick Consistency',
    description: 'Maintained a 3-day consecutive training streak.',
    iconName: 'Zap'
  },
  {
    id: 'badge-streak-7',
    title: 'Iron Discipline',
    description: 'Maintained a 7-day consecutive training streak.',
    iconName: 'Shield'
  },
  {
    id: 'badge-centurion-100m',
    title: 'Centurion',
    description: 'Logged 100+ minutes of verified football training.',
    iconName: 'Clock'
  },
  {
    id: 'badge-academy-scholar',
    title: 'Tactical Scholar',
    description: 'Mastered 3 or more lessons in the Skills Academy.',
    iconName: 'BookOpen'
  },
  {
    id: 'badge-mindset-pro',
    title: 'Stoic Footballer',
    description: 'Logged 2 or more entries in your Mental Reflection Journal.',
    iconName: 'Brain'
  },
  {
    id: 'badge-challenge-ace',
    title: 'Daily Grinder',
    description: 'Completed at least 2 Daily Football Challenges.',
    iconName: 'Award'
  },
  {
    id: 'badge-record-setter',
    title: 'Record Breaker',
    description: 'Logged a verified personal record in juggling or sprints.',
    iconName: 'Trophy'
  }
];
