import { useEffect, useRef } from 'react';
import { usePipelineStore } from './usePipelineStore';
import { STAGE_ORDER } from '../data/pipelineConfig';

export function useSimulation() {
  const {
    leads,
    selectedLeadId,
    isSimulationRunning,
    simulationSpeed,
    tickCount,
    advanceLead,
    injectLead,
    incrementTick,
  } = usePipelineStore();

  const tickRef = useRef<number>(tickCount);

  useEffect(() => {
    tickRef.current = tickCount;
  }, [tickCount]);

  // Single step execution logic (used by both interval loop and manual Step button)
  const executeStep = () => {
    incrementTick();
    const currentTick = tickRef.current + 1;

    // Ingest new lead periodically (e.g., every 3 ticks if active leads < 25)
    const activeLeads = leads.filter((l) => l.currentStage !== 'won');
    if (currentTick % 3 === 0 && activeLeads.length < 24) {
      injectLead();
    }

    // Pick one eligible lead in each of the active stages to advance
    for (const stage of STAGE_ORDER.slice(0, -1)) {
      const candidates = leads.filter((l) => l.currentStage === stage);
      if (candidates.length > 0) {
        // If candidate is actively inspected, prioritize non-inspected leads to prevent surprising jumps
        const nonInspected = candidates.filter((c) => c.id !== selectedLeadId);
        const pool = nonInspected.length > 0 ? nonInspected : candidates;
        const candidate = pool[currentTick % pool.length];
        if (candidate) {
          advanceLead(candidate.id);
          break; // Advance one stage transition per tick for smooth readability
        }
      }
    }
  };

  useEffect(() => {
    if (!isSimulationRunning) return;

    // Base interval in milliseconds
    const baseInterval = 2800;
    const intervalTime = Math.max(500, baseInterval / simulationSpeed);

    const timer = setInterval(() => {
      executeStep();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSimulationRunning, simulationSpeed, leads]);

  return {
    stepOnce: executeStep,
    injectLead,
  };
}
