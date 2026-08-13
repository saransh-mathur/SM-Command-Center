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
 <header className="w-full sticky top-0 z-30 px-4 sm:px-6 py-4 backdrop-blur-2xl bg-white/70 border-b border-stone-200 transition-colors duration-500">
 <div className="max-w-[1720px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
 
 {/* Left: Brand Title & Online Indicator */}
 <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-start">
 <div className="flex items-center gap-3">
 <motion.div 
 whileHover={{ rotate: 180, scale: 1.1 }}
 transition={{ duration: 0.4 }}
 onClick={() => setActiveView('cockpit')}
 className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 flex items-center justify-center shadow-sm text-white font-black cursor-pointer"
 >
 <Zap className="w-5 h-5 text-white fill-white" />
 </motion.div>
 
 <div>
 <div className="flex items-center gap-2.5">
 <h1 
 onClick={() => setActiveView('cockpit')}
 className="text-lg sm:text-xl font-semibold tracking-wide text-stone-800 font-sans cursor-pointer hover:text-stone-600 transition-colors"
 >
 SM COMMAND CENTER
 </h1>
 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
 <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5"></span>
 LIVE
 </span>
 </div>
 <p className="text-[11px] text-stone-500 font-mono flex items-center gap-2 mt-0.5">
 <span>LOCAL COCKPIT // LINUX X86_64</span>
 <span className="text-stone-300">•</span>
 <span className="text-cyan-500 font-semibold">NITRO-AN515</span>
 </p>
 </div>
 </div>
 </div>

 {/* Center: 4-Way Navigation Switcher */}
 <div className="flex items-center flex-wrap gap-2 p-1 font-sans">
 <button
 onClick={() => setActiveView('cockpit')}
 className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer text-sm font-medium border ${
 activeView === 'cockpit'
 ? 'bg-cyan-50 text-cyan-700 border-cyan-200 shadow-sm'
 : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 shadow-sm'
 }`}>
 <Zap className="w-3.5 h-3.5" />
 <span>Cockpit</span>
 </button>

 <button
 onClick={() => setActiveView('career')}
 className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer text-sm font-medium border ${
 activeView === 'career'
 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
 : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 shadow-sm'
 }`}>
 <Briefcase className="w-3.5 h-3.5" />
 <span>Career</span>
 </button>

 <button
 onClick={() => setActiveView('courses')}
 className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer text-sm font-medium border ${
 activeView === 'courses'
 ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
 : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 shadow-sm'
 }`}>
 <Code2 className="w-3.5 h-3.5" />
 <span>Course Lab</span>
 </button>

 <button
 onClick={() => setActiveView('mba')}
 className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer text-sm font-medium border ${
 activeView === 'mba'
 ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
 : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 shadow-sm'
 }`}>
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
 whileHover={{ y: -1 }}
 whileTap={{ scale: 0.96 }}
 onClick={() => openModal('roulette')}
 className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-medium text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
 >
 <Dices className="w-4 h-4" />
 <span>Unblock Me</span>
 </motion.button>

 {/* Energy Mode Selector */}
 <div className="flex items-center gap-1.5">
 <button
 onClick={() => setEnergyMode('morning')}
 title="Morning Peak (Deep Code + Applications)"
 className={`p-2 rounded-full border transition-all cursor-pointer shadow-sm ${
 energyMode === 'morning'
 ? 'bg-amber-50 border-amber-200 text-amber-600'
 : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-900'
 }`}
 >
 <Sunrise className="w-3.5 h-3.5" />
 </button>
 <button
 onClick={() => setEnergyMode('midday')}
 title="Midday Build (Udemy Code + Quant Methods)"
 className={`p-2 rounded-full border transition-all cursor-pointer shadow-sm ${
 energyMode === 'midday'
 ? 'bg-cyan-50 border-cyan-200 text-cyan-600'
 : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-900'
 }`}
 >
 <Sun className="w-3.5 h-3.5" />
 </button>
 <button
 onClick={() => setEnergyMode('evening')}
 title="Evening Diffuse (Light MBA Reading + Rest)"
 className={`p-2 rounded-full border transition-all cursor-pointer shadow-sm ${
 energyMode === 'evening'
 ? 'bg-violet-50 border-violet-200 text-violet-600'
 : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-900'
 }`}
 >
 <Moon className="w-3.5 h-3.5" />
 </button>
 </div>
 
 {/* Dev Mode Toggle */}
 <button
   onClick={() => setIsDevMode(prev => !prev)}
   title="Toggle Dev Mode (Diagnostics & Control Hub)"
   className={`p-2 rounded-full border transition-all cursor-pointer shadow-sm flex items-center justify-center ${
 isDevMode
 ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
 : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-900'
 }`}
 >
   <Terminal className="w-4 h-4" />
 </button>

 {/* Live Digital Clock */}
 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-sm text-stone-600 text-sm font-medium transition-colors">
 <Clock className="w-4 h-4 text-stone-400" />
 <span className="font-medium tracking-wide">{telemetry.time}</span>
 </div>

 {/* Telemetry only visible if isDevMode is true */}
 {isDevMode && (
   <>
     {/* CPU Thermals */}
     <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-sm text-sm font-medium transition-colors ${getTempColor(telemetry?.cpuTemp ?? 48)}`}>
     <Cpu className="w-4 h-4 opacity-80" />
     <span>{Number(telemetry?.cpuTemp ?? 48).toFixed(1)}°C</span>
     </div>

     {/* RAM Usage */}
     <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-sm text-sm font-medium transition-colors ${getRamColor(telemetry?.ramPercent ?? 29)}`}>
     <Layers className="w-4 h-4 opacity-80" />
     <span>{Number(telemetry?.ramUsed ?? 4.5).toFixed(1)}G</span>
     </div>
   </>
 )}

 </div>

 </div>
 </header>
 );
};
