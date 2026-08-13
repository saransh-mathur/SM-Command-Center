import React from 'react';
import { MonitorPlay, Users, Clock, PlayCircle, Video } from 'lucide-react';

export const YouTubeCreatorWidget = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <MonitorPlay className="w-4 h-4 text-rose-500" />
          <span>CREATOR STUDIO ANALYTICS</span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Live</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-[#09090b] p-2 rounded-md border border-zinc-800/40">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mb-1">
            <Users className="w-3 h-3 text-blue-400" /> Subs
          </div>
          <div className="text-sm font-bold text-zinc-200">14.2K <span className="text-emerald-400 text-[10px] font-normal">+120</span></div>
        </div>
        <div className="bg-[#09090b] p-2 rounded-md border border-zinc-800/40">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mb-1">
            <PlayCircle className="w-3 h-3 text-rose-400" /> Views
          </div>
          <div className="text-sm font-bold text-zinc-200">89.4K <span className="text-emerald-400 text-[10px] font-normal">+5%</span></div>
        </div>
        <div className="bg-[#09090b] p-2 rounded-md border border-zinc-800/40">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mb-1">
            <Clock className="w-3 h-3 text-amber-400" /> Watch Hrs
          </div>
          <div className="text-sm font-bold text-zinc-200">4,200 <span className="text-zinc-500 text-[10px] font-normal">Monetized</span></div>
        </div>
        <div className="bg-[#09090b] p-2 rounded-md border border-zinc-800/40 flex flex-col justify-center items-center cursor-pointer hover:bg-zinc-800/50 transition-colors">
          <Video className="w-4 h-4 text-zinc-400 mb-1" />
          <span className="text-[9px] text-zinc-400 text-center">Env Control<br/>(Studio Lights)</span>
        </div>
      </div>

      <div className="flex-1 bg-[#09090b] p-3 rounded-md border border-zinc-800/40">
        <h3 className="text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Production Pipeline</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-300">"Why RAG is dead in 2026"</span>
            <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-[9px]">Editing</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-300">"FastAPI vs Go Benchmark"</span>
            <span className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded text-[9px]">Scripting</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-500 line-through">"Desk Setup Tour"</span>
            <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[9px]">Published</span>
          </div>
        </div>
      </div>
    </>
  );
};
