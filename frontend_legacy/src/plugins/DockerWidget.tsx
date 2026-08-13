import React from 'react';
import { Server, CheckCircle2, XCircle } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

export const DockerWidget = () => {
  const { containers } = useDashboard();
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <Server className="w-4 h-4 text-zinc-400" />
          <span>DOCKER SERVICES & RUNTIMES</span>
        </div>
        <span className="text-[11px] text-zinc-500">
          {containers.filter(c => c.status === 'running').length}/{containers.length} Running
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto custom-scrollbar flex-1">
        {containers.map((svc) => (
        <div key={svc.id} className="bg-[#09090b] p-3 rounded-md flex justify-between items-center border border-zinc-800/40">
          <div className="truncate pr-2">
            <div className="text-xs font-medium text-zinc-200 truncate">{svc.name}</div>
            <div className="text-[10px] text-zinc-500 truncate">{svc.image}</div>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-[10px] text-zinc-400">{svc.ports}</span>
            {svc.status === "running" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
          </div>
        </div>
        ))}
        {containers.length === 0 && (
          <div className="col-span-2 text-center text-zinc-500 text-xs py-4 flex items-center justify-center">No containers found.</div>
        )}
      </div>
    </>
  );
};
