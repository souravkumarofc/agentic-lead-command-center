import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Activity, 
  Layers, 
  Cpu, 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  PlusCircle
} from 'lucide-react';
import { usePipelineStore } from '../hooks/usePipelineStore';
import { useSimulation } from '../hooks/useSimulation';
import { formatTimeHHMMSS } from '../utils/formatters';

export const Navigation: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedLeadId,
    leads,
    isSimulationRunning,
    setSimulationRunning,
    simulationSpeed,
    setSimulationSpeed,
    resetAll,
    tickCount,
  } = usePipelineStore();

  const { injectLead, stepOnce } = useSimulation();
  const [timeStr, setTimeStr] = useState(formatTimeHHMMSS());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(formatTimeHHMMSS());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCount = leads.filter((l) => l.currentStage !== 'won').length;

  return (
    <header className="sticky top-0 z-50 w-full max-w-full border-b border-ops-border bg-ops-bg/95 backdrop-blur-md">
      {/* Primary Top Bar */}
      <div className="h-14 sm:h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Brand & System Status */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-ops-surface border border-cyan-500/40 shadow-inner flex-shrink-0">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-ops-cyan animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 ring-2 ring-ops-bg" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-slate-100 uppercase truncate">
                  Agentic Ops
                </span>
                <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded bg-cyan-950/80 text-ops-cyan border border-cyan-800/60 font-mono flex-shrink-0">
                  v2.4
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ONLINE</span>
                <span className="text-slate-600">|</span>
                <span>TICK #{tickCount}</span>
              </div>
            </div>
          </div>

          {/* System Time Ticker (Large screens only) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded bg-ops-surface/80 border border-ops-border font-mono text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-ops-cyan animate-pulse" />
            <span>UTC {timeStr}</span>
          </div>
        </div>

        {/* Primary Desktop Navigation Tabs (>= md) */}
        <nav className="hidden md:flex items-center p-1 rounded-lg bg-ops-surface border border-ops-border flex-shrink-0">
          <button
            id="nav-dashboard-tab"
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'dashboard'
                ? 'bg-ops-card text-ops-cyan border border-cyan-500/30 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Operations Dashboard</span>
          </button>

          <button
            id="nav-command-center-tab"
            onClick={() => setActiveView('command-center')}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'command-center'
                ? 'bg-ops-card text-ops-cyan border border-cyan-500/30 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Activity className="w-4 h-4 text-ops-cyan-glow" />
            <span>3D Command Center</span>
            <span className="flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/50">
              {activeCount}
            </span>
          </button>

          <button
            id="nav-lead-journey-tab"
            onClick={() => setActiveView('lead-journey')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'lead-journey'
                ? 'bg-ops-card text-ops-amber border border-amber-500/30 shadow-sm font-semibold'
                : selectedLeadId
                ? 'text-amber-400/80 hover:text-amber-300 hover:bg-slate-800/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Lead Journey</span>
            {selectedLeadId ? (
              <span className="font-mono text-[10px] text-amber-300">({selectedLeadId})</span>
            ) : (
              <span className="font-mono text-[10px] text-slate-500">(Catalog)</span>
            )}
          </button>
        </nav>

        {/* Simulation Controls & Quick Ingestion */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Simulation Play / Pause / Speed */}
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg bg-ops-surface border border-ops-border">
            <button
              id="sim-toggle-btn"
              onClick={() => setSimulationRunning(!isSimulationRunning)}
              title={isSimulationRunning ? 'Pause simulation engine' : 'Resume simulation engine'}
              className={`p-1 sm:p-1.5 rounded transition-colors ${
                isSimulationRunning
                  ? 'text-emerald-400 hover:bg-emerald-950/40'
                  : 'text-amber-400 hover:bg-amber-950/40'
              }`}
            >
              {isSimulationRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            {!isSimulationRunning && (
              <button
                id="sim-step-btn"
                onClick={stepOnce}
                title="Step forward 1 tick"
                className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono text-slate-300 hover:bg-slate-800 border border-slate-700"
              >
                Step
              </button>
            )}

            {/* Speed Presets */}
            <div className="hidden sm:flex items-center gap-0.5 ml-1 border-l border-slate-800 pl-1">
              {([1, 2, 5] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimulationSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                    simulationSpeed === spd
                      ? 'bg-cyan-950 text-ops-cyan border border-cyan-800/80'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              id="sim-reset-btn"
              onClick={resetAll}
              title="Reset simulation to initial state"
              className="hidden sm:block p-1.5 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Inject Lead CTA */}
          <button
            id="quick-inject-lead-btn"
            onClick={() => injectLead()}
            title="Inject new synthetic lead into pipeline"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-ops-cyan/10 text-ops-cyan border border-ops-cyan/40 hover:bg-ops-cyan/20 transition-all text-xs font-mono font-medium shadow-sm hover:border-ops-cyan flex-shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Inject</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Tab Navigation Strip (< md) */}
      <div className="flex md:hidden border-t border-ops-border/70 bg-ops-surface/80 px-2 py-1.5 w-full">
        <nav className="grid grid-cols-3 gap-1.5 w-full p-1 rounded-xl bg-ops-bg border border-ops-border text-center font-mono">
          <button
            id="mobile-nav-dashboard-tab"
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-lg text-xs font-medium transition-all ${
              activeView === 'dashboard'
                ? 'bg-ops-card text-ops-cyan border border-cyan-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Dashboard</span>
          </button>

          <button
            id="mobile-nav-command-center-tab"
            onClick={() => setActiveView('command-center')}
            className={`relative flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-lg text-xs font-medium transition-all ${
              activeView === 'command-center'
                ? 'bg-ops-card text-ops-cyan border border-cyan-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 flex-shrink-0 text-ops-cyan" />
            <span className="truncate">3D Hub</span>
            <span className="px-1 py-0.2 rounded-full text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/50 flex-shrink-0">
              {activeCount}
            </span>
          </button>

          <button
            id="mobile-nav-lead-journey-tab"
            onClick={() => setActiveView('lead-journey')}
            className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-xs font-medium transition-all ${
              activeView === 'lead-journey'
                ? 'bg-ops-card text-ops-amber border border-amber-500/40 shadow-sm font-bold'
                : selectedLeadId
                ? 'text-amber-400/90'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Journey</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
