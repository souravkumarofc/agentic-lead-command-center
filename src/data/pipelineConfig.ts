import { PipelineZoneConfig, LeadStage } from '../types/pipeline';

export const PIPELINE_STAGES: PipelineZoneConfig[] = [
  {
    id: 'intake',
    order: 1,
    title: 'Intake Port',
    subtitle: 'Multi-Channel Stream',
    description: 'Autonomous listener ingesting signals from WhatsApp, Web, Facebook, and Email.',
    worldPosition: [-50, 0, 0],
    dimensions: [16, 2, 16],
    colorHex: '#38BDF8', // Cyan-Blue
    accentHex: '#0284C7',
    iconName: 'Inbox',
  },
  {
    id: 'qualification',
    order: 2,
    title: 'AI Qualification',
    subtitle: 'Signal Analysis & Scoring',
    description: 'LLM heuristics scan intent, domain authority, budget parameters, and urgency.',
    worldPosition: [-30, 0, 0],
    dimensions: [16, 2, 16],
    colorHex: '#818CF8', // Indigo
    accentHex: '#4F46E5',
    iconName: 'Cpu',
  },
  {
    id: 'routing',
    order: 3,
    title: 'AI Agent Routing',
    subtitle: 'Autonomous Matchmaking',
    description: 'Dynamic neural routing assigns leads to specialized AI agents based on capacity and affinity.',
    worldPosition: [-10, 0, 0],
    dimensions: [18, 2, 18],
    colorHex: '#C084FC', // Purple
    accentHex: '#9333EA',
    iconName: 'Network',
  },
  {
    id: 'followup',
    order: 4,
    title: 'Engagement Track',
    subtitle: 'Multi-Touch Nurturing',
    description: 'Active conversational cadences, context-aware email sequencing, and interactive demos.',
    worldPosition: [10, 0, 0],
    dimensions: [16, 2, 16],
    colorHex: '#FBBF24', // Amber
    accentHex: '#D97706',
    iconName: 'Send',
  },
  {
    id: 'deal',
    order: 5,
    title: 'Deal Desk',
    subtitle: 'Proposal & Negotiation',
    description: 'Autonomous pricing generation, MSA alignment, and executive committee escalation.',
    worldPosition: [30, 0, 0],
    dimensions: [16, 2, 16],
    colorHex: '#FB7185', // Rose
    accentHex: '#E11D48',
    iconName: 'Briefcase',
  },
  {
    id: 'won',
    order: 6,
    title: 'Terminal / Won',
    subtitle: 'Contract Executed',
    description: 'Closed-won deals routed directly into provisioning and customer onboarding workflows.',
    worldPosition: [50, 0, 0],
    dimensions: [16, 2, 16],
    colorHex: '#34D399', // Emerald
    accentHex: '#059669',
    iconName: 'CheckCircle2',
  },
];

export const STAGE_MAP: Record<LeadStage, PipelineZoneConfig> = PIPELINE_STAGES.reduce(
  (acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  },
  {} as Record<LeadStage, PipelineZoneConfig>
);

export const STAGE_ORDER: LeadStage[] = [
  'intake',
  'qualification',
  'routing',
  'followup',
  'deal',
  'won',
];
