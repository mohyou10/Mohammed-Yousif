import { Position } from '../types';

export interface PositionProgram {
  position: Position;
  tagline: string;
  roleOverview: string;
  keyResponsibilities: string[];
  tacticalDemands: string[];
  physicalRequirements: string[];
  proReferencePlayers: string[];
  specializedDrills: {
    title: string;
    durationMinutes: number;
    intensity: 'High' | 'Moderate' | 'Explosive';
    focus: string;
    description: string;
  }[];
}

export const POSITIONS_DATA: PositionProgram[] = [
  {
    position: 'Goalkeeper',
    tagline: 'The First Attacker & Last Line of Defense',
    roleOverview: 'Modern goalkeeping requires elite shot-stopping, spatial command of the penalty area, box distribution under high pressure, and vocal defensive leadership.',
    keyResponsibilities: [
      'Command the 18-yard box on crosses and set pieces',
      'Act as a sweeper-keeper behind a high defensive line',
      'Distribute accurately with both feet and overhand throws',
      'Organize backline marking and prevent transition overloads'
    ],
    tacticalDemands: [
      'Angle play & setting feet before shot is struck',
      'Reading through-balls 35 meters out',
      'Distribution into midfield pivots or wing-backs'
    ],
    physicalRequirements: ['Explosive vertical jump', 'Lateral diving elasticity', 'Grip strength', 'Hand-eye reaction speed'],
    proReferencePlayers: ['Alisson Becker', 'Thibaut Courtois', 'Manuel Neuer', 'Ederson'],
    specializedDrills: [
      {
        title: 'Low Diving & Immediate Recovery Save',
        durationMinutes: 20,
        intensity: 'Explosive',
        focus: 'Footwork and second-reaction agility',
        description: 'Drop-step save to right post, instant push up to feet, collapse dive to save deflected ball on left side.'
      },
      {
        title: 'Sweeper Keeper 30m Through-Ball Clearance',
        durationMinutes: 20,
        intensity: 'High',
        focus: 'Timing rush and 1-touch clearance',
        description: 'Start on 18-yard line, read driven balls into the channel, sprint out and clear with first touch into target mini-goals.'
      }
    ]
  },
  {
    position: 'Centre-Back',
    tagline: 'The Defensive Anchor & Build-up Initiator',
    roleOverview: 'Dominant 1v1 ground and aerial defending, reading opponent runs in behind, holding a compact line, and breaking the first line of press with driven vertical passes.',
    keyResponsibilities: [
      'Win defensive aerial duels and loose second balls',
      'Maintain defensive line depth and offside trap synchronization',
      'Cover full-backs when they overlap',
      'Step out into midfield with ball or play line-breaking passes'
    ],
    tacticalDemands: ['Rest defense positioning during team attacks', 'Side-on body shape to track runs', 'Communication volume'],
    physicalRequirements: ['Aerial leap power', 'Rotational core stability', 'Deceleration strength', 'Straight-line sprint recovery'],
    proReferencePlayers: ['Virgil van Dijk', 'Rúben Dias', 'William Saliba', 'Antonio Rüdiger'],
    specializedDrills: [
      {
        title: '1v1 Channel Jockey & Slide Tackle Recovery',
        durationMinutes: 25,
        intensity: 'High',
        focus: 'Delaying striker and timing tackle',
        description: 'Force attacker onto weaker foot along touchline, maintain 1.5m gap, commit tackle when ball leaves foot.'
      },
      {
        title: 'Vertical Line-Breaking Pass Under High Press',
        durationMinutes: 20,
        intensity: 'Moderate',
        focus: 'Pass disguise and pace',
        description: 'Receive bouncing back-pass, disguise glance toward full-back, punch driven pass into center-circle pivot.'
      }
    ]
  },
  {
    position: 'Full-Back',
    tagline: 'The Engine of Modern Football',
    roleOverview: 'Full-backs must defend 1v1 against explosive wingers, transition 80 meters continuously, provide overlapping crosses, and tuck in as inverted midfielders in modern setups.',
    keyResponsibilities: [
      'Lock down opposition wingers in 1v1 duels',
      'Provide attacking width through overlaps and underlaps',
      'Deliver dangerous low driven or whipped crosses into penalty box',
      'Track back 60 meters on defensive transitions'
    ],
    tacticalDemands: ['Knowing when to overlap vs tuck in as third centre-back', 'Cross selection', 'Back-post defensive heading'],
    physicalRequirements: ['Elite repeat-sprint endurance (10-12km per match)', 'High acceleration', 'Lateral agility'],
    proReferencePlayers: ['Trent Alexander-Arnold', 'Alphonso Davies', 'Achraf Hakimi', 'Kyle Walker'],
    specializedDrills: [
      {
        title: 'Overlap Sprint to First-Time Whipped Delivery',
        durationMinutes: 25,
        intensity: 'High',
        focus: 'Aerobic sprint capacity and crossing technique',
        description: 'Overlap marker cone, receive timed through ball at full sprint, deliver low whipped cross between 6-yard box and penalty spot.'
      },
      {
        title: '1v1 Jockeying Against Inside & Outside Cuts',
        durationMinutes: 20,
        intensity: 'High',
        focus: 'Footwork and center of gravity',
        description: 'Match agility steps of winger shifting left and right; prevent any entry into the penalty box.'
      }
    ]
  },
  {
    position: 'Defensive Midfielder',
    tagline: 'The Tactical Shield & Metronome',
    roleOverview: 'Controls match rhythm, shields the backline from counter-attacks, intercepts passing lanes, wins second balls, and acts as the passing bridge from defense to attack.',
    keyResponsibilities: [
      'Screen passing lanes into opponent strikers',
      'Intercept counter-attacks and commit tactical fouls if necessary',
      'Receive under back-to-goal pressure and switch play',
      'Cover center-backs when they step out'
    ],
    tacticalDemands: ['Continuous 360-degree shoulder scanning', 'Understanding press-trigger moments', 'Tempo modulation'],
    physicalRequirements: ['Stamina capacity', 'Physical strength in duels', 'Anticipation and short burst speed'],
    proReferencePlayers: ['Rodri', 'Sergio Busquets', 'Casemiro', 'Declan Rice'],
    specializedDrills: [
      {
        title: 'Half-Turn Under Intense Back Pressure',
        durationMinutes: 25,
        intensity: 'Moderate',
        focus: 'Body shape and back-foot reception',
        description: 'Receive ball from centre-back with defender breathing on back; execute blind-turn or wall-bounce pass in under 2 touches.'
      },
      {
        title: 'Defensive Interception & Counter-Switch',
        durationMinutes: 20,
        intensity: 'High',
        focus: 'Anticipation and 40m switch pass',
        description: 'Anticipate pass into dummy striker, step in to intercept, and within 1 touch launch 40m diagonal switch to winger.'
      }
    ]
  },
  {
    position: 'Central Midfielder',
    tagline: 'The Box-to-Box Conductor',
    roleOverview: 'Dominates both boxes. Combines tactical discipline with creative playmaking, tireless pressing, late runs into the box, and transition defense.',
    keyResponsibilities: [
      'Link defensive third to attacking third',
      'Make late blind-side runs into the opponent penalty box',
      'Press aggressively and win second balls in midfield',
      'Maintain high passing accuracy under pressure'
    ],
    tacticalDemands: ['Operating in half-spaces', 'Timing third-man runs', 'Possession retention in high-traffic zones'],
    physicalRequirements: ['Peak VO2 max (highest distance covered on team)', 'Agility', 'Multi-directional speed'],
    proReferencePlayers: ['Luka Modrić', 'Jude Bellingham', 'Fede Valverde', 'Toni Kroos'],
    specializedDrills: [
      {
        title: 'Box-to-Box Transition Shuttle & Finish',
        durationMinutes: 25,
        intensity: 'High',
        focus: 'Physical threshold and composure under fatigue',
        description: 'Win tackle at edge of own box, sprint 60 meters into attacking third, receive cutback and finish into bottom corner.'
      },
      {
        title: 'Pocket Receiving in Half-Spaces',
        durationMinutes: 20,
        intensity: 'Moderate',
        focus: 'Orientation and killer through-ball',
        description: 'Drop between opponent lines, receive on half-turn, slip weighted pass behind center-backs for runner.'
      }
    ]
  },
  {
    position: 'Attacking Midfielder',
    tagline: 'The Creative Playmaker & Space Exploiter',
    roleOverview: 'Operates in the golden zone between midfield and defense. Unlocks tight defenses with visionary passing, sharp dribbling, and long-range shooting.',
    keyResponsibilities: [
      'Create high-quality scoring chances (xG creation)',
      'Shoot accurately from edge of 18-yard box',
      'Combine in quick 1-2 passing sequences around the box',
      'Lead counter-pressing immediately after ball loss'
    ],
    tacticalDemands: ['Finding pockets of space behind defensive pivots', 'Weight of pass', 'Disguised reverse balls'],
    physicalRequirements: ['Explosive short-burst speed (0-5m)', 'Hip flexibility', 'Decoupled upper body agility'],
    proReferencePlayers: ['Kevin De Bruyne', 'Martin Ødegaard', 'Florian Wirtz', 'Jamal Musiala'],
    specializedDrills: [
      {
        title: 'Edge of Box Quick Cut & Curved Strike',
        durationMinutes: 25,
        intensity: 'High',
        focus: 'Rapid trigger release and pinpoint placement',
        description: 'Receive at 20 yards, fake shot to freeze defender, cut 1 meter to the side, wrap foot for far-post top-corner strike.'
      },
      {
        title: 'Weighted Through-Ball Threading Drill',
        durationMinutes: 20,
        intensity: 'Moderate',
        focus: 'Vision and touch weight',
        description: 'Feed angled balls between 2 mannequins with perfect backspin for speeding winger to run onto without breaking stride.'
      }
    ]
  },
  {
    position: 'Winger',
    tagline: 'The 1v1 Breaker & Transition Threat',
    roleOverview: 'Provides vertical speed, isolates defenders in 1v1 scenarios, cuts inside to score or crosses from byline, and tracks opposition full-backs tirelessly.',
    keyResponsibilities: [
      'Beat full-backs consistently on the outside and inside',
      'Attack the far post when the opposite winger has the ball',
      'Deliver cutbacks and driven crosses',
      'High-speed tracking back on defensive transitions'
    ],
    tacticalDemands: ['Timing runs in behind offside line', 'Pressing angles to force opposition inside', '1v1 isolations'],
    physicalRequirements: ['Maximum top-end sprint speed (32-35+ km/h)', 'Repeated sprint ability', 'Explosive change of pace'],
    proReferencePlayers: ['Vinicius Jr', 'Bukayo Saka', 'Mohamed Salah', 'Lamine Yamal'],
    specializedDrills: [
      {
        title: '1v1 Isolation to Byline Cutback',
        durationMinutes: 25,
        intensity: 'Explosive',
        focus: 'Stepover speed and driven cutback accuracy',
        description: 'Attack cone defender at speed, double stepover, explode to byline, pull back low driven pass to penalty spot.'
      },
      {
        title: 'Inverted Run in Behind & Far-Post Curler',
        durationMinutes: 20,
        intensity: 'High',
        focus: 'Curved off-the-ball run and finishing',
        description: 'Start wide on touchline, arc run behind defender line, receive lofted diagonal ball, finish 1-touch into side netting.'
      }
    ]
  },
  {
    position: 'Striker',
    tagline: 'The Lethal Finisher & Focal Point',
    roleOverview: 'The ultimate match-winner. Scores in all manners (headers, 1-touch poaches, driven finishes), holds up play with back to goal, and creates chaos for defenders.',
    keyResponsibilities: [
      'Score goals with high conversion efficiency',
      'Hold up long balls and bring attacking midfielders into play',
      'Make sharp double-movements to shake man-markers',
      'Initiate team pressing from the front'
    ],
    tacticalDemands: ['Timing runs across front of near post', 'Playing on shoulder of last defender', 'Hold-up body shielding'],
    physicalRequirements: ['Explosive acceleration', 'Upper-body shielding strength', 'Aerial jump height', 'First-touch softness'],
    proReferencePlayers: ['Erling Haaland', 'Harry Kane', 'Robert Lewandowski', 'Kylian Mbappé'],
    specializedDrills: [
      {
        title: 'Near-Post Dart & 1-Touch Clinical Finish',
        durationMinutes: 25,
        intensity: 'Explosive',
        focus: 'Blindside movement and clinical touch',
        description: 'Back away 2 steps to push defender deep, suddenly dart across near post, touch inside or toe-poke past goalkeeper.'
      },
      {
        title: 'Back-to-Goal Ball Shielding & Spin Strike',
        durationMinutes: 20,
        intensity: 'High',
        focus: 'Lower body base and rapid turn',
        description: 'Receive firm ball into chest or feet with defender pushing into back; feel defender arm, spin off shoulder, fire shot.'
      }
    ]
  }
];
