import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Dices, 
 X, 
 Play, 
 Pause, 
 RotateCcw, 
 CheckCircle2, 
 Sparkles, 
 Briefcase, 
 BookOpen, 
 Code2, 
 ExternalLink,
 Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDashboard } from '../../context/DashboardContext';

export const AntiProcrastinationRouletteModal: React.FC = () => {
 const { 
 activeModal, 
 closeModal, 
 currentRouletteTask, 
 spinRoulette, 
 incrementTarget, 
 addToast,
 setActiveView 
 } = useDashboard();

 const isOpen = activeModal === 'roulette';

 // 3-minute timer state (180s)
 const TOTAL_SECONDS = (currentRouletteTask?.estimatedMinutes || 3) * 60;
 const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
 const [isRunning, setIsRunning] = useState(false);
 const [isSpinning, setIsSpinning] = useState(false);

 useEffect(() => {
 if (currentRouletteTask) {
 setSecondsLeft((currentRouletteTask.estimatedMinutes || 3) * 60);
 setIsRunning(false);
 }
 }, [currentRouletteTask]);

 useEffect(() => {
 let interval: any = null;
 if (isRunning && secondsLeft > 0) {
 interval = setInterval(() => {
 setSecondsLeft((prev) => prev - 1);
 }, 1000);
 } else if (secondsLeft === 0 && isRunning) {
 setIsRunning(false);
 confetti({
 particleCount: 100,
 spread: 70,
 origin: { y: 0.6 },
 colors: ['#10B981', '#06B6D4', '#8B5CF6'],
 });
 addToast({
 type: 'success',
 title: '🎉 Micro-Task Time Completed!',
 message: 'You crushed the friction hurdle. Keep the momentum going!',
 });
 }
 return () => clearInterval(interval);
 }, [isRunning, secondsLeft, addToast]);

 if (!isOpen || !currentRouletteTask) return null;

 const mins = Math.floor(secondsLeft / 60);
 const secs = secondsLeft % 60;
 const progressPct = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;

 const handleSpin = () => {
 setIsSpinning(true);
 setIsRunning(false);
 setTimeout(() => {
 spinRoulette();
 setIsSpinning(false);
 }, 450);
 };

 const handleComplete = () => {
 setIsRunning(false);
 confetti({
 particleCount: 120,
 spread: 80,
 origin: { y: 0.6 },
 colors: ['#10B981', '#06B6D4', '#F59E0B'],
 });
 incrementTarget(currentRouletteTask.targetKey);
 addToast({
 type: 'success',
 title: '🎯 Micro-Action Smashed!',
 message: `Completed "${currentRouletteTask.title}". Procrastination broken!`,
 });
 closeModal();
 };

 const handleNavigateToTrack = () => {
 closeModal();
 if (currentRouletteTask.track === 'job') {
 setActiveView('career');
 } else if (currentRouletteTask.track === 'udemy') {
 setActiveView('courses');
 } else {
 setActiveView('mba');
 }
 };

 const getTrackBadge = () => {
 switch (currentRouletteTask.track) {
 case 'job':
 return {
 label: '💼 JOB HUNT TRACK',
 color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
 icon: Briefcase,
 };
 case 'udemy':
 return {
 label: '💻 UDEMY / COURSE TRACK',
 color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
 icon: Code2,
 };
 case 'mba':
 return {
 label: '🎓 MBA COPILOT TRACK',
 color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
 icon: BookOpen,
 };
 }
 };

 const trackBadge = getTrackBadge();
 const TrackIcon = trackBadge.icon;

 return (
 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 space-y-5 relative overflow-hidden"
 >
 {/* Top Glow Ambient */}
 <div className="absolute top-0 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

 {/* Modal Header */}
 <div className="flex items-center justify-between pb-3.5 mb-4 border-b relative z-10">
 <div className="flex items-center gap-3">
 <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-glow-emerald">
 <Dices className="w-5 h-5 animate-pulse" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-base font-black text-slate-900 tracking-wide">
 🎲 ANTI-PROCRASTINATION ROULETTE
 </h3>
 <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-emerald-300 font-semibold">
 &lt;3 MINUTE PROTOCOL
 </span>
 </div>
 <p className="text-xs text-slate-500 font-mono mt-0.5">
 Zero friction • Single random micro-action • Powered by @Tsuna
 </p>
 </div>
 </div>

 <button
 onClick={closeModal}
 className="p-1.5 rounded-lg bg-slate-100 hover:border-slate-700 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Task Card with Spin Animation */}
 <AnimatePresence mode="wait">
 <motion.div
 key={currentRouletteTask.id}
 initial={{ opacity: 0, rotateX: 60, scale: 0.95 }}
 animate={{ opacity: 1, rotateX: 0, scale: 1 }}
 exit={{ opacity: 0, rotateX: -60, scale: 0.95 }}
 transition={{ duration: 0.3 }}
 className={`p-5 rounded-xl bg-slate-50 border border-slate-100 ${trackBadge.color.split(' ')[2]} relative overflow-hidden mb-5`}
 >
 <div className="flex items-center justify-between gap-2 mb-3">
 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${trackBadge.color}`}>
 <TrackIcon className="w-3.5 h-3.5" />
 {trackBadge.label}
 </span>

 <span className="text-xs font-mono text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md ">
 <Timer className="w-3.5 h-3.5 text-cyan-400" />
 <span>Est: {currentRouletteTask.estimatedMinutes} min</span>
 </span>
 </div>

 <h4 className="text-lg font-extrabold text-slate-900 mb-1.5 leading-snug">
 {currentRouletteTask.title}
 </h4>
 <p className="text-xs text-slate-700 leading-relaxed mb-3">
 {currentRouletteTask.description}
 </p>

 <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-mono flex items-start gap-2">
 <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
 <span>{currentRouletteTask.advisorTip}</span>
 </div>
 </motion.div>
 </AnimatePresence>

 {/* Countdown Timer Block */}
 <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-5">
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
 Focus Window
 </span>
 <span className="text-2xl font-black font-mono text-emerald-400 tracking-widest">
 {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
 </span>
 </div>

 {/* Progress bar */}
 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3 ">
 <motion.div
 className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
 initial={{ width: 0 }}
 animate={{ width: `${progressPct}%` }}
 transition={{ duration: 0.4 }}
 />
 </div>

 <div className="flex items-center justify-between gap-3">
 <div className="flex items-center gap-2">
 <button
 onClick={() => setIsRunning(!isRunning)}
 className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
 isRunning
 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
 : 'bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 shadow-glow-emerald'
 }`}
 >
 {isRunning ? (
 <>
 <Pause className="w-3.5 h-3.5" />
 <span>Pause Timer</span>
 </>
 ) : (
 <>
 <Play className="w-3.5 h-3.5 fill-slate-950" />
 <span>Start 3-Min Sprint</span>
 </>
 )}
 </button>

 <button
 onClick={() => {
 setSecondsLeft(TOTAL_SECONDS);
 setIsRunning(false);
 }}
 className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
 title="Reset Timer"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 </button>
 </div>

 <button
 onClick={handleSpin}
 disabled={isSpinning}
 className="px-3.5 py-2 rounded-xl bg-slate-100 hover:border-slate-600 text-slate-800 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer hover:bg-slate-200"
 >
 <Dices className={`w-3.5 h-3.5 text-cyan-400 ${isSpinning ? 'animate-spin' : ''}`} />
 <span>Roll Different Task</span>
 </button>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="flex items-center justify-between gap-3 pt-3 border-t ">
 <button
 onClick={handleNavigateToTrack}
 className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer"
 >
 <span>Jump to {trackBadge.label}</span>
 <ExternalLink className="w-3 h-3" />
 </button>

 <div className="flex items-center gap-2">
 <button
 onClick={closeModal}
 className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs text-slate-500 hover:text-slate-800 font-mono transition-all cursor-pointer"
 >
 Close
 </button>
 <button
 onClick={handleComplete}
 className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-glow-emerald cursor-pointer hover:opacity-95 transition-all"
 >
 <CheckCircle2 className="w-4 h-4 text-slate-950" />
 <span>Done &amp; Log Progress</span>
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 );
};
