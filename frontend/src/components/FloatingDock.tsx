import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Sparkles } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { AdvisorId } from '../types';

export const FloatingDock: React.FC = () => {
  const { openAdvisorModal } = useDashboard();

  const advisors: {
    id: AdvisorId;
    name: string;
    tagline: string;
    icon: any;
    color: string;
    glow: string;
    badge: string;
  }[] = [
    {
      id: 'ren',
      name: '@Ren',
      tagline: 'Knowledge & Prep',
      icon: Brain,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20',
      glow: 'shadow-glow-cyan',
      badge: 'CLO // ARCHITECTURE',
    },
    {
      id: 'sky',
      name: '@Sky',
      tagline: 'Nervous System & Energy',
      icon: Zap,
      color: 'text-violet-400 border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20',
      glow: 'shadow-glow-violet',
      badge: 'FOCUS // REGULATION',
    },
    {
      id: 'tsuna',
      name: '@Tsuna',
      tagline: 'Execution & Unstuck',
      icon: Target,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20',
      glow: 'shadow-glow-emerald',
      badge: 'COACH // ANTI-INERTIA',
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-40 px-3 py-2 rounded-2xl glass-panel border border-slate-700/80 shadow-dock flex items-center gap-2 max-w-full overflow-x-auto">
      <div className="hidden sm:flex items-center gap-1.5 pl-2 pr-3 border-r border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Advisory Board</span>
      </div>

      <div className="flex items-center gap-2">
        {advisors.map((advisor) => {
          const Icon = advisor.icon;
          return (
            <motion.button
              key={advisor.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openAdvisorModal(advisor.id)}
              className={`px-3 sm:px-4 py-2 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${advisor.color}`}
            >
              <Icon className="w-4 h-4" />
              <div className="text-left font-mono">
                <span className="text-xs font-black block leading-none text-white">
                  {advisor.name}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:block leading-tight">
                  {advisor.tagline}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
