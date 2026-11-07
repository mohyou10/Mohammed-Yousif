export interface KnowledgeArticle {
  id: string;
  category: 'Tactics' | 'Formations' | 'Terminology' | 'Nutrition' | 'Recovery' | 'Academy Prep' | 'Rules';
  title: string;
  readTimeMinutes: number;
  summary: string;
  keyPoints: string[];
  contentSections: {
    heading: string;
    body: string;
  }[];
}

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'tact-gegenpress',
    category: 'Tactics',
    title: 'Gegenpressing: The Counter-Pressing Philosophy',
    readTimeMinutes: 5,
    summary: 'The systematic tactic of winning the ball back immediately within 5 seconds of losing possession, capitalizing on opponent disorganization.',
    keyPoints: [
      'The 5-Second Rule: Press immediately before the opponent can organize their shape',
      'The best playmaker in the world is the counter-press',
      'Collective hunting packs of 3 players swarming the ball carrier',
      'Requires elite team stamina and psychological aggression'
    ],
    contentSections: [
      {
        heading: 'Why Gegenpressing is Deadly',
        body: 'When an opponent wins the ball, their eyes are usually looking down to secure control and their teammates are expanding into attacking shapes. This brief window of vulnerability is when a swift, organized trap can win the ball back in dangerous areas 20-30 meters from goal.'
      },
      {
        heading: 'The 3 Trapping Triggers',
        body: '1. A heavy touch by the opponent recipient. 2. A backwards or bouncing pass where the receiver is facing their own goal. 3. The ball forced against the touchline, which acts as an extra defender.'
      }
    ]
  },
  {
    id: 'tact-positional-play',
    category: 'Tactics',
    title: 'Juego de Posición: Dominating Through Structure',
    readTimeMinutes: 6,
    summary: 'How elite coaches structure pitch zones so the ball moves with purpose, creating numerical and positional superiority across every line.',
    keyPoints: [
      'Never more than two players on the same vertical line',
      'Never more than three players on the same horizontal line',
      'Occupying the half-spaces between opponent full-backs and centre-backs',
      'Moving the opponent by circulating the ball until an overload appears'
    ],
    contentSections: [
      {
        heading: 'The Pitch Grid System',
        body: 'The pitch is subdivided into 20 zones, emphasizing the central corridor, the two half-spaces, and the two wide channels. By spacing players across these specific grid zones, passing options are always available at varying angles.'
      },
      {
        heading: 'Third-Man Combinations',
        body: 'Player A cannot pass to Player C because the lane is blocked. Instead, Player A passes to Player B, who immediately bounces the ball to Player C. Player C receives facing forward with time and space.'
      }
    ]
  },
  {
    id: 'form-433',
    category: 'Formations',
    title: 'The 4-3-3: Balance, Triangles, and Width',
    readTimeMinutes: 5,
    summary: 'The gold standard tactical formation for modern possession, positional play, and high-pressing football.',
    keyPoints: [
      'Natural passing triangles between backline, midfield pivot, and wingers',
      'Singular defensive pivot (the #6) shields centre-backs',
      'Two #8 midfielders can press high or drop to build up',
      'High wingers provide maximum width to stretch opponent backlines'
    ],
    contentSections: [
      {
        heading: 'Key Strengths',
        body: 'The 4-3-3 naturally creates geometric passing angles. When organized well, players rarely have to force straight-line passes, allowing fluid combinations through midfield.'
      },
      {
        heading: 'Vulnerabilities to Guard Against',
        body: 'If the two #8s advance too high simultaneously, the single pivot #6 can be isolated during counter-attacks. Communication and rest-defense positioning are vital.'
      }
    ]
  },
  {
    id: 'form-4231',
    category: 'Formations',
    title: 'The 4-2-3-1: Central Control and Creative Freedom',
    readTimeMinutes: 5,
    summary: 'A resilient, dynamic formation utilizing a double pivot in midfield and an authentic number 10 behind the central striker.',
    keyPoints: [
      'Double pivot (two #6s) provides strong defensive foundation',
      'The #10 has freedom to drift into half-spaces to unlock defenses',
      'Full-backs have freedom to overlap knowing two pivots are covering',
      'Smooth transition into 4-4-2 in low-block defense'
    ],
    contentSections: [
      {
        heading: 'Tactical Function',
        body: 'One defensive midfielder acts as a deep ball-winner, while the second acts as a deep-lying playmaker or box-to-box runner. The attacking trident behind the striker can rotate positions fluidly.'
      }
    ]
  },
  {
    id: 'term-half-spaces',
    category: 'Terminology',
    title: 'The Half-Spaces: The Most Dangerous Pitch Corridors',
    readTimeMinutes: 4,
    summary: 'Why modern coaches like Guardiola and Klopp treat the corridors between the center and wings as the primary zone of creativity.',
    keyPoints: [
      'Located between the central pitch strip and the touchlines',
      'Defenders face a dilemma: Should the centre-back or full-back step out?',
      'Offers a direct 45-degree diagonal angle on goal for passing or shooting',
      'Allows vision toward both the goal and the opposite wing simultaneously'
    ],
    contentSections: [
      {
        heading: 'The Power of the 45-Degree Angle',
        body: 'From the wings, a cross is easily defended because the goalkeeper can face out. From the center, defenders congest the box. The half-space provides the perfect diagonal angle to slice behind defensive lines.'
      }
    ]
  },
  {
    id: 'nutr-matchday-fuel',
    category: 'Nutrition',
    title: 'Matchday Nutrition & Glycogen Optimization',
    readTimeMinutes: 5,
    summary: 'Scientifically calibrated pre-match fueling and hydration to sustain 90 minutes of explosive intensity without cramping.',
    keyPoints: [
      'Carb Loading: 3.5 to 4 hours before kickoff (low fiber, low fat, high complex carbs)',
      'Hydration: 500ml of water with electrolytes 2 hours prior; 200ml 15 mins before kickoff',
      'Half-Time Refuel: 30g fast-acting carbohydrates (banana, isotonic drink, or energy gel)',
      'Post-Match Window: 30g protein + 60g carbohydrates within 45 minutes for glycogen replenishment'
    ],
    contentSections: [
      {
        heading: 'The Pre-Match Meal Blueprint',
        body: 'Ideal meal: White rice or pasta with grilled chicken breast and a light tomato sauce. Avoid heavy cheeses, fried foods, and bulky broccoli or beans that slow gastric emptying.'
      }
    ]
  },
  {
    id: 'rec-sleep-science',
    category: 'Recovery',
    title: 'Sleep Architecture for Elite Muscle Repair & Reaction Time',
    readTimeMinutes: 4,
    summary: 'Why sleep is the single most powerful legal performance-enhancing tool in modern football.',
    keyPoints: [
      'Human Growth Hormone (HGH) peaks during Stage 3/4 deep slow-wave sleep',
      'REM sleep consolidates muscle memory and tactical decision-making',
      'Sub-7 hour sleep increases muscle injury risk by over 1.7x',
      'Keep bedroom dark and cool (18°C / 65°F) for maximum recovery'
    ],
    contentSections: [
      {
        heading: 'The 90-Minute Sleep Cycle',
        body: 'Aim for 5 full 90-minute sleep cycles (7.5 hours) or 6 cycles (9 hours). Consistency in wake-up times reinforces your circadian rhythm.'
      }
    ]
  },
  {
    id: 'acad-trial-prep',
    category: 'Academy Prep',
    title: 'Academy Trial Masterclass: What Scouts Look For',
    readTimeMinutes: 6,
    summary: 'An insider guide to what academy directors and scouts evaluate within the first 10 minutes of watching you play.',
    keyPoints: [
      'Body Language: Never complain, drop your head, or slouch after an error',
      'Vocal Leadership: Scouts listen for players who communicate clearly and organize teammates',
      'Scan Frequency: Does the player check their shoulders before the ball arrives?',
      'Play Simple First: Complete your first 3 passes cleanly before trying high-risk moves'
    ],
    contentSections: [
      {
        heading: 'The 4 Scouting Pillars',
        body: '1. Technical: First touch under pressure and passing accuracy. 2. Tactical: Positioning without the ball and understanding transitions. 3. Physical: Speed of thought and athletic agility. 4. Psychological: Grit, work ethic, and coachability.'
      }
    ]
  }
];
