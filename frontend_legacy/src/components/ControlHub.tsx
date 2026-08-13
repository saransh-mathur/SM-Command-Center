import React from 'react';
import { motion } from 'framer-motion';
import { 
 Terminal, 
 Activity, 
 ExternalLink, 
 RefreshCw, 
 FileText, 
 CheckCircle2, 
 XCircle, 
 Loader2, 
 Laptop, 
 Flame, 
 HardDrive
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const ControlHub: React.FC = () => {
 const { 
 agyStatus, 
 agyCronSynced, 
 toggleAgyDashboard, 
 laptopHealthScanning, 
 lastScanTime, 
 scanAndLaunchDashboard, 
 telemetry
 } = useDashboard();

 const isAgyActive = agyStatus === 'active';
 const isAgyLoading = agyStatus === 'loading';

 return (
 <section className="w-full">
 <div className="bg-void-900/40 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-sm transition-all hover:border-slate-700/50">
 
 {/* Header Title & Tag */}
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b ">
 <div className="flex items-center gap-2.5">
 <div className="p-2 rounded-xl bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
 <Activity className="w-4 h-4" />
 </div>
 <div>
 <h2 className="text-sm sm:text-base font-semibold text-slate-100 tracking-wide flex items-center gap-2">
 SYSTEM SERVICES & DIAGNOSTICS CONTROL HUB
 </h2>
 <p className="text-xs text-slate-400">
 Master orchestrator for Antigravity Streamlit telemetry, cron workers & hardware diagnostics
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2 self-end sm:self-auto">
 <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 px-3 py-1.5 rounded-full bg-slate-900/30 ">
 SOCKET: <span className="text-emerald-500 font-semibold ml-1">CONNECTED</span>
 </span>
 </div>
 </div>

 {/* 2-Column Grid for Services */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 
 {/* ========================================================= */}
 {/* SERVICE 1: AGY STREAMLIT DASHBOARD */}
 {/* ========================================================= */}
 <div className={`p-5 rounded-2xl transition-all duration-300 ${
 isAgyActive 
 ? 'bg-slate-900/30 border-emerald-500/20 shadow-sm hover:-translate-y-0.5' 
 : 'bg-slate-900/20 hover:-translate-y-0.5'
 }`}>
 <div className="flex items-start justify-between gap-3">
 <div className="flex items-start gap-3">
 <div className={`p-2.5 rounded-xl transition-colors ${
 isAgyActive 
 ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
 : 'bg-slate-800/60 text-slate-400'
 }`}>
 <Terminal className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-sm font-semibold text-slate-100">AGY Streamlit Dashboard</h3>
 {/* Live Status Badge */}
 {isAgyLoading ? (
 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-amber-500/15 border-amber-500/30 text-amber-400">
 <Loader2 className="w-3 h-3 animate-spin" />
 UPDATING...
 </span>
 ) : isAgyActive ? (
 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm">
 <CheckCircle2 className="w-3 h-3" />
 ACTIVE (Port 8501)
 </span>
 ) : (
 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-rose-500/15 border-rose-500/30 text-rose-400">
 <XCircle className="w-3 h-3" />
 DISABLED
 </span>
 )}
 </div>
 <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
 <span>localhost:8501</span>
 <span className="text-slate-600">•</span>
 <span className={agyCronSynced ? 'text-emerald-400' : 'text-slate-500'}>
 Cron: {agyCronSynced ? 'Synced (5m)' : 'Paused'}
 </span>
 </p>
 </div>
 </div>
 </div>

 {/* Actions Bar */}
 <div className="mt-4 pt-3 border-t flex items-center justify-between gap-3">
 <div className="flex items-center gap-2">
 <motion.button
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 disabled={isAgyLoading}
 onClick={toggleAgyDashboard}
 className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-2 transition-all shadow-sm ${
 isAgyLoading
 ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
 : isAgyActive
 ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/40 text-rose-300'
 : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-glow-emerald'
 }`}
 >
 {isAgyLoading ? (
 <>
 <Loader2 className="w-3.5 h-3.5 animate-spin" />
 <span>Switching State...</span>
 </>
 ) : isAgyActive ? (
 <>
 <XCircle className="w-3.5 h-3.5" />
 <span>Disable Service</span>
 </>
 ) : (
 <>
 <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
 <span>Enable Service</span>
 </>
 )}
 </motion.button>
 </div>

 {/* Open App ↗ Button */}
 <a
 href={isAgyActive ? "http://localhost:8501" : "#"}
 target={isAgyActive ? "_blank" : undefined}
 rel="noreferrer"
 className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
 isAgyActive
 ? 'bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:border-cyan-500/50'
 : 'bg-slate-900/40 text-slate-600 cursor-not-allowed pointer-events-none'
 }`}
 >
 <span>Open App</span>
 <ExternalLink className="w-3 h-3" />
 </a>
 </div>
 </div>

 {/* ========================================================= */}
 {/* SERVICE 2: LAPTOP HEALTH & DIAGNOSTICS */}
 {/* ========================================================= */}
 <div className="p-4 rounded-xl bg-slate-900/90 transition-all duration-300 hover:border-cyan-500/30">
 <div className="flex items-start justify-between gap-3">
 <div className="flex items-start gap-3">
 <div className="p-2.5 rounded-xl bg-cyan-500/15 border-cyan-500/40 text-cyan-400">
 <Laptop className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-sm font-bold text-slate-100">Laptop Health & Diagnostics</h3>
 <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
 LIVE PULSE
 </span>
 </div>
 <p className="text-xs text-slate-400 font-mono mt-0.5">
 Hardware thermals, nbfc fan controller & process health
 </p>
 </div>
 </div>
 </div>

 {/* Mini Telemetry Pill Row */}
 <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
 <div className="p-2 rounded-lg bg-slate-950/60 flex items-center gap-2">
 <Flame className="w-3.5 h-3.5 text-amber-400" />
 <div>
 <span className="text-[10px] text-slate-400 block">CPU TEMP</span>
 <span className="text-slate-200 font-semibold">{telemetry.cpuTemp}°C</span>
 </div>
 </div>

 <div className="p-2 rounded-lg bg-slate-950/60 flex items-center gap-2">
 <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
 <div>
 <span className="text-[10px] text-slate-400 block">RAM LOAD</span>
 <span className="text-slate-200 font-semibold">{telemetry.ramPercent}%</span>
 </div>
 </div>

 <div className="p-2 rounded-lg bg-slate-950/60 flex items-center gap-2">
 <Activity className="w-3.5 h-3.5 text-emerald-400" />
 <div>
 <span className="text-[10px] text-slate-400 block">LAST SCAN</span>
 <span className="text-slate-300 font-semibold text-[11px] truncate block">{lastScanTime}</span>
 </div>
 </div>
 </div>

 {/* Actions Bar */}
 <div className="mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-2.5">
 {/* Dual Action: Scan + Open Live Dashboard in New Tab */}
 <motion.button
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 disabled={laptopHealthScanning}
 onClick={() => scanAndLaunchDashboard(true)}
 className="px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold flex items-center gap-2 shadow-glow-cyan"
 >
 <RefreshCw className={`w-3.5 h-3.5 ${laptopHealthScanning ? 'animate-spin text-slate-950' : ''}`} />
 <span>{laptopHealthScanning ? 'Scanning & Launching...' : 'Scan & Open Live Dashboard ↗'}</span>
 </motion.button>

 {/* In-App Live View Button */}
 <button
 onClick={() => scanAndLaunchDashboard(false)}
 className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:border-cyan-500/50 flex items-center gap-1.5 transition-all"
 >
 <FileText className="w-3 h-3 text-cyan-400" />
 <span>In-App View</span>
 </button>
 </div>
 </div>

 </div>

 </div>
 </section>
 );
};
