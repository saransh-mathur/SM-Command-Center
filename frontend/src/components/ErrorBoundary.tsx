import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Command Center UI:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('sm_daily_targets');
      localStorage.removeItem('sm_career_apps');
      localStorage.removeItem('sm_udemy_courses');
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel rounded-2xl border border-rose-500/40 p-6 shadow-2xl bg-slate-900/90 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h2 className="text-lg font-bold text-white mb-2">
              Command Center Diagnostics Recovery
            </h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              A state schema mismatch was detected. Resetting local cache will resolve this immediately.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-950 text-left text-[11px] font-mono text-rose-300 border border-slate-800 mb-4 max-h-32 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-glow-emerald"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Cache &amp; Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
