import React, { useState, useEffect } from 'react';
import { Settings, Cpu, Cloud, Zap, AlertCircle, Loader2, HardDrive } from 'lucide-react';

interface OllamaModel {
  name: string;
  size: number;
  parameter_size: string;
  quantization: string;
  family: string;
}

export const LLMControlWidget = ({ workspaceId, widgetId, isEditMode }: any) => {
  const [provider, setProvider] = useState('ollama');
  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [ollamaStatus, setOllamaStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [defaultChatModel, setDefaultChatModel] = useState('');
  const [defaultEmbedModel, setDefaultEmbedModel] = useState('');

  useEffect(() => {
    if (provider === 'ollama') {
      fetchModels();
    }
  }, [provider]);

  const fetchModels = async () => {
    setOllamaStatus('loading');
    try {
      const resp = await fetch('/api/ai/models');
      if (!resp.ok) {
        setOllamaStatus('offline');
        return;
      }
      const data = await resp.json();
      setModels(data.models || []);
      setDefaultChatModel(data.default_chat_model || '');
      setDefaultEmbedModel(data.default_embed_model || '');
      if (data.models?.length > 0 && !model) {
        setModel(data.default_chat_model || data.models[0].name);
      }
      setOllamaStatus('online');
    } catch {
      setOllamaStatus('offline');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + ' GB';
    if (bytes >= 1e6) return (bytes / 1e6).toFixed(0) + ' MB';
    return bytes + ' B';
  };

  return (
    <div className="flex flex-col h-full w-full p-4 bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-violet-500" />
          <h3 className="text-stone-800 font-semibold">AI Control Panel</h3>
        </div>
        {provider === 'ollama' && (
          <div className={`flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${
            ollamaStatus === 'online' ? 'bg-emerald-50 text-emerald-600' :
            ollamaStatus === 'offline' ? 'bg-red-50 text-red-500' :
            'bg-stone-100 text-stone-400'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              ollamaStatus === 'online' ? 'bg-emerald-400 animate-pulse' :
              ollamaStatus === 'offline' ? 'bg-red-400' :
              'bg-stone-300 animate-pulse'
            }`} />
            {ollamaStatus === 'online' ? 'Connected' : ollamaStatus === 'offline' ? 'Offline' : 'Checking...'}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-500">PROVIDER</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setProvider('ollama')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm transition-all ${
                provider === 'ollama' 
                  ? 'bg-violet-50 border-violet-300 text-violet-600 shadow-sm' 
                  : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50 shadow-sm'
              }`}
            >
              <Cpu className="w-4 h-4" /> Local (Ollama)
            </button>
            <button
              onClick={() => setProvider('openai')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm transition-all ${
                provider === 'openai' 
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-600 shadow-sm' 
                  : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50 shadow-sm'
              }`}
            >
              <Cloud className="w-4 h-4" /> External API
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-500">MODEL</label>
          {provider === 'ollama' ? (
            <>
              {ollamaStatus === 'loading' && (
                <div className="flex items-center gap-2 py-2 px-3 bg-stone-50 rounded-lg text-xs text-stone-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading models...
                </div>
              )}
              {ollamaStatus === 'offline' && (
                <div className="flex items-center gap-2 py-2 px-3 bg-red-50 rounded-lg text-xs text-red-500">
                  <AlertCircle className="w-3.5 h-3.5" /> Cannot reach Ollama. Run `ollama serve`.
                </div>
              )}
              {ollamaStatus === 'online' && (
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-lg p-2 text-sm text-stone-800 outline-none shadow-sm"
                >
                  {models.map(m => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({m.parameter_size})
                    </option>
                  ))}
                </select>
              )}
              {ollamaStatus === 'online' && models.find(m => m.name === model) && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {[{
                    label: formatSize(models.find(m => m.name === model)!.size),
                    icon: <HardDrive className="w-3 h-3" />
                  }, {
                    label: models.find(m => m.name === model)!.family,
                  }, {
                    label: models.find(m => m.name === model)!.quantization,
                  }].map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-md">
                      {tag.icon}{tag.label}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <select 
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-lg p-2 text-sm text-stone-800 outline-none shadow-sm"
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            </select>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-stone-500">TEMPERATURE</label>
            <span className="text-xs text-stone-500">{temperature.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>

        <button className="w-full py-2 bg-emerald-50 text-emerald-600 border border-emerald-300 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 shadow-sm">
          <Zap className="w-4 h-4" /> Save Strategy
        </button>
      </div>
    </div>
  );
};
