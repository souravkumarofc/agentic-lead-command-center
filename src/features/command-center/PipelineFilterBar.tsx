import React, { useState } from 'react';
import { Search, X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { usePipelineStore } from '../../hooks/usePipelineStore';
import { AgentId } from '../../types/pipeline';
import { AI_AGENTS } from '../../data/agentsData';

export const PipelineFilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters } = usePipelineStore();
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filters.source !== 'all' ||
    filters.agentId !== 'all' ||
    filters.priority !== 'all' ||
    filters.searchQuery !== '';

  return (
    <div className="absolute top-14 left-3 right-3 sm:top-4 sm:right-4 sm:left-auto z-20 pointer-events-auto">
      <div className="glass-panel rounded-xl border border-ops-border shadow-2xl backdrop-blur-md overflow-hidden transition-all max-w-full sm:max-w-md">
        {/* Toggle Button / Search Bar */}
        <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-ops-surface/90">
          <div className="relative flex items-center flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads, company, ID..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-ops-card/90 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ops-cyan w-full sm:w-60"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ searchQuery: '' })}
                className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-mono text-xs border transition-all flex-shrink-0 ${
              hasActiveFilters
                ? 'bg-cyan-950 text-ops-cyan border-cyan-700'
                : 'bg-ops-card text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-ops-cyan animate-pulse" />
            )}
          </button>
        </div>

        {/* Dropdown Filters Panel */}
        {isOpen && (
          <div className="p-3 sm:p-3.5 space-y-3 font-mono text-xs border-t border-ops-border bg-ops-surface/95 max-h-[60vh] overflow-y-auto w-full">
            {/* Filter by Source */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase block mb-1.5 font-bold">
                Inbound Channel Source
              </span>
              <div className="grid grid-cols-2 gap-1">
                {(['all', 'whatsapp', 'website', 'facebook', 'email'] as const).map((src) => (
                  <button
                    key={src}
                    onClick={() => setFilters({ source: src })}
                    className={`px-2 py-1 rounded text-[11px] capitalize text-left transition-colors border ${
                      filters.source === src
                        ? 'bg-cyan-950 text-ops-cyan border-cyan-700 font-bold'
                        : 'bg-ops-card/60 text-slate-400 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    {src === 'all' ? 'All Channels' : src}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Assigned Agent */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase block mb-1.5 font-bold">
                Assigned AI Agent
              </span>
              <div className="grid grid-cols-1 gap-1">
                <button
                  onClick={() => setFilters({ agentId: 'all' })}
                  className={`px-2 py-1 rounded text-[11px] text-left transition-colors border ${
                    filters.agentId === 'all'
                      ? 'bg-cyan-950 text-ops-cyan border-cyan-700 font-bold'
                      : 'bg-ops-card/60 text-slate-400 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  All Agents
                </button>
                {(Object.keys(AI_AGENTS) as AgentId[]).map((agentId) => {
                  const agent = AI_AGENTS[agentId];
                  return (
                    <button
                      key={agentId}
                      onClick={() => setFilters({ agentId })}
                      className={`px-2 py-1 rounded text-[11px] text-left transition-colors border flex items-center justify-between ${
                        filters.agentId === agentId
                          ? 'bg-cyan-950 text-ops-cyan border-cyan-700 font-bold'
                          : 'bg-ops-card/60 text-slate-400 border-slate-800 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{agent.name}</span>
                      <span className="text-[9px] text-slate-500">{agent.role.split('&')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Priority */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase block mb-1.5 font-bold">
                Priority Tier
              </span>
              <div className="grid grid-cols-2 gap-1">
                {(['all', 'low', 'medium', 'high', 'critical'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilters({ priority: p })}
                    className={`px-2 py-1 rounded text-[11px] capitalize text-left transition-colors border ${
                      filters.priority === p
                        ? 'bg-cyan-950 text-ops-cyan border-cyan-700 font-bold'
                        : 'bg-ops-card/60 text-slate-400 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    {p === 'all' ? 'All Priorities' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Actions */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-rose-950/40 text-rose-300 border border-rose-900/60 hover:bg-rose-900/40 transition-colors text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
