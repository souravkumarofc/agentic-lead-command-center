import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SceneManager } from '../../three/SceneManager';
import { usePipelineStore } from '../../hooks/usePipelineStore';
import { HoverTooltip } from './HoverTooltip';
import { Lead } from '../../types/pipeline';

export const SceneCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  const {
    filteredLeads,
    selectedLeadId,
    selectLead,
    focusedZoneId,
    metrics,
  } = usePipelineStore();

  const [hoveredLead, setHoveredLead] = useState<Lead | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  // Hover handler called from Three.js InteractionManager
  const handleHoverLead = useCallback(
    (leadId: string | null, coords: { x: number; y: number } | null) => {
      if (!leadId || !coords) {
        setHoveredLead(null);
        setHoverCoords(null);
        return;
      }
      const found = filteredLeads.find((l) => l.id === leadId) || null;
      setHoveredLead(found);
      setHoverCoords(coords);
    },
    [filteredLeads]
  );

  // Click handler called from Three.js InteractionManager
  const handleSelectLead = useCallback(
    (leadId: string) => {
      selectLead(leadId);
      if (sceneManagerRef.current) {
        sceneManagerRef.current.focusLead(leadId);
      }
    },
    [selectLead]
  );

  // Initialize Three.js SceneManager
  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new SceneManager(
      containerRef.current,
      handleHoverLead,
      handleSelectLead
    );
    sceneManagerRef.current = manager;

    return () => {
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, []); // Mount once

  // Synchronize dynamic leads and stage metrics with Three.js scene
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.syncState(
        filteredLeads,
        selectedLeadId,
        metrics.stageDistribution,
        focusedZoneId
      );
    }
  }, [filteredLeads, selectedLeadId, metrics.stageDistribution, focusedZoneId]);

  // Synchronize camera fly-to when focusedZoneId changes
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setFocusedZone(focusedZoneId);
    }
  }, [focusedZoneId]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden select-none bg-ops-bg">
      <div ref={containerRef} className="w-full h-full" />
      <HoverTooltip lead={hoveredLead} coords={hoverCoords} />
    </div>
  );
};
