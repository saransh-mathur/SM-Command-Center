import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { Responsive, useContainerWidth } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { LayoutDashboard } from 'lucide-react';
import { WIDGET_REGISTRY } from '@/plugins/WidgetRegistry';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Widget Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface CockpitGridProps {
  workspaceId: string;
  layouts: any;
  onLayoutChange: (layout: any, allLayouts: any) => void;
}

export const CockpitGrid: React.FC<CockpitGridProps> = ({ 
  workspaceId, 
  layouts, 
  onLayoutChange 
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { width, containerRef, mounted } = useContainerWidth();

  if (!mounted) return null;

  return (
    <div className="w-full pb-20">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-sm font-semibold text-stone-500">WORKSPACE GRID</h2>
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-md transition-all border ${
            isEditMode 
              ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-sm' 
              : 'bg-white/80 text-stone-500 border-stone-200 hover:text-stone-800 shadow-sm'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          {isEditMode ? 'Save Layout' : 'Edit Mode'}
        </button>
      </div>

      <div ref={containerRef} className={isEditMode ? 'bg-[url("https://www.transparenttextures.com/patterns/graphy.png")] bg-repeat min-h-[800px] border border-dashed border-rose-200' : 'min-h-[800px]'}>
        {mounted && layouts && (
        <Responsive
          className="layout"
          layouts={layouts}
          width={width}
          onLayoutChange={onLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          compactType={null} 
          preventCollision={true}
          margin={[16, 16]}
        >
          {(layouts?.lg || (Array.isArray(layouts) ? layouts : Object.values(layouts)[0] || [])).map((layoutItem: any) => {
            // Widget ID or type could be stored in i, e.g., 'metric-tracker:entities-123'
            const typeStr = layoutItem.i.split(':')[0];
            const widget = WIDGET_REGISTRY[typeStr];
            
            if (!widget) {
              return (
                <div key={layoutItem.i} className="bg-red-500/10 border border-red-500/50 flex items-center justify-center rounded-lg text-red-500 text-xs">
                  Missing Widget: {typeStr}
                </div>
              );
            }
            
            const WidgetComponent = widget.component;
            const isEditingStyles = isEditMode 
              ? 'border-rose-400 shadow-md cursor-grab active:cursor-grabbing hover:border-rose-500' 
              : 'border-stone-100 shadow-sm';
            
            return (
              <div 
                key={layoutItem.i} 
                className={`${widget.defaultClassName} ${isEditingStyles} transition-colors overflow-hidden`}
              >
                <ErrorBoundary fallback={<div className="bg-red-500/10 text-red-500 flex items-center justify-center h-full w-full">Error loading {typeStr}</div>}>
                  <WidgetComponent 
                    isEditMode={isEditMode}
                    workspaceId={workspaceId}
                    widgetId={layoutItem.i}
                  />
                </ErrorBoundary>
              </div>
            );
          })}
        </Responsive>
        )}
      </div>
    </div>
  );
};
