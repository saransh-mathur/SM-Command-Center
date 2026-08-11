import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  MessageSquare, 
  Calculator, 
  Sparkles, 
  Send, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  Clock, 
  BookMarked,
  Zap,
  Copy,
  Check,
  AlertTriangle,
  Layers,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDashboard } from '../../context/DashboardContext';
import { RichMarkdownViewer } from './RichMarkdownViewer';

const API_BASE = 'http://localhost:8000/api';

interface MBAModule {
  id: string;
  title: string;
  code: string;
  icon: string;
  color: string;
  total_pages: number;
  files_count: number;
  progress_pct: number;
  units: { num: number; title: string }[];
}

interface UnitNote {
  unit_num: number;
  unit_title: string;
  raw_markdown?: string;
  quick_review?: {
    bullets: string[];
    core_formulas: string[];
    exam_traps: string;
  };
  deep_dive?: {
    overview: string;
    conceptual_breakdown: { heading: string; content: string }[];
    formulas_latex: string[];
    tech_analogy: string;
    slide_takeaways: string;
    citations: string;
  };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ren';
  text: string;
  timestamp: string;
}

export const MBAStudyDashboard: React.FC = () => {
  const { addToast, incrementTarget } = useDashboard();

  // State
  const [modules, setModules] = useState<MBAModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('financial_accounting');
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'timer'>('notes');
  const [noteMode, setNoteMode] = useState<'deep_dive' | 'quick_review'>('deep_dive');

  // Notes state
  const [notes, setNotes] = useState<{ module_title: string; units: UnitNote[] } | null>(null);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [loadingNotes, setLoadingNotes] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ren',
      text: "👋 Hello Saransh! I am **@Ren**, your MBA Concept Mentor. I am grounded in all 6 of your NMIMS textbooks, lecture slide decks, and model answers.\n\nAsk me anything about accounting equations, statistics/CLT, economics elasticity, or business communication frameworks!",
      timestamp: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Study timer state
  const [studyMinutes, setStudyMinutes] = useState(45);
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Fetch modules on mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`${API_BASE}/mba/modules`);
        if (res.ok) {
          const data = await res.json();
          setModules(data);
        }
      } catch (err) {
        console.warn('Failed to fetch MBA modules:', err);
      }
    };
    fetchModules();
  }, []);

  // Fetch pre-made notes when selected module changes
  useEffect(() => {
    const fetchNotes = async () => {
      setLoadingNotes(true);
      try {
        const res = await fetch(`${API_BASE}/mba/modules/${selectedModuleId}/notes`);
        if (res.ok) {
          const data = await res.json();
          setNotes(data);
          setSelectedUnitIndex(0);
        }
      } catch (err) {
        console.warn('Failed to fetch notes:', err);
      } finally {
        setLoadingNotes(false);
      }
    };
    fetchNotes();
  }, [selectedModuleId]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      handleLogStudySprint();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || modules[0];

  const handleSendMessage = async (customText?: string) => {
    const query = customText || chatInput;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/mba/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, module_id: selectedModuleId })
      });

      if (res.ok) {
        const data = await res.json();
        const renMsg: ChatMessage = {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'ren',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, renMsg]);
      }
    } catch (err) {
      console.warn('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogStudySprint = async () => {
    try {
      await fetch(`${API_BASE}/mba/log-study`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module_id: selectedModuleId,
          topic: selectedModule?.title || 'MBA Study Session',
          minutes: studyMinutes
        })
      });
      incrementTarget('deepDevBlocks');
    } catch (err) {
      console.warn('Study log error:', err);
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F0FF', '#10B981', '#8B5CF6', '#F59E0B']
    });

    addToast({
      type: 'success',
      title: '🎓 MBA Study Sprint Recorded!',
      message: `Completed ${studyMinutes}m on ${selectedModule?.title}. Logged to PostgreSQL.`
    });

    setIsTimerRunning(false);
    setSecondsRemaining(studyMinutes * 60);
  };

  const copyCurrentNotes = () => {
    if (!notes) return;
    const currentUnit = notes.units[selectedUnitIndex] || notes.units[0];
    const textToCopy = `=== ${notes.module_title} - Unit ${currentUnit.unit_num}: ${currentUnit.unit_title} ===\n\n` +
      `[QUICK REVIEW]\n` +
      (currentUnit.quick_review?.bullets.map(b => `• ${b}`).join('\n') || '') + '\n\n' +
      `[FORMULAS]\n` +
      (currentUnit.quick_review?.core_formulas.join('\n') || '') + '\n\n' +
      `[DEEP DIVE]\n` +
      (currentUnit.deep_dive?.overview || '');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: 'info',
      title: 'Notes Copied',
      message: `Copied Unit ${currentUnit.unit_num} notes to clipboard.`
    });
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const suggestedPrompts = [
    "Explain the Fundamental Accounting Equation (A = L + E) with journal entries",
    "How does the Central Limit Theorem derive standard error in Unit 4?",
    "Break down the 7 Cs of Business Communication and the Minto Pyramid",
    "What is the difference between Revenue Expenditure vs Capital Expenditure?",
    "Explain Price Elasticity of Demand (|Ed| > 1 vs |Ed| < 1) and revenue impact"
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-violet-600 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-glow-amber">
            <GraduationCap className="w-6 h-6 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                MBA SEM 1 AI STUDY COPILOT
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                NMIMS DUAL-MODE NOTES
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
              <span>Source: 6 Textbooks (2,700+ Pages) & Slide Decks</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">@Ren Mentor Ready</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-1.5 text-amber-400">
            <Flame className="w-4 h-4" />
            <span className="font-bold">5-Day Study Streak</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-1.5 text-cyan-400">
            <Clock className="w-4 h-4" />
            <span>4.5 hrs this week</span>
          </div>
        </div>
      </div>

      {/* 6-Module Curriculum Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {modules.map((mod) => {
          const isSelected = mod.id === selectedModuleId;
          return (
            <motion.button
              key={mod.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedModuleId(mod.id)}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/50 shadow-glow-cyan'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {mod.code}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan animate-pulse" />
                  )}
                </div>
                <h3 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug">
                  {mod.title}
                </h3>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{mod.total_pages} Pages</span>
                  <span className="text-emerald-400 font-bold">{mod.progress_pct}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${mod.progress_pct}%` }}
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Main Workbench Area */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 shadow-glass">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800 flex-wrap">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'notes'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>📝 Pre-Made Unit Notes (Dual-Mode)</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'chat'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>💬 @Ren Study Chatbot</span>
            </button>

            <button
              onClick={() => setActiveTab('timer')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'timer'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>⏱️ Study Sprint & Focus</span>
            </button>
          </div>

          {activeTab === 'notes' && (
            <div className="flex items-center gap-2">
              {/* Dual Mode Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <button
                  onClick={() => setNoteMode('deep_dive')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                    noteMode === 'deep_dive'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3 h-3 text-emerald-400" />
                  <span>📖 Deep Dive Master Notes</span>
                </button>
                <button
                  onClick={() => setNoteMode('quick_review')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                    noteMode === 'quick_review'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>⚡ 60s Quick Review</span>
                </button>
              </div>

              {/* Copy Notes */}
              <button
                onClick={copyCurrentNotes}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
                title="Copy Notes to Clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: PRE-MADE DUAL-MODE UNIT NOTES */}
        {activeTab === 'notes' && (
          <div>
            {loadingNotes ? (
              <div className="p-12 text-center text-xs font-mono text-slate-400 flex flex-col items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
                <span>Loading synthesized notes for {selectedModule?.title}...</span>
              </div>
            ) : notes && notes.units.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-5">
                
                {/* Unit Selector Sidebar */}
                <div className="w-full lg:w-64 space-y-1.5 flex-shrink-0 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">
                    Units & Chapters:
                  </span>
                  {notes.units.map((unit, idx) => (
                    <button
                      key={unit.unit_num}
                      onClick={() => setSelectedUnitIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        selectedUnitIndex === idx
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold shadow-sm'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500 font-mono">Unit {unit.unit_num}</div>
                      <div className="line-clamp-2 font-sans mt-0.5">{unit.unit_title}</div>
                    </button>
                  ))}
                </div>

                {/* Unit Content Panel */}
                <div className="flex-1 p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-5">
                  {(() => {
                    const currentUnit = notes.units[selectedUnitIndex] || notes.units[0];
                    
                    // ==========================================
                    // MODE A: DEEP DIVE MASTER NOTES
                    // ==========================================
                    if (noteMode === 'deep_dive') {
                      const deep = currentUnit.deep_dive;
                      const raw = currentUnit.raw_markdown;
                      return (
                        <div className="space-y-5 font-sans">
                          
                          {/* Unit Title Header */}
                          <div className="border-b border-slate-800 pb-3.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                📖 DEEP DIVE MASTER NOTES • UNIT #{currentUnit.unit_num}
                              </span>
                              <span className="text-xs font-mono text-slate-500">
                                {notes.module_title}
                              </span>
                            </div>
                            <h3 className="text-lg font-extrabold text-white">
                              {currentUnit.unit_title}
                            </h3>
                            <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                              {deep?.overview}
                            </p>
                          </div>

                          {/* Full Raw Markdown Document View if present */}
                          {raw ? (
                            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-glass">
                              <RichMarkdownViewer content={raw} />
                            </div>
                          ) : (
                            deep?.conceptual_breakdown && (
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-200 font-mono flex items-center gap-2 uppercase tracking-wide">
                                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                                  Comprehensive Conceptual Breakdown:
                                </h4>
                                {deep.conceptual_breakdown.map((item: any, idx: number) => (
                                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                                    <h5 className="text-xs font-bold text-cyan-300 mb-1.5 font-mono">
                                      {item.heading}
                                    </h5>
                                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                                      {item.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )
                          )}

                          {/* Formulas LaTeX */}
                          {deep?.formulas_latex && deep.formulas_latex.length > 0 && (
                            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                              <h4 className="text-xs font-bold text-amber-300 font-mono flex items-center gap-2">
                                <Calculator className="w-3.5 h-3.5" />
                                Mathematical Derivations & LaTeX Equations:
                              </h4>
                              {deep.formulas_latex.map((f, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 text-amber-200 font-mono text-xs border border-amber-500/20">
                                  {f}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Software Engineering / Tech Analogy */}
                          {deep?.tech_analogy && (
                            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs">
                              <strong className="text-cyan-300 font-mono block mb-1 flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5" />
                                💻 Software Architecture Analogy (@Ren):
                              </strong>
                              <p className="text-slate-300 leading-relaxed">{deep.tech_analogy}</p>
                            </div>
                          )}

                          {/* Slide Takeaways */}
                          {deep?.slide_takeaways && (
                            <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/30 text-xs">
                              <strong className="text-violet-300 font-mono block mb-1">
                                🎯 Teacher's Lecture Slide Focus & Exam Pointers:
                              </strong>
                              <p className="text-slate-300 leading-relaxed">{deep.slide_takeaways}</p>
                            </div>
                          )}

                          {/* Citations Footer */}
                          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
                            <span>Verified against {deep?.citations}</span>
                            <span className="text-emerald-400">Exam Grade: A+ Ready</span>
                          </div>

                        </div>
                      );
                    }

                    // ==========================================
                    // MODE B: 60-SECOND FLASH QUICK REVIEW
                    // ==========================================
                    const quick = currentUnit.quick_review;
                    return (
                      <div className="space-y-4 font-sans">
                        
                        {/* Quick Header */}
                        <div className="border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              ⚡ 60-SECOND QUICK REVIEW • UNIT #{currentUnit.unit_num}
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-white">
                            {currentUnit.unit_title}
                          </h3>
                        </div>

                        {/* High-Yield Bullet Takeaways */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                          <h4 className="text-xs font-bold text-amber-300 font-mono flex items-center gap-2 uppercase tracking-wide">
                            <Zap className="w-3.5 h-3.5" />
                            Core Takeaways (High Signal):
                          </h4>
                          <ul className="space-y-2 text-xs text-slate-200">
                            {quick?.bullets.map((b, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-amber-400 font-bold mt-0.5">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Essential Formulas */}
                        {quick?.core_formulas && quick.core_formulas.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                              <Calculator className="w-3.5 h-3.5" />
                              Essential Formulas Only:
                            </h4>
                            {quick.core_formulas.map((f, idx) => (
                              <div key={idx} className="p-2 rounded bg-slate-950 text-emerald-200 font-mono text-xs border border-emerald-500/20">
                                {f}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Common Exam Traps Alert */}
                        {quick?.exam_traps && (
                          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs">
                            <strong className="text-rose-300 font-mono block mb-1 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              ⚠️ Common Exam Pitfalls & Traps:
                            </strong>
                            <p className="text-slate-300 leading-relaxed">{quick.exam_traps}</p>
                          </div>
                        )}

                      </div>
                    );
                  })()}
                </div>

              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 font-mono">
                No notes available.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE AI STUDY CHATBOT */}
        {activeTab === 'chat' && (
          <div className="flex flex-col gap-4">
            
            {/* Suggested Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase flex-shrink-0">
                Suggested Prompts:
              </span>
              {suggestedPrompts.slice(0, 3).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 flex-shrink-0 transition-all text-left"
                >
                  • {p}
                </button>
              ))}
            </div>

            {/* Chat History Box */}
            <div className="min-h-[380px] max-h-[480px] overflow-y-auto rounded-xl p-4 bg-slate-950/80 border border-slate-800/80 flex flex-col gap-3 font-sans">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[88%] ${
                    msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mb-1">
                    <span>{msg.sender === 'user' ? 'Saransh' : '@Ren (MBA Mentor)'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="self-start p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>@Ren is synthesizing answer from textbook & slides...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Ask @Ren any question about ${selectedModule?.title}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!chatInput.trim() || isTyping}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-glow-cyan disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask @Ren</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: STUDY SPRINT & FOCUS TIMER */}
        {activeTab === 'timer' && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center font-mono">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-wide block mb-1">
              FOCUSED MBA STUDY SPRINT
            </span>
            <h3 className="text-sm font-bold text-slate-200 mb-4">
              {selectedModule?.title}
            </h3>

            {/* Time Preset Buttons */}
            <div className="flex justify-center gap-2 mb-6">
              {[30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setStudyMinutes(mins);
                    setSecondsRemaining(mins * 60);
                    setIsTimerRunning(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    studyMinutes === mins
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 font-bold shadow-glow-violet'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>

            {/* Big Countdown Timer */}
            <div className="text-5xl font-black text-white tracking-tight my-4">
              {formatTimer(secondsRemaining)}
            </div>

            <p className="text-[11px] text-slate-400 mb-6 font-sans">
              Log this session to PostgreSQL upon completion to automatically increment your daily execution blocks.
            </p>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
                  isTimerRunning ? 'bg-amber-400 text-slate-950' : 'bg-violet-500 text-slate-950 shadow-glow-violet'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
                <span>{isTimerRunning ? 'Pause Sprint' : 'Start Study Sprint'}</span>
              </motion.button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setSecondsRemaining(studyMinutes * 60);
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogStudySprint}
                className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Log Session</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
