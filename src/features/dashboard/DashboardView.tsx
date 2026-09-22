import React from 'react';
import { usePipelineStore } from '../../hooks/usePipelineStore';
import { MetricCards } from './MetricCards';
import { StageFunnelChart } from './StageFunnelChart';
import { AgentWorkloadMatrix } from './AgentWorkloadMatrix';
import { SourceDistribution } from './SourceDistribution';
import { RecentActivityFeed } from './RecentActivityFeed';
import { Activity, ArrowRight } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { metrics, setActiveView, setFocusedZone } = usePipelineStore();

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Top Banner & Fast Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-ops-surface via-ops-card to-ops-surface border border-ops-border shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-ops-cyan border border-cyan-800/80 uppercase">
              Operations Control
            </span>
            <span className="text-xs font-mono text-slate-400">Autonomous Sales Engine</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold font-mono tracking-tight text-slate-100">
            Enterprise Pipeline Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time multi-agent orchestration coordinating inbound inquiries, heuristic qualification, automated negotiation, and contract execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="launch-command-center-cta"
            onClick={() => {
              setFocusedZone(null);
              setActiveView('command-center');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ops-cyan text-slate-950 font-bold font-mono text-xs hover:bg-cyan-300 transition-all shadow-md hover:shadow-cyan-500/20 group"
          >
            <Activity className="w-4 h-4" />
            <span>Launch 3D Command Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Top Key Metrics */}
      <section>
        <MetricCards metrics={metrics} />
      </section>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stage Funnel & Sources */}
        <div className="lg:col-span-7 space-y-6">
          <StageFunnelChart stageDistribution={metrics.stageDistribution} />
          <SourceDistribution sourceDistribution={metrics.sourceDistribution} />
        </div>

        {/* Right Column: AI Agent Fleet & Activity Feed */}
        <div className="lg:col-span-5 space-y-6">
          <AgentWorkloadMatrix agentWorkload={metrics.agentWorkload} />
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
};
