import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Activity, CheckCircle2, ChevronRight, Brain, Palette, Server } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

export const SetupWizard: React.FC = () => {
  const { telemetry, refreshSetupStatus } = useDashboard();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [dashboardName, setDashboardName] = useState("Command Center");
  const [accentColor, setAccentColor] = useState("emerald");
  const [activeModules, setActiveModules] = useState<string[]>(["cockpit", "mba", "courses", "career"]);
  
  const [llmProvider, setLlmProvider] = useState("ollama");
  const [llmApiKey, setLlmApiKey] = useState("");
  const [llmModel, setLlmModel] = useState("llama3");

  const toggleModule = (id: string) => {
    setActiveModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const completeSetup = async () => {
    setIsSubmitting(true);
    try {
      await fetch('http://localhost:8000/api/setup/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboard_name: dashboardName,
          accent_color: accentColor,
          active_modules: activeModules,
          llm_provider: llmProvider,
          llm_api_key: llmApiKey || null,
          llm_model: llmModel,
          setup_completed: true
        })
      });
      await refreshSetupStatus();
    } catch (e) {
      console.error("Failed to save setup", e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#09090b] z-[9999] flex flex-col items-center justify-center p-6 text-zinc-100 font-mono">
      <div className="max-w-2xl w-full bg-[#121215] border border-zinc-800/50 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-zinc-800 w-full">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-wider mb-2">INITIALIZING COMMAND CENTER</h1>
          <p className="text-sm text-zinc-400">First-time configuration wizard.</p>
        </div>

        {/* STEP 1: Auto Discovery */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Activity className="w-4 h-4 text-emerald-400" /> SYSTEM AUTO-DISCOVERY
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#09090b] p-4 rounded-lg border border-zinc-800/30">
                <div className="text-xs text-zinc-500 mb-1">CPU THREADS</div>
                <div className="text-lg font-bold">{telemetry?.cpuLoad !== undefined ? 'Active' : 'Scanning...'}</div>
              </div>
              <div className="bg-[#09090b] p-4 rounded-lg border border-zinc-800/30">
                <div className="text-xs text-zinc-500 mb-1">MEMORY (RAM)</div>
                <div className="text-lg font-bold">{telemetry?.ramTotal || '...'} GB Total</div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg text-xs leading-relaxed">
              <strong>Hardware Detected!</strong> The backend services are online and streaming live telemetry. We will automatically configure hardware monitoring logic for your local machine.
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full mt-4 bg-zinc-100 text-zinc-900 font-bold py-3 rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Preferences & Modules */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Palette className="w-4 h-4 text-emerald-400" /> DASHBOARD PREFERENCES
            </h2>

            <div className="space-y-3">
              <label className="text-xs text-zinc-400">DASHBOARD NAME</label>
              <input 
                type="text" 
                value={dashboardName}
                onChange={e => setDashboardName(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="e.g. Alex's Hub"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs text-zinc-400">ACTIVE MODULES</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'cockpit', label: 'Overview (Cockpit)' },
                  { id: 'mba', label: 'MBA Copilot' },
                  { id: 'courses', label: 'Course Lab' },
                  { id: 'career', label: 'Career & Jobs' }
                ].map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => toggleModule(mod.id)}
                    className={`p-3 text-left border rounded-md text-sm transition-all ${
                      activeModules.includes(mod.id) 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-800 bg-[#09090b] text-zinc-500 hover:border-zinc-600'
                    }`}
                  >
                    <div className="font-semibold">{mod.label}</div>
                    <div className="text-[10px] mt-1 opacity-70">
                      {activeModules.includes(mod.id) ? 'Enabled' : 'Disabled'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-4 py-3 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700">Back</button>
              <button 
                onClick={() => setStep(3)}
                className="flex-1 bg-zinc-100 text-zinc-900 font-bold py-3 rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                Configure AI Brain <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AI Brain Configuration */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Brain className="w-4 h-4 text-emerald-400" /> AI BRAIN CONFIGURATION
            </h2>

            <p className="text-xs text-zinc-400 mb-4">
              Select the LLM provider to power your digital advisors. Local models are free and private, while cloud providers are faster and more capable.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['ollama', 'openai', 'anthropic', 'gemini'].map(prov => (
                <button
                  key={prov}
                  onClick={() => setLlmProvider(prov)}
                  className={`p-2 text-center border rounded-md text-xs uppercase font-bold transition-all ${
                    llmProvider === prov
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-800 bg-[#09090b] text-zinc-500 hover:border-zinc-600'
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>

            <div className="space-y-4 bg-[#09090b] p-4 rounded-md border border-zinc-800/30">
              {llmProvider === 'ollama' ? (
                <div className="text-xs text-zinc-400">
                  <span className="text-emerald-400 font-bold block mb-2">Local Mode (Ollama)</span>
                  Make sure Ollama is installed and running on port 11434. 
                  Run <code className="bg-zinc-800 px-1 rounded">ollama pull llama3</code> in your terminal if you don't have a model yet.
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs text-zinc-400">{llmProvider.toUpperCase()} API KEY</label>
                  <input 
                    type="password" 
                    value={llmApiKey}
                    onChange={e => setLlmApiKey(e.target.value)}
                    className="w-full bg-[#121215] border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="sk-..."
                  />
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs text-zinc-400">MODEL NAME</label>
                <input 
                  type="text" 
                  value={llmModel}
                  onChange={e => setLlmModel(e.target.value)}
                  className="w-full bg-[#121215] border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder={llmProvider === 'ollama' ? 'llama3' : 'gpt-4o'}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(2)} className="px-4 py-3 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700">Back</button>
              <button 
                onClick={completeSetup}
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500 text-emerald-950 font-bold py-3 rounded-md hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Booting...' : 'Complete Initialization'} <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
