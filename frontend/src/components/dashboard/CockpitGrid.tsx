import React, { useState } from 'react';
import { Responsive, useContainerWidth } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { LayoutDashboard } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { WIDGET_REGISTRY } from '@/plugins/WidgetRegistry';

export const CockpitGrid: React.FC<{ 
  logs: any[]; 
  filteredLogs: any[]; 
  logFilter: string; 
  setLogFilter: (f: any) => void;
  handleTriggerAction: (act: string) => void;
}> = ({ logs, filteredLogs, logFilter, setLogFilter, handleTriggerAction }) => {
  const { telemetry, containers, globalConfig } = useDashboard();
  const [isEditMode, setIsEditMode] = useState(false);
  const [layouts, setLayouts] = useState<any>(null);
  const { width, containerRef, mounted } = useContainerWidth();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Default Grid Layout
  const defaultLayout = [
    // Hardware Metrics (Top Row)
    { i: 'hw-cpu', x: 0, y: 0, w: 3, h: 3 },
    { i: 'hw-mem', x: 3, y: 0, w: 3, h: 3 },
    { i: 'hw-gpu', x: 6, y: 0, w: 3, h: 3 },
    { i: 'hw-pwr', x: 9, y: 0, w: 3, h: 3 },
    // Middle Row
    { i: 'docker', x: 0, y: 3, w: 8, h: 6 },
    { i: 'actions', x: 8, y: 3, w: 4, h: 6 },
    // Bottom Row
    { i: 'data-entry', x: 0, y: 9, w: 6, h: 6 },
    { i: 'logs', x: 6, y: 9, w: 6, h: 6 },
  ];

  React.useEffect(() => {
    // Check backend config first
    if (globalConfig?.dashboard_layout) {
      setLayouts(globalConfig.dashboard_layout);
    } else {
      // Fallback to local storage (migration from old version) or defaults
      const saved = localStorage.getItem('cockpit_layout');
      if (saved) {
        setLayouts(JSON.parse(saved));
      } else {
        setLayouts({ lg: defaultLayout });
      }
    }
  }, [globalConfig]);

  const handleLayoutChange = (layout: any, allLayouts: any) => {
    setLayouts(allLayouts);
    localStorage.setItem('cockpit_layout', JSON.stringify(allLayouts));
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Save to backend config to persist across logouts (debounced)
    timeoutRef.current = setTimeout(async () => {
      try {
        await fetch('http://localhost:8000/api/setup/layout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(allLayouts)
        });
      } catch (e) {
        console.error("Failed to save layout to backend", e);
      }
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className="w-full pb-20">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-sm font-semibold text-zinc-300">SYSTEM OVERVIEW</h2>
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-md transition-all border ${
            isEditMode 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
              : 'bg-[#121215] text-zinc-400 border-zinc-800 hover:text-zinc-200'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          {isEditMode ? 'Save Layout' : 'Edit Mode'}
        </button>
      </div>

      <div ref={containerRef} className={isEditMode ? 'bg-[url("https://www.transparenttextures.com/patterns/graphy.png")] bg-repeat min-h-[800px] border border-dashed border-zinc-800' : 'min-h-[800px]'}>
        {mounted && layouts && (
        <Responsive
          className="layout"
          layouts={layouts}
          width={width}
          onLayoutChange={handleLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          compactType={null} 
          preventCollision={true}
          margin={[16, 16]}
        >
          {layouts?.lg?.map((layoutItem: any) => {
            const widgetId = layoutItem.i;
            const widget = WIDGET_REGISTRY[widgetId];
            if (!widget) return null;
            
            const WidgetComponent = widget.component;
            const isEditingStyles = isEditMode 
              ? 'border-emerald-500/50 shadow-lg cursor-grab active:cursor-grabbing hover:border-emerald-400' 
              : 'border-zinc-800/30';
            
            return (
              <div 
                key={widgetId} 
                className={`${widget.defaultClassName} ${isEditingStyles} transition-colors`}
              >
                <WidgetComponent 
                  isEditMode={isEditMode}
                  logs={logs}
                  filteredLogs={filteredLogs}
                  logFilter={logFilter}
                  setLogFilter={setLogFilter}
                  handleTriggerAction={handleTriggerAction}
                />
              </div>
            );
          })}

        </Responsive>
        )}
      </div>
    </div>
  );
};
