import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
 Rocket, 
 X, 
 Play, 
 Pause, 
 RotateCcw, 
 CheckCircle, 
 Sparkles, 
 Target 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDashboard } from '../../context/DashboardContext';

const STARTER_TASKS = [
 'Draft the core Django Model and 1 migration schema',
 'Write the test case setup for DSA Sliding Window (LC 3)',
 'Read 2 pages of MBA Accounting / Quant Methods',
 'Customize 1 resume outreach message on LinkedIn',
 'Write the docstring & signature for a FastAPI endpoint',
];

export const MicroStartModal: React.FC = () => {
 const { activeModal, closeModal, addToast, incrementTarget } = useDashboard();
 const isOpen = activeModal === 'microStart';

 const TOTAL_SECONDS = 5 * 60; // 300s
 const [seconds, setSeconds] = useState(TOTAL_SECONDS);
 const [isRunning, setIsRunning] = useState(false);
 const [selectedTask, setSelectedTask] = useState(STARTER_TASKS[0]);
 const [customTask, setCustomTask] = useState('');

 useEffect(() => {
 let interval: any = null;
 if (isRunning && seconds > 0) {
 interval = setInterval(() => {
 setSeconds((prev) => prev - 1);
 }, 1000);
 } else if (seconds === 0 && isRunning) {
 setIsRunning(false);
 confetti({
 particleCount: 100,
 spread: 70,
 origin: { y: 0.6 },
 colors: ['#10B981', '#00F0FF', '#8B5CF6'],
 });
 addToast({
 type: 'success',
 title: '🚀 5-Minute Sprint Finished!',
 message: 'Inertia broken! Keep riding the momentum into your deep session.',
 });
 }
 return () => clearInterval(interval);
 }, [isRunning, seconds, addToast]);

 if (!isOpen) return null;

 const currentActiveTask = customTask.trim() || selectedTask;
 const mins = Math.floor(seconds / 60);
 const secs = seconds % 60;
 const progressPercent = ((TOTAL_SECONDS - seconds) / TOTAL_SECONDS) * 100;

 const handleCompleteSprint = () => {
 setIsRunning(false);
 confetti({
 particleCount: 120,
 spread: 80,
 origin: { y: 0.6 },
 });
 incrementTarget('deepCoding');
 addToast({
 type: 'success',
 title: '🎯 Micro-Sprint Logged!',
 message: `Completed micro-task: "${currentActiveTask}". Momentum unlocked!`,
 });
 closeModal();
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="w-full max-w-lg glass-panel rounded-2xl border-emerald-500/40 shadow-2xl p-6 relative overflow-hidden"
 >
 {/* Top Header */}
 <div className="flex items-center justify-between pb-3 mb-4 border-b ">
 <div className="flex items-center gap-2.5">
 <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
 <Rocket className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-base font-extrabold text-white">
 5-MINUTE MICRO-START LAUNCHER
 </h3>
 <p className="text-xs text-slate-400 font-mono">
 Powered by @Tsuna's Anti-Overthinking Protocol
 </p>
 </div>
 </div>

 <button
 onClick={closeModal}
 className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Task Selection */}
 <div className="mb-4">
 <label className="text-xs font-mono text-slate-300 block mb-2 font-bold flex items-center gap-1.5">
 <Target className="w-3.5 h-3.5 text-emerald-400" />
 Choose 1 Atomic Micro-Task to Execute Right Now:
 </label>
 <div className="space-y-1.5 mb-2.5">
 {STARTER_TASKS.map((task) => (
 <button
 key={task}
 onClick={() => {
 setSelectedTask(task);
 setCustomTask('');
 }}
 className={`w-full text-left text-xs p-2 rounded-lg transition-all font-sans ${
 selectedTask === task && !customTask
 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold shadow-sm'
 : 'bg-slate-950/40 text-slate-300 hover:bg-slate-900'
 }`}
 >
 • {task}
 </button>
 ))}
 </div>

 <input
 type="text"
 placeholder="Or write custom 5-min micro-task..."
 value={customTask}
 onChange={(e) => setCustomTask(e.target.value)}
 className="w-full px-3 py-2 rounded-lg bg-slate-900 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
 />
 </div>

 {/* Countdown Center */}
 <div className="p-4 rounded-xl bg-slate-950/80 text-center mb-5">
 <span className="text-[11px] font-mono text-emerald-400 block mb-1">
 CURRENT TASK: "{currentActiveTask}"
 </span>
 <div className="text-4xl font-black font-mono text-slate-100 tracking-tight my-2">
 {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
 </div>

 {/* Progress bar */}
 <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden mb-3">
 <div
 className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-300"
 style={{ width: `${progressPercent}%` }}
 />
 </div>

 {/* Controls */}
 <div className="flex items-center justify-center gap-3">
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => setIsRunning(!isRunning)}
 className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
 isRunning ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950 shadow-glow-emerald'
 }`}
 >
 {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
 <span>{isRunning ? 'Pause Timer' : 'Launch Sprint'}</span>
 </motion.button>

 <button
 onClick={() => {
 setIsRunning(false);
 setSeconds(TOTAL_SECONDS);
 }}
 className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200"
 title="Reset 5m"
 >
 <RotateCcw className="w-4 h-4" />
 </button>

 <button
 onClick={handleCompleteSprint}
 className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5"
 >
 <CheckCircle className="w-4 h-4" />
 <span>Done Early!</span>
 </button>
 </div>
 </div>

 {/* Motivational Footer */}
 <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
 <span className="flex items-center gap-1 text-emerald-400">
 <Sparkles className="w-3 h-3" />
 Rule: 5 minutes of action destroys 5 hours of overthinking.
 </span>
 </div>
 </motion.div>
 </div>
 );
};
