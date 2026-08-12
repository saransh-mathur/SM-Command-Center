import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CockpitGrid } from './CockpitGrid';

export const WorkspaceDashboard: React.FC = () => {
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Default layout if none exists
  const defaultLayout = [
    { i: 'metric-tracker', x: 0, y: 0, w: 4, h: 4 },
    { i: 'markdown-notes', x: 4, y: 0, w: 4, h: 4 },
    { i: 'agent-chat', x: 8, y: 0, w: 4, h: 4 },
  ];

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        // Fetching the first active workspace (in a real app, user selects workspace)
        const res = await axios.get('http://localhost:8000/api/workspaces/');
        if (res.data && res.data.length > 0) {
          const ws = res.data[0];
          // Ensure config has dashboard_layout
          if (!ws.config) ws.config = {};
          if (!ws.config.dashboard_layout) {
            ws.config.dashboard_layout = { lg: defaultLayout };
          }
          setWorkspace(ws);
        }
      } catch (err) {
        console.error('Failed to fetch workspace', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspace();
  }, []);

  const handleLayoutChange = async (layout: any, allLayouts: any) => {
    if (!workspace) return;
    try {
      const updatedConfig = { ...workspace.config, dashboard_layout: allLayouts };
      await axios.patch(`http://localhost:8000/api/workspaces/${workspace.id}`, {
        config: updatedConfig
      });
      setWorkspace({ ...workspace, config: updatedConfig });
    } catch (e) {
      console.error('Failed to save layout', e);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-500 animate-pulse">Loading Workspace...</div>;
  }

  if (!workspace) {
    return <div className="p-8 text-zinc-500">No active workspace found. Create one to begin.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-[#121215] p-4 rounded-xl border border-zinc-800/50">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">{workspace.name}</h2>
          <p className="text-sm text-zinc-500">Persona: {workspace.persona_type}</p>
        </div>
      </div>
      
      <CockpitGrid 
        workspaceId={workspace.id}
        layouts={workspace.config?.dashboard_layout || { lg: defaultLayout }}
        onLayoutChange={handleLayoutChange}
      />
    </div>
  );
};
