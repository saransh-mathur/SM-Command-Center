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
  const [messages, setMessages] = React.useState<Array<{role: string, content: string, isError?: boolean}>>([]);
  const [input, setInput] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

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

    // Add placeholder for assistant response
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const resp = await fetch('/api/ai/chat', {
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
                if (payload.token) {
                  setMessages(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    updated[updated.length - 1] = { ...last, content: last.content + payload.token };
                    return updated;
                  });
                }
                if (payload.error) {
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
                if (payload.done) break;
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
              {msg.role === 'assistant' && msg.content === '' && isStreaming && (
                <span className="inline-flex gap-1 items-center text-stone-400">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
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
