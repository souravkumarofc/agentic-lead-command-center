import React from 'react';
import { Bot } from 'lucide-react';
import { AGENT_LIST } from '../../data/agentsData';
import { PipelineMetrics } from '../../types/pipeline';

interface AgentWorkloadMatrixProps {
  agentWorkload: PipelineMetrics['agentWorkload'];
}

export const AgentWorkloadMatrix: React.FC<AgentWorkloadMatrixProps> = ({ agentWorkload }) => {
  return (
    <div className="glass-panel p-5 rounded-xl border border-ops-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
            <Bot className="w-4 h-4 text-ops-cyan" />
            AI Autonomous Agent Fleet
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Active workload allocation and throughput metrics per neural worker
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
          4 OF 4 ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AGENT_LIST.map((agent) => {
          const liveLoad = agentWorkload[agent.id] ?? agent.activeLeadsCount;

          return (
            <div
              key={agent.id}
              className="p-3.5 rounded-lg bg-ops-surface/70 border border-ops-border hover:border-slate-600 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-ops-card border border-slate-700 flex items-center justify-center text-base shadow-sm">
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-200 group-hover:text-ops-cyan transition-colors">
                      {agent.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{agent.role}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                    agent.status === 'processing'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                      : agent.status === 'routing'
                      ? 'bg-purple-950 text-purple-300 border-purple-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/70 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Load</div>
                  <div className="text-xs font-bold text-slate-100 flex items-center justify-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: agent.colorHex }}
                    />
                    {liveLoad} leads
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Processed</div>
                  <div className="text-xs font-bold text-slate-300">
                    {agent.totalProcessed}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Latency</div>
                  <div className="text-xs font-bold text-slate-300">
                    {agent.avgResolutionTimeSec}s
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
