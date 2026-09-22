import React from 'react';
import { PIPELINE_STAGES } from '../../data/pipelineConfig';
import { LeadStage } from '../../types/pipeline';
import { Crosshair } from 'lucide-react';

interface ZoneNavigationDockProps {
  focusedZoneId: LeadStage | null;
  onSelectZone: (zoneId: LeadStage | null) => void;
  stageCounts: Record<LeadStage, number>;
}

export const ZoneNavigationDock: React.FC<ZoneNavigationDockProps> = ({
  focusedZoneId,
  onSelectZone,
  stageCounts,
}) => {
  return (
    <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-[calc(100vw-1rem)] sm:max-w-[95vw] overflow-x-auto touch-pan-x">
      <div className="glass-panel px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-2xl border border-ops-border shadow-2xl flex items-center gap-1 sm:gap-1.5 backdrop-blur-md w-max">
        {/* Reset Overview button */}
        <button
          onClick={() => onSelectZone(null)}
          title="Reset camera to pipeline overview"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs transition-all whitespace-nowrap ${
            focusedZoneId === null
              ? 'bg-ops-cyan text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Overview</span>
        </button>

        <div className="w-[1px] h-5 bg-slate-800 mx-0.5 sm:mx-1" />

        {/* 6 Stage buttons */}
        {PIPELINE_STAGES.map((stage) => {
          const isActive = focusedZoneId === stage.id;
          const count = stageCounts[stage.id] || 0;

          return (
            <button
              key={stage.id}
              onClick={() => onSelectZone(stage.id)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-ops-card text-slate-100 border font-bold shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              style={{
                borderColor: isActive ? stage.colorHex : 'transparent',
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: stage.colorHex }}
              />
              <span className="font-semibold text-[11px] sm:text-xs">{stage.order}. {stage.title}</span>
              <span
                className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
