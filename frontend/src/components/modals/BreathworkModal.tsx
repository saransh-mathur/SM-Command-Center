import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, X, Play, Pause, RotateCcw, Heart } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const BreathworkModal: React.FC = () => {
 const { activeModal, closeModal } = useDashboard();
 const isOpen = activeModal === 'breathwork';

 const [mode, setMode] = useState<'sigh' | '478'>('sigh');
 const [isActive, setIsActive] = useState(true);
 const [phase, setPhase] = useState<'inhale1' | 'inhale2' | 'exhale' | 'hold'>('inhale1');
 const [secondsInPhase, setSecondsInPhase] = useState(3);

 // Physiological Sigh: Inhale 1 (2.5s) -> Inhale 2 (1.0s) -> Exhale (6.0s)
 useEffect(() => {
 if (!isOpen || !isActive) return;

 let timer: any = null;

 if (mode === 'sigh') {
 if (phase === 'inhale1') {
 timer = setTimeout(() => {
 setPhase('inhale2');
 setSecondsInPhase(1);
 }, 2500);
 } else if (phase === 'inhale2') {
 timer = setTimeout(() => {
 setPhase('exhale');
 setSecondsInPhase(6);
 }, 1200);
 } else if (phase === 'exhale') {
 timer = setTimeout(() => {
 setPhase('inhale1');
 setSecondsInPhase(3);
 }, 6000);
 }
 } else {
 // 4-7-8 Protocol
 if (phase === 'inhale1') {
 timer = setTimeout(() => {
 setPhase('hold');
 setSecondsInPhase(7);
 }, 4000);
 } else if (phase === 'hold') {
 timer = setTimeout(() => {
 setPhase('exhale');
 setSecondsInPhase(8);
 }, 7000);
 } else if (phase === 'exhale') {
 timer = setTimeout(() => {
 setPhase('inhale1');
 setSecondsInPhase(4);
 }, 8000);
 }
 }

 return () => clearTimeout(timer);
 }, [isOpen, isActive, phase, mode]);

 if (!isOpen) return null;

 const getPhaseText = () => {
 if (mode === 'sigh') {
 if (phase === 'inhale1') return 'Deep Inhale (Nose)';
 if (phase === 'inhale2') return 'Extra Top-Off Inhale!';
 if (phase === 'exhale') return 'Long, Slow Exhale (Mouth)';
 } else {
 if (phase === 'inhale1') return 'Inhale Smoothly (4s)';
 if (phase === 'hold') return 'Hold Breath (7s)';
 if (phase === 'exhale') return 'Exhale Completely (8s)';
 }
 return 'Breathe';
 };

 const getCircleScale = () => {
 if (phase === 'inhale1') return 1.35;
 if (phase === 'inhale2') return 1.6;
 if (phase === 'hold') return 1.4;
 return 0.85;
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="w-full max-w-md glass-panel rounded-2xl border-cyan-500/40 shadow-2xl p-6 relative text-center"
 >
 {/* Top Header */}
 <div className="flex items-center justify-between pb-3 mb-4 border-b ">
 <div className="flex items-center gap-2">
 <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
 <Wind className="w-5 h-5" />
 </div>
 <div className="text-left">
 <h3 className="text-base font-extrabold text-white">
 NERVOUS SYSTEM REGULATOR
 </h3>
 <p className="text-xs text-slate-400 font-mono">
 @Sky Down-Regulation Protocol
 </p>
 </div>
 </div>

 <button
 onClick={closeModal}
 className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white "
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Mode Selector */}
 <div className="flex items-center justify-center gap-2 mb-6 font-mono text-xs">
 <button
 onClick={() => {
 setMode('sigh');
 setPhase('inhale1');
 }}
 className={`px-3 py-1.5 rounded-lg transition-all ${
 mode === 'sigh'
 ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold shadow-glow-cyan'
 : 'bg-slate-900 text-slate-400 hover:text-slate-200'
 }`}
 >
 2-Step Physiological Sigh
 </button>
 <button
 onClick={() => {
 setMode('478');
 setPhase('inhale1');
 }}
 className={`px-3 py-1.5 rounded-lg transition-all ${
 mode === '478'
 ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 font-bold shadow-glow-violet'
 : 'bg-slate-900 text-slate-400 hover:text-slate-200'
 }`}
 >
 4-7-8 Pre-Interview Calm
 </button>
 </div>

 {/* Animated Breath Visualizer */}
 <div className="relative flex items-center justify-center h-48 mb-6">
 {/* Outer glowing pulsing aura */}
 <motion.div
 animate={{ scale: getCircleScale() }}
 transition={{ duration: phase === 'exhale' ? 6 : 2.5, ease: 'easeInOut' }}
 className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border-cyan-400/50 blur-md absolute"
 />

 {/* Inner solid ring */}
 <motion.div
 animate={{ scale: getCircleScale() }}
 transition={{ duration: phase === 'exhale' ? 6 : 2.5, ease: 'easeInOut' }}
 className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-600 via-blue-600 to-violet-600 flex items-center justify-center shadow-glow-cyan text-slate-950 font-black relative z-10"
 >
 <Heart className="w-8 h-8 text-slate-950 fill-slate-950 animate-pulse" />
 </motion.div>
 </div>

 {/* Phase Instructions */}
 <div className="p-3.5 rounded-xl bg-slate-950/80 mb-5">
 <div className="flex items-center justify-center gap-2 mb-1">
 <span className="text-sm font-extrabold text-cyan-300 font-mono">
 {getPhaseText()}
 </span>
 <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
 {secondsInPhase}s
 </span>
 </div>
 <p className="text-[11px] text-slate-400 mt-1 font-sans">
 {mode === 'sigh'
 ? 'Triggers immediate parasympathetic down-regulation by popping open collapsed alveoli in the lungs.'
 : 'Slows down heart rate and eliminates cognitive brain fog before technical rounds.'}
 </p>
 </div>

 {/* Controls */}
 <div className="flex items-center justify-center gap-3">
 <button
 onClick={() => setIsActive(!isActive)}
 className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
 isActive ? 'bg-amber-400 text-slate-950' : 'bg-cyan-400 text-slate-950'
 }`}
 >
 {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
 <span>{isActive ? 'Pause Pacer' : 'Resume Pacer'}</span>
 </button>

 <button
 onClick={() => {
 setPhase('inhale1');
 }}
 className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200"
 title="Reset Pacer"
 >
 <RotateCcw className="w-4 h-4" />
 </button>
 </div>
 </motion.div>
 </div>
 );
};
