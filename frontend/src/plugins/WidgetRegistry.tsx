import React from 'react';
import { CpuWidget, MemWidget, GpuWidget, PwrWidget } from './HardwareWidgets';
import { DockerWidget } from './DockerWidget';
import { QuickActionsWidget } from './QuickActionsWidget';
import { LogsWidget } from './LogsWidget';
import { Q1ControllableInputs } from '@/components/quadrants/Q1ControllableInputs';
import { YouTubeCreatorWidget } from './YouTubeCreatorWidget';
import { ECommerceWidget } from './ECommerceWidget';
import { MetricTrackerWidget, MarkdownNoteViewer, AgenticChat } from '@/components/widgets/DynamicWidgets';
import { LLMControlWidget } from '@/components/widgets/LLMControlWidget';

export interface WidgetRegistryItem {
  id: string;
  component: React.FC<any>;
  defaultClassName: string;
}

export const WIDGET_REGISTRY: Record<string, WidgetRegistryItem> = {
  'hw-cpu': {
    id: 'hw-cpu',
    component: CpuWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-stone-100 shadow-sm flex flex-col justify-center'
  },
  'hw-mem': {
    id: 'hw-mem',
    component: MemWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-stone-100 shadow-sm flex flex-col justify-center'
  },
  'hw-gpu': {
    id: 'hw-gpu',
    component: GpuWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-stone-100 shadow-sm flex flex-col justify-center'
  },
  'hw-pwr': {
    id: 'hw-pwr',
    component: PwrWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-stone-100 shadow-sm flex flex-col justify-center'
  },
  'docker': {
    id: 'docker',
    component: DockerWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md rounded-xl p-4 border border-stone-100 shadow-sm flex flex-col'
  },
  'actions': {
    id: 'actions',
    component: QuickActionsWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md rounded-xl p-4 border border-stone-100 shadow-sm flex flex-col justify-between'
  },
  'data-entry': {
    id: 'data-entry',
    component: Q1ControllableInputs,
    defaultClassName: 'overflow-y-auto flex flex-col bg-white/80 backdrop-blur-md rounded-xl border border-stone-100 shadow-sm'
  },
  'logs': {
    id: 'logs',
    component: LogsWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md rounded-xl p-4 border border-stone-100 shadow-sm flex flex-col'
  },
  'youtube-creator': {
    id: 'youtube-creator',
    component: YouTubeCreatorWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md rounded-xl p-4 border border-stone-100 shadow-sm flex flex-col'
  },
  'e-commerce': {
    id: 'e-commerce',
    component: ECommerceWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md rounded-xl p-4 border border-stone-100 shadow-sm flex flex-col'
  },
  'metric-tracker': {
    id: 'metric-tracker',
    component: MetricTrackerWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md rounded-2xl border border-stone-100 shadow-sm flex flex-col overflow-hidden'
  },
  'markdown-notes': {
    id: 'markdown-notes',
    component: MarkdownNoteViewer,
    defaultClassName: 'bg-white/80 backdrop-blur-md rounded-2xl border border-stone-100 shadow-sm flex flex-col overflow-hidden'
  },
  'agent-chat': {
    id: 'agent-chat',
    component: AgenticChat,
    defaultClassName: 'bg-white/80 backdrop-blur-md rounded-2xl border border-stone-100 shadow-sm flex flex-col overflow-hidden'
  },
  'llm-control': {
    id: 'llm-control',
    component: LLMControlWidget,
    defaultClassName: 'bg-white/80 backdrop-blur-md rounded-2xl border border-stone-100 shadow-sm flex flex-col overflow-hidden'
  }
};
