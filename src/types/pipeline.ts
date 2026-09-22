/**
 * Pipeline Data Model & Type Definitions
 * Enterprise-grade type specifications for Agentic Lead Operations
 */

export type LeadStage = 
  | 'intake'
  | 'qualification'
  | 'routing'
  | 'followup'
  | 'deal'
  | 'won';

export type LeadSource = 
  | 'whatsapp'
  | 'website'
  | 'facebook'
  | 'email';

export type AgentId = 
  | 'agent-conversation'
  | 'agent-sales'
  | 'agent-meeting'
  | 'agent-support';

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  colorHex: string;
  accentHex: string;
  activeLeadsCount: number;
  totalProcessed: number;
  avgResolutionTimeSec: number;
  status: 'idle' | 'processing' | 'routing' | 'cooldown';
  avatar: string;
}

export type EventType = 
  | 'lead_ingested'
  | 'qualification_started'
  | 'qualification_passed'
  | 'qualification_failed'
  | 'agent_assigned'
  | 'agent_handoff'
  | 'followup_dispatched'
  | 'meeting_scheduled'
  | 'deal_created'
  | 'deal_won'
  | 'deal_lost';

export interface LeadEvent {
  id: string;
  leadId: string;
  timestamp: string; // HH:mm:ss or ISO
  isoDate: string;
  type: EventType;
  title: string;
  description: string;
  fromStage?: LeadStage;
  toStage?: LeadStage;
  agentId?: AgentId;
  metadata?: Record<string, string | number | boolean>;
}

export type LeadPriority = 'low' | 'medium' | 'high' | 'critical';
export type LeadHealth = 'healthy' | 'at_risk' | 'stalled';

export interface Lead {
  id: string; // e.g., 'LD-1042'
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  currentStage: LeadStage;
  assignedAgentId?: AgentId;
  priority: LeadPriority;
  score: number; // 0 - 100
  estimatedValue: number; // USD
  health: LeadHealth;
  createdAt: string;
  updatedAt: string;
  history: LeadEvent[];
  notes?: string;
  tags?: string[];
  // Spatial coordinates for Three.js interpolation
  positionTarget?: [number, number, number];
}

export interface PipelineZoneConfig {
  id: LeadStage;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  worldPosition: [number, number, number]; // [x, y, z]
  dimensions: [number, number, number]; // [width, height, depth]
  colorHex: string;
  accentHex: string;
  iconName: string;
}

export interface PipelineMetrics {
  totalActiveLeads: number;
  leadsQualifiedToday: number;
  wonTodayCount: number;
  wonTodayValue: number;
  wonThisWeekCount: number;
  wonThisWeekValue: number;
  overallConversionRate: number; // e.g. 24.8%
  avgVelocityHours: number;
  stageDistribution: Record<LeadStage, number>;
  sourceDistribution: Record<LeadSource, number>;
  agentWorkload: Record<AgentId, number>;
}

export type ActiveView = 'dashboard' | 'command-center' | 'lead-journey';

export interface PipelineFilterState {
  stage?: LeadStage | 'all';
  source?: LeadSource | 'all';
  agentId?: AgentId | 'all';
  priority?: LeadPriority | 'all';
  health?: LeadHealth | 'all';
  searchQuery: string;
}
