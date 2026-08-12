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
 <header className="w-full sticky top-0 z-30 px-4 sm:px-6 py-4 backdrop-blur-2xl bg-void-900/70 border-b transition-colors duration-500">
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
 className="text-lg sm:text-xl font-semibold tracking-wide text-slate-100 font-sans cursor-pointer hover:text-white transition-colors"
 >
 SM COMMAND CENTER
 </h1>
 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
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
 <div className="flex items-center flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/30 backdrop-blur-md font-mono text-xs">
 <button
 onClick={() => setActiveView('cockpit')}
 className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
 activeView === 'cockpit'
 ? 'bg-cyan-500/15 text-cyan-500 border-cyan-500/20 font-semibold shadow-sm'
 : 'text-slate-500 hover:text-slate-300'
 }`}
 >
 <Zap className="w-3.5 h-3.5" />
 <span>Cockpit</span>
 </button>

 <button
 onClick={() => setActiveView('career')}
 className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
 activeView === 'career'
 ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20 font-semibold shadow-sm'
 : 'text-slate-500 hover:text-slate-300'
 }`}
 >
 <Briefcase className="w-3.5 h-3.5" />
 <span>Career</span>
 </button>

 <button
 onClick={() => setActiveView('courses')}
 className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
 activeView === 'courses'
 ? 'bg-blue-500/15 text-blue-500 border-blue-500/20 font-semibold shadow-sm'
 : 'text-slate-500 hover:text-slate-300'
 }`}
 >
 <Code2 className="w-3.5 h-3.5" />
 <span>Course Lab</span>
 </button>

 <button
 onClick={() => setActiveView('mba')}
 className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
 activeView === 'mba'
 ? 'bg-amber-500/15 text-amber-500 border-amber-500/20 font-semibold shadow-sm'
 : 'text-slate-500 hover:text-slate-300'
 }`}
 >
 <GraduationCap className="w-3.5 h-3.5" />
 <span>MBA Copilot</span>
 <span className="px-1.5 py-0.5 rounded-md text-[9px] tracking-wider uppercase bg-amber-500/20 text-amber-500 font-bold ml-1">
 NMIMS
 </span>
 </button>
 </div>

 {/* Right Controls: Emergency Unblocker + Energy Switcher + Telemetry */}
 <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-end">
 
 {/* 🎲 EMERGENCY UNBLOCK BUTTON */}
 <motion.button
 whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(var(--color-emerald), 0.3)' }}
 whileTap={{ scale: 0.96 }}
 onClick={() => openModal('roulette')}
 className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
 >
 <Dices className="w-4 h-4" />
 <span>Unblock Me</span>
 </motion.button>

 {/* Energy Mode Selector */}
 <div className="flex items-center p-1 rounded-full bg-slate-900/30 backdrop-blur-md text-[11px] font-mono">
 <button
 onClick={() => setEnergyMode('morning')}
 title="Morning Peak (Deep Code + Applications)"
 className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
 energyMode === 'morning'
 ? 'bg-amber-500/15 text-amber-500'
 : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
 }`}
 >
 <Sunrise className="w-3.5 h-3.5" />
 </button>
 <button
 onClick={() => setEnergyMode('midday')}
 title="Midday Build (Udemy Code + Quant Methods)"
 className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
 energyMode === 'midday'
 ? 'bg-cyan-500/15 text-cyan-500'
 : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
 }`}
 >
 <Sun className="w-3.5 h-3.5" />
 </button>
 <button
 onClick={() => setEnergyMode('evening')}
 title="Evening Diffuse (Light MBA Reading + Rest)"
 className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
 energyMode === 'evening'
 ? 'bg-violet-500/15 text-violet-500'
 : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
 }`}
 >
 <Moon className="w-3.5 h-3.5" />
 </button>
 </div>

 {/* Live Digital Clock */}
 <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/20 backdrop-blur-sm text-slate-300 text-xs font-mono transition-colors">
 <Clock className="w-3.5 h-3.5 text-slate-500" />
 <span className="font-medium tracking-wide">{telemetry.time}</span>
 </div>

 {/* CPU Thermals */}
 <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/20 backdrop-blur-sm text-xs font-mono font-medium transition-colors ${getTempColor(telemetry?.cpuTemp ?? 48)}`}>
 <Cpu className="w-3.5 h-3.5 opacity-80" />
 <span>{Number(telemetry?.cpuTemp ?? 48).toFixed(1)}°C</span>
 </div>

 {/* RAM Usage */}
 <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/20 backdrop-blur-sm text-xs font-mono font-medium transition-colors ${getRamColor(telemetry?.ramPercent ?? 29)}`}>
 <Layers className="w-3.5 h-3.5 opacity-80" />
 <span>{Number(telemetry?.ramUsed ?? 4.5).toFixed(1)}G</span>
 </div>

 </div>

 </div>
 </header>
 );
};
