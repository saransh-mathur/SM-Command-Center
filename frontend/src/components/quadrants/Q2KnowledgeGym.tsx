import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Brain, 
 Code, 
 Timer, 
 BookOpen, 
 ExternalLink, 
 Play, 
 Pause, 
 RotateCcw, 
 Sparkles, 
 ChevronRight, 
 ChevronLeft,
 GraduationCap,
 HelpCircle,
 CheckCircle,
 Eye,
 Zap
} from 'lucide-react';
import { DSA_PATTERNS } from '../../data/dsaPatterns';
import { MBA_CARDS } from '../../data/mbaCards';
import { PREP_QUESTIONS } from '../../data/prepQuestions';
import { useDashboard } from '../../context/DashboardContext';

export const Q2KnowledgeGym: React.FC = () => {
 const { addToast } = useDashboard();

 // 1. DSA Pattern State
 const [dsaIndex, setDsaIndex] = useState(0);
 const [showDsaCode, setShowDsaCode] = useState(false);
 const currentDsa = DSA_PATTERNS[dsaIndex];

 // 2. 90s PREP Timer State
 const [prepIndex, setPrepIndex] = useState(0);
 const [prepTimer, setPrepTimer] = useState(90);
 const [isPrepRunning, setIsPrepRunning] = useState(false);
 const currentPrep = PREP_QUESTIONS[prepIndex];

 // 3. MBA Flip Card State
 const [mbaIndex, setMbaIndex] = useState(0);
 const [isFlipped, setIsFlipped] = useState(false);
 const currentMba = MBA_CARDS[mbaIndex];

 // 4. Flashcard Generator State
 const [customTopic, setCustomTopic] = useState('');
 const [isGenerating, setIsGenerating] = useState(false);
 const [generatedCard, setGeneratedCard] = useState<{ topic: string; recallQ: string; formula: string } | null>(null);

 // PREP Timer countdown effect
 useEffect(() => {
 let interval: any = null;
 if (isPrepRunning && prepTimer > 0) {
 interval = setInterval(() => {
 setPrepTimer((prev) => prev - 1);
 }, 1000);
 } else if (prepTimer === 0 && isPrepRunning) {
 setIsPrepRunning(false);
 addToast({
 type: 'info',
 title: '⏱️ PREP Drill Completed',
 message: '90-second response window concluded. Check your structure for conciseness!',
 });
 }
 return () => clearInterval(interval);
 }, [isPrepRunning, prepTimer, addToast]);

 const handleNextDsa = () => {
 setDsaIndex((prev) => (prev + 1) % DSA_PATTERNS.length);
 setShowDsaCode(false);
 };

 const handlePrevDsa = () => {
 setDsaIndex((prev) => (prev - 1 + DSA_PATTERNS.length) % DSA_PATTERNS.length);
 setShowDsaCode(false);
 };

 const handleNextMba = () => {
 setIsFlipped(false);
 setTimeout(() => {
 setMbaIndex((prev) => (prev + 1) % MBA_CARDS.length);
 }, 150);
 };

 const handleNextPrep = () => {
 setPrepIndex((prev) => (prev + 1) % PREP_QUESTIONS.length);
 setPrepTimer(90);
 setIsPrepRunning(false);
 };

 const handleGenerateFlashcard = () => {
 if (!customTopic.trim()) return;
 setIsGenerating(true);

 setTimeout(() => {
 setIsGenerating(false);
 setGeneratedCard({
 topic: customTopic,
 recallQ: `Feynman Drill: Explain how ${customTopic} operates under peak load, and what trade-offs you make when scaling it.`,
 formula: `Key Mental Model: Active Recall 3-Stage Explanation (Child -> Peer -> Architecture Code).`,
 });
 addToast({
 type: 'success',
 title: 'Active Recall Card Generated',
 message: `Synthesized Feynman concept card for "${customTopic}".`,
 });
 setCustomTopic('');
 }, 800);
 };

 return (
 <div className="glass-panel rounded-2xl p-5 shadow-glass flex flex-col justify-between h-full relative overflow-hidden group hover:border-slate-700 transition-all">
 
 {/* Background Glow */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

 <div>
 {/* Card Header */}
 <div className="flex items-start justify-between gap-3 mb-4">
 <div className="flex items-center gap-3">
 <div className="p-2.5 rounded-xl bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
 <Brain className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-base font-bold text-white tracking-tight">
 🧠 Dual-Track Knowledge & Drill Gym
 </h3>
 <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
 @Ren Protocol
 </span>
 </div>
 <p className="text-xs text-slate-400 mt-0.5">
 Top 15 DSA patterns, PREP interview drills & Distance MBA Sem 1 synthesis
 </p>
 </div>
 </div>
 </div>

 {/* ========================================================= */}
 {/* SECTION 1: DSA PATTERN OF THE DAY */}
 {/* ========================================================= */}
 <div className="mb-4 p-3.5 rounded-xl bg-slate-950/60 ">
 <div className="flex items-center justify-between gap-2 mb-2">
 <div className="flex items-center gap-2">
 <Code className="w-4 h-4 text-cyan-400" />
 <span className="text-xs font-bold text-slate-200 font-mono">
 DSA PATTERN #{dsaIndex + 1}: {currentDsa.name}
 </span>
 </div>
 
 <div className="flex items-center gap-1.5">
 <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border-cyan-500/30">
 {currentDsa.difficulty}
 </span>
 <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border-amber-500/30">
 {currentDsa.frequency}
 </span>
 </div>
 </div>

 <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
 {currentDsa.takeaway}
 </p>

 <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t ">
 <div className="flex items-center gap-3">
 <span>Time: <strong className="text-emerald-400">{currentDsa.timeComplexity}</strong></span>
 <span>Space: <strong className="text-cyan-400">{currentDsa.spaceComplexity}</strong></span>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setShowDsaCode(!showDsaCode)}
 className="text-[11px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1"
 >
 <Eye className="w-3 h-3 text-cyan-400" />
 {showDsaCode ? 'Hide Code' : 'View Code'}
 </button>

 <a
 href={currentDsa.link}
 target="_blank"
 rel="noreferrer"
 className="text-[11px] px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300 flex items-center gap-1"
 >
 <span>LC Example</span>
 <ExternalLink className="w-3 h-3" />
 </a>

 <div className="flex items-center gap-1 ml-1">
 <button
 onClick={handlePrevDsa}
 className="p-1 rounded bg-slate-900 text-slate-400 hover:text-slate-200"
 >
 <ChevronLeft className="w-3 h-3" />
 </button>
 <button
 onClick={handleNextDsa}
 className="p-1 rounded bg-slate-900 text-slate-400 hover:text-slate-200"
 >
 <ChevronRight className="w-3 h-3" />
 </button>
 </div>
 </div>
 </div>

 {/* Expandable Code Drawer */}
 <AnimatePresence>
 {showDsaCode && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="mt-3 pt-3 border-t "
 >
 <pre className="p-2.5 rounded-lg bg-slate-900 text-cyan-300 font-mono text-[11px] overflow-x-auto leading-tight">
 <code>{currentDsa.codeSnippet}</code>
 </pre>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* ========================================================= */}
 {/* SECTION 2: 90s PREP/STAR INTERVIEW DRILL */}
 {/* ========================================================= */}
 <div className="mb-4 p-3.5 rounded-xl bg-slate-950/60 ">
 <div className="flex items-center justify-between gap-2 mb-2">
 <div className="flex items-center gap-2">
 <Timer className="w-4 h-4 text-violet-400" />
 <span className="text-xs font-bold text-slate-200 font-mono">
 90s PREP INTERVIEW GYM
 </span>
 <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border-violet-500/30">
 {currentPrep.category}
 </span>
 </div>

 {/* Timer Display & Controls */}
 <div className="flex items-center gap-2 font-mono">
 <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
 prepTimer <= 15
 ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
 : 'bg-slate-900 text-violet-300'
 }`}>
 00:{prepTimer.toString().padStart(2, '0')}
 </span>

 <button
 onClick={() => setIsPrepRunning(!isPrepRunning)}
 className={`p-1 rounded text-slate-950 font-bold ${
 isPrepRunning ? 'bg-amber-400 hover:bg-amber-300' : 'bg-violet-400 hover:bg-violet-300'
 }`}
 title={isPrepRunning ? 'Pause' : 'Start 90s response drill'}
 >
 {isPrepRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
 </button>

 <button
 onClick={() => {
 setIsPrepRunning(false);
 setPrepTimer(90);
 }}
 className="p-1 rounded bg-slate-900 text-slate-400 hover:text-slate-200"
 title="Reset timer"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 </button>

 <button
 onClick={handleNextPrep}
 className="p-1 rounded bg-slate-900 text-slate-400 hover:text-slate-200"
 title="Next Question"
 >
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>

 <p className="text-xs text-slate-200 font-medium mb-2.5">
 "{currentPrep.prompt}"
 </p>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono text-slate-400">
 <div className="p-1.5 rounded bg-slate-900/80 ">
 <strong className="text-violet-400 block">P: Point</strong>
 <span>Direct 1-line answer</span>
 </div>
 <div className="p-1.5 rounded bg-slate-900/80 ">
 <strong className="text-cyan-400 block">R: Reason</strong>
 <span>Core engineering why</span>
 </div>
 <div className="p-1.5 rounded bg-slate-900/80 ">
 <strong className="text-emerald-400 block">E: Example</strong>
 <span>Metric or project proof</span>
 </div>
 <div className="p-1.5 rounded bg-slate-900/80 ">
 <strong className="text-amber-400 block">P: Point</strong>
 <span>Punchy summary takeaway</span>
 </div>
 </div>
 </div>

 {/* ========================================================= */}
 {/* SECTION 3: MBA SEM 1 INTERACTIVE 3D FLIP-CARD */}
 {/* ========================================================= */}
 <div className="mb-4">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 <GraduationCap className="w-4 h-4 text-amber-400" />
 <span className="text-xs font-bold text-slate-200 font-mono">
 MBA SEM 1 RECALL: {currentMba.subject}
 </span>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setIsFlipped(!isFlipped)}
 className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 flex items-center gap-1"
 >
 <RotateCcw className="w-3 h-3" />
 {isFlipped ? 'Show Question' : 'Flip for Formula'}
 </button>

 <button
 onClick={handleNextMba}
 className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1"
 >
 <span>Next Card</span>
 <ChevronRight className="w-3 h-3" />
 </button>
 </div>
 </div>

 <div
 onClick={() => setIsFlipped(!isFlipped)}
 className="cursor-pointer perspective-1000 min-h-[95px] select-none"
 >
 <motion.div
 animate={{ rotateY: isFlipped ? 180 : 0 }}
 transition={{ duration: 0.5, ease: 'easeInOut' }}
 className="w-full h-full relative transform-style-3d p-3.5 rounded-xl bg-slate-950/80 border-amber-500/30 shadow-sm flex flex-col justify-between"
 >
 {!isFlipped ? (
 <div>
 <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400/80 mb-1">
 <HelpCircle className="w-3 h-3" />
 <span>TOPIC: {currentMba.topic}</span>
 </div>
 <p className="text-xs text-slate-200 font-sans">
 {currentMba.question}
 </p>
 <span className="text-[10px] text-slate-500 font-mono block mt-2">
 💡 Click card to flip and verify active recall
 </span>
 </div>
 ) : (
 <div className="rotate-y-180">
 <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 mb-1">
 <CheckCircle className="w-3 h-3" />
 <span>SYNTHESIS & FORMULA:</span>
 </div>
 <p className="text-xs text-slate-300 font-sans mb-1.5">
 {currentMba.answer}
 </p>
 <div className="p-1.5 rounded bg-slate-900 text-amber-300 font-mono text-[11px] border-amber-500/20">
 {currentMba.formulaOrInsight}
 </div>
 </div>
 )}
 </motion.div>
 </div>
 </div>

 {/* ========================================================= */}
 {/* SECTION 4: ACTIVE RECALL FLASHCARD GENERATOR */}
 {/* ========================================================= */}
 <div className="p-3 rounded-xl bg-slate-950/40 ">
 <div className="flex items-center gap-2 mb-2">
 <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
 <span className="text-xs font-mono font-bold text-slate-300">
 Generate Active Concept Flashcards
 </span>
 </div>

 <div className="flex gap-2">
 <input
 type="text"
 value={customTopic}
 onChange={(e) => setCustomTopic(e.target.value)}
 placeholder="e.g. pgvector indexing, CAP Theorem, WACC..."
 onKeyDown={(e) => e.key === 'Enter' && handleGenerateFlashcard()}
 className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
 />
 <button
 onClick={handleGenerateFlashcard}
 disabled={isGenerating || !customTopic.trim()}
 className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-glow-cyan disabled:opacity-40 disabled:cursor-not-allowed"
 >
 <Zap className="w-3.5 h-3.5" />
 <span>{isGenerating ? 'Synthesizing...' : 'Generate'}</span>
 </button>
 </div>

 {generatedCard && (
 <motion.div
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 className="mt-2.5 p-2.5 rounded-lg bg-slate-900 border-cyan-500/30 text-xs font-mono"
 >
 <span className="text-[10px] text-cyan-400 block font-bold">FEYNMAN 3-STAGE CARD: {generatedCard.topic}</span>
 <p className="text-slate-300 text-[11px] mt-1">{generatedCard.recallQ}</p>
 <span className="text-[10px] text-emerald-400 block mt-1">{generatedCard.formula}</span>
 </motion.div>
 )}
 </div>

 </div>

 {/* Footer Insight */}
 <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono text-slate-400">
 <span className="flex items-center gap-1 text-cyan-400">
 <BookOpen className="w-3 h-3" />
 Protocol: Feynman 3-Stage + PREP Framework
 </span>
 <span className="text-slate-500">Anti-Rambling Rule</span>
 </div>

 </div>
 );
};
