import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Rocket, FileText, Settings, X, PlusCircle } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import axios from 'axios';

export const Omnibar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { addToast, activeView, setActiveView } = useDashboard();
  
  const API_BASE = 'http://localhost:8000/api';
  // Attempt to use a dynamically obtained workspace_id or fallback
  const workspaceId = 'd8121d52-6f0d-42dd-b666-4d27f81215a6';

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        if (!open) {
          setQuery('');
          setSearchResults([]);
        }
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_BASE}/entities/?search=${query}&limit=5`, {
          params: { workspace_id: workspaceId },
          signal: controller.signal
        });
        setSearchResults(res.data.items || []);
      } catch (err: any) {
        if (err.name !== 'CanceledError') {
          console.error('Search failed', err);
        }
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const fireWebhookPayload = async () => {
    try {
      await axios.post(`${API_BASE}/ingestion/webhook/${workspaceId}/task`, {
        source_name: 'Omnibar Manual Trigger',
        entity_type: 'task',
        payload: { title: 'Ad-hoc Task', source: 'omnibar' }
      });
      addToast({ type: 'success', title: 'Webhook Fired', message: 'Payload sent to Celery worker.' });
      setOpen(false);
    } catch (e) {
      addToast({ type: 'error', title: 'Webhook Failed', message: 'Could not fire webhook.' });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <Command label="Command Menu" className="w-full flex flex-col" shouldFilter={false}>
          <div className="flex items-center px-4 py-3 border-b border-zinc-800">
            <Search className="w-5 h-5 text-zinc-500 mr-3 shrink-0" />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 text-lg"
              placeholder="Search entities or type a command..."
            />
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-700">
            {query.length > 0 && searchResults.length === 0 && (
              <Command.Empty className="py-6 text-center text-zinc-500 text-sm">
                No results found for "{query}"
              </Command.Empty>
            )}

            {searchResults.length > 0 && (
              <Command.Group heading="Entities" className="text-xs text-zinc-500 font-semibold px-2 py-1.5 mb-1">
                {searchResults.map((entity) => (
                  <Command.Item
                    key={entity.id}
                    onSelect={() => {
                      addToast({ type: 'info', title: 'Entity Selected', message: `Opened ${entity.title}` });
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 rounded-md cursor-pointer data-[selected=true]:bg-zinc-800/80 data-[selected=true]:text-zinc-100"
                  >
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span>{entity.title}</span>
                    <span className="ml-auto text-xs text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded">{entity.entity_type}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {(query.length === 0 || searchResults.length > 0) && (
              <Command.Group heading="Quick Actions" className="text-xs text-zinc-500 font-semibold px-2 py-1.5 mt-2">
                <Command.Item
                  onSelect={fireWebhookPayload}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 rounded-md cursor-pointer data-[selected=true]:bg-zinc-800/80 data-[selected=true]:text-zinc-100"
                >
                  <Rocket className="w-4 h-4 text-violet-400" />
                  Fire Async Webhook Payload
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    setActiveView('cockpit');
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 rounded-md cursor-pointer data-[selected=true]:bg-zinc-800/80 data-[selected=true]:text-zinc-100"
                >
                  <Settings className="w-4 h-4 text-cyan-400" />
                  Go to Workspace Dashboard
                </Command.Item>
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
