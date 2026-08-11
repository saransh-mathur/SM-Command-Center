import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, X, Send, Sparkles } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const AdvisorModal: React.FC = () => {
  const { activeModal, selectedAdvisor, closeModal, addToast } = useDashboard();
  const isOpen = activeModal === 'advisor' && !!selectedAdvisor;

  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  if (!isOpen || !selectedAdvisor) return null;

  const advisorConfig = {
    ren: {
      name: '@Ren',
      title: 'Chief Learning Officer & Technical Mentor',
      avatarIcon: Brain,
      themeColor: 'cyan',
      accentBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      glow: 'shadow-glow-cyan',
      domain: 'DSA Patterns, System Architecture, RAG Pipelines & Distance MBA Quant/Accounting Synthesis',
      samplePrompts: [
        'Break down Sliding Window vs Two Pointers mental model',
        'How do I synthesize Balance Sheet equity equations for MBA Sem 1?',
        'Give me a 3-stage Feynman explanation for RAG rerankers',
      ],
      quickAdvice: 'Always end your technical answers with PREP structure: Point -> Reason -> Example -> Point. Do not beat around the bush in architectural grillings.',
    },
    sky: {
      name: '@Sky',
      title: 'Peak Performance & Nervous System Advisor',
      avatarIcon: Zap,
      themeColor: 'violet',
      accentBg: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
      glow: 'shadow-glow-violet',
      domain: 'Neuroscience of Focus, Future Anxiety Grounding & Ultradian Rhythm Energy Management',
      samplePrompts: [
        'I am feeling overwhelmed about upcoming technical interviews',
        'How do I handle fatigue when switching to evening MBA lectures?',
        'Guide me through down-regulating pre-interview anxiety',
      ],
      quickAdvice: 'Future anxiety is an alert without an immediate action. Ground your neurobiology strictly on Daily Controllable Inputs. 2 deep physiological sighs resets sympathetic overdrive.',
    },
    tsuna: {
      name: '@Tsuna',
      title: 'Execution Systems & Anti-Overthinking Coach',
      avatarIcon: Target,
      themeColor: 'emerald',
      accentBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      glow: 'shadow-glow-emerald',
      domain: 'Frictionless Productivity, 5-Minute Micro-Stepping & KISS Problem Simplification',
      samplePrompts: [
        'I am procrastinating on starting this complex database schema',
        'How do I break down this massive MBA assignment into <2 min steps?',
        'Help me set my 3 non-negotiable inputs for today',
      ],
      quickAdvice: 'The enemy is not difficulty; it is the friction of starting. Apply the 5-Minute Rule: commit only to the first 5 minutes. Action creates momentum, not over-planning.',
    },
  }[selectedAdvisor];

  const Icon = advisorConfig.avatarIcon;

  const handleAsk = () => {
    if (!question.trim()) return;
    setIsConsulting(true);

    setTimeout(() => {
      setIsConsulting(false);
      if (selectedAdvisor === 'ren') {
        setResponse(`Ren's Guidance on "${question}":\n\n1. Core Mental Model: Separate the problem into invariants vs variables.\n2. Feynman Synthesis: Explain it as if teaching a junior developer in 2 sentences.\n3. PREP Framework: State the trade-off immediately before detailing code.`);
      } else if (selectedAdvisor === 'sky') {
        setResponse(`Sky's Guidance on "${question}":\n\n1. Grounding Anchor: You are safe in the present moment. Uncontrollable future outcomes cannot be solved today.\n2. Protocol: Take 2 physiological sighs right now (inhale, top off, long slow exhale).\n3. Focus Buffer: Lock into 1 singular 90-min ultradian block, then completely disconnect.`);
      } else {
        setResponse(`Tsuna's Guidance on "${question}":\n\n1. Micro-Step 1: Write down just the next 2-minute physical action (open IDE, create file).\n2. KISS Principle: Throw away the overcomplicated edge cases for now. Build the baseline first.\n3. 5-Min Timer: Click the Micro-Start launcher and execute without second-guessing.`);
      }
      addToast({
        type: 'info',
        title: `${advisorConfig.name} Responded`,
        message: 'Advisory protocol recommendations delivered.',
      });
      setQuestion('');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700 shadow-2xl p-6 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${advisorConfig.accentBg}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">{advisorConfig.name}</h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{advisorConfig.title}</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Baseline Wisdom Quote */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-4 text-xs font-mono">
          <span className="text-[10px] text-slate-400 block font-bold mb-1">
            CORE DIRECTIVE:
          </span>
          <p className="text-slate-200 font-sans italic">"{advisorConfig.quickAdvice}"</p>
        </div>

        {/* Sample Prompt Chips */}
        <div className="mb-4">
          <span className="text-[11px] font-mono text-slate-400 block mb-1.5 font-bold">
            Quick Inquiries:
          </span>
          <div className="space-y-1.5">
            {advisorConfig.samplePrompts.map((p) => (
              <button
                key={p}
                onClick={() => setQuestion(p)}
                className="w-full text-left text-xs p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-slate-300 hover:text-white font-sans transition-all flex items-center justify-between"
              >
                <span>• {p}</span>
                <Sparkles className="w-3 h-3 text-slate-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Response Box */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono mb-4 text-slate-200 whitespace-pre-line"
          >
            {response}
          </motion.div>
        )}

        {/* Input & Ask */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Ask ${advisorConfig.name} for guidance or micro-step...`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <button
            onClick={handleAsk}
            disabled={isConsulting || !question.trim()}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-glow-cyan disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Consult</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
