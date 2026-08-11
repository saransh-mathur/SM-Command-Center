import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Cpu, 
  Layers, 
  Zap, 
  Briefcase,
  Code2,
  GraduationCap,
  Dices,
  Sun,
  Sunrise,
  Moon
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const Header: React.FC = () => {
  const { 
    telemetry, 
    activeView, 
    setActiveView, 
    energyMode, 
    setEnergyMode, 
    openModal 
  } = useDashboard();

  const getTempColor = (temp: number) => {
    if (temp < 55) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (temp < 72) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getRamColor = (percent: number) => {
    if (percent < 60) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    if (percent < 80) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <header className="w-full glass-panel border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-6 py-3 backdrop-blur-xl bg-slate-950/80">
      <div className="max-w-[1720px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand Title & Online Indicator */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              onClick={() => setActiveView('cockpit')}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-glow-cyan text-slate-950 font-black cursor-pointer"
            >
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </motion.div>
            
            <div>
              <div className="flex items-center gap-2.5">
                <h1 
                  onClick={() => setActiveView('cockpit')}
                  className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-sans cursor-pointer"
                >
                  SM COMMAND CENTER
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5"></span>
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>LOCAL COCKPIT // LINUX X86_64</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-semibold">NITRO-AN515</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: 4-Way Navigation Switcher */}
        <div className="flex items-center flex-wrap gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs shadow-inner">
          <button
            onClick={() => setActiveView('cockpit')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'cockpit'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>⚡ Cockpit</span>
          </button>

          <button
            onClick={() => setActiveView('career')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'career'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-glow-emerald'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>💼 Career &amp; Jobs</span>
          </button>

          <button
            onClick={() => setActiveView('courses')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'courses'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>💻 Course Lab</span>
          </button>

          <button
            onClick={() => setActiveView('mba')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'mba'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-glow-amber'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>🎓 MBA Copilot</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/30 text-amber-200 font-bold">
              NMIMS
            </span>
          </button>
        </div>

        {/* Right Controls: Emergency Unblocker + Energy Switcher + Telemetry */}
        <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-end">
          
          {/* 🎲 EMERGENCY UNBLOCK BUTTON */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => openModal('roulette')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs font-mono flex items-center gap-1.5 shadow-glow-emerald border border-emerald-400/50 cursor-pointer animate-pulse"
          >
            <Dices className="w-4 h-4 text-slate-950" />
            <span>🎲 Unblock Me</span>
          </motion.button>

          {/* Energy Mode Selector */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setEnergyMode('morning')}
              title="Morning Peak (Deep Code + Applications)"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                energyMode === 'morning'
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Sunrise className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setEnergyMode('midday')}
              title="Midday Build (Udemy Code + Quant Methods)"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                energyMode === 'midday'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setEnergyMode('evening')}
              title="Evening Diffuse (Light MBA Reading + Rest)"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                energyMode === 'evening'
                  ? 'bg-violet-500/20 text-violet-300 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Live Digital Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs font-mono shadow-inner">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold tracking-wider">{telemetry.time}</span>
          </div>

          {/* CPU Thermals */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-semibold ${getTempColor(telemetry?.cpuTemp ?? 48)}`}>
            <Cpu className="w-3.5 h-3.5" />
            <span>{Number(telemetry?.cpuTemp ?? 48).toFixed(1)}°C</span>
          </div>

          {/* RAM Usage */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-semibold ${getRamColor(telemetry?.ramPercent ?? 29)}`}>
            <Layers className="w-3.5 h-3.5" />
            <span>{Number(telemetry?.ramUsed ?? 4.5).toFixed(1)}G</span>
          </div>

        </div>

      </div>
    </header>
  );
};
