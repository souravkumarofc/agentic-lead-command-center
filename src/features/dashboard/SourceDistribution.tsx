import React from 'react';
import { MessageSquare, Globe, Share2, Mail, Compass } from 'lucide-react';
import { SOURCE_CONFIG } from '../../utils/colors';
import { LeadSource, PipelineMetrics } from '../../types/pipeline';

interface SourceDistributionProps {
  sourceDistribution: PipelineMetrics['sourceDistribution'];
}

export const SourceDistribution: React.FC<SourceDistributionProps> = ({ sourceDistribution }) => {
  const sources: LeadSource[] = ['whatsapp', 'website', 'facebook', 'email'];
  const total = Object.values(sourceDistribution).reduce((a, b) => a + b, 0) || 1;

  const getIcon = (source: LeadSource) => {
    switch (source) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'website':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'facebook':
        return <Share2 className="w-4 h-4 text-blue-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-ops-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-ops-cyan" />
            Lead Intake Sources
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-channel ingestion distribution & conversion telemetry
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sources.map((src) => {
          const count = sourceDistribution[src] || 0;
          const pct = Math.round((count / total) * 100);
          const config = SOURCE_CONFIG[src];

          return (
            <div
              key={src}
              className="p-3.5 rounded-lg bg-ops-surface/60 border border-ops-border hover:border-slate-600 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-ops-card border border-slate-700">
                    {getIcon(src)}
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-200">
                    {config.label}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-100">
                  {count}
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden mb-1">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>{pct}% share</span>
                <span className="text-slate-500">Autonomous sync</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
