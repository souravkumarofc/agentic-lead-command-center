import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { PIPELINE_STAGES, STAGE_ORDER } from '../../data/pipelineConfig';
import { LeadStage } from '../../types/pipeline';

interface StageProgressStepperProps {
  currentStage: LeadStage;
}

export const StageProgressStepper: React.FC<StageProgressStepperProps> = ({ currentStage }) => {
  const currentIdx = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-ops-border">
      <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
        <span>Pipeline Stage Progression</span>
        <span className="text-ops-cyan">
          Step {currentIdx + 1} of {STAGE_ORDER.length} ({currentStage.toUpperCase()})
        </span>
      </div>

      <div className="relative flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isPassed = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <React.Fragment key={stage.id}>
              <div
                className={`flex-1 p-3 rounded-xl border font-mono transition-all ${
                  isCurrent
                    ? 'bg-ops-card border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                    : isPassed
                    ? 'bg-ops-surface/90 border-emerald-900/50'
                    : 'bg-ops-surface/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 font-bold">
                    0{stage.order}
                  </span>
                  {isPassed && (
                    <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  {isCurrent && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ops-cyan" />
                    </span>
                  )}
                </div>

                <div
                  className={`text-xs font-bold uppercase truncate ${
                    isCurrent
                      ? 'text-ops-cyan'
                      : isPassed
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {stage.subtitle}
                </div>
              </div>

              {idx < PIPELINE_STAGES.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-slate-700">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
