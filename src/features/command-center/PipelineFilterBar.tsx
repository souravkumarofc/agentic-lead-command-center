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
    <div className="absolute top-4 right-4 z-20 pointer-events-auto">
      <div className="glass-panel rounded-xl border border-ops-border shadow-2xl backdrop-blur-md overflow-hidden transition-all">
        {/* Toggle Button / Search Bar */}
        <div className="flex items-center gap-2 p-2 bg-ops-surface/90">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads, company, ID..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-ops-card/90 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ops-cyan w-48 sm:w-64"
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs border transition-all ${
              hasActiveFilters
                ? 'bg-cyan-950 text-ops-cyan border-cyan-700'
                : 'bg-ops-card text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-ops-cyan animate-pulse" />
            )}
          </button>
        </div>

        {/* Dropdown Filters Panel */}
        {isOpen && (
          <div className="p-3.5 space-y-3 font-mono text-xs border-t border-ops-border bg-ops-surface/95 max-w-sm">
            {/* Filter by Source */}
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
                Channel Source
              </label>
              <div className="flex flex-wrap gap-1">
                {(['all', 'whatsapp', 'website', 'facebook', 'email'] as const).map((src) => (
                  <button
                    key={src}
                    onClick={() => setFilters({ source: src })}
                    className={`px-2 py-1 rounded text-[11px] uppercase transition-colors ${
                      filters.source === src
                        ? 'bg-cyan-950 text-ops-cyan border border-cyan-800 font-bold'
                        : 'bg-ops-card text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Assigned Agent */}
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
                Assigned AI Agent
              </label>
              <div className="flex flex-wrap gap-1">
                {(['all', ...Object.keys(AI_AGENTS)] as (AgentId | 'all')[]).map((agId) => {
                  const label = agId === 'all' ? 'All Agents' : AI_AGENTS[agId]?.name.split(' ')[0];
                  return (
                    <button
                      key={agId}
                      onClick={() => setFilters({ agentId: agId })}
                      className={`px-2 py-1 rounded text-[11px] transition-colors ${
                        filters.agentId === agId
                          ? 'bg-purple-950 text-purple-300 border border-purple-800 font-bold'
                          : 'bg-ops-card text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Priority */}
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
                Lead Priority
              </label>
              <div className="flex flex-wrap gap-1">
                {(['all', 'low', 'medium', 'high', 'critical'] as const).map((pri) => (
                  <button
                    key={pri}
                    onClick={() => setFilters({ priority: pri })}
                    className={`px-2 py-1 rounded text-[11px] uppercase transition-colors ${
                      filters.priority === pri
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                        : 'bg-ops-card text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {pri}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
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
