import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { PIPELINE_STAGES } from '../../data/pipelineConfig';
import { LeadStage, PipelineMetrics } from '../../types/pipeline';
import { usePipelineStore } from '../../hooks/usePipelineStore';

interface StageFunnelChartProps {
  stageDistribution: PipelineMetrics['stageDistribution'];
}

export const StageFunnelChart: React.FC<StageFunnelChartProps> = ({ stageDistribution }) => {
  const { setActiveView, setFocusedZone } = usePipelineStore();

  const total = Object.values(stageDistribution).reduce((a, b) => a + b, 0) || 1;

  const handleInspectZone = (stageId: LeadStage) => {
    setFocusedZone(stageId);
    setActiveView('command-center');
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-ops-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ops-cyan animate-pulse" />
            Pipeline Funnel Velocity
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time lead distribution across autonomous operational stages
          </p>
        </div>

        <button
          onClick={() => setActiveView('command-center')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 text-ops-cyan border border-cyan-800/60 hover:bg-cyan-900/60 transition-all text-xs font-mono group"
        >
          <span>Open Full 3D View</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {PIPELINE_STAGES.map((stage) => {
          const count = stageDistribution[stage.id] || 0;
          const pct = Math.round((count / total) * 100);

          return (
            <div
              key={stage.id}
              className="p-3 rounded-lg bg-ops-surface/60 border border-ops-border/70 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stage.colorHex }}
                  />
                  <span className="text-xs font-mono font-medium text-slate-200">
                    {stage.order}. {stage.title}
                  </span>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    — {stage.subtitle}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-100">
                    {count} <span className="text-slate-500 font-normal">({pct}%)</span>
                  </span>

                  <button
                    onClick={() => handleInspectZone(stage.id)}
                    title={`Zoom to ${stage.title} in 3D`}
                    className="p-1 rounded text-slate-400 hover:text-ops-cyan hover:bg-slate-800/80 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full h-2 rounded-full bg-slate-900/80 overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(pct, 4)}%`,
                    backgroundColor: stage.colorHex,
                    boxShadow: `0 0 8px ${stage.colorHex}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
