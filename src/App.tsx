import React, { useEffect } from 'react';
import { Navigation } from './app/Navigation';
import { DashboardView } from './features/dashboard/DashboardView';
import { CommandCenterView } from './features/command-center/CommandCenterView';
import { LeadJourneyView } from './features/lead-journey/LeadJourneyView';
import { usePipelineStore } from './hooks/usePipelineStore';
import { useSimulation } from './hooks/useSimulation';
import { ActiveView } from './types/pipeline';

export default function App() {
  const { activeView, setActiveView, selectedLeadId } = usePipelineStore();
  // Activate simulation hook
  useSimulation();

  // Handle URL query parameters for deep linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as ActiveView | null;
    const leadIdParam = params.get('leadId');

    if (viewParam && ['dashboard', 'command-center', 'lead-journey'].includes(viewParam)) {
      setActiveView(viewParam, leadIdParam || undefined);
    }
  }, [setActiveView]);

  // Sync state back to URL query parameters without reloading
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('view', activeView);
    if (selectedLeadId && activeView === 'lead-journey') {
      params.set('leadId', selectedLeadId);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeView, selectedLeadId]);

  return (
    <div className="min-h-screen bg-ops-bg text-slate-100 flex flex-col font-sans selection:bg-ops-cyan/30 selection:text-white">
      {/* Top Navigation Bar */}
      <Navigation />

      {/* Main Viewport */}
      <main className="flex-1">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'command-center' && <CommandCenterView />}
        {activeView === 'lead-journey' && <LeadJourneyView />}
      </main>
    </div>
  );
}
