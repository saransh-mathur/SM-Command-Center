import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Laptop, 
  X, 
  Activity, 
  RefreshCw, 
  ExternalLink, 
  Layers, 
  FileCode 
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const DiagnosticReportModal: React.FC = () => {
  const { 
    activeModal, 
    closeModal, 
    telemetry, 
    dashboardTimestamp, 
    laptopHealthScanning, 
    refreshLaptopHealth, 
    lastScanTime 
  } = useDashboard();
  
  const [viewMode, setViewMode] = useState<'iframe' | 'summary'>('iframe');
  const isOpen = activeModal === 'diagnostics';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl h-[92vh] glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  LAPTOP HEALTH DIAGNOSTICS // LIVE ENGINE
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  LIVE SYNC
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Source: laptop_health_dashboard.html • Last Synced: <span className="text-cyan-400">{lastScanTime}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs">
              <button
                onClick={() => setViewMode('iframe')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'iframe'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Live .HTML Report</span>
              </button>
              <button
                onClick={() => setViewMode('summary')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'summary'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Quick Telemetry</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col">
          {viewMode === 'iframe' ? (
            <div className="w-full h-full relative">
              <iframe
                key={dashboardTimestamp}
                src={`/laptop_health_dashboard.html?t=${dashboardTimestamp}`}
                title="Live Laptop Diagnostics Dashboard"
                className="w-full h-full border-0 rounded-xl bg-slate-950"
              />
            </div>
          ) : (
            <div className="p-5 overflow-y-auto space-y-4">
              {/* System Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">HOST & OS</span>
                  <span className="text-slate-200 font-bold">Zorin OS 17.2 LTS</span>
                  <span className="text-[10px] text-cyan-400 block">Kernel 6.8.0-generic</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">PROCESSOR</span>
                  <span className="text-slate-200 font-bold">Intel i5-9300H</span>
                  <span className="text-[10px] text-emerald-400 block">4 Cores / 8 Threads</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">DEDICATED GPU</span>
                  <span className="text-slate-200 font-bold">GTX 1650 Mobile</span>
                  <span className="text-[10px] text-amber-400 block">4GB GDDR5 VRAM</span>
                </div>
              </div>

              {/* Live Hardware Telemetry Matrix */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    Live Hardware Telemetry
                  </span>
                  <span className="text-slate-500 text-[10px]">Polled from /sys/class/hwmon</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-400">Core Package Temp:</span>
                      <span className="text-emerald-400 font-bold">{telemetry.cpuTemp}°C (Optimal)</span>
                    </div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-400">GPU Core Temp:</span>
                      <span className="text-amber-400 font-bold">{telemetry.gpuTemp}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">NBFC Fan RPM:</span>
                      <span className="text-violet-400 font-bold">{telemetry.fanRpm} RPM ({telemetry.fanMode})</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-400">RAM Allocation:</span>
                      <span className="text-cyan-400 font-bold">{telemetry.ramUsed} GB / {telemetry.ramTotal} GB ({telemetry.ramPercent}%)</span>
                    </div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-400">Swap Pressure:</span>
                      <span className="text-slate-300 font-bold">{telemetry.swapUsed} GB ({telemetry.swapPercent}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Battery State:</span>
                      <span className="text-emerald-400 font-bold">{telemetry.batteryPercent}% ({telemetry.powerDrawWatts}W)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={laptopHealthScanning}
              onClick={refreshLaptopHealth}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${laptopHealthScanning ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{laptopHealthScanning ? 'Refreshing Sensors...' : 'Refresh Hardware Telemetry'}</span>
            </motion.button>

            <a
              href={`/laptop_health_dashboard.html?t=${dashboardTimestamp}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <span>Open in Full Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold"
          >
            Close Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};
