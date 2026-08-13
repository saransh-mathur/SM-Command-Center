import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const ToastContainer: React.FC = () => {
 const { toasts, removeToast } = useDashboard();

 const getIcon = (type: string) => {
 switch (type) {
 case 'success':
 return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
 case 'warning':
 return <AlertTriangle className="w-4 h-4 text-amber-400" />;
 case 'error':
 return <XCircle className="w-4 h-4 text-rose-400" />;
 default:
 return <Info className="w-4 h-4 text-cyan-400" />;
 }
 };

 const getBorderColor = (type: string) => {
 switch (type) {
 case 'success':
 return 'border-emerald-500/40 shadow-glow-emerald';
 case 'warning':
 return 'border-amber-500/40 shadow-glow-amber';
 case 'error':
 return 'border-rose-500/40';
 default:
 return 'border-cyan-500/40 shadow-glow-cyan';
 }
 };

 return (
 <div className="fixed top-16 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
 <AnimatePresence>
 {toasts.map((toast) => (
 <motion.div
 key={toast.id}
 initial={{ opacity: 0, x: 40, scale: 0.9 }}
 animate={{ opacity: 1, x: 0, scale: 1 }}
 exit={{ opacity: 0, x: 40, scale: 0.9 }}
 transition={{ duration: 0.3 }}
 className={`pointer-events-auto p-3.5 rounded-xl glass-panel ${getBorderColor(
 toast.type
 )} backdrop-blur-xl flex items-start gap-3 shadow-2xl`}
 >
 <div className="mt-0.5">{getIcon(toast.type)}</div>
 <div className="flex-1 text-xs">
 <h4 className="font-bold text-slate-100 font-mono tracking-tight">{toast.title}</h4>
 <p className="text-slate-300 text-[11px] font-sans mt-0.5 leading-snug">{toast.message}</p>
 </div>
 <button
 onClick={() => removeToast(toast.id)}
 className="text-slate-500 hover:text-slate-300 p-0.5 -mr-1 -mt-1"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 );
};
