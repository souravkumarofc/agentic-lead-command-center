import React from 'react';
import { 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  Activity, 
  FastForward
} from 'lucide-react';
import { Lead } from '../../types/pipeline';
import { usePipelineStore } from '../../hooks/usePipelineStore';
import { SOURCE_CONFIG, PRIORITY_CONFIG, HEALTH_CONFIG, STAGE_COLORS } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatters';

interface LeadHeaderCardProps {
  lead: Lead;
}

export const LeadHeaderCard: React.FC<LeadHeaderCardProps> = ({ lead }) => {
  const { setActiveView, setFocusedZone, advanceLead } = usePipelineStore();

  const sourceConfig = SOURCE_CONFIG[lead.source];
  const priorityConfig = PRIORITY_CONFIG[lead.priority];
  const healthConfig = HEALTH_CONFIG[lead.health];
  const stageColor = STAGE_COLORS[lead.currentStage];

  const handleReturnTo3D = () => {
    setFocusedZone(lead.currentStage);
    setActiveView('command-center');
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-ops-border space-y-5">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('command-center')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ops-surface border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to 3D Command Center</span>
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
          >
            Dashboard
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono text-ops-cyan font-bold">{lead.id}</span>
        </div>

        <div className="flex items-center gap-2">
          {lead.currentStage !== 'won' && (
            <button
              onClick={() => advanceLead(lead.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/80 hover:bg-amber-900/60 font-mono text-xs transition-colors"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Advance Stage</span>
            </button>
          )}

          <button
            onClick={handleReturnTo3D}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-950/60 text-ops-cyan border border-cyan-800/80 hover:bg-cyan-900/60 font-mono text-xs transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Locate in 3D</span>
          </button>
        </div>
      </div>

      {/* Primary Identity Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl lg:text-3xl font-bold font-sans text-slate-100">
              {lead.name}
            </h1>
            <span className="font-mono text-sm px-2.5 py-0.5 rounded bg-ops-surface border border-slate-700 text-slate-300 font-semibold">
              {lead.id}
            </span>
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Building className="w-4 h-4 text-slate-500" />
              {lead.company}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-500" />
              {lead.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-500" />
              {lead.phone}
            </span>
          </div>
        </div>

        {/* Badges Stack */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Source */}
          <span className={`px-2.5 py-1 rounded-lg border font-semibold ${sourceConfig.badgeBg}`}>
            {sourceConfig.label}
          </span>

          {/* Stage */}
          <span className={`px-2.5 py-1 rounded-lg border capitalize font-bold ${stageColor?.bg} ${stageColor?.text} border-slate-700`}>
            Stage: {lead.currentStage}
          </span>

          {/* Priority */}
          <span className={`px-2.5 py-1 rounded-lg border font-bold ${priorityConfig.badge}`}>
            Priority: {priorityConfig.label}
          </span>

          {/* Health */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ops-surface border border-slate-800 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${healthConfig.dot}`} />
            <span>Health: {healthConfig.label}</span>
          </span>
        </div>
      </div>

      {/* Financial & Scoring Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 font-mono">
        <div className="p-3 rounded-xl bg-ops-surface/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block">Target Contract Value</span>
          <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
            {formatCurrency(lead.estimatedValue)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-ops-surface/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block">AI Qualification Score</span>
          <span className="text-xl font-bold text-ops-cyan mt-0.5 block">
            {lead.score} <span className="text-xs text-slate-500">/ 100</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-ops-surface/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block">Total Journey Events</span>
          <span className="text-xl font-bold text-slate-200 mt-0.5 block">
            {lead.history.length} <span className="text-xs text-slate-500">steps</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-ops-surface/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block">Inbound Registered</span>
          <span className="text-sm font-bold text-slate-300 mt-1 block truncate">
            {lead.history[0]?.timestamp || '10:32:14'}
          </span>
        </div>
      </div>
    </div>
  );
};
