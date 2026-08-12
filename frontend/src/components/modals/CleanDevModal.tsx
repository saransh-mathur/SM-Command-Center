import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, X, Trash2, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const CleanDevModal: React.FC = () => {
 const { activeModal, closeModal, executeCleanDevMode } = useDashboard();
 const isOpen = activeModal === 'cleanDev';

 const [isCleaning, setIsCleaning] = useState(false);
 const [cleanedResult, setCleanedResult] = useState<{ freedMb: number; killedProcesses: number } | null>(null);

 if (!isOpen) return null;

 const handleExecuteClean = async () => {
 setIsCleaning(true);
 const result = await executeCleanDevMode();
 setIsCleaning(false);
 setCleanedResult(result);
 setTimeout(() => {
 closeModal();
 setCleanedResult(null);
 }, 1800);
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="w-full max-w-md glass-panel rounded-2xl border-amber-500/40 shadow-2xl p-6 relative"
 >
 {/* Header */}
 <div className="flex items-center justify-between pb-3 mb-4 border-b ">
 <div className="flex items-center gap-2.5">
 <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border-amber-500/40">
 <ShieldAlert className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-base font-extrabold text-white">
 CLEAN DEV MODE PURGE
 </h3>
 <p className="text-xs text-slate-400 font-mono">
 System RAM Optimization & Zombie Process Purge
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

 {/* Warning & Targets */}
 <div className="p-3.5 rounded-xl bg-amber-500/10 border-amber-500/30 text-amber-200 text-xs mb-4">
 <div className="flex items-center gap-2 font-bold mb-1">
 <AlertTriangle className="w-4 h-4 text-amber-400" />
 Targeted Cleanup Operations:
 </div>
 <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-300 font-mono">
 <li>Terminating 8 orphan Brave Browser Tab renderers</li>
 <li>Purging stale scrcpy & temporary screen streaming threads</li>
 <li>Unloading idle Ollama model weights from RAM (~1.2 GB)</li>
 <li>Resetting Linux dentry / inode slab memory cache</li>
 </ul>
 </div>

 {/* Actions */}
 {cleanedResult ? (
 <div className="p-4 rounded-xl bg-emerald-500/15 border-emerald-500/40 text-emerald-300 text-center font-mono text-xs">
 <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
 <span className="font-bold block">PURGE COMPLETE!</span>
 <span>Freed {cleanedResult.freedMb} MB RAM • Killed {cleanedResult.killedProcesses} zombie processes</span>
 </div>
 ) : (
 <div className="flex items-center justify-end gap-2 pt-2">
 <button
 onClick={closeModal}
 disabled={isCleaning}
 className="px-3.5 py-2 rounded-xl bg-slate-900 text-xs font-mono text-slate-400 hover:text-slate-200"
 >
 Cancel
 </button>
 <motion.button
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 disabled={isCleaning}
 onClick={handleExecuteClean}
 className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-glow-amber disabled:opacity-50"
 >
 {isCleaning ? (
 <>
 <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
 <span>Purging Processes...</span>
 </>
 ) : (
 <>
 <Trash2 className="w-4 h-4" />
 <span>Execute Deep Clean</span>
 </>
 )}
 </motion.button>
 </div>
 )}
 </motion.div>
 </div>
 );
};
