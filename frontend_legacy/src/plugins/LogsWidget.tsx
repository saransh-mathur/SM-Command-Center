import React from 'react';
import { Terminal } from 'lucide-react';

interface LogsWidgetProps {
  isEditMode?: boolean;
  filteredLogs?: any[];
  logFilter?: string;
  setLogFilter?: (f: string) => void;
}

export const LogsWidget: React.FC<LogsWidgetProps> = ({ isEditMode, filteredLogs = [], logFilter, setLogFilter }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <Terminal className="w-4 h-4 text-zinc-400" />
          <span>LIVE STREAM CONSOLE</span>
        </div>
        <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-md text-[10px]">
          {(["ALL", "INFO", "WARN", "ERR"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => !isEditMode && setLogFilter && setLogFilter(filter)}
            className={`px-2 py-0.5 rounded transition-all ${
              logFilter === filter ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {filter}
          </button>
          ))}
        </div>
      </div>
      <div className="bg-[#09090b] border border-zinc-800/40 rounded-md p-3 flex-1 overflow-y-auto space-y-1.5 text-[11px] font-mono">
        {filteredLogs.length === 0 && (
          <div className="text-zinc-500 h-full flex items-center justify-center">System logs empty.</div>
        )}
        {filteredLogs.map((log, i) => (
          <div key={log.id || i} className="flex items-start gap-2 text-zinc-400">
            <span className="text-zinc-600 select-none">{log.time}</span>
            <span className={`font-semibold ${log.level === 'ERR' ? 'text-rose-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-emerald-400'}`}>
              [{log.level}]
            </span>
            <span className="text-zinc-300 break-all">{log.msg || log.message}</span>
          </div>
        ))}
      </div>
    </>
  );
};
