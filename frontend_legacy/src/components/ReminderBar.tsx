import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { AlertCircle, Target, Briefcase, Code } from 'lucide-react';

export const ReminderBar: React.FC = () => {
  const { targets, applications, courses, activeView, setActiveView } = useDashboard();

  const missingApps = Math.max(0, (targets?.applications?.target || 3) - (targets?.applications?.current || 0));
  const missingCourses = Math.max(0, (targets?.udemySprints?.target || 2) - (targets?.udemySprints?.current || 0));
  const missingCoding = Math.max(0, (targets?.deepCoding?.target || 2) - (targets?.deepCoding?.current || 0));

  // Determine if we need to show a reminder
  const reminders = [];
  
  if (missingApps > 0) {
    reminders.push(
      <button 
        key="apps"
        onClick={() => setActiveView('career')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-mono font-semibold transition-colors"
      >
        <Briefcase className="w-3.5 h-3.5" />
        {missingApps} Job Applications pending today
      </button>
    );
  }

  if (missingCourses > 0) {
    reminders.push(
      <button 
        key="courses"
        onClick={() => setActiveView('courses')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-[11px] font-mono font-semibold transition-colors"
      >
        <Target className="w-3.5 h-3.5" />
        {missingCourses} Course Sprints pending today
      </button>
    );
  }

  if (missingCoding > 0) {
    reminders.push(
      <button 
        key="coding"
        onClick={() => setActiveView('cockpit')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-mono font-semibold transition-colors"
      >
        <Code className="w-3.5 h-3.5" />
        {missingCoding} Deep Coding problems pending
      </button>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="flex items-center gap-2 mb-6 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
        <AlertCircle className="w-4 h-4" />
        ALL DAILY TARGETS MET! Excellent work today.
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono font-bold mr-2 uppercase tracking-wider">
        <AlertCircle className="w-4 h-4" />
        Action Required:
      </div>
      {reminders}
    </div>
  );
};
