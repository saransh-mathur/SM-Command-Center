import React from 'react';
import { motion } from 'framer-motion';
import { 
 Server, 
 Cpu, 
 Flame, 
 Fan, 
 Box, 
 Trash2, 
 Power, 
 ShieldAlert, 
 Activity,
 HardDrive
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const Q3HardwareWatchdog: React.FC = () => {
 const { 
 telemetry, 
 setFanMode, 
 containers, 
 toggleContainer, 
 openModal 
 } = useDashboard();

 return (
 <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full group hover:border-slate-700 transition-all">
 
 {/* Background Glow */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

 <div>
 {/* Card Header */}
 <div className="flex items-start justify-between gap-3 mb-4">
 <div className="flex items-center gap-3">
 <div className="p-2.5 rounded-xl bg-amber-500/10 border-amber-500/30 text-amber-400">
 <Server className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-base font-bold text-slate-900 tracking-tight">
 🖥️ Hardware & Dev Environment
 </h3>
 <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
 Kernel Watchdog
 </span>
 </div>
 <p className="text-xs text-slate-500 mt-0.5">
 Real-time thermal telemetry, nbfc-linux fan control & Docker runtime
 </p>
 </div>
 </div>
 </div>

 {/* ========================================================= */}
 {/* SECTION 1: HARDWARE THERMAL & FAN STATUS GAUGES */}
 {/* ========================================================= */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
 
 {/* CPU Temp Gauge */}
 <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono">
 <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
 <span className="flex items-center gap-1">
 <Cpu className="w-3.5 h-3.5 text-cyan-400" />
 CPU
 </span>
 <span className="text-[10px] text-slate-500">{telemetry.cpuLoad}%</span>
 </div>
 <div className="text-base sm:text-lg font-black text-slate-100">
 {telemetry.cpuTemp}°C
 </div>
 <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
 <div
 className="h-full bg-cyan-400 rounded-full transition-all"
 style={{ width: `${Math.min(100, (telemetry.cpuTemp / 90) * 100)}%` }}
 />
 </div>
 </div>

 {/* GPU Temp Gauge */}
 <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono">
 <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
 <span className="flex items-center gap-1">
 <Flame className="w-3.5 h-3.5 text-amber-400" />
 GTX 1650
 </span>
 <span className="text-[10px] text-emerald-400">NORMAL</span>
 </div>
 <div className="text-base sm:text-lg font-black text-slate-100">
 {telemetry.gpuTemp}°C
 </div>
 <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
 <div
 className="h-full bg-amber-400 rounded-full transition-all"
 style={{ width: `${Math.min(100, (telemetry.gpuTemp / 90) * 100)}%` }}
 />
 </div>
 </div>

 {/* Fan RPM Gauge */}
 <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono">
 <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
 <span className="flex items-center gap-1">
 <Fan className="w-3.5 h-3.5 text-violet-400 animate-spin" />
 NBFC FAN
 </span>
 <span className="text-[10px] text-violet-400">{telemetry.fanMode}</span>
 </div>
 <div className="text-base sm:text-lg font-black text-slate-100 truncate">
 {telemetry.fanRpm} <span className="text-xs font-normal text-slate-500">RPM</span>
 </div>
 <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
 <div
 className="h-full bg-violet-400 rounded-full transition-all"
 style={{ width: `${Math.min(100, (telemetry.fanRpm / 5500) * 100)}%` }}
 />
 </div>
 </div>

 {/* RAM & Swap */}
 <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono">
 <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
 <span className="flex items-center gap-1">
 <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
 MEMORY
 </span>
 <span className="text-[10px] text-slate-500">{telemetry.ramUsed}G</span>
 </div>
 <div className="text-base sm:text-lg font-black text-slate-100">
 {telemetry.ramPercent}%
 </div>
 <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
 <div
 className="h-full bg-emerald-400 rounded-full transition-all"
 style={{ width: `${telemetry.ramPercent}%` }}
 />
 </div>
 </div>

 </div>

 {/* NBFC Fan Mode Selector Switch */}
 <div className="mb-4 p-3 rounded-xl bg-slate-50/50 flex items-center justify-between gap-3">
 <div className="flex items-center gap-2">
 <Fan className="w-4 h-4 text-violet-400" />
 <span className="text-xs font-mono font-bold text-slate-700">
 NBFC-Linux Fan Profile:
 </span>
 </div>

 <div className="flex items-center gap-1.5 font-mono text-xs">
 {(['Auto', 'Performance', 'Quiet'] as const).map((mode) => (
 <button
 key={mode}
 onClick={() => setFanMode(mode)}
 className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
 telemetry.fanMode === mode
 ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 font-bold shadow-glow-violet'
 : 'bg-slate-100 text-slate-500 hover:text-slate-800'
 }`}
 >
 {mode}
 </button>
 ))}
 </div>
 </div>

 {/* ========================================================= */}
 {/* SECTION 2: DOCKER CONTAINER RUNTIME */}
 {/* ========================================================= */}
 <div className="mb-4">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 <Box className="w-4 h-4 text-cyan-400" />
 <span className="text-xs font-mono font-bold text-slate-700">
 Docker Containers & Microservices
 </span>
 </div>
 <span className="text-[10px] font-mono text-slate-500">
 {containers.filter((c) => c.status === 'running').length} / {containers.length} RUNNING
 </span>
 </div>

 <div className="space-y-2">
 {containers.map((container) => {
 const isRunning = container.status === 'running';
 const isIdle = container.status === 'idle';

 return (
 <div
 key={container.id}
 className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs font-mono"
 >
 <div className="flex items-center gap-2.5">
 <span
 className={`w-2 h-2 rounded-full ${
 isRunning ? 'bg-emerald-400 shadow-glow-emerald animate-pulse' : isIdle ? 'bg-amber-400' : 'bg-slate-600'
 }`}
 />
 <div>
 <span className="text-slate-800 font-bold block">{container.name}</span>
 <span className="text-[10px] text-slate-500 font-normal">
 {container.image} {container.port ? `• :${container.port}` : ''}
 </span>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <span className="text-[11px] text-slate-500">{container.memoryUsage}</span>
 <button
 onClick={() => toggleContainer(container.id)}
 className={`p-1.5 rounded-lg transition-all ${
 isRunning
 ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/30'
 : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
 }`}
 title={isRunning ? 'Stop Container' : 'Start Container'}
 >
 <Power className="w-3 h-3" />
 </button>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* ========================================================= */}
 {/* SECTION 3: CLEAN DEV MODE BUTTON */}
 {/* ========================================================= */}
 <motion.button
 whileHover={{ scale: 1.015, boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)' }}
 whileTap={{ scale: 0.985 }}
 onClick={() => openModal('cleanDev')}
 className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-600/30 via-rose-600/20 to-amber-600/30 hover:from-amber-600/40 hover:to-rose-600/30 border-amber-500/40 text-amber-200 font-mono font-bold flex items-center justify-between shadow-sm transition-all"
 >
 <div className="flex items-center gap-2.5">
 <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
 <ShieldAlert className="w-4 h-4" />
 </div>
 <div className="text-left">
 <span className="text-xs block font-bold text-amber-100">
 ACTIVATE CLEAN DEV MODE
 </span>
 <span className="text-[10px] text-amber-300/80 font-normal">
 Kill zombie Brave renderers, scrcpy & reclaim ~1.4 GB RAM
 </span>
 </div>
 </div>

 <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-amber-500/20 border-amber-500/30 text-amber-300">
 <Trash2 className="w-3.5 h-3.5" />
 <span>PURGE</span>
 </div>
 </motion.button>

 </div>

 {/* Footer Insight */}
 <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono text-slate-500">
 <span className="flex items-center gap-1 text-amber-400">
 <Activity className="w-3 h-3" />
 Watchdog: Active (Odysseus + Ollama + NBFC)
 </span>
 <span className="text-slate-500">Zorin 17.2 LTS</span>
 </div>

 </div>
 );
};
