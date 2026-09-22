import { LeadSource, LeadStage, LeadPriority, LeadHealth } from '../types/pipeline';

export const SOURCE_CONFIG: Record<LeadSource, { label: string; icon: string; color: string; badgeBg: string; border: string }> = {
  whatsapp: {
    label: 'WhatsApp',
    icon: 'MessageSquare',
    color: '#25D366',
    badgeBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    border: 'border-emerald-500/40',
  },
  website: {
    label: 'Website Direct',
    icon: 'Globe',
    color: '#06B6D4',
    badgeBg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
    border: 'border-cyan-500/40',
  },
  facebook: {
    label: 'Facebook Ads',
    icon: 'Share2',
    color: '#3B82F6',
    badgeBg: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    border: 'border-blue-500/40',
  },
  email: {
    label: 'Inbound Email',
    icon: 'Mail',
    color: '#A855F7',
    badgeBg: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
    border: 'border-purple-500/40',
  },
};

export const PRIORITY_CONFIG: Record<LeadPriority, { label: string; color: string; badge: string }> = {
  low: {
    label: 'Low',
    color: '#64748B',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
  },
  medium: {
    label: 'Medium',
    color: '#0284C7',
    badge: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
  },
  high: {
    label: 'High',
    color: '#F59E0B',
    badge: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
  },
  critical: {
    label: 'Critical',
    color: '#EF4444',
    badge: 'bg-rose-950/70 text-rose-300 border-rose-800/60 animate-pulse',
  },
};

export const HEALTH_CONFIG: Record<LeadHealth, { label: string; color: string; dot: string }> = {
  healthy: {
    label: 'Optimal',
    color: '#10B981',
    dot: 'bg-emerald-500',
  },
  at_risk: {
    label: 'At Risk',
    color: '#F59E0B',
    dot: 'bg-amber-500',
  },
  stalled: {
    label: 'Stalled',
    color: '#EF4444',
    dot: 'bg-rose-500',
  },
};

export const STAGE_COLORS: Record<LeadStage, { color: string; bg: string; text: string }> = {
  intake: { color: '#38BDF8', bg: 'bg-sky-500/10', text: 'text-sky-400' },
  qualification: { color: '#818CF8', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  routing: { color: '#C084FC', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  followup: { color: '#FBBF24', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  deal: { color: '#FB7185', bg: 'bg-rose-500/10', text: 'text-rose-400' },
  won: { color: '#34D399', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
};
