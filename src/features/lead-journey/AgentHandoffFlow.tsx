import React from 'react';
import { Bot } from 'lucide-react';
import { Lead } from '../../types/pipeline';
import { AI_AGENTS } from '../../data/agentsData';

interface AgentHandoffFlowProps {
  lead: Lead;
}

export const AgentHandoffFlow: React.FC<AgentHandoffFlowProps> = ({ lead }) => {
  // Extract all agent-related events
  const agentEvents = lead.history.filter(
    (e) => e.agentId !== undefined || e.type.includes('agent')
  );

  return (
    <div className="glass-panel p-5 rounded-2xl border border-ops-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          Autonomous Agent Handoff Sequence
        </h3>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
          NEURAL WORKFLOW
        </span>
      </div>

      {agentEvents.length === 0 ? (
        <div className="p-4 rounded-xl bg-ops-surface/40 border border-slate-800 text-center text-slate-500 font-mono text-xs">
          No agent assigned yet. Lead is currently in automated heuristic qualification queue.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agentEvents.map((evt, idx) => {
            const agent = evt.agentId ? AI_AGENTS[evt.agentId] : null;

            return (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl bg-ops-surface/80 border border-slate-800 font-mono text-xs hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-500 uppercase">
                    Step {idx + 1} • {evt.timestamp}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {evt.type === 'agent_handoff' ? 'Handoff' : 'Assignment'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-ops-card border border-slate-700 flex items-center justify-center text-sm">
                    {agent ? agent.avatar : '🤖'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-200">
                      {agent ? agent.name : 'Pipeline Router'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {agent ? agent.role : 'Autonomous Dispatch'}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  {evt.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
