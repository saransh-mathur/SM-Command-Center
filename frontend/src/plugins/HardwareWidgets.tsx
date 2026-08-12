import React from 'react';
import { Cpu, Activity, Zap, Database } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

export const CpuWidget = () => {
  const { telemetry } = useDashboard();
  return (
    <>
      <div className="flex justify-between items-center text-zinc-500 text-[11px] mb-1">
        <span>CPU LOAD</span>
        <Cpu className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="text-lg font-bold text-zinc-100">{telemetry.cpuLoad}%</div>
      <div className="text-[10px] text-zinc-500 mt-0.5">{telemetry.cpuTemp}°C</div>
    </>
  );
};

export const MemWidget = () => {
  const { telemetry } = useDashboard();
  return (
    <>
      <div className="flex justify-between items-center text-zinc-500 text-[11px] mb-1">
        <span>MEMORY</span>
        <Activity className="w-4 h-4 text-blue-400" />
      </div>
      <div className="text-lg font-bold text-zinc-100">{telemetry.ramUsed} / {telemetry.ramTotal} GB</div>
      <div className="text-[10px] text-zinc-500 mt-0.5">Swap: {telemetry.swapUsed} GB</div>
    </>
  );
};

export const GpuWidget = () => {
  const { telemetry } = useDashboard();
  return (
    <>
      <div className="flex justify-between items-center text-zinc-500 text-[11px] mb-1">
        <span>GPU (NVIDIA)</span>
        <Zap className="w-4 h-4 text-purple-400" />
      </div>
      <div className="text-lg font-bold text-zinc-100">{telemetry.gpuTemp}°C</div>
      <div className="text-[10px] text-zinc-500 mt-0.5">Dedicated Graphics</div>
    </>
  );
};

export const PwrWidget = () => {
  const { telemetry } = useDashboard();
  return (
    <>
      <div className="flex justify-between items-center text-zinc-500 text-[11px] mb-1">
        <span>POWER & FANS</span>
        <Database className="w-4 h-4 text-amber-400" />
      </div>
      <div className="text-lg font-bold text-zinc-100">{telemetry.batteryPercent}% {telemetry.isCharging ? '⚡' : ''}</div>
      <div className="text-[10px] text-zinc-500 mt-0.5">{telemetry.fanRpm} RPM ({telemetry.fanMode})</div>
    </>
  );
};
