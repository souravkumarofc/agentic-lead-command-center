import React from 'react';
import { SceneCanvas } from './SceneCanvas';
import { TelemetryHUD } from './TelemetryHUD';
import { ZoneNavigationDock } from './ZoneNavigationDock';
import { PipelineFilterBar } from './PipelineFilterBar';
import { LeadDrawerPreview } from './LeadDrawerPreview';
import { usePipelineStore } from '../../hooks/usePipelineStore';

import { AlertCircle, RotateCcw } from 'lucide-react';

export const CommandCenterView: React.FC = () => {
  const {
    metrics,
    focusedZoneId,
    setFocusedZone,
    selectedLead,
    selectLead,
    filteredLeads,
    resetFilters,
  } = usePipelineStore();

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] overflow-hidden bg-ops-bg">
      {/* 3D WebGL Canvas */}
      <SceneCanvas />

      {/* Empty State Banner when filter yields 0 matches */}
      {filteredLeads.length === 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <div className="glass-panel px-4 py-2.5 rounded-xl border border-amber-500/40 shadow-2xl flex items-center gap-3 backdrop-blur-md font-mono text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>0 leads match active filter criteria</span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-200 hover:bg-amber-900 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Left Telemetry HUD */}
      <TelemetryHUD metrics={metrics} />

      {/* Top Right Filter & Search Bar */}
      <PipelineFilterBar />

      {/* Bottom Floating Zone Navigation Dock */}
      <ZoneNavigationDock
        focusedZoneId={focusedZoneId}
        onSelectZone={setFocusedZone}
        stageCounts={metrics.stageDistribution}
      />

      {/* Slide-in Lead Details Drawer when a node is selected */}
      {selectedLead && (
        <LeadDrawerPreview
          lead={selectedLead}
          onClose={() => selectLead(null)}
        />
      )}
    </div>
  );
};
