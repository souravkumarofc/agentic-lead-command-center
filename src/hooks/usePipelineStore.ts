import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Lead, 
  LeadStage, 
  LeadSource, 
  AgentId, 
  ActiveView, 
  PipelineFilterState, 
  PipelineMetrics,
  LeadEvent 
} from '../types/pipeline';
import { INITIAL_LEADS } from '../data/initialLeads';
import { STAGE_ORDER } from '../data/pipelineConfig';
import { AI_AGENTS } from '../data/agentsData';
import { formatTimeHHMMSS } from '../utils/formatters';

// Global singleton pattern for synchronized state across views
let listeners: Array<() => void> = [];

let state = {
  leads: [...INITIAL_LEADS],
  selectedLeadId: null as string | null,
  focusedZoneId: null as LeadStage | null,
  activeView: 'dashboard' as ActiveView,
  filters: {
    stage: 'all',
    source: 'all',
    agentId: 'all',
    priority: 'all',
    health: 'all',
    searchQuery: '',
  } as PipelineFilterState,
  isSimulationRunning: true,
  simulationSpeed: 1 as 1 | 2 | 5,
  tickCount: 0,
};

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function usePipelineStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const leads = state.leads;
  const selectedLeadId = state.selectedLeadId;
  const focusedZoneId = state.focusedZoneId;
  const activeView = state.activeView;
  const filters = state.filters;
  const isSimulationRunning = state.isSimulationRunning;
  const simulationSpeed = state.simulationSpeed;
  const tickCount = state.tickCount;

  // Selected lead object
  const selectedLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Computed Metrics
  const metrics: PipelineMetrics = useMemo(() => {
    const totalActive = leads.filter((l) => l.currentStage !== 'won').length;
    const wonLeads = leads.filter((l) => l.currentStage === 'won');
    const wonTodayValue = wonLeads.reduce((acc, l) => acc + l.estimatedValue, 0);
    const qualifiedCount = leads.filter((l) => l.score >= 80).length;

    const stageDist: Record<LeadStage, number> = {
      intake: 0,
      qualification: 0,
      routing: 0,
      followup: 0,
      deal: 0,
      won: 0,
    };
    leads.forEach((l) => {
      if (stageDist[l.currentStage] !== undefined) {
        stageDist[l.currentStage]++;
      }
    });

    const sourceDist: Record<LeadSource, number> = {
      whatsapp: 0,
      website: 0,
      facebook: 0,
      email: 0,
    };
    leads.forEach((l) => {
      if (sourceDist[l.source] !== undefined) {
        sourceDist[l.source]++;
      }
    });

    const agentLoad: Record<AgentId, number> = {
      'agent-conversation': 0,
      'agent-sales': 0,
      'agent-meeting': 0,
      'agent-support': 0,
    };
    leads.forEach((l) => {
      if (l.assignedAgentId && agentLoad[l.assignedAgentId] !== undefined) {
        agentLoad[l.assignedAgentId]++;
      }
    });

    const convRate = leads.length > 0 ? (wonLeads.length / leads.length) * 100 : 24.5;

    return {
      totalActiveLeads: totalActive,
      leadsQualifiedToday: qualifiedCount,
      wonTodayCount: wonLeads.length,
      wonTodayValue: wonTodayValue,
      wonThisWeekCount: wonLeads.length + 14,
      wonThisWeekValue: wonTodayValue + 248000,
      overallConversionRate: Number(convRate.toFixed(1)),
      avgVelocityHours: 4.2,
      stageDistribution: stageDist,
      sourceDistribution: sourceDist,
      agentWorkload: agentLoad,
    };
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (filters.stage !== 'all' && lead.currentStage !== filters.stage) return false;
      if (filters.source !== 'all' && lead.source !== filters.source) return false;
      if (filters.agentId !== 'all' && lead.assignedAgentId !== filters.agentId) return false;
      if (filters.priority !== 'all' && lead.priority !== filters.priority) return false;
      if (filters.health !== 'all' && lead.health !== filters.health) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return (
          lead.name.toLowerCase().includes(q) ||
          lead.company.toLowerCase().includes(q) ||
          lead.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, filters]);

  // Actions
  const setActiveView = useCallback((view: ActiveView, leadId?: string) => {
    state.activeView = view;
    if (leadId) {
      state.selectedLeadId = leadId;
    }
    emitChange();
  }, []);

  const selectLead = useCallback((id: string | null) => {
    state.selectedLeadId = id;
    emitChange();
  }, []);

  const setFocusedZone = useCallback((zone: LeadStage | null) => {
    state.focusedZoneId = zone;
    emitChange();
  }, []);

  const setFilters = useCallback((newFilters: Partial<PipelineFilterState>) => {
    state.filters = { ...state.filters, ...newFilters };
    emitChange();
  }, []);

  const resetFilters = useCallback(() => {
    state.filters = {
      stage: 'all',
      source: 'all',
      agentId: 'all',
      priority: 'all',
      health: 'all',
      searchQuery: '',
    };
    emitChange();
  }, []);

  const setSimulationRunning = useCallback((running: boolean) => {
    state.isSimulationRunning = running;
    emitChange();
  }, []);

  const setSimulationSpeed = useCallback((speed: 1 | 2 | 5) => {
    state.simulationSpeed = speed;
    emitChange();
  }, []);

  // Update lead with an event
  const addLeadEvent = useCallback((leadId: string, event: Omit<LeadEvent, 'id' | 'leadId' | 'isoDate'> & { isoDate?: string }) => {
    const time = formatTimeHHMMSS();
    const newEvent: LeadEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      leadId,
      timestamp: event.timestamp || time,
      isoDate: event.isoDate || new Date().toISOString(),
    };

    state.leads = state.leads.map((l) => {
      if (l.id === leadId) {
        return {
          ...l,
          currentStage: event.toStage || l.currentStage,
          assignedAgentId: event.agentId !== undefined ? event.agentId : l.assignedAgentId,
          updatedAt: new Date().toISOString(),
          history: [...l.history, newEvent],
        };
      }
      return l;
    });
    emitChange();
  }, []);

  // Advance a lead to the next stage
  const advanceLead = useCallback((leadId: string) => {
    const lead = state.leads.find((l) => l.id === leadId);
    if (!lead || lead.currentStage === 'won') return;

    const currentIdx = STAGE_ORDER.indexOf(lead.currentStage);
    if (currentIdx === -1 || currentIdx >= STAGE_ORDER.length - 1) return;

    const nextStage = STAGE_ORDER[currentIdx + 1];
    const time = formatTimeHHMMSS();

    let eventTitle = `Moved to ${nextStage.toUpperCase()}`;
    let eventDesc = `Lead transitioned from ${lead.currentStage} to ${nextStage}`;
    let assignedAgent = lead.assignedAgentId;
    let eventType: LeadEvent['type'] = 'agent_handoff';

    if (nextStage === 'qualification') {
      eventTitle = 'Qualification scan started';
      eventDesc = 'LLM heuristics initiating domain authority, budget parameters, and business intent.';
      eventType = 'qualification_started';
    } else if (nextStage === 'routing') {
      // Neural matchmaking assigns optimal specialized agent based on source & profile
      if (lead.source === 'whatsapp') {
        assignedAgent = 'agent-conversation';
      } else if (lead.source === 'website' && lead.score >= 88) {
        assignedAgent = 'agent-sales';
      } else if (lead.source === 'email') {
        assignedAgent = 'agent-meeting';
      } else {
        assignedAgent = 'agent-support';
      }
      const agentInfo = AI_AGENTS[assignedAgent];
      eventTitle = `${agentInfo?.name || 'Autonomous Agent'} assigned`;
      eventDesc = `Lead qualified (Score ${lead.score}/100) and routed to ${agentInfo?.role || 'Agent'}.`;
      eventType = 'agent_assigned';
    } else if (nextStage === 'followup') {
      assignedAgent = lead.assignedAgentId || 'agent-conversation';
      eventTitle = 'Follow-up sent';
      eventDesc = `Automated multi-touch outreach cadence dispatched by ${AI_AGENTS[assignedAgent]?.name}.`;
      eventType = 'followup_dispatched';
    } else if (nextStage === 'deal') {
      // Autonomous handoff to Sales Closer Agent if previously handled by another agent
      if (lead.assignedAgentId !== 'agent-sales') {
        assignedAgent = 'agent-sales';
        eventTitle = 'Sales Agent assigned';
        eventDesc = 'Handoff to Sales Closer Agent v4.1 for commercial term generation.';
        eventType = 'agent_handoff';
      } else {
        eventTitle = 'Deal created';
        eventDesc = `Target commercial valuation set at $${lead.estimatedValue.toLocaleString()} ARR.`;
        eventType = 'deal_created';
      }
    } else if (nextStage === 'won') {
      eventTitle = 'Deal won';
      eventDesc = 'Enterprise contract executed. Client provisioned in onboarding portal.';
      eventType = 'deal_won';
    }

    addLeadEvent(leadId, {
      title: eventTitle,
      description: eventDesc,
      type: eventType,
      fromStage: lead.currentStage,
      toStage: nextStage,
      agentId: assignedAgent,
      timestamp: time,
    });
  }, [addLeadEvent]);

  // Inject a new lead manually or via simulation
  const injectLead = useCallback((customLead?: Partial<Lead>) => {
    const sources: LeadSource[] = ['whatsapp', 'website', 'facebook', 'email'];
    const names = [
      'David Thorne', 'Aisha Khan', 'Mateo Silva', 'Katarina Novak',
      'Liam Gallagher', 'Mei-Ling Zhou', 'Gabriel Santos', 'Zoe Robinson'
    ];
    const companies = [
      'Vortex Telemetry', 'NeuraPulse AI', 'Titan Robotics', 'Crestview Health',
      'AeroSync Technologies', 'Starlight Logistics', 'Horizon Fintech'
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const newId = `LD-${Math.floor(1000 + Math.random() * 9000)}`;
    const time = formatTimeHHMMSS();

    const newLead: Lead = {
      id: newId,
      name: customLead?.name || randomName,
      company: customLead?.company || randomCompany,
      email: `${(randomName.split(' ')[0] || 'lead').toLowerCase()}@${randomCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      source: customLead?.source || randomSource,
      currentStage: 'intake',
      priority: customLead?.priority || (Math.random() > 0.6 ? 'high' : 'medium'),
      score: Math.floor(75 + Math.random() * 24),
      estimatedValue: Math.floor(20 + Math.random() * 65) * 1000,
      health: 'healthy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['Simulated', 'Inbound'],
      history: [
        {
          id: `evt-${Date.now()}`,
          leadId: newId,
          timestamp: time,
          isoDate: new Date().toISOString(),
          type: 'lead_ingested',
          title: `Inbound lead received from ${randomSource.toUpperCase()}`,
          description: `Autonomous ingestion port received signal from ${randomName} at ${randomCompany}.`,
          toStage: 'intake',
        }
      ],
      ...customLead,
    };

    // Keep active leads manageable (max 35) to maintain 60fps
    // CRITICAL: NEVER purge the currently selected lead from memory!
    const currentActive = state.leads.filter((l) => l.currentStage !== 'won');
    if (currentActive.length > 28 || state.leads.length > 36) {
      // Find oldest won lead that is NOT selected to archive
      const wonIndex = state.leads.findIndex(
        (l) => l.id !== state.selectedLeadId && l.currentStage === 'won'
      );
      if (wonIndex !== -1) {
        const nextLeads = [...state.leads];
        nextLeads.splice(wonIndex, 1);
        state.leads = [newLead, ...nextLeads];
      } else {
        // Find oldest non-selected lead
        const oldIndex = state.leads.findIndex((l) => l.id !== state.selectedLeadId);
        if (oldIndex !== -1) {
          const nextLeads = [...state.leads];
          nextLeads.splice(oldIndex, 1);
          state.leads = [newLead, ...nextLeads];
        } else {
          state.leads = [newLead, ...state.leads];
        }
      }
    } else {
      state.leads = [newLead, ...state.leads];
    }
    
    emitChange();
    return newLead;
  }, []);

  const resetAll = useCallback(() => {
    state.leads = [...INITIAL_LEADS];
    state.selectedLeadId = null;
    state.focusedZoneId = null;
    state.tickCount = 0;
    emitChange();
  }, []);

  const incrementTick = useCallback(() => {
    state.tickCount += 1;
    emitChange();
  }, []);

  return {
    leads,
    filteredLeads,
    selectedLead,
    selectedLeadId,
    focusedZoneId,
    activeView,
    filters,
    metrics,
    isSimulationRunning,
    simulationSpeed,
    tickCount,
    // Methods
    setActiveView,
    selectLead,
    setFocusedZone,
    setFilters,
    resetFilters,
    setSimulationRunning,
    setSimulationSpeed,
    advanceLead,
    injectLead,
    resetAll,
    incrementTick,
  };
}
