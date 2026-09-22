import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070A0F] text-slate-100 flex items-center justify-center p-6 font-mono">
          <div className="glass-panel p-8 rounded-2xl border border-rose-500/40 shadow-2xl max-w-lg w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              Operations Console Exception Caught
            </h2>
            <p className="text-xs text-slate-400">
              {this.state.error?.message || 'An unexpected rendering anomaly occurred in the pipeline UI.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ops-cyan text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-colors shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recover Console</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
