import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Play, Pause, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalMBATimer: React.FC = () => {
  const { 
    mbaTimerActive, 
    mbaTimerSeconds, 
    mbaTimerTotalMinutes, 
    pauseMBATimer, 
    resumeMBATimer,
    setActiveView 
  } = useDashboard();

  if (mbaTimerTotalMinutes === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-4 py-2 bg-slate-950/80 backdrop-blur-lg border border-violet-500/30 shadow-glow-violet rounded-full"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-violet-500/20 rounded-full text-violet-400">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-sm font-black font-mono text-white tracking-widest">
            {String(Math.floor(mbaTimerSeconds / 60)).padStart(2, '0')}:{String(mbaTimerSeconds % 60).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <button
            onClick={() => mbaTimerActive ? pauseMBATimer() : resumeMBATimer()}
            className={`p-1.5 rounded-full transition-colors ${
              mbaTimerActive ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
          >
            {mbaTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setActiveView('mba')}
            className="px-3 py-1 text-[10px] font-bold font-mono uppercase bg-violet-600 text-white rounded-full hover:bg-violet-500 transition-colors shadow-glow-violet"
          >
            Finish & Log
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
