import React from 'react';
import { Activity, UploadCloud, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const MetricTrackerWidget = ({ workspaceId, widgetId, isEditMode }: any) => {
  const [definitions, setDefinitions] = React.useState<any[]>([]);
  const [dailyData, setDailyData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  
  const storageKey = `metric_selection_${workspaceId}_${widgetId}`;
  
  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const fetchMetrics = React.useCallback(async () => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }
    try {
      const [defRes, dailyRes] = await Promise.all([
        fetch(`http://localhost:8000/api/metrics/definitions?workspace_id=${workspaceId}`),
        fetch(`http://localhost:8000/api/metrics/daily?workspace_id=${workspaceId}`)
      ]);
      
      if (defRes.ok && dailyRes.ok) {
        const defs = await defRes.json();
        setDefinitions(defs);
        setDailyData(await dailyRes.json());
        
        if (selectedMetrics.length === 0 && defs.length > 0 && !localStorage.getItem(storageKey)) {
          const allIds = defs.map((d: any) => d.id);
          setSelectedMetrics(allIds);
          localStorage.setItem(storageKey, JSON.stringify(allIds));
        }
        
        setError('');
      } else {
        setError('Failed to fetch metrics data');
      }
    } catch (err) {
      setError('Network error loading metrics');
    } finally {
      setLoading(false);
    }
  }, [workspaceId, selectedMetrics.length, storageKey]);

  React.useEffect(() => {
    fetchMetrics();
    if (isEditMode) return;
    
    const interval = setInterval(() => {
      fetchMetrics();
    }, 10000); // 10 seconds polling
    
    return () => clearInterval(interval);
  }, [fetchMetrics, isEditMode]);

  const toggleMetric = (defId: string) => {
    setSelectedMetrics(prev => {
      const next = prev.includes(defId) ? prev.filter(id => id !== defId) : [...prev, defId];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const visibleDefinitions = isEditMode 
    ? definitions 
    : definitions.filter(def => selectedMetrics.includes(def.id));

  return (
    <div className="flex flex-col h-full w-full p-4 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          <h3 className="text-stone-800 font-semibold">{isEditMode ? 'Configure Metrics' : 'Live Metrics'}</h3>
        </div>
        {!isEditMode && <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-xs text-stone-400">Live</span></div>}
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading && <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 text-stone-400 animate-spin" /></div>}
        {error && <div className="text-sm text-red-500 text-center mt-4">{error}</div>}
        
        {!loading && !error && isEditMode && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-stone-500 mb-2">Select metrics to display on this widget:</p>
            {definitions.map(def => (
              <label key={def.id} className="flex items-center gap-3 p-3 bg-white/60 border border-stone-200 rounded-lg cursor-pointer hover:bg-white/80 transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedMetrics.includes(def.id)}
                  onChange={() => toggleMetric(def.id)}
                  className="w-4 h-4 text-emerald-500 border-stone-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-stone-700">{def.label}</span>
              </label>
            ))}
            {definitions.length === 0 && (
              <div className="text-sm text-stone-400 italic">No metrics defined for this workspace.</div>
            )}
          </div>
        )}

        {!loading && !error && !isEditMode && visibleDefinitions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 text-sm">
            {definitions.length === 0 ? 'No metrics defined for this workspace.' : 'No metrics selected. Edit layout to configure.'}
          </div>
        )}
        
        {!loading && !error && !isEditMode && visibleDefinitions.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {visibleDefinitions.map((def: any) => {
              const currentVal = dailyData?.metrics?.[def.key] ?? 0;
              const targetVal = dailyData?.targets?.[def.key] ?? def.default_target;
              const progress = targetVal > 0 ? Math.min(100, Math.round((currentVal / targetVal) * 100)) : 0;
              
              return (
                <div key={def.id} className="bg-white/60 border border-stone-200 rounded-lg p-3 flex flex-col">
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1 truncate">{def.label}</div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold text-stone-800 leading-none">{currentVal}</span>
                    <span className="text-xs text-stone-400 leading-relaxed mb-0.5">/ {targetVal}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
  const [messages, setMessages] = React.useState<Array<{role: string, content: string, isError?: boolean}>>([]);
  const [input, setInput] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [activeTool, setActiveTool] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const getToolDisplayName = (name: string) => {
    const map: Record<string, string> = {
      'update_daily_metric': 'Updating Daily Tracker...',
      'create_quick_note': 'Creating Note...',
      'toggle_integration': 'Toggling Integration...'
    };
    if (map[name]) return map[name];
    const titleCased = name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `Executing ${titleCased}...`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    setActiveTool(null);

    // Add placeholder for assistant response
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const resp = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          workspace_id: workspaceId || null,
          temperature: 0.7,
          use_rag: !!workspaceId,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ detail: 'AI service unavailable' }));
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: errData.detail || 'Something went wrong.',
            isError: true,
          };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const payload = JSON.parse(line.slice(6));
                
                if (payload.tool_call?.name) {
                  setActiveTool(payload.tool_call.name);
                }

                if (payload.token) {
                  setActiveTool(null);
                  setMessages(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    updated[updated.length - 1] = { ...last, content: last.content + payload.token };
                    return updated;
                  });
                }
                if (payload.error) {
                  setActiveTool(null);
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: payload.error,
                      isError: true,
                    };
                    return updated;
                  });
                }
                if (payload.done) {
                  setActiveTool(null);
                  break;
                }
              } catch {}
            }
          }
        }
      }
    } catch (err: any) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Failed to connect to AI service. Is the backend running?',
          isError: true,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      setActiveTool(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">AI Assistant</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-2">
            <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <span className="text-xs">Ask me anything about your workspace</span>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-stone-800 text-white rounded-br-sm'
                  : msg.isError
                    ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-sm'
                    : 'bg-white/80 text-stone-700 border border-stone-100 shadow-sm rounded-bl-sm'
              }`}
            >
              {msg.content}
              {msg.role === 'assistant' && msg.content === '' && isStreaming && !activeTool && (
                <span className="inline-flex gap-1 items-center h-5 text-stone-400">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              )}
              {msg.role === 'assistant' && msg.content === '' && isStreaming && activeTool && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-medium animate-pulse">{getToolDisplayName(activeTool)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-1">
        <div className="flex items-end gap-2 bg-white/80 border border-stone-200 rounded-xl p-1.5 shadow-sm">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isEditMode ? 'Disabled in edit mode' : 'Message the AI...'}
            disabled={isEditMode || isStreaming}
            rows={1}
            className="flex-1 bg-transparent text-sm text-stone-800 outline-none resize-none px-2 py-1.5 placeholder:text-stone-400 max-h-20 overflow-y-auto"
          />
          <button
            onClick={sendMessage}
            disabled={isEditMode || isStreaming || !input.trim()}
            className="p-2 rounded-lg bg-stone-800 text-white hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DocumentUploadWidget = ({ workspaceId, widgetId, isEditMode }: any) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = React.useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (isEditMode) return;
    const validTypes = ['application/pdf', 'text/csv', 'text/markdown', 'text/plain'];
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(selectedFile.type) && !['pdf', 'csv', 'md'].includes(ext || '')) {
      setStatus('error');
      setMessage('Invalid file type. Please upload PDF, CSV, or Markdown.');
      return;
    }
    setFile(selectedFile);
    uploadFile(selectedFile);
  };

  const uploadFile = async (fileToUpload: File) => {
    setStatus('uploading');
    setMessage('');
    const formData = new FormData();
    formData.append('file', fileToUpload);
    if (workspaceId) {
      formData.append('workspace_id', workspaceId);
    }

    try {
      const response = await fetch('http://localhost:8000/api/ingestion/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.status === 202 || response.ok) {
        setStatus('success');
        setMessage('File uploaded and is processing.');
      } else {
        setStatus('error');
        setMessage('Upload failed.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error during upload.');
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4 bg-transparent">
      <h3 className="text-stone-800 font-semibold mb-4">Document Upload</h3>
      <div 
        className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-colors ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-stone-300 bg-stone-50'} ${isEditMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-stone-100'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isEditMode && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.csv,.md,application/pdf,text/csv,text/markdown"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />
        {status === 'idle' && (
          <>
            <UploadCloud className="w-8 h-8 text-stone-400 mb-2" />
            <p className="text-sm text-stone-600 text-center">Drag and drop a file here, or click to select</p>
            <p className="text-xs text-stone-400 mt-1">Supports PDF, CSV, Markdown</p>
          </>
        )}
        {status === 'uploading' && (
          <>
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
            <p className="text-sm text-stone-600">Uploading {file?.name}...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="text-sm text-emerald-700 text-center">{message}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); setStatus('idle'); setFile(null); }}
              className="mt-2 text-xs text-stone-500 hover:text-stone-700"
            >
              Upload another
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-red-600 text-center">{message}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); setStatus('idle'); setFile(null); }}
              className="mt-2 text-xs text-stone-500 hover:text-stone-700"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
};
