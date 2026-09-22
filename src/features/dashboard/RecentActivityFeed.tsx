import React from 'react';
import { Activity, ExternalLink } from 'lucide-react';
import { usePipelineStore } from '../../hooks/usePipelineStore';

export const RecentActivityFeed: React.FC = () => {
  const { leads, setActiveView, selectLead } = usePipelineStore();

  // Aggregate all events across all leads, sorted by newest first
  const allEvents = React.useMemo(() => {
    const list: Array<{
      leadId: string;
      leadName: string;
      company: string;
      timestamp: string;
      isoDate: string;
      title: string;
      description: string;
      stage?: string;
    }> = [];

    leads.forEach((l) => {
      l.history.forEach((h) => {
        list.push({
          leadId: l.id,
          leadName: l.name,
          company: l.company,
          timestamp: h.timestamp,
          isoDate: h.isoDate,
          title: h.title,
          description: h.description,
          stage: h.toStage || l.currentStage,
        });
      });
    });

    // Sort descending by ISO date or timestamp
    return list
      .sort((a, b) => (b.isoDate > a.isoDate ? 1 : -1))
      .slice(0, 8);
  }, [leads]);

  const handleLeadClick = (leadId: string) => {
    selectLead(leadId);
    setActiveView('lead-journey', leadId);
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-ops-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-ops-cyan" />
            Live Event Stream
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time autonomous audit trail of state transitions & agent dispatches
          </p>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 animate-pulse">
          STREAM ACTIVE
        </span>
      </div>

      <div className="divide-y divide-slate-800/60 font-mono">
        {allEvents.map((evt, idx) => (
          <div
            key={`${evt.leadId}-${idx}`}
            className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 hover:bg-slate-800/20 px-2 rounded transition-colors group"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-[11px] text-slate-500 font-mono mt-0.5 whitespace-nowrap">
                {evt.timestamp}
              </span>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-ops-cyan transition-colors flex items-center gap-2">
                  <span>{evt.title}</span>
                  {evt.stage && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {evt.stage}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {evt.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleLeadClick(evt.leadId)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-ops-cyan px-2 py-1 rounded hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              <span>{evt.leadId}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
