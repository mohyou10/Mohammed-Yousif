import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Target,
  Send,
  Zap,
  Layers,
  Activity,
  Shield,
  Compass,
  Flame,
  Gauge,
  HeartPulse,
  Crosshair,
  UserCheck,
  Brain,
  Repeat,
  Sparkles,
  ArrowRight,
  Search,
  Dumbbell
} from 'lucide-react';
import { ALL_EXERCISES } from '../data/exercisesData';

interface CategoryCardInfo {
  id: string;
  name: string;
  filterKey: string;
  group: 'Technical' | 'Physical' | 'Position' | 'Athlete';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  imageUrl: string;
  focusAreas: string[];
}

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState<'All' | 'Technical' | 'Physical' | 'Position' | 'Athlete'>('All');

  const categories: CategoryCardInfo[] = [
    {
      id: 'shooting',
      name: 'Shooting & Finishing',
      filterKey: 'Shooting',
      group: 'Technical',
      description: 'Lethal 1-touch finishing, bending strikes, weak-foot side netting drives, and volley execution under defender pressure.',
      icon: Target,
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['1-Touch Finishing', 'Curled Strikes', 'Low Driven Shots', 'Box Movement']
    },
    {
      id: 'passing',
      name: 'Passing & Distribution',
      filterKey: 'Passing',
      group: 'Technical',
      description: 'Precision grounded push passes, line-breaking chipped deliveries, wall-rhythm combinations, and dynamic crossing.',
      icon: Send,
      imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['Rhythm Wall Passes', 'Diagonal Switches', 'First-Time Balls', 'Through-Balls']
    },
    {
      id: 'dribbling',
      name: 'Dribbling & 1v1 Dominance',
      filterKey: 'Dribbling',
      group: 'Technical',
      description: 'Tight cone weaves, explosive body feints, La Croqueta execution, change of pace, and beating defenders off the dribble.',
      icon: Zap,
      imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['Close Ball Control', 'Body Feints', 'La Croqueta', 'Explosive Cutbacks']
    },
    {
      id: 'ball-control',
      name: 'Ball Control & First Touch',
      filterKey: 'Ball Control',
      group: 'Technical',
      description: 'Aerial dead-ball cushions, high-pressure directional touches, directional turns, and 360-degree ball mastery routines.',
      icon: Layers,
      imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['Aerial Cushions', 'Directional First Touch', 'Cruyff Turns', 'Ankle Lock']
    },
    {
      id: 'legs',
      name: 'Leg Power & Hamstring Armor',
      filterKey: 'Legs',
      group: 'Physical',
      description: 'Nordic curls, Bulgarian split squats, jump squats, and unilateral strength to protect against hamstring injuries and boost kick velocity.',
      icon: Dumbbell,
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['Nordic Hamstring Curls', 'Split Squats', 'Calf Eccentrics', 'Sprint Braking']
    },
    {
      id: 'arms',
      name: 'Arm & Upper-Body Shielding',
      filterKey: 'Arms',
      group: 'Physical',
      description: 'Pectoral, lat, and tricep power for legal shoulder-to-shoulder shielding, aggressive aerial contesting, and throw-in power.',
      icon: Shield,
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['Ball Shielding Arm Bar', 'Plyo Push-Ups', 'Pull-Ups', 'Core-Lat Link']
    },
    {
      id: 'core',
      name: 'Core & Rotational Stability',
      filterKey: 'Core',
      group: 'Physical',
      description: 'Anti-rotational Paloff holds, hollow body rocks, side planks, and kinetic chain rigidity to withstand heavy tackles.',
      icon: Activity,
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['Anti-Rotation Planks', 'Hollow Body Hold', 'Medicine Ball Slams', 'Tackle Resilience']
    },
    {
      id: 'speed',
      name: 'Speed & Linear Acceleration',
      filterKey: 'Speed',
      group: 'Physical',
      description: 'Sprint mechanics, first 3-step explosiveness, hill sprints, resisted bounds, and maximum top-speed flying thirties.',
      icon: Flame,
      imageUrl: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['First-Step Burst', 'Drive Phase 0-10m', 'Max Velocity 30m', 'Arm Drive Action']
    },
    {
      id: 'agility',
      name: 'Agility & Change of Direction',
      filterKey: 'Agility',
      group: 'Physical',
      description: '5-10-5 pro agilities, slalom cone cutting, deceleration braking mechanics, and reactive mirroring drills without slowing down.',
      icon: Gauge,
      imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['Low Center of Mass', 'Deceleration Plant', 'T-Test Drill', 'Lateral Shuffles']
    },
    {
      id: 'endurance',
      name: 'Football Endurance & VO2 Max',
      filterKey: 'Endurance',
      group: 'Physical',
      description: 'High-intensity interval running (HIIT), football-specific box-to-box shuttles, and lactate tolerance for 90+ minutes.',
      icon: Repeat,
      imageUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['15-15 Interval Runs', 'Box-to-Box Shuttles', 'Lactate Clearance', 'Match Stamina']
    },
    {
      id: 'goalkeeper',
      name: 'Goalkeeper Specialist',
      filterKey: 'Goalkeeper',
      group: 'Position',
      description: 'W-catch shape, low diving angles, reflex saves, high cross claims, sweep-keeper distribution, and 1v1 smothering.',
      icon: UserCheck,
      imageUrl: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['W-Grip Hand Positioning', 'Low Driven Saves', 'Cross Claiming', 'Sweeper Distribution']
    },
    {
      id: 'defending',
      name: 'Defending & 1v1 Containment',
      filterKey: 'Defending',
      group: 'Position',
      description: 'Side-on body posture, delay tactics, channel forcing, recovery tackles, aerial heading duels, and defensive line stepping.',
      icon: Shield,
      imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['Side-On Jockeying', 'Patience & Delay', 'Block Tackles', 'Defensive Cover']
    },
    {
      id: 'midfield',
      name: 'Midfield Engine & Awareness',
      filterKey: 'Midfield',
      group: 'Position',
      description: 'Blindside scanning (3-5 scans before reception), half-turn body shape, tempo control, and transition pressing.',
      icon: Compass,
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['Pre-Touch Scanning', 'Open Half-Turn', 'Progressive Passing', 'Counter-Pressing']
    },
    {
      id: 'attacking',
      name: 'Attacking & Winger Mastery',
      filterKey: 'Attacking',
      group: 'Position',
      description: 'Blindside runs, overlapping wing play, whipped crosses into the corridor of uncertainty, and lethal box finishing.',
      icon: Crosshair,
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['Corridor Crosses', 'Blindside Runs', 'Far-Post Arriving', '1v1 Isolation']
    },
    {
      id: 'mental',
      name: 'Mental Toughness & Mindset',
      filterKey: 'Mental',
      group: 'Athlete',
      description: 'Pre-match visualization, mistake reset routines (the 5-second flush rule), confidence rebuilding, and tactical composure.',
      icon: Brain,
      imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['5-Second Reset Rule', 'Visualization Script', 'Pressure Breathwork', 'Trial Confidence']
    },
    {
      id: 'recovery',
      name: 'Recovery & Injury Prevention',
      filterKey: 'Recovery',
      group: 'Athlete',
      description: 'Hip mobility flows, foam rolling myofascial release, ankle dorsiflexion, and active regeneration routines.',
      icon: HeartPulse,
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      focusAreas: ['90/90 Hip Flow', 'Thoracic Opener', 'Ankle Dorsiflexion', 'Foam Rolling']
    }
  ];

  // Calculate actual exercises per category
  const getExerciseCount = (cat: CategoryCardInfo) => {
    return ALL_EXERCISES.filter(ex => {
      const k = cat.filterKey.toLowerCase();
      if (k === 'shooting') return ex.subCategory.toLowerCase() === 'shooting' || ex.subCategory.toLowerCase() === 'finishing';
      if (k === 'passing') return ex.subCategory.toLowerCase() === 'passing' || ex.subCategory.toLowerCase() === 'crossing';
      if (k === 'dribbling') return ex.subCategory.toLowerCase() === 'dribbling' || ex.subCategory.toLowerCase() === 'ball mastery';
      if (k === 'ball control') return ex.subCategory.toLowerCase() === 'ball control' || ex.subCategory.toLowerCase() === 'first touch';
      if (k === 'defending') return ex.subCategory.toLowerCase() === 'defender';
      if (k === 'midfield') return ex.subCategory.toLowerCase() === 'midfielder';
      if (k === 'attacking') return ex.subCategory.toLowerCase() === 'striker' || ex.subCategory.toLowerCase() === 'winger';
      if (k === 'mental') return ex.category === 'Special' || ex.subCategory === 'Advanced';
      if (k === 'recovery') return ex.subCategory.toLowerCase() === 'mobility' || ex.subCategory.toLowerCase() === 'balance';
      return ex.category.toLowerCase() === k || ex.subCategory.toLowerCase() === k;
    }).length;
  };

  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.focusAreas.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGroup = activeGroup === 'All' || c.group === activeGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="relative rounded-sm overflow-hidden border border-theme bg-theme-card p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-theme-elevated border border-theme text-[11px] font-mono-sport text-lime-accent uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            16 Specialized Football Training Domains
          </div>
          <h1 className="text-2xl lg:text-3xl font-black font-display text-theme-primary uppercase tracking-tight">
            Category Explorer
          </h1>
          <p className="text-sm text-theme-secondary mt-2 leading-relaxed">
            Every professional footballer is built on comprehensive athletic, technical, and mental foundations.
            Browse our targeted curriculum below. Click any category to open all matching exercises with instructions, sets, reps, and timers.
          </p>
        </div>

        {/* Search & Group Filter Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 pt-6 border-t border-theme-subtle">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search category, muscle, or skill focus..."
              className="w-full bg-theme-elevated border border-theme rounded-sm pl-10 pr-4 py-2.5 text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:border-[#ccff00]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['All', 'Technical', 'Physical', 'Position', 'Athlete'] as const).map(group => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`px-3 py-2 text-xs font-mono-sport uppercase font-bold rounded-sm whitespace-nowrap transition-colors ${
                  activeGroup === group
                    ? 'bg-[#ccff00] text-black'
                    : 'bg-theme-elevated text-theme-secondary hover:text-theme-primary border border-theme'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map(cat => {
          const Icon = cat.icon;
          const count = getExerciseCount(cat);

          return (
            <div
              key={cat.id}
              onClick={() => navigate(`/trainings?category=${encodeURIComponent(cat.filterKey)}`)}
              className="group bg-theme-card border border-theme hover:border-[#ccff00] rounded-sm overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-sm"
            >
              {/* Card Image Banner */}
              <div className="relative h-36 w-full overflow-hidden bg-black">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Badges on image */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-sm bg-black/80 backdrop-blur-xs text-[10px] font-mono-sport text-theme-muted uppercase border border-white/10">
                    {cat.group}
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-sm bg-[#ccff00] text-black text-[10px] font-mono-sport font-black uppercase">
                    {count} Drills
                  </span>
                </div>

                {/* Title & Icon on Banner Bottom */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-sm bg-[#ccff00] text-black flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-display uppercase tracking-wide truncate">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-theme-secondary line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                {/* Focus areas tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.focusAreas.slice(0, 3).map((f, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded-xs bg-theme-elevated text-[10px] font-mono-sport text-theme-muted border border-theme"
                    >
                      {f}
                    </span>
                  ))}
                  {cat.focusAreas.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-xs bg-theme-elevated text-[10px] font-mono-sport text-theme-muted border border-theme">
                      +{cat.focusAreas.length - 3}
                    </span>
                  )}
                </div>

                {/* Bottom Action */}
                <div className="pt-2 border-t border-theme flex items-center justify-between text-xs font-mono-sport text-lime-accent group-hover:text-lime-accent font-bold">
                  <span className="uppercase text-[11px] tracking-wider">Explore Drills</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-16 bg-theme-card border border-theme rounded-sm">
          <p className="text-sm text-theme-muted">No categories match &ldquo;{searchTerm}&rdquo;</p>
          <button
            onClick={() => { setSearchTerm(''); setActiveGroup('All'); }}
            className="mt-3 px-4 py-1.5 text-xs font-mono-sport uppercase font-bold bg-[#ccff00] text-black rounded-sm"
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
};
