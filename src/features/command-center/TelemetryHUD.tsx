import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck 
} from 'lucide-react';
import { PipelineMetrics } from '../../types/pipeline';
import { formatCurrency } from '../../utils/formatters';

interface TelemetryHUDProps {
  metrics: PipelineMetrics;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ metrics }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-20 pointer-events-auto">
      <div className="glass-panel rounded-xl border border-ops-border shadow-2xl backdrop-blur-md overflow-hidden transition-all w-72 sm:w-80">
        {/* Header bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-ops-surface/80 border-b border-ops-border">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ops-cyan" />
            </span>
            <span className="font-mono text-xs font-bold tracking-wider text-slate-100 uppercase">
              Pipeline Telemetry
            </span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible content */}
        {!collapsed && (
          <div className="p-3.5 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-ops-card/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Active In-Flight</div>
                <div className="text-lg font-bold text-slate-100 mt-0.5">
                  {metrics.totalActiveLeads}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-ops-card/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Won Value</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">
                  {formatCurrency(metrics.wonTodayValue)}
                </div>
              </div>
            </div>

            {/* Micro Stage Breakdown */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                <span>STAGE DISTRIBUTION</span>
                <span>TOTAL: {metrics.totalActiveLeads + metrics.wonTodayCount}</span>
              </div>
              <div className="grid grid-cols-6 gap-1 text-center text-[10px]">
                {Object.entries(metrics.stageDistribution).map(([stage, count]) => (
                  <div key={stage} className="p-1 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[9px] text-slate-400 uppercase truncate">
                      {stage.substring(0, 3)}
                    </div>
                    <div className="font-bold text-slate-100">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick status indicator */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ROUTING_HEURISTICS: NOMINAL</span>
              </div>
              <span className="text-ops-cyan">LATENCY 24ms</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
