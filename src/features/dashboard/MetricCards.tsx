import React from 'react';
import { 
  Users, 
  CheckCircle, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { PipelineMetrics } from '../../types/pipeline';
import { formatCurrency } from '../../utils/formatters';

interface MetricCardsProps {
  metrics: PipelineMetrics;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {/* 1. Active Leads */}
      <div className="glass-panel p-4 rounded-xl border border-ops-border hover:border-cyan-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Active Leads</span>
          <div className="p-1.5 rounded-lg bg-cyan-950/60 text-ops-cyan border border-cyan-800/40 group-hover:scale-105 transition-transform">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100 group-hover:text-ops-cyan transition-colors">
          {metrics.totalActiveLeads}
        </div>
        <div className="mt-1 flex items-center text-[10px] text-emerald-400 font-mono gap-1">
          <ArrowUpRight className="w-3 h-3" />
          <span>+8.4% this cycle</span>
        </div>
      </div>

      {/* 2. Leads Qualified */}
      <div className="glass-panel p-4 rounded-xl border border-ops-border hover:border-indigo-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Qualified</span>
          <div className="p-1.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 group-hover:scale-105 transition-transform">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100 group-hover:text-indigo-400 transition-colors">
          {metrics.leadsQualifiedToday}
        </div>
        <div className="mt-1 flex items-center text-[10px] text-slate-400 font-mono">
          <span>Score threshold ≥ 80</span>
        </div>
      </div>

      {/* 3. Won Today */}
      <div className="glass-panel p-4 rounded-xl border border-ops-border hover:border-emerald-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Won Today</span>
          <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 group-hover:scale-105 transition-transform">
            <Trophy className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">
          {metrics.wonTodayCount}
        </div>
        <div className="mt-1 flex items-center text-[10px] text-emerald-400/90 font-mono">
          <span>{formatCurrency(metrics.wonTodayValue)} ARR</span>
        </div>
      </div>

      {/* 4. Won This Week */}
      <div className="glass-panel p-4 rounded-xl border border-ops-border hover:border-emerald-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Won This Week</span>
          <div className="p-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/30 group-hover:scale-105 transition-transform">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">
          {metrics.wonThisWeekCount}
        </div>
        <div className="mt-1 flex items-center text-[10px] text-slate-400 font-mono">
          <span>{formatCurrency(metrics.wonThisWeekValue)} ARR</span>
        </div>
      </div>

      {/* 5. Conversion Rate */}
      <div className="glass-panel p-4 rounded-xl border border-ops-border hover:border-cyan-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Conversion Rate</span>
          <div className="p-1.5 rounded-lg bg-cyan-950/60 text-ops-cyan border border-cyan-800/40 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100 group-hover:text-ops-cyan transition-colors">
          {metrics.overallConversionRate}%
        </div>
        <div className="mt-1 flex items-center text-[10px] text-emerald-400 font-mono gap-1">
          <ArrowUpRight className="w-3 h-3" />
          <span>+2.1% benchmark</span>
        </div>
      </div>

      {/* 6. Avg Velocity */}
      <div className="glass-panel p-4 rounded-xl border border-ops-border hover:border-amber-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Avg Velocity</span>
          <div className="p-1.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/40 group-hover:scale-105 transition-transform">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100 group-hover:text-amber-400 transition-colors">
          {metrics.avgVelocityHours}h
        </div>
        <div className="mt-1 flex items-center text-[10px] text-slate-400 font-mono">
          <span>Intake to Close</span>
        </div>
      </div>
    </div>
  );
};
