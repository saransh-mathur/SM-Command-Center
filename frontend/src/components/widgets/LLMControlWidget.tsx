import React, { useState } from 'react';
import { Settings, Cpu, Cloud, Zap } from 'lucide-react';

export const LLMControlWidget = ({ workspaceId, widgetId, isEditMode }: any) => {
  const [provider, setProvider] = useState('ollama');
  const [model, setModel] = useState('llama3');
  const [temperature, setTemperature] = useState(0.7);

  return (
    <div className="flex flex-col h-full w-full p-4 bg-[#121215]">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-violet-500" />
        <h3 className="text-zinc-100 font-semibold">AI Control Panel</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">PROVIDER</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setProvider('ollama')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm transition-all ${
                provider === 'ollama' 
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
              }`}
            >
              <Cpu className="w-4 h-4" /> Local (Ollama)
            </button>
            <button
              onClick={() => setProvider('openai')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm transition-all ${
                provider === 'openai' 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
              }`}
            >
              <Cloud className="w-4 h-4" /> External API
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">MODEL</label>
          <select 
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-100 outline-none"
          >
            {provider === 'ollama' ? (
              <>
                <option value="llama3">Llama 3 (8B)</option>
                <option value="mistral">Mistral (7B)</option>
              </>
            ) : (
              <>
                <option value="gpt-4o">GPT-4o</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              </>
            )}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-zinc-400">TEMPERATURE</label>
            <span className="text-xs text-zinc-500">{temperature.toFixed(1)}</span>
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

        <button className="w-full py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm font-semibold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" /> Save Strategy
        </button>
      </div>
    </div>
  );
};
