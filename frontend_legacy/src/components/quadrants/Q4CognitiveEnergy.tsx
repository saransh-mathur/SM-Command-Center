import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
 Zap, 
 Play, 
 Pause, 
 RotateCcw, 
 Wind, 
 Headphones, 
 Volume2, 
 VolumeX, 
 ShieldCheck,
 ArrowRightLeft,
 Flame
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const Q4CognitiveEnergy: React.FC = () => {
 const { openModal, addToast } = useDashboard();

 // 1. 90-Min Ultradian Deep Work Timer
 const TOTAL_ULTRADIAN_SECONDS = 90 * 60; // 5400s
 const [ultradianSeconds, setUltradianSeconds] = useState(TOTAL_ULTRADIAN_SECONDS);
 const [isUltradianRunning, setIsUltradianRunning] = useState(false);

 // 2. 10-Min Context-Switch Buffer Timer
 const TOTAL_BUFFER_SECONDS = 10 * 60; // 600s
 const [bufferSeconds, setBufferSeconds] = useState(TOTAL_BUFFER_SECONDS);
 const [isBufferRunning, setIsBufferRunning] = useState(false);

 // 3. NSDR Audio Player
 const [isNsdrPlaying, setIsNsdrPlaying] = useState(false);
 const [isMuted, setIsMuted] = useState(false);

 // Ultradian countdown effect
 useEffect(() => {
 let interval: any = null;
 if (isUltradianRunning && ultradianSeconds > 0) {
 interval = setInterval(() => {
 setUltradianSeconds((prev) => prev - 1);
 }, 1000);
 } else if (ultradianSeconds === 0 && isUltradianRunning) {
 setIsUltradianRunning(false);
 addToast({
 type: 'success',
 title: '🏁 90-Min Ultradian Block Complete!',
 message: 'Great focus! Step away for 10–15 mins before resuming cognitive work.',
 });
 }
 return () => clearInterval(interval);
 }, [isUltradianRunning, ultradianSeconds, addToast]);

 // Buffer countdown effect
 useEffect(() => {
 let interval: any = null;
 if (isBufferRunning && bufferSeconds > 0) {
 interval = setInterval(() => {
 setBufferSeconds((prev) => prev - 1);
 }, 1000);
 } else if (bufferSeconds === 0 && isBufferRunning) {
 setIsBufferRunning(false);
 addToast({
 type: 'info',
 title: '🌊 Context-Switch Buffer Finished',
 message: 'Mental context clear. Ready to transition into your MBA lecture or review block.',
 });
 }
 return () => clearInterval(interval);
 }, [isBufferRunning, bufferSeconds, addToast]);

 const formatTime = (totalSeconds: number) => {
 const mins = Math.floor(totalSeconds / 60);
 const secs = totalSeconds % 60;
 return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
 };

 const ultradianProgress = ((TOTAL_ULTRADIAN_SECONDS - ultradianSeconds) / TOTAL_ULTRADIAN_SECONDS) * 100;
 const radius = 42;
 const circumference = 2 * Math.PI * radius;
 const strokeDashoffset = circumference - (ultradianProgress / 100) * circumference;

 return (
 <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full group hover:border-slate-700 transition-all">
 
 {/* Background Glow */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

 <div>
 {/* Card Header */}
 <div className="flex items-start justify-between gap-3 mb-4">
 <div className="flex items-center gap-3">
 <div className="p-2.5 rounded-xl bg-violet-500/10 border-violet-500/30 text-violet-400">
 <Zap className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-base font-bold text-slate-900 tracking-tight">
 ⚡ Cognitive Energy & Nervous System
 </h3>
 <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
 @Sky Protocol
 </span>
 </div>
 <p className="text-xs text-slate-500 mt-0.5">
 90-minute ultradian deep work blocks, stress down-regulation & context switching
 </p>
 </div>
 </div>
 </div>

 {/* ========================================================= */}
 {/* SECTION 1: 90-MIN ULTRADIAN TIMER WITH SVG RING */}
 {/* ========================================================= */}
 <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
 
 {/* Circular Countdown Ring */}
 <div className="relative flex items-center justify-center">
 <svg className="w-24 h-24 transform -rotate-90">
 <circle
 cx="48"
 cy="48"
 r={radius}
 className="text-slate-800"
 strokeWidth="6"
 stroke="currentColor"
 fill="transparent"
 />
 <motion.circle
 cx="48"
 cy="48"
 r={radius}
 className="text-violet-500"
 strokeWidth="6"
 strokeDasharray={circumference}
 animate={{ strokeDashoffset }}
 transition={{ duration: 0.5, ease: 'linear' }}
 strokeLinecap="round"
 stroke="currentColor"
 fill="transparent"
 />
 </svg>
 <div className="absolute flex flex-col items-center justify-center font-mono">
 <span className="text-lg font-black text-slate-100 tracking-tight">
 {formatTime(ultradianSeconds)}
 </span>
 <span className="text-[9px] text-violet-400 font-bold uppercase tracking-wider">
 {isUltradianRunning ? 'IN FOCUS' : 'PAUSED'}
 </span>
 </div>
 </div>

 {/* Controls & Focus Info */}
 <div className="flex-1 text-center sm:text-left">
 <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
 <Flame className="w-4 h-4 text-violet-400" />
 <h4 className="text-xs font-bold text-slate-800 font-mono">
 90-Min Ultradian Sprint
 </h4>
 </div>
 <p className="text-[11px] text-slate-500 leading-tight mb-3">
 Unbroken deep coding cycle aligned with natural neurochemical focus rhythms.
 </p>

 <div className="flex items-center justify-center sm:justify-start gap-2">
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => setIsUltradianRunning(!isUltradianRunning)}
 className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm ${
 isUltradianRunning
 ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
 : 'bg-violet-500 hover:bg-violet-400 text-slate-950 shadow-glow-violet'
 }`}
 >
 {isUltradianRunning ? (
 <>
 <Pause className="w-3.5 h-3.5" />
 <span>Pause Sprint</span>
 </>
 ) : (
 <>
 <Play className="w-3.5 h-3.5 fill-slate-950" />
 <span>Start 90m Block</span>
 </>
 )}
 </motion.button>

 <button
 onClick={() => {
 setIsUltradianRunning(false);
 setUltradianSeconds(TOTAL_ULTRADIAN_SECONDS);
 }}
 className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
 title="Reset 90m Timer"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 </div>

 {/* ========================================================= */}
 {/* SECTION 2: 10-MIN CONTEXT SWITCH BUFFER */}
 {/* ========================================================= */}
 <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 font-mono text-xs">
 <div className="flex items-center gap-2.5">
 <div className="p-2 rounded-lg bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
 <ArrowRightLeft className="w-4 h-4" />
 </div>
 <div>
 <span className="text-slate-800 font-bold block">10-Min Context-Switch Buffer</span>
 <span className="text-[10px] text-slate-500">
 Dev $\leftrightarrow$ MBA Lecture mental partition
 </span>
 </div>
 </div>

 <div className="flex items-center gap-2">
 <span className={`px-2 py-1 rounded bg-slate-100 font-bold ${
 isBufferRunning ? 'border-cyan-500/40 text-cyan-300' : ' text-slate-500'
 }`}>
 {formatTime(bufferSeconds)}
 </span>

 <button
 onClick={() => setIsBufferRunning(!isBufferRunning)}
 className={`p-1.5 rounded-lg text-slate-950 font-bold ${
 isBufferRunning ? 'bg-amber-400 hover:bg-amber-300' : 'bg-cyan-400 hover:bg-cyan-300'
 }`}
 title={isBufferRunning ? 'Pause Buffer' : 'Start 10m Buffer'}
 >
 {isBufferRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
 </button>

 <button
 onClick={() => {
 setIsBufferRunning(false);
 setBufferSeconds(TOTAL_BUFFER_SECONDS);
 }}
 className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
 >
 <RotateCcw className="w-3 h-3" />
 </button>
 </div>
 </div>

 {/* ========================================================= */}
 {/* SECTION 3: 1-CLICK PHYSIOLOGICAL SIGH & NSDR AUDIO */}
 {/* ========================================================= */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
 
 {/* 1-Click Physiological Sigh Modal Trigger */}
 <motion.button
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => openModal('breathwork')}
 className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-violet-500/20 border-cyan-500/30 text-left flex items-center justify-between group cursor-pointer"
 >
 <div className="flex items-center gap-2.5">
 <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
 <Wind className="w-4 h-4 animate-pulse" />
 </div>
 <div>
 <span className="text-xs font-bold text-slate-800 block font-mono">
 Physiological Sigh
 </span>
 <span className="text-[10px] text-cyan-400 font-sans">
 2 Inhales + 1 Long Exhale
 </span>
 </div>
 </div>
 <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
 RESET 🌊
 </span>
 </motion.button>

 {/* NSDR / Evening Recovery Audio Card */}
 <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
 <div className="flex items-center gap-2">
 <div className={`p-2 rounded-lg ${
 isNsdrPlaying ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-slate-100 text-slate-500'
 }`}>
 <Headphones className="w-4 h-4" />
 </div>
 <div>
 <span className="text-xs font-bold text-slate-800 font-mono block">
 NSDR Protocol
 </span>
 <span className="text-[10px] text-slate-500">
 {isNsdrPlaying ? '15m Deep Rest Active' : 'Evening Recovery'}
 </span>
 </div>
 </div>

 <div className="flex items-center gap-1.5">
 {/* Equalizer animation when playing */}
 {isNsdrPlaying && (
 <div className="flex items-end gap-0.5 h-4 mr-1">
 <span className="w-1 bg-violet-400 rounded-full h-3 animate-pulse"></span>
 <span className="w-1 bg-cyan-400 rounded-full h-4 animate-bounce"></span>
 <span className="w-1 bg-emerald-400 rounded-full h-2 animate-pulse"></span>
 </div>
 )}

 <button
 onClick={() => {
 const nextState = !isNsdrPlaying;
 setIsNsdrPlaying(nextState);
 addToast({
 type: nextState ? 'success' : 'info',
 title: nextState ? '🎧 NSDR Audio Playing' : 'NSDR Paused',
 message: nextState ? 'Non-Sleep Deep Rest audio session initiated.' : 'Audio paused.',
 });
 }}
 className={`p-1.5 rounded-lg font-bold ${
 isNsdrPlaying ? 'bg-amber-400 text-slate-950' : 'bg-violet-500 text-slate-950 hover:bg-violet-400'
 }`}
 title={isNsdrPlaying ? 'Pause NSDR' : 'Play NSDR Track'}
 >
 {isNsdrPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-slate-950" />}
 </button>

 <button
 onClick={() => setIsMuted(!isMuted)}
 className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
 >
 {isMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
 </button>
 </div>
 </div>

 </div>

 </div>

 {/* Footer Insight */}
 <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono text-slate-500">
 <span className="flex items-center gap-1 text-violet-400">
 <ShieldCheck className="w-3 h-3" />
 Neuroplasticity Protocol: Focus + Rest Cycles
 </span>
 <span className="text-slate-500">Zero Burnout Baseline</span>
 </div>

 </div>
 );
};
