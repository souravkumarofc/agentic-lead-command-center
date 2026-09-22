import React from 'react';
import { Lead } from '../../types/pipeline';
import { SOURCE_CONFIG } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatters';
import { AI_AGENTS } from '../../data/agentsData';

interface HoverTooltipProps {
  lead: Lead | null;
  coords: { x: number; y: number } | null;
}

export const HoverTooltip: React.FC<HoverTooltipProps> = ({ lead, coords }) => {
  if (!lead || !coords) return null;

  const sourceConfig = SOURCE_CONFIG[lead.source];
  const agent = lead.assignedAgentId ? AI_AGENTS[lead.assignedAgentId] : null;

  // Offset tooltip slightly away from cursor so it doesn't block raycasting
  const left = Math.min(coords.x + 18, window.innerWidth - 260);
  const top = Math.min(coords.y - 40, window.innerHeight - 180);

  return (
    <div
      className="fixed pointer-events-none z-50 p-3 rounded-lg bg-ops-card/95 backdrop-blur-md border border-cyan-500/50 shadow-2xl font-mono text-xs w-60"
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
        <span className="font-bold text-ops-cyan text-[11px] tracking-wider">{lead.id}</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
          {sourceConfig?.label}
        </span>
      </div>

      <div className="font-bold text-slate-100 text-sm truncate">{lead.name}</div>
      <div className="text-slate-400 text-[11px] truncate mb-2">{lead.company}</div>

      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1.5 border-t border-slate-800/60">
        <div>
          <span className="text-slate-500 block uppercase">Stage</span>
          <span className="font-semibold text-slate-200 capitalize">{lead.currentStage}</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase">Value</span>
          <span className="font-semibold text-emerald-400">{formatCurrency(lead.estimatedValue)}</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase">Score</span>
          <span className="font-semibold text-cyan-300">{lead.score}/100</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase">Agent</span>
          <span className="font-semibold text-purple-300 truncate block">
            {agent ? agent.name.split(' ')[0] : 'Unassigned'}
          </span>
        </div>
      </div>
    </div>
  );
};
