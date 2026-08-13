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
 Moon,
 Terminal
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const Header: React.FC = () => {
 const { 
 telemetry, 
 activeView, 
 setActiveView, 
 energyMode, 
 setEnergyMode, 
 openModal,
 isDevMode,
 setIsDevMode 
 } = useDashboard();

 const getTempColor = (temp: number) => {
 if (temp < 55) return 'text-emerald-600 border-emerald-200 bg-emerald-50';
 if (temp < 72) return 'text-amber-600 border-amber-200 bg-amber-50';
 return 'text-rose-600 border-rose-200 bg-rose-50';
 };

 const getRamColor = (percent: number) => {
 if (percent < 60) return 'text-cyan-600 border-cyan-200 bg-cyan-50';
 if (percent < 80) return 'text-amber-600 border-amber-200 bg-amber-50';
 return 'text-rose-600 border-rose-200 bg-rose-50';
 };

 return (
 <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-sm">
  {/* Brand / Logo */}
  <div className="flex items-center gap-3">
    <motion.div 
      whileHover={{ rotate: 180, scale: 1.1 }}
      transition={{ duration: 0.4 }}
      onClick={() => setActiveView('cockpit')}
      className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm text-white cursor-pointer"
    >
      <Zap className="w-4 h-4 text-white fill-white" />
    </motion.div>
    <div className="flex items-center gap-2">
      <span className="font-bold text-slate-900 tracking-tight text-lg cursor-pointer" onClick={() => setActiveView('cockpit')}>SM COMMAND CENTER</span>
      <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200/60 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        LIVE
      </span>
    </div>
  </div>

  {/* Navigation Pills */}
  <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
    <button onClick={() => setActiveView('cockpit')} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${activeView === 'cockpit' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
      <Zap className="w-3.5 h-3.5" /> Cockpit
    </button>
    <button onClick={() => setActiveView('career')} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${activeView === 'career' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
      <Briefcase className="w-3.5 h-3.5" /> Career
    </button>
    <button onClick={() => setActiveView('courses')} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${activeView === 'courses' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
      <Code2 className="w-3.5 h-3.5" /> Course Lab
    </button>
    <button onClick={() => setActiveView('mba')} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${activeView === 'mba' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
      <GraduationCap className="w-3.5 h-3.5" /> MBA
    </button>
  </nav>

  {/* Right Controls: Emergency Unblocker + Energy Switcher + Telemetry */}
  <div className="flex items-center gap-2">
    <button
      onClick={() => openModal('roulette')}
      className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-3 py-1.5 rounded-xl text-sm transition-all shadow-xs flex items-center gap-1.5"
    >
      <Dices className="w-4 h-4 text-emerald-600" />
      Unblock Me
    </button>

    <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
      <button
        onClick={() => setEnergyMode('morning')}
        className={`p-1.5 rounded-lg transition-all ${energyMode === 'morning' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Sunrise className="w-4 h-4" />
      </button>
      <button
        onClick={() => setEnergyMode('midday')}
        className={`p-1.5 rounded-lg transition-all ${energyMode === 'midday' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setEnergyMode('evening')}
        className={`p-1.5 rounded-lg transition-all ${energyMode === 'evening' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>

    <button
      onClick={() => setIsDevMode(prev => !prev)}
      className={`p-1.5 rounded-xl border transition-all shadow-xs flex items-center justify-center ${
        isDevMode ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
      }`}
    >
      <Terminal className="w-4 h-4" />
    </button>

    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-slate-700 text-sm font-medium">
      <Clock className="w-4 h-4 text-slate-400" />
      <span>{telemetry.time}</span>
    </div>

    {isDevMode && (
      <>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-xs text-sm font-medium ${getTempColor(telemetry?.cpuTemp ?? 48)}`}>
          <Cpu className="w-4 h-4" />
          <span>{Number(telemetry?.cpuTemp ?? 48).toFixed(1)}°C</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-xs text-sm font-medium ${getRamColor(telemetry?.ramPercent ?? 29)}`}>
          <Layers className="w-4 h-4" />
          <span>{Number(telemetry?.ramUsed ?? 4.5).toFixed(1)}G</span>
        </div>
      </>
    )}
  </div>
 </header>
 );
};
