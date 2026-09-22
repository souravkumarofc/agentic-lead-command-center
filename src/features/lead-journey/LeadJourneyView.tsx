import React from 'react';
import { usePipelineStore } from '../../hooks/usePipelineStore';
import { LeadHeaderCard } from './LeadHeaderCard';
import { StageProgressStepper } from './StageProgressStepper';
import { AgentHandoffFlow } from './AgentHandoffFlow';
import { JourneyTimeline } from './JourneyTimeline';
import { LeadMetadataInspector } from './LeadMetadataInspector';
import { Users, Activity } from 'lucide-react';
import { SOURCE_CONFIG, STAGE_COLORS } from '../../utils/colors';

export const LeadJourneyView: React.FC = () => {
  const { leads, selectedLead, selectLead, setActiveView } = usePipelineStore();

  // If no lead is selected, render a selector grid allowing user to choose any lead to inspect
  if (!selectedLead) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-ops-border text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-ops-card border border-slate-700 flex items-center justify-center mx-auto text-ops-cyan">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-mono text-slate-100">
            Select a Lead to Inspect Full Lifecycle Journey
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Choose any lead below or select a node in the 3D Command Center to trace its chronological timeline and agent handoffs.
          </p>

          <button
            onClick={() => setActiveView('command-center')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ops-cyan text-slate-950 font-mono font-bold text-xs hover:bg-cyan-300 transition-colors shadow-md"
          >
            <Activity className="w-4 h-4" />
            <span>Open 3D Command Center</span>
          </button>
        </div>

        {/* Lead selection list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {leads.map((l) => {
            const src = SOURCE_CONFIG[l.source];
            const stage = STAGE_COLORS[l.currentStage];

            return (
              <div
                key={l.id}
                onClick={() => selectLead(l.id)}
                className="p-4 rounded-xl glass-panel border border-ops-border hover:border-cyan-500/50 cursor-pointer transition-all group font-mono text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-ops-cyan group-hover:underline">
                    {l.id}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border ${src.badgeBg}`}>
                    {src.label}
                  </span>
                </div>

                <div className="font-bold text-slate-100 text-sm font-sans truncate">
                  {l.name}
                </div>
                <div className="text-slate-400 text-xs truncate mb-2">{l.company}</div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className={`capitalize ${stage.text}`}>{l.currentStage}</span>
                  <span className="text-slate-400">{l.history.length} events</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-[1500px] mx-auto space-y-6">
      {/* 1. Header Card with Details & Badges */}
      <LeadHeaderCard lead={selectedLead} />

      {/* 2. Pipeline Stage Stepper */}
      <StageProgressStepper currentStage={selectedLead.currentStage} />

      {/* 3. AI Agent Handoff Flow Diagram */}
      <AgentHandoffFlow lead={selectedLead} />

      {/* 4. Main Two Column Grid: Chronological Timeline + Technical Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <JourneyTimeline lead={selectedLead} />
        </div>
        <div className="lg:col-span-4">
          <LeadMetadataInspector lead={selectedLead} />
        </div>
      </div>
    </div>
  );
};
