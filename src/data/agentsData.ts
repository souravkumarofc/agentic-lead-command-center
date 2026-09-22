import { Agent, AgentId } from '../types/pipeline';

export const AI_AGENTS: Record<AgentId, Agent> = {
  'agent-conversation': {
    id: 'agent-conversation',
    name: 'Conversation Agent v3.4',
    role: 'Real-time Dialog & Intent Parser',
    description: 'Natural language agent handling early multi-channel discovery, FAQs, and intent classification.',
    colorHex: '#06B6D4', // Cyan
    accentHex: '#0891B2',
    activeLeadsCount: 6,
    totalProcessed: 1420,
    avgResolutionTimeSec: 42,
    status: 'processing',
    avatar: '💬',
  },
  'agent-sales': {
    id: 'agent-sales',
    name: 'Sales Closer Agent v4.1',
    role: 'Autonomous Proposal & Pricing Architect',
    description: 'Synthesizes requirements, prepares tailored technical quotes, and negotiates procurement terms.',
    colorHex: '#8B5CF6', // Purple
    accentHex: '#7C3AED',
    activeLeadsCount: 4,
    totalProcessed: 890,
    avgResolutionTimeSec: 180,
    status: 'processing',
    avatar: '⚡',
  },
  'agent-meeting': {
    id: 'agent-meeting',
    name: 'Meeting Agent v2.8',
    role: 'Calendar & Sync Orchestrator',
    description: 'Cross-analyzes executive availability, timezone constraints, and auto-provisions conference rooms.',
    colorHex: '#10B981', // Emerald
    accentHex: '#059669',
    activeLeadsCount: 3,
    totalProcessed: 645,
    avgResolutionTimeSec: 25,
    status: 'idle',
    avatar: '📅',
  },
  'agent-support': {
    id: 'agent-support',
    name: 'Support Agent v3.0',
    role: 'Technical Validation & SLA Specialist',
    description: 'Evaluates enterprise security compliance, data residency queries, and architecture fit.',
    colorHex: '#F59E0B', // Amber
    accentHex: '#D97706',
    activeLeadsCount: 2,
    totalProcessed: 512,
    avgResolutionTimeSec: 90,
    status: 'routing',
    avatar: '🛡️',
  },
};

export const AGENT_LIST: Agent[] = Object.values(AI_AGENTS);
