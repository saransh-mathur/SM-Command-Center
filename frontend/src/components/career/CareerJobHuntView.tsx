import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Copy, 
  Check, 
  ExternalLink, 
  MapPin, 
  DollarSign, 
  Trash2, 
  Send, 
  Star, 
  Target,
  Award
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { JobStage } from '../../types';
import { OUTREACH_TEMPLATES, STAR_PROJECTS } from '../../data/mockCareer';
import { AddApplicationModal } from './AddApplicationModal';

const STAGES: { key: JobStage; label: string; color: string; border: string }[] = [
  { key: 'targeted', label: 'Targeted', color: 'text-slate-300 bg-slate-800/80', border: 'border-slate-700' },
  { key: 'tailored', label: 'Resume Tailored', color: 'text-cyan-300 bg-cyan-500/10', border: 'border-cyan-500/30' },
  { key: 'outreach', label: 'Outreach Sent', color: 'text-amber-300 bg-amber-500/10', border: 'border-amber-500/30' },
  { key: 'interview', label: 'Interviewing', color: 'text-violet-300 bg-violet-500/10', border: 'border-violet-500/30' },
  { key: 'offer', label: 'Offer', color: 'text-emerald-300 bg-emerald-500/15', border: 'border-emerald-500/40' },
];

export const CareerJobHuntView: React.FC = () => {
  const { 
    applications, 
    updateApplicationStage, 
    deleteApplication, 
    openModal, 
    addToast,
    incrementTarget 
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'templates' | 'projects'>('pipeline');
  const [selectedTemplateCat, setSelectedTemplateCat] = useState<'all' | 'recruiter' | 'hiring_manager' | 'alumni' | 'followup'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (id: string, text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    incrementTarget('applications');
    addToast({
      type: 'success',
      title: '📋 Copied to Clipboard!',
      message: `Template "${title}" copied. Staging outreach goal +1!`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTemplates = selectedTemplateCat === 'all' 
    ? OUTREACH_TEMPLATES 
    : OUTREACH_TEMPLATES.filter((t) => t.category === selectedTemplateCat);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Banner & Control Deck */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-glow-emerald">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                💼 Career &amp; Job Hunt Launchpad
              </h2>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {applications.length} Active Targets
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Frictionless application pipeline • 1-Click Outreach Engine • Star Project Pitch Bank
            </p>
          </div>
        </div>

        {/* View Switcher Tabs & Add Button */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs shadow-inner">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-glow-emerald'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Pipeline Kanban</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>1-Click Outreach Bank</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold shadow-glow-violet'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Star Project Pitches</span>
            </button>
          </div>

          <button
            onClick={() => openModal('addApp')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-glow-emerald hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {STAGES.map((stage) => {
            const stageApps = applications.filter((a) => a.stage === stage.key);
            return (
              <div
                key={stage.key}
                className="glass-panel rounded-2xl p-4 border border-slate-800/90 shadow-glass flex flex-col gap-3 min-h-[520px] bg-slate-900/40"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${stage.border} ${stage.color}`}>
                    {stage.label}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                    {stageApps.length}
                  </span>
                </div>

                {/* Stage Cards */}
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-0.5">
                  {stageApps.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-slate-800/80 text-slate-500 text-xs font-mono">
                      No applications in this stage
                    </div>
                  ) : (
                    stageApps.map((app) => (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all shadow-md group relative flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                              {app.company}
                            </h4>
                            <p className="text-xs text-slate-300 font-medium line-clamp-1">
                              {app.role}
                            </p>
                          </div>

                          <button
                            onClick={() => deleteApplication(app.id)}
                            title="Delete application"
                            className="text-slate-600 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400">
                          {app.salaryRange && (
                            <span className="inline-flex items-center gap-0.5 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              <DollarSign className="w-3 h-3" />
                              {app.salaryRange}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-0.5 text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            <MapPin className="w-3 h-3" />
                            {app.location}
                          </span>
                        </div>

                        {/* Tech Tags */}
                        <div className="flex flex-wrap gap-1">
                          {app.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {app.notes && (
                          <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 line-clamp-2">
                            {app.notes}
                          </p>
                        )}

                        {/* Move Stage Selector */}
                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            Move:
                          </span>
                          <select
                            value={app.stage}
                            onChange={(e) => updateApplicationStage(app.id, e.target.value as JobStage)}
                            className="text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-700 rounded px-1.5 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="targeted">Targeted</option>
                            <option value="tailored">Tailored</option>
                            <option value="outreach">Outreach Sent</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                          </select>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="flex flex-col gap-5">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Templates' },
              { id: 'recruiter', label: 'LinkedIn Recruiter Ping' },
              { id: 'hiring_manager', label: 'Engineering Manager Pitch' },
              { id: 'alumni', label: 'Alumni Coffee Chat' },
              { id: 'followup', label: 'Post-Interview Thank You' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedTemplateCat(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedTemplateCat === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-glass flex flex-col justify-between gap-4 bg-slate-900/50 relative overflow-hidden group hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-cyan-400" />
                      {tpl.title}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      {tpl.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-xs font-mono text-slate-400 block mb-0.5">Subject:</span>
                    <p className="text-xs font-mono text-cyan-300 font-semibold bg-slate-950 p-2 rounded-lg border border-slate-800">
                      {tpl.subject}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-slate-400 block mb-0.5">Body:</span>
                    <pre className="text-xs font-mono text-slate-200 bg-slate-950/90 p-3 rounded-xl border border-slate-800/90 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                      {tpl.body}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-500">
                    Replace placeholders like {"{{Company}}"}
                  </span>
                  <button
                    onClick={() => handleCopyText(tpl.id, `${tpl.subject}\n\n${tpl.body}`, tpl.title)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-glow-cyan hover:opacity-95 transition-all cursor-pointer"
                  >
                    {copiedId === tpl.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-950" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Star Projects Tab */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STAR_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-glass flex flex-col justify-between gap-4 bg-slate-900/60 relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-violet-400" />
                      {proj.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {proj.role} • {proj.timeframe}
                    </p>
                  </div>

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {proj.summary}
                </p>

                <div className="mb-4">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Key Impact Metrics:
                  </h4>
                  <ul className="space-y-1.5">
                    {proj.impactMetrics.map((metric, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-violet-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() =>
                    handleCopyText(
                      proj.id,
                      `**${proj.title}** (${proj.role})\n${proj.summary}\n\nImpact Metrics:\n${proj.impactMetrics.map((m) => `- ${m}`).join('\n')}\n\nTech Stack: ${proj.techStack.join(', ')}`,
                      proj.title
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copiedId === proj.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Snippet!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy Resume Pitch Block</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Application Modal */}
      <AddApplicationModal />
    </div>
  );
};
