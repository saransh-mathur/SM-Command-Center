import React from 'react';
import { Play, RefreshCw } from 'lucide-react';

interface QuickActionsWidgetProps {
  isEditMode?: boolean;
  handleTriggerAction?: (act: string) => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ isEditMode, handleTriggerAction }) => {
  return (
    <>
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-4">
          <Play className="w-4 h-4 text-zinc-400" />
          <span>QUICK ACTIONS</span>
        </div>
        <div className="space-y-2 overflow-y-auto flex-1">
          {[
            { name: "Toggle AGY Dashboard", desc: "Enable or disable Streamlit monitor" },
            { name: "Flush Cache", desc: "Purge stale Redis keys" },
            { name: "Restart Ollama", desc: "Reload local LLM context" },
            { name: "Purge Dev Data", desc: "Terminate stale workers and clean memory" },
          ].map((act, i) => (
          <button
            key={i}
            onClick={() => !isEditMode && handleTriggerAction && handleTriggerAction(act.name)}
            className="w-full text-left bg-[#09090b] hover:bg-zinc-800/50 p-2.5 rounded-md transition-all group border border-zinc-800/30 hover:border-emerald-500/30"
          >
            <div className="text-xs font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">{act.name}</div>
            <div className="text-[10px] text-zinc-500">{act.desc}</div>
          </button>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t text-[11px] text-zinc-500 flex justify-between items-center">
        <span>Environment: Development</span>
        <button className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200">
          <RefreshCw className="w-3 h-3" /> Reload
        </button>
      </div>
    </>
  );
};
