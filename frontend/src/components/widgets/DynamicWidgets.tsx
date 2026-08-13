import React from 'react';
import { Activity } from 'lucide-react';

export const MetricTrackerWidget = ({ workspaceId, widgetId, isEditMode }: any) => {
  return (
    <div className="flex flex-col h-full w-full p-4 bg-transparent">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-emerald-500" />
        <h3 className="text-stone-800 font-semibold">Metrics Overview</h3>
      </div>
      <div className="flex-1 flex items-center justify-center text-stone-500">
        <p>Metric Tracking Data (Dynamic Entity)</p>
      </div>
    </div>
  );
};

export const MarkdownNoteViewer = ({ workspaceId, widgetId, isEditMode }: any) => {
  return (
    <div className="flex flex-col h-full w-full p-4 bg-transparent">
      <h3 className="text-stone-800 font-semibold mb-2">Knowledge Note</h3>
      <div className="flex-1 text-stone-600 text-sm overflow-y-auto">
        <p>Dynamic Markdown Content will render here based on Entity payload.</p>
      </div>
    </div>
  );
};

export const AgenticChat = ({ workspaceId, widgetId, isEditMode }: any) => {
  return (
    <div className="flex flex-col h-full w-full p-4 bg-transparent">
      <h3 className="text-stone-800 font-semibold mb-4">AI Chat Assistant</h3>
      <div className="flex-1 border border-stone-200 rounded-md mb-2 p-2 text-stone-500 bg-white/50">
        Chat history...
      </div>
      <input type="text" placeholder="Type a message..." className="w-full bg-white/50 border border-stone-200 rounded-md p-2 text-sm text-stone-800 outline-none placeholder:text-stone-400" disabled={isEditMode} />
    </div>
  );
};
