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
 Check,
 XCircle
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { COURSE_CHEAT_SHEETS } from '../../data/mockCourses';
import { CourseCheatSheet } from '../../types';

export const CourseLabView: React.FC = () => {
  const { courses, logCourseSprint, addToast, addCourse, deleteCourse } = useDashboard();

 // Active Course for sprint
 const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'course-1');
 const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

 // 10-Minute Sprint Timer State (600s)
 const TOTAL_SPRINT_SECONDS = 10 * 60;
 const [secondsRemaining, setSecondsRemaining] = useState<number>(TOTAL_SPRINT_SECONDS);
 const [isSprintRunning, setIsSprintRunning] = useState<boolean>(false);
 const [snippetCode, setSnippetCode] = useState<string>(
 `# 1 Video = 1 Code Snippet Drill\n# Module: ${selectedCourse?.currentModule || 'AsyncIO'}\n\nasync def micro_task_handler(event_payload: dict):\n # TODO: Implement async task logic\n pass`
 );
 const [commitMessage, setCommitMessage] = useState<string>('feat: async task handler micro-drill');

 // AI Fast-Track Cheat Sheet State
 const [selectedSheet, setSelectedSheet] = useState<CourseCheatSheet>(COURSE_CHEAT_SHEETS[0]);
 const [customTopicInput, setCustomTopicInput] = useState<string>('');
 const [isGeneratingCheatSheet, setIsGeneratingCheatSheet] = useState<boolean>(false);
 const [copiedChallenge, setCopiedChallenge] = useState<boolean>(false);

 // Add Course State
 const [isAddingCourse, setIsAddingCourse] = useState(false);
 const [newCourseTitle, setNewCourseTitle] = useState('');
 const [newCourseSections, setNewCourseSections] = useState(10);

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
 starterCode: `def solve_${customTopicInput.toLowerCase().replace(/[^a-z0-9]/g, '_')}():\n # Implement clean 5-minute solution\n return True`,
 solution: `def solve_${customTopicInput.toLowerCase().replace(/[^a-z0-9]/g, '_')}():\n return {"status": "optimized", "module": "${customTopicInput}"}`,
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
 <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
 <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

 <div className="flex items-center gap-3.5">
 <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-glow-cyan">
 <Code2 className="w-6 h-6" />
 </div>
 <div>
 <div className="flex items-center gap-2.5">
 <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
 💻 Course Lab &amp; Udemy Unblocker
 </h2>
 <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border-cyan-500/30 text-cyan-300">
 1 Video = 1 Code Snippet Protocol
 </span>
 </div>
 <p className="text-xs text-slate-500 font-mono mt-0.5">
 Eliminate tutorial fatigue • 10-min code-along sprints • AI Cheat-Sheet video bypass
 </p>
 </div>
 </div>

 {/* Quick Rules Pill */}
 <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono text-slate-700">
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
 className={`p-4 rounded-2xl transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden ${
 isSelected
 ? 'bg-slate-50 border border-slate-100 border-cyan-500/50 shadow-glow-cyan'
 : 'bg-slate-50 border border-slate-100 hover:border-slate-700'
 }`}
 >
 <div>
 <div className="flex items-center justify-between gap-2 mb-2">
 <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-cyan-300 font-semibold">
 {course.instructor || 'Self Study'}
 </span>
 <div className="flex items-center gap-2">
    <span className="text-xs font-mono font-bold text-slate-700">
    {pct}%
    </span>
    <button 
      onClick={(e) => { e.stopPropagation(); deleteCourse(course.id); }}
      className="p-1 rounded bg-slate-200/50 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
    >
      <XCircle className="w-3.5 h-3.5" />
    </button>
  </div>
 </div>

 <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 mb-1">
 {course.title}
 </h3>
 <p className="text-[11px] font-mono text-slate-500 mb-2">
 {course.instructor}
 </p>

 {/* Progress Bar */}
 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2 ">
 <div
 className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
 style={{ width: `${pct}%` }}
 />
 </div>

 <div className="text-[11px] font-mono text-slate-500 line-clamp-1 bg-slate-50 p-1.5 rounded ">
 <span className="text-cyan-400 font-bold">Next: </span>
 {course.currentLessonTitle}
 </div>
 </div>

 <div className="flex items-center justify-between pt-2 border-t text-[11px] font-mono">
 <span className="text-slate-500">
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

 {/* Add Course Card */}
 {!isAddingCourse ? (
   <motion.div
     whileHover={{ y: -2 }}
     onClick={() => setIsAddingCourse(true)}
     className="p-4 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 text-slate-500 hover:text-cyan-400 min-h-[160px]"
   >
     <div className="p-3 rounded-full bg-slate-100">
       <Sparkles className="w-6 h-6" />
     </div>
     <span className="text-sm font-bold font-mono">Add New Course</span>
   </motion.div>
 ) : (
   <div className="p-4 rounded-2xl bg-slate-100 border border-cyan-500/50 flex flex-col gap-3 min-h-[160px]">
     <input
       type="text"
       placeholder="Course Title..."
       value={newCourseTitle}
       onChange={(e) => setNewCourseTitle(e.target.value)}
       className="w-full bg-slate-50 text-xs font-mono text-slate-900 px-3 py-2 rounded focus:outline-none focus:border-cyan-500"
     />
     <div className="flex items-center gap-2">
       <label className="text-[10px] font-mono text-slate-500">Total Sections:</label>
       <input
         type="number"
         value={newCourseSections}
         onChange={(e) => setNewCourseSections(parseInt(e.target.value) || 1)}
         className="w-16 bg-slate-50 text-xs font-mono text-slate-900 px-2 py-1 rounded focus:outline-none"
       />
     </div>
     <div className="flex gap-2 mt-auto">
       <button
         onClick={() => setIsAddingCourse(false)}
         className="flex-1 py-1.5 rounded bg-slate-200 text-slate-700 text-[10px] font-mono hover:bg-slate-700"
       >
         Cancel
       </button>
       <button
         onClick={() => {
           if (newCourseTitle) {
             addCourse(newCourseTitle, newCourseSections);
             setIsAddingCourse(false);
             setNewCourseTitle('');
           }
         }}
         className="flex-1 py-1.5 rounded bg-cyan-600 text-slate-900 font-bold text-[10px] font-mono hover:bg-cyan-500 shadow-glow-cyan"
       >
         Save
       </button>
     </div>
   </div>
 )}
 </div>

  {/* Main Two-Column Interactive Workstation */}
  {selectedCourse ? (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 
 {/* Left Column: 10-Minute Code-Along Sprint Studio (7 Cols) */}
 <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
 <div className="flex items-center justify-between pb-3 border-b ">
 <div className="flex items-center gap-2.5">
 <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border-cyan-500/30">
 <Timer className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-base font-extrabold text-slate-900">
 10-Minute "1 Video = 1 Commit" Sprint
 </h3>
 <p className="text-xs font-mono text-slate-500">
 Target: {selectedCourse.title}
 </p>
 </div>
 </div>

 {/* Timer Display */}
 <div className="flex items-center gap-3">
 <span className="text-2xl font-black font-mono text-cyan-400 tracking-widest bg-slate-50 px-3 py-1 rounded-xl ">
 {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
 </span>
 </div>
 </div>

 {/* Progress bar */}
 <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden ">
 <motion.div
 className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400"
 initial={{ width: 0 }}
 animate={{ width: `${progressPct}%` }}
 transition={{ duration: 0.3 }}
 />
 </div>

 {/* Current Lesson Prompt */}
 <div className="p-3 rounded-xl bg-slate-50 text-xs font-mono flex items-center justify-between gap-2">
 <div>
 <span className="text-slate-500 uppercase block text-[10px]">Active Lesson:</span>
 <span className="text-slate-800 font-semibold">{selectedCourse.currentLessonTitle}</span>
 </div>
 <a
 href={selectedCourse.url}
 target="_blank"
 rel="noreferrer"
 className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono font-bold flex items-center gap-1.5"
 >
 <span>Open 1.5x</span>
 <ExternalLink className="w-3.5 h-3.5" />
 </a>
 </div>

 {/* Built-in Code Snippet Box */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <label className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
 <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
 <span>Code Staging Area (Key takeaway from this video):</span>
 </label>
 </div>
 <textarea
 rows={8}
 value={snippetCode}
 onChange={(e) => setSnippetCode(e.target.value)}
 className="w-full p-3 rounded-xl bg-slate-50 font-mono text-xs text-cyan-300 focus:border-cyan-500 focus:outline-none leading-relaxed"
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
 className="w-full px-3 py-2 rounded-xl bg-slate-50 text-xs font-mono text-slate-800 focus:border-cyan-500 focus:outline-none"
 />
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setIsSprintRunning(!isSprintRunning)}
 className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
 isSprintRunning
 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
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
 className="bg-slate-900 text-white hover:bg-slate-800 font-medium px-4 py-2 rounded-xl text-sm transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
 >
 <CheckCircle2 className="w-4 h-4 text-slate-950" />
 <span>Mark Done &amp; Commit</span>
 </button>
 </div>
 </div>
 </div>

 {/* Right Column: AI Fast-Track & Cheat-Sheet Engine (5 Cols) */}
 <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
 <div className="flex items-center justify-between pb-3 border-b ">
 <div className="flex items-center gap-2.5">
 <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400 border-violet-500/30">
 <Sparkles className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-base font-extrabold text-slate-900">
 AI Course Fast-Track &amp; Cheat Sheet
 </h3>
 <p className="text-xs font-mono text-slate-500">
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
 ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 font-bold'
 : 'bg-slate-50 text-slate-500 hover:text-slate-900'
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
 className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 text-xs font-mono text-slate-900 focus:border-violet-500 focus:outline-none"
 />
 <button
 onClick={handleGenerateCustomSheet}
 disabled={isGeneratingCheatSheet}
 className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-slate-900 font-bold text-xs font-mono transition-all flex items-center gap-1 shadow-glow-violet cursor-pointer"
 >
 <Sparkles className={`w-3.5 h-3.5 ${isGeneratingCheatSheet ? 'animate-spin' : ''}`} />
 <span>Synthesize</span>
 </button>
 </div>

 {/* Selected Cheat Sheet Content */}
 <div className="p-4 rounded-xl bg-slate-50 flex flex-col gap-3.5">
 <div>
 <span className="text-[10px] font-mono uppercase text-violet-400 font-bold">
 {selectedSheet.category}
 </span>
 <h4 className="text-sm font-extrabold text-slate-900">
 {selectedSheet.topic}
 </h4>
 </div>

 {/* 3-Bullet Mental Model */}
 <div>
 <h5 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
 📌 3-Bullet Mental Model:
 </h5>
 <ul className="space-y-1.5">
 {selectedSheet.mentalModelBullets.map((bullet, i) => (
 <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
 <span className="text-cyan-400 font-bold">•</span>
 <span>{bullet}</span>
 </li>
 ))}
 </ul>
 </div>

 {/* Code Challenge */}
 <div className="p-3 rounded-lg bg-slate-100 ">
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
 <p className="text-xs text-slate-700 mb-2">
 {selectedSheet.codeChallenge.prompt}
 </p>
 <pre className="p-2 rounded bg-slate-50 text-[11px] font-mono text-emerald-300 overflow-x-auto">
 {selectedSheet.codeChallenge.starterCode}
 </pre>
 </div>

 {/* Active Recall Questions */}
 <div>
 <h5 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
 🧠 Active Recall Drills:
 </h5>
 <ul className="space-y-1.5">
 {selectedSheet.activeRecallQuestions.map((q, i) => (
 <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 border border-slate-100 p-2 rounded ">
 <span className="text-violet-400 font-bold">Q{i + 1}:</span>
 <span>{q}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 </div>
  ) : (
    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-center">
      <div className="p-4 rounded-full bg-slate-100 mb-4">
        <Sparkles className="w-8 h-8 text-cyan-500/50" />
      </div>
      <h3 className="text-lg font-bold text-slate-700 mb-2">No Active Courses</h3>
      <p className="text-sm font-mono text-slate-500 max-w-md">
        Add a new course above to start your 10-minute sprint tracking and AI cheat-sheet generation.
      </p>
    </div>
  )}
 </div>
 );
};
