import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Play, 
  Pause, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Timer, 
  FileCode2, 
  Copy, 
  Check 
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { COURSE_CHEAT_SHEETS } from '../../data/mockCourses';
import { CourseCheatSheet } from '../../types';

export const CourseLabView: React.FC = () => {
  const { courses, logCourseSprint, addToast } = useDashboard();

  // Active Course for sprint
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'course-1');
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // 10-Minute Sprint Timer State (600s)
  const TOTAL_SPRINT_SECONDS = 10 * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TOTAL_SPRINT_SECONDS);
  const [isSprintRunning, setIsSprintRunning] = useState<boolean>(false);
  const [snippetCode, setSnippetCode] = useState<string>(
    `# 1 Video = 1 Code Snippet Drill\n# Module: ${selectedCourse?.currentModule || 'AsyncIO'}\n\nasync def micro_task_handler(event_payload: dict):\n    # TODO: Implement async task logic\n    pass`
  );
  const [commitMessage, setCommitMessage] = useState<string>('feat: async task handler micro-drill');

  // AI Fast-Track Cheat Sheet State
  const [selectedSheet, setSelectedSheet] = useState<CourseCheatSheet>(COURSE_CHEAT_SHEETS[0]);
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [isGeneratingCheatSheet, setIsGeneratingCheatSheet] = useState<boolean>(false);
  const [copiedChallenge, setCopiedChallenge] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isSprintRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isSprintRunning) {
      setIsSprintRunning(false);
      handleFinishSprint();
    }
    return () => clearInterval(interval);
  }, [isSprintRunning, secondsRemaining]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const progressPct = ((TOTAL_SPRINT_SECONDS - secondsRemaining) / TOTAL_SPRINT_SECONDS) * 100;

  const handleFinishSprint = () => {
    setIsSprintRunning(false);
    logCourseSprint(selectedCourse.id);
    setSecondsRemaining(TOTAL_SPRINT_SECONDS);
  };

  const handleGenerateCustomSheet = () => {
    if (!customTopicInput.trim()) return;
    setIsGeneratingCheatSheet(true);

    setTimeout(() => {
      const newSheet: CourseCheatSheet = {
        id: `custom-${Date.now()}`,
        topic: customTopicInput.trim(),
        category: 'AI Synthesized Fast-Track',
        mentalModelBullets: [
          `Key Principle: ${customTopicInput.trim()} structures data and state flow for zero-overhead execution under concurrent load.`,
          `Edge Case Trap: Avoid blocking synchronous I/O or unchecked recursion when scaling ${customTopicInput.trim()}.`,
          `Production Metric: Optimize latency thresholds by caching deterministic evaluations and applying async connection pooling.`,
        ],
        codeChallenge: {
          title: `Implement Minimal Prototype for ${customTopicInput.trim()}`,
          prompt: `Write a modular Python/FastAPI helper demonstrating the core architecture of ${customTopicInput.trim()}.`,
          starterCode: `def solve_${customTopicInput.toLowerCase().replace(/[^a-z0-9]/g, '_')}():\n    # Implement clean 5-minute solution\n    return True`,
          solution: `def solve_${customTopicInput.toLowerCase().replace(/[^a-z0-9]/g, '_')}():\n    return {"status": "optimized", "module": "${customTopicInput}"}`,
        },
        activeRecallQuestions: [
          `How would you explain ${customTopicInput.trim()} in an interview under the 90s PREP framework?`,
          `What are the horizontal scaling bottlenecks associated with this architectural pattern?`,
        ],
      };
      setSelectedSheet(newSheet);
      setIsGeneratingCheatSheet(false);
      setCustomTopicInput('');
      addToast({
        type: 'success',
        title: '✨ AI Cheat-Sheet Generated',
        message: `Synthesized mental model for ${newSheet.topic}!`,
      });
    }, 600);
  };

  const handleCopyChallenge = () => {
    navigator.clipboard.writeText(selectedSheet.codeChallenge.starterCode);
    setCopiedChallenge(true);
    addToast({
      type: 'info',
      title: '📋 Starter Code Copied',
      message: 'Pasted into clipboard. Ready for your editor!',
    });
    setTimeout(() => setCopiedChallenge(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Banner & Philosophy */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden bg-slate-900/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-glow-cyan">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                💻 Course Lab &amp; Udemy Unblocker
              </h2>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                1 Video = 1 Code Snippet Protocol
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Eliminate tutorial fatigue • 10-min code-along sprints • AI Cheat-Sheet video bypass
            </p>
          </div>
        </div>

        {/* Quick Rules Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="text-cyan-400 font-bold">⚡ Rules:</span>
          <span>1.5x Speed</span>
          <span className="text-slate-600">•</span>
          <span>Open Editor Left</span>
          <span className="text-slate-600">•</span>
          <span>1 Commit Done</span>
        </div>
      </div>

      {/* Grid: Active Courses Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map((course) => {
          const isSelected = course.id === selectedCourseId;
          const pct = Math.round((course.completedLessons / course.totalLessons) * 100);

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedCourseId(course.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-500/50 shadow-glow-cyan'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">
                    {course.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {pct}%
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-white line-clamp-2 mb-1">
                  {course.title}
                </h3>
                <p className="text-[11px] font-mono text-slate-400 mb-2">
                  {course.instructor}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2 border border-slate-800/80">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="text-[11px] font-mono text-slate-400 line-clamp-1 bg-slate-950 p-1.5 rounded border border-slate-800/80">
                  <span className="text-cyan-400 font-bold">Next: </span>
                  {course.currentLessonTitle}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] font-mono">
                <span className="text-slate-400">
                  {course.completedLessons}/{course.totalLessons} Lessons
                </span>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Udemy</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Two-Column Interactive Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 10-Minute Code-Along Sprint Studio (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-slate-800 shadow-glass flex flex-col gap-4 bg-slate-900/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  10-Minute "1 Video = 1 Commit" Sprint
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Target: {selectedCourse.title}
                </p>
              </div>
            </div>

            {/* Timer Display */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black font-mono text-cyan-400 tracking-widest bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Current Lesson Prompt */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between gap-2">
            <div>
              <span className="text-slate-500 uppercase block text-[10px]">Active Lesson:</span>
              <span className="text-slate-200 font-semibold">{selectedCourse.currentLessonTitle}</span>
            </div>
            <a
              href={selectedCourse.url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <span>Open 1.5x</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Built-in Code Snippet Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Code Staging Area (Key takeaway from this video):</span>
              </label>
            </div>
            <textarea
              rows={8}
              value={snippetCode}
              onChange={(e) => setSnippetCode(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 focus:border-cyan-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Commit Message Box & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Commit message..."
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSprintRunning(!isSprintRunning)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
                  isSprintRunning
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 shadow-glow-cyan'
                }`}
              >
                {isSprintRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Start 10m Sprint</span>
                  </>
                )}
              </button>

              <button
                onClick={handleFinishSprint}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-glow-emerald hover:opacity-95 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Mark Done &amp; Commit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Fast-Track & Cheat-Sheet Engine (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-slate-800 shadow-glass flex flex-col gap-4 bg-slate-900/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  AI Course Fast-Track &amp; Cheat Sheet
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Bypass passive video watching via mental models
                </p>
              </div>
            </div>
          </div>

          {/* Quick Pre-Saved Cheat-Sheet Selector */}
          <div className="flex flex-wrap gap-1.5">
            {COURSE_CHEAT_SHEETS.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => setSelectedSheet(sheet)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedSheet.id === sheet.id
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {sheet.topic}
              </button>
            ))}
          </div>

          {/* Generate Custom Sheet Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste any Udemy topic (e.g. Celery Workers)..."
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomSheet()}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-violet-500 focus:outline-none"
            />
            <button
              onClick={handleGenerateCustomSheet}
              disabled={isGeneratingCheatSheet}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs font-mono transition-all flex items-center gap-1 shadow-glow-violet cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingCheatSheet ? 'animate-spin' : ''}`} />
              <span>Synthesize</span>
            </button>
          </div>

          {/* Selected Cheat Sheet Content */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-3.5">
            <div>
              <span className="text-[10px] font-mono uppercase text-violet-400 font-bold">
                {selectedSheet.category}
              </span>
              <h4 className="text-sm font-extrabold text-white">
                {selectedSheet.topic}
              </h4>
            </div>

            {/* 3-Bullet Mental Model */}
            <div>
              <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                📌 3-Bullet Mental Model:
              </h5>
              <ul className="space-y-1.5">
                {selectedSheet.mentalModelBullets.map((bullet, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Challenge */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>5-Min Code Challenge:</span>
                </span>
                <button
                  onClick={handleCopyChallenge}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedChallenge ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedChallenge ? 'Copied' : 'Copy Starter'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                {selectedSheet.codeChallenge.prompt}
              </p>
              <pre className="p-2 rounded bg-slate-950 text-[11px] font-mono text-emerald-300 border border-slate-800 overflow-x-auto">
                {selectedSheet.codeChallenge.starterCode}
              </pre>
            </div>

            {/* Active Recall Questions */}
            <div>
              <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                🧠 Active Recall Drills:
              </h5>
              <ul className="space-y-1.5">
                {selectedSheet.activeRecallQuestions.map((q, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    <span className="text-violet-400 font-bold">Q{i + 1}:</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
