import React, { useState } from 'react';
import { Lock, Terminal, ShieldAlert, ArrowRight } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

export const Login: React.FC = () => {
  const { login } = useDashboard();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        const data = await res.json();
        login(data.token);
      } else {
        setError("Invalid password. Check your terminal.");
      }
    } catch (e) {
      setError("Backend is unreachable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#09090b] z-[9999] flex flex-col items-center justify-center p-6 text-zinc-100 font-mono">
      <div className="max-w-md w-full bg-[#121215] border border-zinc-800/50 rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold tracking-wider mb-2">RESTRICTED ACCESS</h1>
          <p className="text-xs text-zinc-400">Please enter the admin password generated in your backend terminal on startup.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder="sm-admin-..."
                className="w-full bg-[#09090b] border border-zinc-800 rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 p-3 rounded-md border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" /> {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full bg-zinc-100 text-zinc-900 font-bold py-3 rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Unlock System'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
