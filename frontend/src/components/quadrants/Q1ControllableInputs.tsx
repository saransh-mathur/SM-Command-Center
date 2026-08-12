import React from 'react';
import { motion } from 'framer-motion';
import { 
 Target, 
 Rocket, 
 Briefcase, 
 Code2, 
 Layers, 
 CheckCircle2, 
 RotateCcw, 
 Plus, 
 Minus,
 Sparkles,
 GraduationCap,
 Dices,
 Flame
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const Q1ControllableInputs: React.FC = () => {
 const { 
 targets, 
 incrementTarget, 
 decrementTarget, 
 resetTargets, 
 openModal,
 dailyScore 
 } = useDashboard();

 const items = [
 {
 key: 'applications' as const,
 title: 'Job Applications & Outreach Pings',
 subtitle: 'Targeted resume submissions & recruiter networking',
 target: targets?.applications?.target ?? 3,
 current: targets?.applications?.current ?? 0,
 icon: Briefcase,
 color: 'emerald',
 bgGlow: 'from-emerald-500/20 to-teal-500/5',
 accentColor: 'text-emerald-400',
 borderAccent: 'border-emerald-500/30',
 barColor: 'bg-emerald-400',
 },
 {
 key: 'udemySprints' as const,
 title: 'Udemy / Course Micro-Sprints',
 subtitle: '10-min 1 Video = 1 Code Snippet drills',
 target: targets?.udemySprints?.target ?? 2,
 current: targets?.udemySprints?.current ?? 0,
 icon: Code2,
 color: 'cyan',
 bgGlow: 'from-cyan-500/20 to-blue-500/5',
 accentColor: 'text-cyan-400',
 borderAccent: 'border-cyan-500/30',
 barColor: 'bg-cyan-400',
 },
 {
 key: 'mbaRecall' as const,
 title: 'MBA Concept & Formula Recall',
 subtitle: 'Active recall flashcards across 6 Sem 1 modules',
 target: targets?.mbaRecall?.target ?? 2,
 current: targets?.mbaRecall?.current ?? 0,
 icon: GraduationCap,
 color: 'amber',
 bgGlow: 'from-amber-500/20 to-orange-500/5',
 accentColor: 'text-amber-400',
 borderAccent: 'border-amber-500/30',
 barColor: 'bg-amber-400',
 },
 {
 key: 'deepDevBlocks' as const,
 title: '90-min Ultradian Deep Work Block',
 subtitle: 'Unbroken deep work block with zero distractions',
 target: targets?.deepDevBlocks?.target ?? 2,
 current: targets?.deepDevBlocks?.current ?? 0,
 icon: Layers,
 color: 'violet',
 bgGlow: 'from-violet-500/20 to-purple-500/5',
 accentColor: 'text-violet-400',
 borderAccent: 'border-violet-500/30',
 barColor: 'bg-violet-400',
 },
 ];

 // 7-day mock contribution streak
 const streakDays = [
 { day: 'Wed', count: 4, level: 3 },
 { day: 'Thu', count: 5, level: 4 },
 { day: 'Fri', count: 3, level: 2 },
 { day: 'Sat', count: 6, level: 4 },
 { day: 'Sun', count: 4, level: 3 },
 { day: 'Mon', count: 5, level: 4 },
 { day: 'Today', count: Math.min(6, Math.max(1, Math.round(dailyScore / 18))), level: dailyScore > 75 ? 4 : dailyScore > 40 ? 3 : 2 },
 ];

 const getHeatmapColor = (level: number) => {
 switch (level) {
 case 4: return 'bg-emerald-400 border-emerald-300';
 case 3: return 'bg-emerald-500/70 border-emerald-400/50';
 case 2: return 'bg-emerald-600/40 border-emerald-500/30';
 default: return 'bg-slate-800 ';
 }
 };

 return (
 <div className="glass-panel rounded-2xl p-5 shadow-glass flex flex-col justify-between h-full relative overflow-hidden group hover:border-slate-700 transition-all bg-slate-900/60">
 
 {/* Background Subtle Gradient Glow */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

 <div>
 {/* Card Header */}
 <div className="flex items-start justify-between gap-3 mb-4">
 <div className="flex items-center gap-3">
 <div className="p-2.5 rounded-xl bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
 <Target className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-base font-bold text-white tracking-tight">
 🎯 Tri-Track Daily Controllable Inputs
 </h3>
 <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
 @Tsuna Engine
 </span>
 </div>
 <p className="text-xs text-slate-400 mt-0.5 font-mono">
 Daily Momentum Score: <span className="text-emerald-400 font-bold">{dailyScore}%</span> (Focus 100% on effort, 0% on future anxiety)
 </p>
 </div>
 </div>

 <button
 onClick={resetTargets}
 title="Reset Daily Inputs"
 className="p-1.5 rounded-lg bg-slate-900/60 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 </button>
 </div>

  {/* Dual Quick Action Buttons */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
 <motion.button
 layout
 whileHover={{ scale: 1.015 }}
 whileTap={{ scale: 0.985 }}
 onClick={() => openModal('roulette')}
 className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs flex items-center justify-between shadow-glow-emerald border-emerald-400/40 cursor-pointer"
 >
 <div className="flex items-center gap-2">
 <Dices className="w-4 h-4 text-slate-950" />
 <span>🎲 Unblock Me (3-Min Roulette)</span>
 </div>
 <Sparkles className="w-3.5 h-3.5" />
 </motion.button>

 <motion.button
 layout
 whileHover={{ scale: 1.015 }}
 whileTap={{ scale: 0.985 }}
 onClick={() => openModal('microStart')}
 className="p-3 rounded-xl bg-slate-950 hover:border-slate-600 text-slate-200 font-bold text-xs flex items-center justify-between cursor-pointer"
 >
 <div className="flex items-center gap-2">
 <Rocket className="w-4 h-4 text-emerald-400" />
 <span>🚀 5-Min Micro-Start</span>
 </div>
 <span className="text-[10px] font-mono text-slate-400">Timer</span>
 </motion.button>
 </div>

 {/* Overall Progress Gauge */}
 <div className="p-3 rounded-xl bg-slate-950/80 mb-4 flex items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-slate-900 border-emerald-500/40 flex items-center justify-center text-xs font-mono font-bold text-emerald-300">
 {dailyScore}%
 </div>
 <div>
 <span className="text-xs font-extrabold text-white">Daily Execution Momentum</span>
 <p className="text-[11px] text-slate-400 font-mono">
 {dailyScore >= 100 ? '🎉 All daily targets smashed!' : 'Complete micro-actions across all 3 tracks'}
 </p>
 </div>
 </div>

 <div className="w-36 bg-slate-900 h-2 rounded-full overflow-hidden hidden sm:block">
 <div 
 className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500" 
 style={{ width: `${dailyScore}%` }} 
 />
 </div>
 </div>

 {/* Inputs List */}
 <div className="space-y-2.5 mb-4">
 {items.map((item) => {
 const Icon = item.icon;
 const isCompleted = item.current >= item.target;
 const pct = Math.min(100, Math.round((item.current / Math.max(1, item.target)) * 100));

 return (
 <div
 key={item.key}
 className={`p-3 rounded-xl bg-slate-950/70 ${
 isCompleted ? 'border-emerald-500/40 bg-emerald-500/[0.03]' : ''
 } flex flex-col gap-2 transition-all`}
 >
 <div className="flex items-center justify-between gap-2">
 <div className="flex items-center gap-2.5 min-w-0">
 <div className={`p-1.5 rounded-lg bg-slate-900 ${item.accentColor}`}>
 <Icon className="w-3.5 h-3.5" />
 </div>
 <div className="min-w-0">
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-slate-200 truncate">
 {item.title}
 </span>
 {isCompleted && (
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
 )}
 </div>
 <span className="text-[10px] font-mono text-slate-400 block truncate">
 {item.subtitle}
 </span>
 </div>
 </div>

 {/* Counter Controls */}
 <div className="flex items-center gap-1.5 flex-shrink-0">
 <button
 onClick={() => decrementTarget(item.key)}
 className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
 >
 <Minus className="w-3 h-3" />
 </button>
 <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-900 ">
 {item.current}/{item.target}
 </span>
 <button
 onClick={() => incrementTarget(item.key)}
 className="p-1 rounded bg-slate-900 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
 >
 <Plus className="w-3 h-3" />
 </button>
 </div>
 </div>

 {/* Progress bar */}
 <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
 <div
 className={`h-full ${item.barColor} transition-all duration-300`}
 style={{ width: `${pct}%` }}
 />
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Footer: 7-Day Streak & Heatmap */}
 <div className="pt-3 border-t flex items-center justify-between gap-2">
 <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
 <Flame className="w-4 h-4 text-amber-400" />
 <span>7-Day Streak Grid:</span>
 </div>

 <div className="flex items-center gap-1.5 flex-wrap">
 {streakDays.map((s, idx) => (
 <div key={idx} className="flex flex-col items-center gap-0.5">
 <div 
 title={`${s.day}: ${s.count} actions`}
 className={`w-4 h-4 rounded-sm ${getHeatmapColor(s.level)} transition-all`}
 />
 <span className="text-[9px] font-mono text-slate-500">{s.day[0]}</span>
 </div>
 ))}
 </div>
 </div>

 </div>
 );
};
