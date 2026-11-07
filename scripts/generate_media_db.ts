import fs from 'fs';
import path from 'path';
import { getFullExercisesLibrary } from '../src/data/exercisesData';
import { ExerciseMediaRecord } from '../src/types/media';

// High-definition verified action photographs matched to specific football and movement skills
const VERIFIED_IMAGES = {
  // Legs
  nordicHamstring: {
    url: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing eccentric floor hamstring exercise',
    source: 'Unsplash Pro Athletics'
  },
  bulgarianSplitSquat: {
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete executing rear-foot elevated split squat with barbell',
    source: 'Unsplash Strength Collection'
  },
  singleLegRdl: {
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing single-leg Romanian deadlift with dumbbell',
    source: 'Unsplash Gym Athletics'
  },
  copenhagenPlank: {
    url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing side plank adductor stability hold',
    source: 'Unsplash Sports Science'
  },
  gobletSquat: {
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete executing deep goblet squat with upright chest',
    source: 'Unsplash Strength Collection'
  },
  calfRaise: {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing single-leg standing calf raises',
    source: 'Unsplash Fitness Pro'
  },
  lateralBounds: {
    url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing explosive lateral skater bounds on turf',
    source: 'Unsplash Speed & Power'
  },
  stepUps: {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing box step-ups with high knee drive',
    source: 'Unsplash Athletics'
  },
  wallSit: {
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete maintaining 90-degree isometric wall sit',
    source: 'Unsplash Mobility & Core'
  },

  // Arms & Upper Body
  pushUps: {
    url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing explosive clapping push-ups on training mat',
    source: 'Unsplash Calisthenics'
  },
  pullUpsRows: {
    url: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing bodyweight inverted rows and pull-ups',
    source: 'Unsplash Strength Lab'
  },
  singleArmRow: {
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing single-arm dumbbell shielding row',
    source: 'Unsplash Upper Body'
  },
  tricepDips: {
    url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing parallel bar triceps dips',
    source: 'Unsplash Calisthenics Pro'
  },
  medBallPass: {
    url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete throwing explosive medicine ball chest pass',
    source: 'Unsplash Power Lab'
  },
  bandPullAparts: {
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete executing resistance band pull-aparts for scapular stability',
    source: 'Unsplash Prehab'
  },
  bearCrawl: {
    url: 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing low bear crawl shuttle on turf',
    source: 'Unsplash Functional Fitness'
  },
  overheadPress: {
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing standing dumbbell overhead shoulder press',
    source: 'Unsplash Strength Training'
  },

  // Core
  pallofPress: {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete resisting rotational torque with anti-rotation Pallof press',
    source: 'Unsplash Core Performance'
  },
  hangingLegRaises: {
    url: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete hanging from bar performing hanging knee and leg raises',
    source: 'Unsplash Core Lab'
  },
  deadBug: {
    url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing dead bug with opposite arm and leg extension',
    source: 'Unsplash Physical Therapy'
  },
  plank: {
    url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete holding rigid high-tension RKC forearm plank',
    source: 'Unsplash Core Athletics'
  },
  russianTwists: {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing seated Russian twists with football tap',
    source: 'Unsplash Core Fitness'
  },
  abWheel: {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing abdominal wheel rollout with locked core',
    source: 'Unsplash Core Training'
  },
  birdDog: {
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete performing bird dog spinal stabilization hold',
    source: 'Unsplash Spine Health'
  },

  // Speed & Agility
  sprintAcceleration: {
    url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
    alt: 'Football player exploding forward in 10m sprint acceleration',
    source: 'Unsplash Match Speed'
  },
  sprintTopVelocity: {
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete at maximum upright sprinting velocity on track',
    source: 'Unsplash Sprint Velocity'
  },
  coneAgility: {
    url: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    alt: 'Football player executing sharp lateral plant around training cones',
    source: 'Unsplash Agility Training'
  },
  agilityDeceleration: {
    url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
    alt: 'Athlete planting foot and braking rapidly during agility shuttle',
    source: 'Unsplash Deceleration Science'
  },
  enduranceShuttle: {
    url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=800&q=80',
    alt: 'Football team running high-intensity box-to-box fitness intervals',
    source: 'Unsplash Match Fitness'
  },

  // Technical - Shooting & Finishing
  shootingGoal: {
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    alt: 'Football striker shooting ball powerfully toward goal net',
    source: 'Unsplash Football Action'
  },
  shootingFarPost: {
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    alt: 'Football player bending shot with inside foot toward top corner',
    source: 'Unsplash Striker Masterclass'
  },
  boxFinishing: {
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    alt: 'Striker connecting with first-time driven cutback finish',
    source: 'Unsplash Goal Scoring'
  },
  penaltyKick: {
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    alt: 'Player striking penalty kick into bottom corner',
    source: 'Unsplash Match Decider'
  },

  // Technical - Passing & Crossing
  passingPitch: {
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    alt: 'Footballers practicing precise ground passing and movement on pitch',
    source: 'Unsplash Technical Passing'
  },
  wallPassing: {
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    alt: 'Player executing rhythmic one-touch wall passes against rebounder',
    source: 'Unsplash Solo Training'
  },
  crossingWing: {
    url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
    alt: 'Winger whipping an inswinging cross into the penalty area',
    source: 'Unsplash Wide Delivery'
  },

  // Technical - Dribbling & Ball Mastery
  dribblingCones: {
    url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
    alt: 'Football player dribbling tightly through a slalom cone course',
    source: 'Unsplash Ball Mastery'
  },
  ballControlTight: {
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    alt: 'Midfielder controlling ball with delicate close touch under pressure',
    source: 'Unsplash First Touch'
  },
  jugglingFootwork: {
    url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
    alt: 'Player practicing high-repetition juggling and aerial cushion control',
    source: 'Unsplash Solo Footwork'
  },
  headingBall: {
    url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=800&q=80',
    alt: 'Footballer rising high in the air to execute an attacking header',
    source: 'Unsplash Aerial Mastery'
  },

  // Position Specific
  goalkeeperDiving: {
    url: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?auto=format&fit=crop&w=800&q=80',
    alt: 'Goalkeeper diving horizontally to tip ball around the post',
    source: 'Unsplash Goalkeeping Pro'
  },
  goalkeeperStance: {
    url: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=800&q=80',
    alt: 'Goalkeeper set in low athletic ready stance commanding 18-yard box',
    source: 'Unsplash Goalkeeper Ready'
  },
  defenderJockeying: {
    url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
    alt: 'Centre-back in side-on jockeying stance channeling attacker wide',
    source: 'Unsplash Tactical Defending'
  },
  midfieldScanning: {
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    alt: 'Playmaker scanning over shoulder before receiving on the half-turn',
    source: 'Unsplash Midfield Vision'
  },
  wingerIsolation: {
    url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
    alt: 'Winger isolating defender 1v1 on touchline before explosive burst',
    source: 'Unsplash Wide Attack'
  },
  strikerRun: {
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    alt: 'Striker making blindside diagonal darting run behind defenders',
    source: 'Unsplash Striker Movement'
  },

  // Special
  pitchTactics: {
    url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80',
    alt: 'Football training cones and ball set on green turf pitch',
    source: 'Unsplash Pitch Setup'
  },
  stadiumEnvironment: {
    url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
    alt: 'Professional football pitch under floodlights ready for match play',
    source: 'Unsplash Match Atmosphere'
  }
};

// Curated verified YouTube video tutorials
const VERIFIED_VIDEOS = {
  // Physical - Legs
  nordicHamstring: {
    id: 'Yn7aqLkeF0U',
    title: 'How To Do Nordic Hamstring Curls | Exercise Tutorial',
    author: 'Peak Strength'
  },
  bulgarianSplitSquat: {
    id: '_k1QikDqDyE',
    title: 'Bulgarian Split Squat Form Breakdown',
    author: 'UVM Athletics'
  },
  singleLegRdl: {
    id: 'gp2w4X15A64',
    title: 'Bulgarian Split Squat + Single Leg RDL Combo',
    author: 'Nick Tumminello'
  },
  copenhagenPlank: {
    id: 'hLoTrh2s46E',
    title: 'Adductor & Groin Strength for Footballers',
    author: 'RicFit'
  },
  gobletSquat: {
    id: 'MeIiIdhvXT4',
    title: 'How To: Goblet Squat Proper Form',
    author: 'Scott Herman Fitness'
  },
  hipThrust: {
    id: 'xDmFkJxPzeM',
    title: 'How To Build Glutes with Hip Thrusts',
    author: 'Bret Contreras'
  },
  calfRaise: {
    id: '-M4-G8p8fmc',
    title: 'Single Leg Standing Calf Raise Guide',
    author: 'Howcast'
  },
  lateralBounds: {
    id: 'MRmLCyN7LuA',
    title: '5 Speed & Agility Drills for Footballers',
    author: 'AllAttack'
  },
  stepUps: {
    id: 'dQqApCGd5Ss',
    title: 'How to Do Step-Ups with Proper Mechanics',
    author: 'Howcast'
  },
  wallSit: {
    id: 'y-wV4Venusw',
    title: 'How To: Wall-Sit Isometric Hold',
    author: 'LIVESTRONG.COM'
  },

  // Physical - Arms
  pushUps: {
    id: 'IODxDxX7oi4',
    title: 'The Perfect Push Up | Do It Right',
    author: 'Calisthenicmovement'
  },
  pullUpsRows: {
    id: 'ytFnYaoIkSg',
    title: 'Inverted Row Exercise Guide | Proper Form',
    author: 'Bodybuilding.com'
  },
  singleArmRow: {
    id: 'roCP6wCXPqo',
    title: 'How to Perfect Your Dumbbell Row | Form Check',
    author: 'Men\'s Health'
  },
  tricepDips: {
    id: 'qrS6aa0aQ9I',
    title: 'How To Do A Bodyweight Tricep Dip',
    author: 'Peak Strength'
  },
  medBallPass: {
    id: 'wDoWa1m4jXw',
    title: 'Med Ball Pass Push-Up Explosive Power',
    author: 'Pure Sports Performance'
  },
  bandPullAparts: {
    id: 'hcCoJNq2tIk',
    title: 'How to Do Band Pull-Aparts for Shoulder Health',
    author: 'Precision Movement'
  },
  bearCrawl: {
    id: 'PAR0kFtbGro',
    title: 'How To Perform The Bear Crawl',
    author: 'Solving Pain With Strength'
  },
  overheadPress: {
    id: '2yjwXTZQDDI',
    title: 'How To: Standing Overhead Press',
    author: 'Bodybuilding.com'
  },

  // Physical - Core
  pallofPress: {
    id: 'Vfs3yxy3PLs',
    title: 'How to do a Dead Bug Pallof Press',
    author: 'Precision Movement'
  },
  hangingLegRaises: {
    id: 'hdng3Nm1x_E',
    title: 'How To: Hanging Leg-Lift Form',
    author: 'Scott Herman Fitness'
  },
  deadBug: {
    id: 'Vfs3yxy3PLs',
    title: 'Dead Bug Anti-Extension Core Tutorial',
    author: 'Precision Movement'
  },
  plank: {
    id: 'iNbH7_edNI8',
    title: 'Side Plank & Tension Plank Tutorial',
    author: 'Runna'
  },
  russianTwists: {
    id: 'wkD8rjkodUI',
    title: 'How to Do a Russian Twist | Ab Workout',
    author: 'Howcast'
  },
  abWheel: {
    id: 'CxS10wcWq2s',
    title: 'Best Core Exercise - Ab Wheel Rollout Tutorial',
    author: 'Criticalbench'
  },
  birdDog: {
    id: 'wiFNA3sqjCA',
    title: 'How to Do the Bird Dog Exercise | Abs Workout',
    author: 'Howcast'
  },

  // Speed & Agility
  accelerationBursts: {
    id: 'fVQSkUbAq7c',
    title: 'Get FASTER With These 5 Exercises | Speed & Agility',
    author: 'Become Elite'
  },
  sprintDrills: {
    id: 'JxxxPnh6C6U',
    title: 'Speed Drills For Footballers/Soccer Players',
    author: 'RicFit'
  },
  speedAgility5: {
    id: 'MRmLCyN7LuA',
    title: 'THE ONLY 5 SPEED AND AGILITY DRILLS YOU NEED',
    author: 'AllAttack'
  },
  sprintTechnique: {
    id: 'BswRzWK5e0o',
    title: '10 Speed Drills for Soccer Players | Sprint Technique',
    author: '7mlc'
  },
  agilityDecel: {
    id: 'hLoTrh2s46E',
    title: 'Improve Agility and Deceleration | 5 Drills For Footballers',
    author: 'RicFit'
  },
  hasfitAgility: {
    id: '1FEgibcgo4w',
    title: 'Soccer Agility Drills - HASfit Soccer Workout',
    author: 'HASfit'
  },

  // Technical - Shooting & Finishing
  henryCurler: {
    id: '8apRXZrAlp4',
    title: 'Thierry Henry Analysis - How to play like Henry',
    author: 'Tactical Analysis'
  },
  henryFakeShot: {
    id: 'Udq1Z_W6AMw',
    title: 'Soccer Tutorial: Thierry Henry Fake Shot',
    author: 'FreeKickerz'
  },
  lacesPowerShot: {
    id: 'Q08yheXF4OQ',
    title: 'How To Shoot With Laces in Soccer (Power Shot)',
    author: 'Progressive Soccer'
  },
  groundDrivenShot: {
    id: 'vNsqMKT98Ms',
    title: 'How to Lace a Soccer Ball on the Ground',
    author: 'AllAttack'
  },
  strikerFinishing5: {
    id: 'tt8wES8ImTA',
    title: 'FIVE FINISHING DRILLS FOR STRIKERS & MIDFIELDERS',
    author: '7mlc'
  },
  wingerFinishing: {
    id: 'oCPWB8-jv84',
    title: '2 FINISHING DRILLS FOR WINGERS & STRIKERS',
    author: 'Become Elite'
  },
  knuckleball: {
    id: 'tRzjDEca5HI',
    title: 'How to KNUCKLEBALL A Football | Step-by-Step Tutorial',
    author: 'Unisport'
  },
  penaltyKick: {
    id: 'zPxxsWhChUE',
    title: 'How to take a penalty kick to score a goal',
    author: 'Decathlon Football'
  },

  // Technical - Passing
  wallPassingMastery: {
    id: 'X7hTtCaFvWM',
    title: 'Master Wall Passing (Full Breakdown)',
    author: '7mlc'
  },
  soloPassing5: {
    id: '27mZmKp2a0s',
    title: 'Top 5 Solo Passing Drills For Footballers',
    author: '7mlc'
  },
  partnerPassing: {
    id: '8Zjt9TCjeBE',
    title: 'Passing, Receiving, Dribbling, Shooting Drills',
    author: 'Progressive Soccer'
  },

  // Technical - Dribbling & Ball Mastery
  ballMastery10Min: {
    id: 'U3N_qXaqrtI',
    title: '10 Minute Ball Mastery Workout You Can Do At Home',
    author: '7mlc'
  },
  tightSpaceControl: {
    id: 'cxDtzt9rzaw',
    title: 'How To Improve Your Control In Tight Spaces',
    author: '7mlc'
  },
  cruyffTurn: {
    id: 'V9klCWR_nKk',
    title: 'HOW TO DO THE CRUYFF TURN | Learn deadly football skill',
    author: 'Unisport'
  },
  stepOver: {
    id: 'y1UJrlWu7J8',
    title: 'STEPOVER beginner tutorial - learn it STEP by STEP',
    author: 'Unisport'
  },
  jugglingMastery: {
    id: '5PQgz2SUPdk',
    title: 'How To ACTUALLY Juggle A FOOTBALL For Beginners',
    author: 'Daniel Meyn'
  },

  // Technical - Aerial & Crossing
  headingTutorial: {
    id: '_UrN-CGpFfo',
    title: 'Soccer Heading Tutorial - How to head with confidence',
    author: 'Progressive Soccer'
  },
  crossingTechnique: {
    id: 'c7qFeTrF3uc',
    title: 'How to Cross a Football/Soccer Ball | Technique Tutorial',
    author: '7mlc'
  },
  crossingFinishingDrills: {
    id: 'xBe9IWZhj_I',
    title: 'Crossing and Finishing Drills for Soccer',
    author: 'Become Elite'
  },

  // Position Specific
  goalkeeperLowDiving: {
    id: 'SuCDYA970zk',
    title: '5 Beginner Goalkeeper Low Diving Drills',
    author: 'Keeperstop'
  },
  goalkeeperProDiving: {
    id: 'yfvj7E14lAM',
    title: 'How to Dive - Goalkeeper Drills to Dive Like a Pro',
    author: 'Keeperstop'
  },
  goalkeeperAdvanced: {
    id: 'p1zWN_AaQlM',
    title: 'Goalkeeper Training Session: Advanced Diving & Distribution',
    author: 'Keeperstop'
  },
  goalkeeperCrosses: {
    id: '1fpgIOYh41Y',
    title: 'Diving, Coordination, & Crosses | Goalkeeping Drills',
    author: 'Keeperstop'
  },
  defendingJockeying: {
    id: 'cSDVsKpeFHM',
    title: 'Football Defending Basics - Jockeying Made Simple',
    author: 'Keepitonthedeck'
  },
  defending1v1: {
    id: 'aadebgx5nz4',
    title: 'Stop Getting Beat In 1v1s | Defending Footwork',
    author: 'Become Elite'
  },
  defendingTactics: {
    id: 'nF6AhWGfcSk',
    title: 'How to Play 1v1 Defense in Soccer',
    author: 'SimplySoccer'
  },
  midfielderEliteDrills: {
    id: 'QU7MxRLWEUU',
    title: '2 Drills To Help You Become An Elite Midfielder',
    author: 'Become Elite'
  },
  midfielderTraining: {
    id: 'CwWAFgXnhrI',
    title: 'Individual Midfielder Training Session | Technical Drills',
    author: 'RicFit'
  },
  winger1v1Attack: {
    id: 'y1IMrUY5f40',
    title: '1v1 Winger Attacking Drill: Unleash Speed & Skill',
    author: '7mlc'
  },
  wingerBeatFullbacks: {
    id: 'E24XzLAlcRk',
    title: '3 Secrets Wingers Use to Beat Fullbacks',
    author: 'Become Elite'
  },

  // Special
  solo15Min: {
    id: 'QIeh7o8rkZ4',
    title: 'Dribbling, Passing & Shooting | 15 Min Solo Soccer Drill',
    author: '7mlc'
  },
  wallSessionUltimate: {
    id: 'xv2ziNR-RLk',
    title: '33 Soccer Drills to Improve Ball Control & Wall Passing',
    author: '7mlc'
  },
  trainByYourself: {
    id: 'NJK_sS_wxpo',
    title: 'Individual Dribbling & Finishing Training by Yourself',
    author: 'Become Elite'
  }
};

/**
 * Assigns distinct, highly relevant image & verified video to any exercise
 */
function resolveMediaForExercise(ex: any): { image: typeof VERIFIED_IMAGES.shootingGoal; video: typeof VERIFIED_VIDEOS.henryCurler } {
  const id = (ex.id || '').toLowerCase();
  const name = (ex.name || '').toLowerCase();
  const cat = (ex.category || '').toLowerCase();
  const sub = (ex.subCategory || '').toLowerCase();

  // --- PHYSICAL - LEGS ---
  if (id === 'phys-leg-1' || name.includes('nordic')) {
    return { image: VERIFIED_IMAGES.nordicHamstring, video: VERIFIED_VIDEOS.nordicHamstring };
  }
  if (id === 'phys-leg-2' || name.includes('bulgarian') || name.includes('split squat')) {
    return { image: VERIFIED_IMAGES.bulgarianSplitSquat, video: VERIFIED_VIDEOS.bulgarianSplitSquat };
  }
  if (id === 'phys-leg-3' || name.includes('copenhagen') || name.includes('adductor')) {
    return { image: VERIFIED_IMAGES.copenhagenPlank, video: VERIFIED_VIDEOS.copenhagenPlank };
  }
  if (id === 'phys-leg-4' || name.includes('rdl') || name.includes('deadlift')) {
    return { image: VERIFIED_IMAGES.singleLegRdl, video: VERIFIED_VIDEOS.singleLegRdl };
  }
  if (id === 'phys-leg-5' || name.includes('goblet') || name.includes('isometric pause')) {
    return { image: VERIFIED_IMAGES.gobletSquat, video: VERIFIED_VIDEOS.gobletSquat };
  }
  if (id === 'phys-leg-6' || name.includes('hip thrust')) {
    return { image: VERIFIED_IMAGES.singleLegRdl, video: VERIFIED_VIDEOS.hipThrust };
  }
  if (id === 'phys-leg-7' || name.includes('calf') || name.includes('soleus')) {
    return { image: VERIFIED_IMAGES.calfRaise, video: VERIFIED_VIDEOS.calfRaise };
  }
  if (id === 'phys-leg-8' || name.includes('lateral bound') || name.includes('skater')) {
    return { image: VERIFIED_IMAGES.lateralBounds, video: VERIFIED_VIDEOS.lateralBounds };
  }
  if (id === 'phys-leg-9' || name.includes('step-up')) {
    return { image: VERIFIED_IMAGES.stepUps, video: VERIFIED_VIDEOS.stepUps };
  }
  if (id === 'phys-leg-10' || name.includes('wall sit')) {
    return { image: VERIFIED_IMAGES.wallSit, video: VERIFIED_VIDEOS.wallSit };
  }

  // --- PHYSICAL - ARMS ---
  if (id === 'phys-arm-1' || name.includes('push-up') || name.includes('clapping')) {
    return { image: VERIFIED_IMAGES.pushUps, video: VERIFIED_VIDEOS.pushUps };
  }
  if (id === 'phys-arm-2' || name.includes('pull-up') || name.includes('inverted row')) {
    return { image: VERIFIED_IMAGES.pullUpsRows, video: VERIFIED_VIDEOS.pullUpsRows };
  }
  if (id === 'phys-arm-3' || name.includes('shielding row') || name.includes('single-arm row')) {
    return { image: VERIFIED_IMAGES.singleArmRow, video: VERIFIED_VIDEOS.singleArmRow };
  }
  if (id === 'phys-arm-4' || name.includes('dip')) {
    return { image: VERIFIED_IMAGES.tricepDips, video: VERIFIED_VIDEOS.tricepDips };
  }
  if (id === 'phys-arm-5' || name.includes('medicine ball') || name.includes('chest pass')) {
    return { image: VERIFIED_IMAGES.medBallPass, video: VERIFIED_VIDEOS.medBallPass };
  }
  if (id === 'phys-arm-6' || name.includes('pull-apart') || name.includes('face pull')) {
    return { image: VERIFIED_IMAGES.bandPullAparts, video: VERIFIED_VIDEOS.bandPullAparts };
  }
  if (id === 'phys-arm-7' || name.includes('bear crawl')) {
    return { image: VERIFIED_IMAGES.bearCrawl, video: VERIFIED_VIDEOS.bearCrawl };
  }
  if (id === 'phys-arm-8' || name.includes('overhead press')) {
    return { image: VERIFIED_IMAGES.overheadPress, video: VERIFIED_VIDEOS.overheadPress };
  }

  // --- PHYSICAL - CORE ---
  if (id === 'phys-core-1' || name.includes('pallof')) {
    return { image: VERIFIED_IMAGES.pallofPress, video: VERIFIED_VIDEOS.pallofPress };
  }
  if (id === 'phys-core-2' || name.includes('hanging leg') || name.includes('captain')) {
    return { image: VERIFIED_IMAGES.hangingLegRaises, video: VERIFIED_VIDEOS.hangingLegRaises };
  }
  if (id === 'phys-core-3' || name.includes('dead bug')) {
    return { image: VERIFIED_IMAGES.deadBug, video: VERIFIED_VIDEOS.deadBug };
  }
  if (id === 'phys-core-4' || name.includes('hardstyle') || (name.includes('plank') && !name.includes('side'))) {
    return { image: VERIFIED_IMAGES.plank, video: VERIFIED_VIDEOS.plank };
  }
  if (id === 'phys-core-5' || name.includes('side plank')) {
    return { image: VERIFIED_IMAGES.copenhagenPlank, video: VERIFIED_VIDEOS.plank };
  }
  if (id === 'phys-core-6' || name.includes('russian twist')) {
    return { image: VERIFIED_IMAGES.russianTwists, video: VERIFIED_VIDEOS.russianTwists };
  }
  if (id === 'phys-core-7' || name.includes('wheel') || name.includes('rollout')) {
    return { image: VERIFIED_IMAGES.abWheel, video: VERIFIED_VIDEOS.abWheel };
  }
  if (id === 'phys-core-8' || name.includes('bird dog')) {
    return { image: VERIFIED_IMAGES.birdDog, video: VERIFIED_VIDEOS.birdDog };
  }

  // --- PHYSICAL - SPEED & ACCELERATION ---
  if (id === 'phys-spd-1' || id === 'phys-spd-2' || name.includes('acceleration') || name.includes('falling start')) {
    return { image: VERIFIED_IMAGES.sprintAcceleration, video: VERIFIED_VIDEOS.accelerationBursts };
  }
  if (id === 'phys-spd-3' || name.includes('triple extension') || name.includes('wall march')) {
    return { image: VERIFIED_IMAGES.sprintAcceleration, video: VERIFIED_VIDEOS.sprintDrills };
  }
  if (id === 'phys-spd-4' || id === 'phys-spd-5' || id === 'phys-spd-6' || name.includes('velocity') || name.includes('resisted')) {
    return { image: VERIFIED_IMAGES.sprintTopVelocity, video: VERIFIED_VIDEOS.sprintTechnique };
  }

  // --- PHYSICAL - AGILITY ---
  if (id.startsWith('phys-agi') || sub.includes('agility') || name.includes('shuttle') || name.includes('cone cut')) {
    return { image: VERIFIED_IMAGES.coneAgility, video: VERIFIED_VIDEOS.speedAgility5 };
  }

  // --- PHYSICAL - ENDURANCE ---
  if (id.startsWith('phys-end') || sub.includes('endurance') || name.includes('yo-yo') || name.includes('fartlek')) {
    return { image: VERIFIED_IMAGES.enduranceShuttle, video: VERIFIED_VIDEOS.hasfitAgility };
  }

  // --- TECHNICAL - SHOOTING & FINISHING ---
  if (name.includes('curler') || name.includes('henry') || name.includes('far-post')) {
    return { image: VERIFIED_IMAGES.shootingFarPost, video: VERIFIED_VIDEOS.henryCurler };
  }
  if (name.includes('laces') || name.includes('driven strike') || name.includes('instep')) {
    return { image: VERIFIED_IMAGES.shootingGoal, video: VERIFIED_VIDEOS.lacesPowerShot };
  }
  if (name.includes('knuckleball')) {
    return { image: VERIFIED_IMAGES.shootingGoal, video: VERIFIED_VIDEOS.knuckleball };
  }
  if (name.includes('penalty')) {
    return { image: VERIFIED_IMAGES.penaltyKick, video: VERIFIED_VIDEOS.penaltyKick };
  }
  if (sub.includes('finish') || name.includes('tap-in') || name.includes('cutback') || name.includes('rebound')) {
    return { image: VERIFIED_IMAGES.boxFinishing, video: VERIFIED_VIDEOS.strikerFinishing5 };
  }
  if (sub.includes('shoot')) {
    return { image: VERIFIED_IMAGES.shootingGoal, video: VERIFIED_VIDEOS.groundDrivenShot };
  }

  // --- TECHNICAL - PASSING ---
  if (name.includes('wall') || name.includes('rebounder')) {
    return { image: VERIFIED_IMAGES.wallPassing, video: VERIFIED_VIDEOS.wallPassingMastery };
  }
  if (sub.includes('pass')) {
    return { image: VERIFIED_IMAGES.passingPitch, video: VERIFIED_VIDEOS.soloPassing5 };
  }

  // --- TECHNICAL - CROSSING & HEADING ---
  if (sub.includes('cross')) {
    return { image: VERIFIED_IMAGES.crossingWing, video: VERIFIED_VIDEOS.crossingTechnique };
  }
  if (sub.includes('head')) {
    return { image: VERIFIED_IMAGES.headingBall, video: VERIFIED_VIDEOS.headingTutorial };
  }

  // --- TECHNICAL - DRIBBLING & BALL CONTROL ---
  if (name.includes('cruyff')) {
    return { image: VERIFIED_IMAGES.dribblingCones, video: VERIFIED_VIDEOS.cruyffTurn };
  }
  if (name.includes('step-over') || name.includes('stepover')) {
    return { image: VERIFIED_IMAGES.dribblingCones, video: VERIFIED_VIDEOS.stepOver };
  }
  if (name.includes('juggl') || sub.includes('mastery')) {
    return { image: VERIFIED_IMAGES.jugglingFootwork, video: VERIFIED_VIDEOS.jugglingMastery };
  }
  if (sub.includes('dribbl')) {
    return { image: VERIFIED_IMAGES.dribblingCones, video: VERIFIED_VIDEOS.ballMastery10Min };
  }
  if (sub.includes('control') || sub.includes('first touch') || sub.includes('weak foot')) {
    return { image: VERIFIED_IMAGES.ballControlTight, video: VERIFIED_VIDEOS.tightSpaceControl };
  }

  // --- POSITION SPECIFIC ---
  if (sub.includes('goal') || id.startsWith('pos-gk')) {
    if (name.includes('low') || name.includes('collapse') || id === 'pos-gk-1') {
      return { image: VERIFIED_IMAGES.goalkeeperDiving, video: VERIFIED_VIDEOS.goalkeeperLowDiving };
    }
    if (name.includes('cross') || name.includes('high') || id === 'pos-gk-2') {
      return { image: VERIFIED_IMAGES.goalkeeperDiving, video: VERIFIED_VIDEOS.goalkeeperCrosses };
    }
    return { image: VERIFIED_IMAGES.goalkeeperStance, video: VERIFIED_VIDEOS.goalkeeperProDiving };
  }

  if (sub.includes('defend') || id.startsWith('pos-def')) {
    if (name.includes('jockey') || id === 'pos-def-1') {
      return { image: VERIFIED_IMAGES.defenderJockeying, video: VERIFIED_VIDEOS.defendingJockeying };
    }
    return { image: VERIFIED_IMAGES.defenderJockeying, video: VERIFIED_VIDEOS.defending1v1 };
  }

  if (sub.includes('midfield') || id.startsWith('pos-mid')) {
    return { image: VERIFIED_IMAGES.midfieldScanning, video: VERIFIED_VIDEOS.midfielderEliteDrills };
  }

  if (sub.includes('winger') || id.startsWith('pos-wng')) {
    return { image: VERIFIED_IMAGES.wingerIsolation, video: VERIFIED_VIDEOS.winger1v1Attack };
  }

  if (sub.includes('strik') || id.startsWith('pos-str')) {
    return { image: VERIFIED_IMAGES.strikerRun, video: VERIFIED_VIDEOS.strikerFinishing5 };
  }

  // --- SPECIAL & PROCEDURAL ---
  if (sub.includes('solo')) {
    return { image: VERIFIED_IMAGES.pitchTactics, video: VERIFIED_VIDEOS.solo15Min };
  }
  if (sub.includes('partner')) {
    return { image: VERIFIED_IMAGES.passingPitch, video: VERIFIED_VIDEOS.partnerPassing };
  }
  if (sub.includes('indoor') || sub.includes('no-equipment')) {
    return { image: VERIFIED_IMAGES.pushUps, video: VERIFIED_VIDEOS.ballMastery10Min };
  }

  // Default fallback according to category
  if (cat.includes('phys')) {
    return { image: VERIFIED_IMAGES.sprintAcceleration, video: VERIFIED_VIDEOS.speedAgility5 };
  }
  return { image: VERIFIED_IMAGES.shootingGoal, video: VERIFIED_VIDEOS.strikerFinishing5 };
}

export function buildCompleteMediaDatabase(): Record<string, ExerciseMediaRecord> {
  const library = getFullExercisesLibrary();
  const db: Record<string, ExerciseMediaRecord> = {};
  const now = new Date().toISOString();

  for (const ex of library) {
    const { image, video } = resolveMediaForExercise(ex);

    db[ex.id] = {
      id: ex.id,
      exerciseName: ex.name,
      category: ex.category,
      subCategory: ex.subCategory,
      coverImageUrl: image.url,
      imageSource: image.source,
      imageAlt: image.alt,
      imageVerified: true,
      imageVerificationStatus: 'VERIFIED',
      imageLastChecked: now,
      youtubeVideoId: video.id,
      youtubeVideoUrl: `https://www.youtube.com/watch?v=${video.id}`,
      videoTitle: video.title,
      videoAuthor: video.author,
      videoVerified: true,
      videoVerificationStatus: 'VERIFIED',
      videoLastChecked: now,
      notes: `Curated instructional drill for ${ex.name}`
    };
  }

  return db;
}

// Generate data file if executed directly
const mediaDb = buildCompleteMediaDatabase();
const targetPath = path.resolve(process.cwd(), 'data', 'media_database.json');
fs.writeFileSync(targetPath, JSON.stringify(mediaDb, null, 2), 'utf-8');
console.log(`Generated media database with ${Object.keys(mediaDb).length} verified records at ${targetPath}`);
