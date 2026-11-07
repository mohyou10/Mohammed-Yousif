export interface AcademyLesson {
  id: string;
  pillar: 'Technical' | 'Physical' | 'Tactical' | 'Mental';
  category: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  durationMinutes: number;
  objective: string;
  coachingPoints: string[];
  fieldDrill: {
    setup: string;
    instructions: string[];
    repsAndSets: string;
    proStandard: string;
  };
}

export const SKILLS_CURRICULUM: AcademyLesson[] = [
  // 1. TECHNICAL SKILLS
  {
    id: 'tech-ball-control',
    pillar: 'Technical',
    category: 'Ball Control',
    title: 'Cushion & Directional First Touch',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    objective: 'Absorb incoming pace and direct the ball into open space in a single fluid movement.',
    coachingPoints: [
      'Relax the receiving ankle right before contact to absorb ball velocity',
      'Open body shape at 45 degrees toward your next intended pass',
      'Scan your shoulder twice before the pass reaches your boot',
      'Push the ball 1 meter out of your feet, ready to strike'
    ],
    fieldDrill: {
      setup: 'Wall or partner 10 meters away. 4 colored cones placed 2 meters apart in a square.',
      instructions: [
        'Fire firm pass against the wall from outside the square',
        'Receive the rebound with inside of foot, pushing through designated cone gate',
        'Alternate receiving foot on every second repetition',
        'Add a disguise feint before the touch arrives'
      ],
      repsAndSets: '4 sets of 15 touches (60 total reps)',
      proStandard: 'Ball never stops dead under feet; touch always breaks the line in under 0.6 seconds.'
    }
  },
  {
    id: 'tech-dribbling',
    pillar: 'Technical',
    category: 'Dribbling',
    title: 'Tight Space 1v1 Feints & Acceleration Burst',
    difficulty: 'Advanced',
    durationMinutes: 25,
    objective: 'Manipulate defender body weight with sharp drop-steps and explosive exit speed.',
    coachingPoints: [
      'Keep low center of gravity with bent knees',
      'Use outside of the foot for instantaneous directional shifts',
      'Commit the imaginary defender by dropping your lead shoulder hard',
      'Explode into open space on touch number two'
    ],
    fieldDrill: {
      setup: 'Slalom course of 6 cones placed 1 meter apart, followed by a 10m sprint gate.',
      instructions: [
        'Dribble through the slalom using sole rolls and outside-cut touches',
        'At the final cone, execute an Iniesta Croqueta or Body Feint',
        'Sprint 10 meters with the ball at maximum game-speed pace'
      ],
      repsAndSets: '6 reps with dominant foot, 6 reps with weak foot',
      proStandard: 'Zero cone touches; transition from feint to sprint within 0.3 seconds.'
    }
  },
  {
    id: 'tech-weak-foot',
    pillar: 'Technical',
    category: 'Weak-Foot Development',
    title: 'Weak-Foot Ankle Locking & Wall Repetition',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    objective: 'Eliminate technical deficiency by building neuromuscular confidence in the non-dominant foot.',
    coachingPoints: [
      'Plant dominant foot firmly 15-20cm parallel to the ball pointing at target',
      'Lock non-dominant ankle bone rigidly through impact',
      'Strike through the exact equator of the ball',
      'Follow through in a straight line toward your target'
    ],
    fieldDrill: {
      setup: 'Smooth brick wall or pitch rebounder. Chalk target box at knee height.',
      instructions: [
        'Stand 5 meters from wall',
        'One-touch passing exclusively with weak foot for 60 seconds',
        'Progress to two-touch: receive across body, strike back firmly',
        'Finish with driven lofted touches against the target box'
      ],
      repsAndSets: '5 rounds of 30 weak-foot strikes (150 total touches)',
      proStandard: 'Minimum 85% accuracy hitting inside the chalk target zone.'
    }
  },
  {
    id: 'tech-finishing',
    pillar: 'Technical',
    category: 'Finishing',
    title: 'Instep Curler & Low-Drive Corner Placement',
    difficulty: 'Advanced',
    durationMinutes: 25,
    objective: 'Develop lethal, consistent finishing into side netting under fatigue.',
    coachingPoints: [
      'Keep eyes on ball at moment of contact, look up early to locate goalkeeper',
      'Wrap foot around ball with inside instep for curled finish',
      'For low driven shot, drive through laces with chest tilted slightly over the ball',
      'Never blast blindly down the middle; target 30cm inside the posts'
    ],
    fieldDrill: {
      setup: 'Penalty box edge, 18-yard line. Cones set up as passive defenders.',
      instructions: [
        'Touch ball out of feet at 45 degree angle past cone',
        'Take maximum 2 setup touches',
        'Curl into far top corner or drive low into side netting',
        'Sprint around a marker cone to simulate tracking back between shots'
      ],
      repsAndSets: '4 sets of 8 shots (32 shots total)',
      proStandard: 'At least 22 out of 32 hitting side netting without goalkeeper saving.'
    }
  },
  {
    id: 'tech-passing',
    pillar: 'Technical',
    category: 'Passing',
    title: 'Driven Ping & Diagonal Switch Ball',
    difficulty: 'Advanced',
    durationMinutes: 20,
    objective: 'Deliver crisp, backspin-driven 30-meter aerial balls directly onto a teammate boot.',
    coachingPoints: [
      'Approach ball at a 35-degree angle',
      'Strike with the hard bone at the top of the big toe laces',
      'Carve underneath the lower half of the ball with a low, flat follow-through',
      'Lean slightly back to generate loft, but keep core rigid'
    ],
    fieldDrill: {
      setup: 'Two 5x5m target squares marked 35 meters apart with cones.',
      instructions: [
        'Drive ball from first square into second square on the fly',
        'Ball must bounce inside the target grid',
        'Alternate between driven flat passes and high floating switches'
      ],
      repsAndSets: '20 driven passes per foot',
      proStandard: '75% of balls landing directly within the 5x5m landing grid.'
    }
  },

  // 2. PHYSICAL DEVELOPMENT
  {
    id: 'phys-speed-accel',
    pillar: 'Physical',
    category: 'Acceleration',
    title: 'First 10m Explosive Sprint Drive',
    difficulty: 'Advanced',
    durationMinutes: 20,
    objective: 'Maximize horizontal force production in the initial 3 strides from a stationary or jogging start.',
    coachingPoints: [
      'Maintain 45-degree forward torso lean during acceleration phase',
      'Drive knees aggressively upward and push ground back behind you',
      'Violent arm swings from hip to cheek pocket',
      'Do not stand upright prematurely'
    ],
    fieldDrill: {
      setup: 'Start line, 10m cone, 20m cone. Measure with stopwatch or cones.',
      instructions: [
        'Assume staggered athletic split-stance',
        'Sprint all-out for 10 meters, decelerate smoothly over 10m',
        'Rest 60 seconds of full walk-back recovery between reps',
        'Repeat from athletic drop-step and back-pedal transitions'
      ],
      repsAndSets: '8 total sprint reps with 60s full recovery',
      proStandard: 'Sub-1.75s 10m split for competitive academy level.'
    }
  },
  {
    id: 'phys-agility-cod',
    pillar: 'Physical',
    category: 'Agility',
    title: 'Pro Agility 5-10-5 Change of Direction',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    objective: 'Train deceleration brake strength, lower-body plant mechanics, and lateral cutting speed.',
    coachingPoints: [
      'Drop hips into deep athletic squat before cutting',
      'Plant outer foot at a 60-degree angle to brace momentum',
      'Push powerfully through inner foot arch on the redirect',
      'Keep head up to simulate scanning players during transitions'
    ],
    fieldDrill: {
      setup: '3 cones in a straight line, 5 yards apart.',
      instructions: [
        'Start at middle cone in athletic 3-point stance',
        'Sprint 5 yards to right cone, touch ground with right hand',
        'Sprint 10 yards to left cone, touch ground with left hand',
        'Sprint 5 yards through middle line'
      ],
      repsAndSets: '6 full trials (3 starting right, 3 starting left) with 90s rest',
      proStandard: 'Under 4.5 seconds for competitive footballers.'
    }
  },
  {
    id: 'phys-endurance',
    pillar: 'Physical',
    category: 'Endurance',
    title: 'Football MAS (Maximal Aerobic Speed) Interval Grids',
    difficulty: 'Advanced',
    durationMinutes: 25,
    objective: 'Elevate VO2 max and repeat-sprint ability for 90-minute dominance in high-tempo football.',
    coachingPoints: [
      'Maintain consistent split pacing; do not sprint all-out on rep 1 and walk rep 6',
      'Use rhythmic box breathing during recovery intervals',
      'Stay upright during rest; do not bend hands over knees',
      'Push mental threshold when lactic acid builds in the legs'
    ],
    fieldDrill: {
      setup: 'Pitch rectangle: 70m length (run) and 35m width (active walk).',
      instructions: [
        '15 seconds running at 120% MAS (approx 70m)',
        '15 seconds active walking recovery (approx 20m)',
        'Continuous intervals for 6 minutes per block'
      ],
      repsAndSets: '2 blocks of 6 minutes, with 3 minutes rest between blocks',
      proStandard: 'Hitting identical 70m markers across all 12 intervals.'
    }
  },

  // 3. TACTICAL INTELLIGENCE
  {
    id: 'tact-vision-scanning',
    pillar: 'Tactical',
    category: 'Vision',
    title: 'Pre-Orientation & 360 Shoulder Scanning',
    difficulty: 'Advanced',
    durationMinutes: 20,
    objective: 'Double your information intake per second to make decisions before receiving the ball.',
    coachingPoints: [
      'Turn chin completely past shoulder to see blind spots',
      'Scan when the ball is traveling, NOT when it is at your feet',
      'Identify 3 key variables: Nearest pressure, free teammate, and open space',
      'Take picture in your mind and execute pre-decided action on touch 1'
    ],
    fieldDrill: {
      setup: 'Circle of 5 numbered or colored cones around you. Wall or passer in front.',
      instructions: [
        'Pass to wall. While ball travels, look over shoulder and call out cone color',
        'Receive rebound and instantly turn toward that cone',
        'Pass back and repeat with opposite shoulder scan'
      ],
      repsAndSets: '4 sets of 12 scans with pass combinations',
      proStandard: 'Minimum 4 shoulder scans every 10 seconds (Xavi & De Bruyne benchmark).'
    }
  },
  {
    id: 'tact-pressing',
    pillar: 'Tactical',
    category: 'Pressing',
    title: 'Curved Pressing Angle & Passing Lane Shadow',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    objective: 'Cut off passing options while closing down the ball carrier with an arc run.',
    coachingPoints: [
      'Never run in a straight line at an opponent with the ball',
      'Curve your run to put the second defender into your cover shadow',
      'Decelerate 1.5 meters before contact so you cannot be beaten with 1 touch',
      'Show the opponent toward the sideline or your defensive trap'
    ],
    fieldDrill: {
      setup: '4 cones representing 2 defenders and 2 passing outlets.',
      instructions: [
        'Sprint on an arcing path to block passing line A while closing down B',
        'Adopt side-on jockey stance as soon as you arrive within 1.5 meters',
        'Pounce if opponent takes a heavy touch'
      ],
      repsAndSets: '8 repetitions per side',
      proStandard: 'Opponent forced into backwards or hurried clearance 9 out of 10 times.'
    }
  },

  // 4. MENTAL DEVELOPMENT
  {
    id: 'ment-mistake-reset',
    pillar: 'Mental',
    category: 'Handling Pressure',
    title: 'The 3-Second Mistake Reset Routine',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    objective: 'Eliminate emotional paralysis following a turnover or missed chance during matches.',
    coachingPoints: [
      'Acknowledge the mistake instantly without physical negative body language (no head in hands)',
      'Execute a physical reset trigger: clap hands once and exhale deeply through pursed lips',
      'Immediately focus on the next 5 seconds of the game: counter-press or drop into shape',
      'Analyze what happened after the final whistle, never during live play'
    ],
    fieldDrill: {
      setup: 'Visualization and live scenario simulation.',
      instructions: [
        'Simulate a misplaced pass during high-intensity drill',
        'Immediately execute physical reset trigger (deep breath + hand clap)',
        'Sprint 15 meters back into defensive positioning within 2.5 seconds',
        'Record thoughts in mental journal'
      ],
      repsAndSets: '5 simulated reps combined with match visualization',
      proStandard: 'Reaction time from mistake to active defensive posture under 1.5 seconds.'
    }
  },
  {
    id: 'ment-confidence',
    pillar: 'Mental',
    category: 'Confidence',
    title: 'Pre-Match Visual Anchoring & State Control',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    objective: 'Anchor self-belief through vivid mental rehearsal of your best actions before stepping on pitch.',
    coachingPoints: [
      'Recall your 3 best career moments in vivid sensory detail (sound, feel, emotion)',
      'Visualize 5 specific scenarios you will execute today in your position',
      'Tell yourself: "I have prepared for this. I trust my training."',
      'Control only effort, communication, and tactical discipline'
    ],
    fieldDrill: {
      setup: 'Quiet room or pitch bench, 10-15 minutes before warm-up.',
      instructions: [
        'Close eyes, perform 4-4-4 box breathing (inhale 4s, hold 4s, exhale 4s)',
        'Mentally walk through first 10 minutes of match play',
        'Feel the ball on your laces, feel making your first clean tackle and completed pass',
        'Open eyes with relaxed, ready focus'
      ],
      repsAndSets: '1 full protocol executed on matchdays or trial mornings',
      proStandard: 'Heart rate stabilizes below 75 BPM during visualization.'
    }
  }
];
