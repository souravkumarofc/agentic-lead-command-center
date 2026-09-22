import React from 'react';
import { 
  X, 
  ExternalLink, 
  FastForward, 
  Bot, 
  Building,
  Mail
} from 'lucide-react';
import { Lead } from '../../types/pipeline';
import { usePipelineStore } from '../../hooks/usePipelineStore';
import { formatCurrency } from '../../utils/formatters';
import { SOURCE_CONFIG, PRIORITY_CONFIG, STAGE_COLORS } from '../../utils/colors';
import { AI_AGENTS } from '../../data/agentsData';

interface LeadDrawerPreviewProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDrawerPreview: React.FC<LeadDrawerPreviewProps> = ({ lead, onClose }) => {
  const { setActiveView, advanceLead } = usePipelineStore();

  // Support closing via Escape key (hook called unconditionally at top of component)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!lead) return null;

  const sourceConfig = SOURCE_CONFIG[lead.source];
  const priorityConfig = PRIORITY_CONFIG[lead.priority];
  const stageColor = STAGE_COLORS[lead.currentStage];
  const agent = lead.assignedAgentId ? AI_AGENTS[lead.assignedAgentId] : null;

  const handleOpenJourney = () => {
    setActiveView('lead-journey', lead.id);
  };

  return (
    <div className="fixed top-[4.5rem] right-4 bottom-24 w-[calc(100vw-2rem)] sm:w-[26rem] max-w-[26rem] z-40 pointer-events-none flex justify-end">
      <div className="w-full h-full glass-panel rounded-2xl border border-ops-border shadow-2xl backdrop-blur-xl flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-3.5 bg-ops-surface/90 border-b border-ops-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-ops-cyan tracking-wider">
              {lead.id}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sourceConfig?.badgeBg}`}>
              {sourceConfig?.label}
            </span>
          </div>

          <button
            id="close-lead-drawer-btn"
            onClick={onClose}
            title="Close panel (Esc)"
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all shadow-sm group"
          >
            <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 font-mono text-xs">
          {/* Main Info */}
          <div>
            <h2 className="text-base font-bold text-slate-100 font-sans">
              {lead.name}
            </h2>
            <div className="flex items-center gap-1.5 text-slate-400 mt-1 text-xs">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>{lead.company}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 mt-0.5 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{lead.email}</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-ops-surface/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Current Stage</span>
              <span className={`font-bold capitalize mt-0.5 block ${stageColor?.text}`}>
                {lead.currentStage}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-ops-surface/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Est. Value</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">
                {formatCurrency(lead.estimatedValue)}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-ops-surface/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Qualification Score</span>
              <span className="font-bold text-cyan-300 mt-0.5 block">
                {lead.score} / 100
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-ops-surface/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Priority</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block mt-0.5 ${priorityConfig.badge}`}>
                {priorityConfig.label}
              </span>
            </div>
          </div>

          {/* Assigned Agent Card */}
          <div className="p-3 rounded-lg bg-ops-surface/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5 mb-1.5">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Active AI Agent Assigned</span>
            </div>
            {agent ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200 text-xs">{agent.name}</div>
                  <div className="text-[11px] text-slate-400">{agent.role}</div>
                </div>
                <div className="text-xl">{agent.avatar}</div>
              </div>
            ) : (
              <div className="text-slate-500 italic">Unassigned (In queue)</div>
            )}
          </div>

          {/* Timeline snippet */}
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Recent Activity Log</span>
              <span className="text-slate-500">{lead.history.length} events</span>
            </div>

            <div className="space-y-2 border-l border-slate-800 pl-3">
              {lead.history.slice(-3).reverse().map((evt) => (
                <div key={evt.id} className="relative">
                  <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-ops-cyan" />
                  <div className="text-[11px] font-semibold text-slate-200">{evt.title}</div>
                  <div className="text-[10px] text-slate-500">{evt.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-ops-surface/90 border-t border-ops-border space-y-2">
          {lead.currentStage !== 'won' && (
            <button
              onClick={() => advanceLead(lead.id)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 transition-colors"
            >
              <FastForward className="w-3.5 h-3.5 text-amber-400" />
              <span>Advance Stage (Manual Push)</span>
            </button>
          )}

          <button
            onClick={handleOpenJourney}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-ops-cyan text-slate-950 font-mono font-bold text-xs hover:bg-cyan-300 transition-all shadow-md shadow-cyan-500/20"
          >
            <span>Inspect Full Journey</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
