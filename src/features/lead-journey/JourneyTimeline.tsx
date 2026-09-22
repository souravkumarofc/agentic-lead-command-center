import React, { useState } from 'react';
import { 
  Circle, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  FileCode, 
  CheckCircle2, 
  ArrowRight,
  Activity,
  Send,
  DollarSign
} from 'lucide-react';
import { Lead, LeadEvent } from '../../types/pipeline';
import { STAGE_COLORS } from '../../utils/colors';

interface JourneyTimelineProps {
  lead: Lead;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ lead }) => {
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  const toggleEvent = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getEventIcon = (evt: LeadEvent) => {
    switch (evt.type) {
      case 'lead_ingested':
        return <Activity className="w-3.5 h-3.5 text-cyan-400" />;
      case 'qualification_started':
      case 'qualification_passed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'agent_assigned':
      case 'agent_handoff':
        return <ArrowRight className="w-3.5 h-3.5 text-purple-400" />;
      case 'followup_dispatched':
        return <Send className="w-3.5 h-3.5 text-amber-400" />;
      case 'deal_created':
        return <DollarSign className="w-3.5 h-3.5 text-rose-400" />;
      case 'deal_won':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-ops-border space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-ops-cyan" />
            Chronological Lifecycle Journey
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable audit trail of state transitions, heuristic scans, and agent interventions
          </p>
        </div>
        <span className="font-mono text-xs text-slate-400">
          {lead.history.length} LIFECYCLE EVENTS
        </span>
      </div>

      {/* Main Timeline Stack */}
      <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-indigo-500 before:to-emerald-500">
        {lead.history.map((evt) => {
          const isExpanded = !expandedEvents[evt.id];
          const stageConfig = evt.toStage ? STAGE_COLORS[evt.toStage] : null;

          return (
            <div key={evt.id} className="relative group font-mono text-xs">
              {/* Timeline node bullet with dynamic icon */}
              <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-ops-bg border border-slate-700 flex items-center justify-center shadow-md group-hover:border-ops-cyan transition-colors">
                {getEventIcon(evt)}
              </div>

              {/* Event card */}
              <div className="p-4 rounded-xl bg-ops-surface/80 border border-slate-800/90 hover:border-slate-600 transition-all">
                <div
                  onClick={() => toggleEvent(evt.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-100 text-sm">
                      {evt.timestamp}
                    </span>
                    <span className="text-slate-600">—</span>
                    <span className="font-bold text-slate-200 text-sm group-hover:text-ops-cyan transition-colors">
                      {evt.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {evt.toStage && (
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded border border-slate-700 ${stageConfig?.bg} ${stageConfig?.text}`}>
                        {evt.toStage}
                      </span>
                    )}

                    <button className="p-1 rounded text-slate-500 hover:text-slate-300">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-1.5 font-sans leading-relaxed">
                  {evt.description}
                </p>

                {/* Expandable Technical Metadata & Payloads */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <FileCode className="w-3 h-3 text-ops-cyan" />
                      <span>TELEMETRY_PAYLOAD</span>
                    </div>
                    <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 overflow-x-auto text-[10px]">
                      {JSON.stringify(
                        {
                          eventId: evt.id,
                          leadId: evt.leadId,
                          eventType: evt.type,
                          isoDate: evt.isoDate,
                          fromStage: evt.fromStage || 'none',
                          toStage: evt.toStage || 'none',
                          agentId: evt.agentId || 'none',
                          metadata: evt.metadata || {},
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
