import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Briefcase, Plus, Building2, MapPin, DollarSign } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { JobStage } from '../../types';

export const AddApplicationModal: React.FC = () => {
 const { activeModal, closeModal, addApplication } = useDashboard();
 const isOpen = activeModal === 'addApp';

 const [company, setCompany] = useState('');
 const [role, setRole] = useState('');
 const [salaryRange, setSalaryRange] = useState('');
 const [location, setLocation] = useState('Remote / Hybrid');
 const [stage, setStage] = useState<JobStage>('targeted');
 const [notes, setNotes] = useState('');
 const [tagInput, setTagInput] = useState('');
 const [tags, setTags] = useState<string[]>(['Python', 'FastAPI']);

 if (!isOpen) return null;

 const handleAddTag = () => {
 if (tagInput.trim() && !tags.includes(tagInput.trim())) {
 setTags([...tags, tagInput.trim()]);
 setTagInput('');
 }
 };

 const handleRemoveTag = (tagToRemove: string) => {
 setTags(tags.filter((t) => t !== tagToRemove));
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!company.trim() || !role.trim()) return;

 addApplication({
 company: company.trim(),
 role: role.trim(),
 salaryRange: salaryRange.trim() || undefined,
 location: location.trim(),
 stage,
 notes: notes.trim() || undefined,
 tags: tags.length > 0 ? tags : ['General'],
 });

 // Reset
 setCompany('');
 setRole('');
 setSalaryRange('');
 setNotes('');
 closeModal();
 };

 return (
 <div className="fixed inset-0 bg-slate-50 border border-slate-100 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 15 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 15 }}
 className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 space-y-5 relative overflow-hidden"
 >
 <div className="flex items-center justify-between pb-3.5 mb-4 border-b ">
 <div className="flex items-center gap-2.5">
 <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
 <Briefcase className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-base font-extrabold text-slate-900">Add Job Application</h3>
 <p className="text-xs text-slate-500 font-mono">Track opportunities through your pipeline</p>
 </div>
 </div>
 <button
 onClick={closeModal}
 className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-mono text-slate-700 mb-1">Company *</label>
 <div className="relative">
 <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
 <input
 type="text"
 required
 placeholder="e.g. Stripe, Coinbase"
 value={company}
 onChange={(e) => setCompany(e.target.value)}
 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-mono text-slate-700 mb-1">Role Title *</label>
 <input
 type="text"
 required
 placeholder="e.g. Backend Engineer"
 value={role}
 onChange={(e) => setRole(e.target.value)}
 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 <div>
 <label className="block text-xs font-mono text-slate-700 mb-1">Initial Stage</label>
 <select
 value={stage}
 onChange={(e) => setStage(e.target.value as JobStage)}
 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
 >
 <option value="targeted">Targeted</option>
 <option value="tailored">Resume Tailored</option>
 <option value="outreach">Outreach Sent</option>
 <option value="interview">Interviewing</option>
 <option value="offer">Offer</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-mono text-slate-700 mb-1">Salary Range</label>
 <div className="relative">
 <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
 <input
 type="text"
 placeholder="₹35L - ₹50L"
 value={salaryRange}
 onChange={(e) => setSalaryRange(e.target.value)}
 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-mono text-slate-700 mb-1">Location</label>
 <div className="relative">
 <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
 <input
 type="text"
 placeholder="Remote / BLR"
 value={location}
 onChange={(e) => setLocation(e.target.value)}
 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
 />
 </div>
 </div>
 </div>

 <div>
 <label className="block text-xs font-mono text-slate-700 mb-1">Key Tags</label>
 <div className="flex gap-2 mb-2">
 <input
 type="text"
 placeholder="Add tech tag (e.g. Python, Docker)"
 value={tagInput}
 onChange={(e) => setTagInput(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
 className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 text-xs font-mono focus:border-emerald-500 focus:outline-none"
 />
 <button
 type="button"
 onClick={handleAddTag}
 className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-mono hover:bg-slate-200 cursor-pointer"
 >
 Add Tag
 </button>
 </div>
 <div className="flex flex-wrap gap-1.5">
 {tags.map((t) => (
 <span
 key={t}
 className="px-2 py-0.5 rounded-md bg-slate-100 text-emerald-300 text-[11px] font-mono flex items-center gap-1"
 >
 {t}
 <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-rose-400 cursor-pointer">
 &times;
 </button>
 </span>
 ))}
 </div>
 </div>

 <div>
 <label className="block text-xs font-mono text-slate-700 mb-1">Strategy / Notes</label>
 <textarea
 rows={2}
 placeholder="e.g. Highlight RAG latency optimization benchmarks and Celery background workers."
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
 />
 </div>

 <div className="flex items-center justify-end gap-2.5 pt-3 border-t ">
 <button
 type="button"
 onClick={closeModal}
 className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 text-xs font-mono cursor-pointer"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-glow-emerald hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-4 h-4" />
 <span>Add to Pipeline</span>
 </button>
 </div>
 </form>
 </motion.div>
 </div>
 );
};
