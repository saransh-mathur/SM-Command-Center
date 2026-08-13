import React, { useState, useEffect } from 'react';
import { Settings, Shield, RefreshCw, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export const IntegrationHubWidget = ({ workspaceId, isEditMode }: any) => {
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  const MODULES = [
    { id: 'file_upload', label: 'File Upload', keyField: 'storage_path', keyLabel: 'Storage Path', icon: '📁' },
    { id: 'youtube', label: 'YouTube Analytics', keyField: 'api_key', keyLabel: 'API Key', icon: '▶️' },
    { id: 'stripe', label: 'Stripe Webhooks', keyField: 'webhook_secret', keyLabel: 'Webhook Secret', icon: '💳' },
    { id: 'custom_rest', label: 'Custom REST API', keyField: 'bearer_token', keyLabel: 'Bearer Token', icon: '🌐' }
  ];

  useEffect(() => {
    if (workspaceId) {
      fetchConfigs();
    }
  }, [workspaceId]);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/integrations/config?workspace_id=${workspaceId}`);
      setConfigs(res.data?.integrations || {});
    } catch (err) {
      console.warn("Could not fetch integrations config. Initializing empty.");
      setConfigs({});
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (moduleId: string) => {
    if (isEditMode) return;
    setConfigs((prev: any) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        active: !prev[moduleId]?.active
      }
    }));
  };

  const handleConfigChange = (moduleId: string, field: string, value: string) => {
    if (isEditMode) return;
    setConfigs((prev: any) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        config: {
          ...prev[moduleId]?.config,
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    if (isEditMode) return;
    try {
      setSaving(true);
      setStatusMsg({ text: '', type: '' });
      await axios.post(`http://localhost:8000/api/integrations/config`, {
        workspace_id: workspaceId,
        integrations: configs
      });
      setStatusMsg({ text: 'Saved successfully', type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    } catch (err: any) {
      setStatusMsg({ text: 'Failed to save configuration', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-semibold text-slate-900">Integration Hub</h3>
        </div>
        {!isEditMode && (
          <button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Changes
          </button>
        )}
      </div>

      {statusMsg.text && (
        <div className={`mb-3 flex items-center gap-2 text-sm p-2 rounded-lg ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {statusMsg.text}
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <RefreshCw className="w-6 h-6 text-stone-400 animate-spin" />
          </div>
        ) : (
          MODULES.map(mod => {
            const isActive = !!configs[mod.id]?.active;
            const configValue = configs[mod.id]?.config?.[mod.keyField] || '';
            
            return (
              <div key={mod.id} className={`p-3 rounded-xl border transition-all ${isActive ? 'bg-white/90 border-emerald-200 shadow-sm' : 'bg-white/40 border-stone-100'} ${isEditMode ? 'opacity-70' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{mod.icon}</span>
                    <span className="font-medium text-stone-800 text-sm">{mod.label}</span>
                  </div>
                  <button 
                    onClick={() => handleToggle(mod.id)}
                    disabled={isEditMode}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-stone-300'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
                
                {isActive && (
                  <div className="mt-3 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-4 w-4 text-stone-400" />
                    </div>
                    <input
                      type="password"
                      placeholder={`Enter ${mod.keyLabel}`}
                      value={configValue}
                      disabled={isEditMode}
                      onChange={(e) => handleConfigChange(mod.id, mod.keyField, e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm bg-stone-50/50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
