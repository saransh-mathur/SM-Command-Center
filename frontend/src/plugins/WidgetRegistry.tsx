import React from 'react';
import { CpuWidget, MemWidget, GpuWidget, PwrWidget } from './HardwareWidgets';
import { DockerWidget } from './DockerWidget';
import { QuickActionsWidget } from './QuickActionsWidget';
import { LogsWidget } from './LogsWidget';
import { Q1ControllableInputs } from '@/components/quadrants/Q1ControllableInputs';
import { YouTubeCreatorWidget } from './YouTubeCreatorWidget';
import { ECommerceWidget } from './ECommerceWidget';

export interface WidgetRegistryItem {
  id: string;
  component: React.FC<any>;
  defaultClassName: string;
}

export const WIDGET_REGISTRY: Record<string, WidgetRegistryItem> = {
  'hw-cpu': {
    id: 'hw-cpu',
    component: CpuWidget,
    defaultClassName: 'bg-[#121215] p-3.5 rounded-lg border flex flex-col justify-center'
  },
  'hw-mem': {
    id: 'hw-mem',
    component: MemWidget,
    defaultClassName: 'bg-[#121215] p-3.5 rounded-lg border flex flex-col justify-center'
  },
  'hw-gpu': {
    id: 'hw-gpu',
    component: GpuWidget,
    defaultClassName: 'bg-[#121215] p-3.5 rounded-lg border flex flex-col justify-center'
  },
  'hw-pwr': {
    id: 'hw-pwr',
    component: PwrWidget,
    defaultClassName: 'bg-[#121215] p-3.5 rounded-lg border flex flex-col justify-center'
  },
  'docker': {
    id: 'docker',
    component: DockerWidget,
    defaultClassName: 'bg-[#121215] rounded-lg p-4 border flex flex-col'
  },
  'actions': {
    id: 'actions',
    component: QuickActionsWidget,
    defaultClassName: 'bg-[#121215] rounded-lg p-4 border flex flex-col justify-between'
  },
  'data-entry': {
    id: 'data-entry',
    component: Q1ControllableInputs,
    defaultClassName: 'overflow-y-auto flex flex-col bg-[#09090b]'
  },
  'logs': {
    id: 'logs',
    component: LogsWidget,
    defaultClassName: 'bg-[#121215] rounded-lg p-4 border flex flex-col'
  },
  'youtube-creator': {
    id: 'youtube-creator',
    component: YouTubeCreatorWidget,
    defaultClassName: 'bg-[#121215] rounded-lg p-4 border flex flex-col'
  },
  'e-commerce': {
    id: 'e-commerce',
    component: ECommerceWidget,
    defaultClassName: 'bg-[#121215] rounded-lg p-4 border flex flex-col'
  }
};
