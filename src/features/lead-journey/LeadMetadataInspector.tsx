import React from 'react';
import { Terminal, Tag, FileText } from 'lucide-react';
import { Lead } from '../../types/pipeline';

interface LeadMetadataInspectorProps {
  lead: Lead;
}

export const LeadMetadataInspector: React.FC<LeadMetadataInspectorProps> = ({ lead }) => {
  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-ops-border space-y-4 font-mono text-xs w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-ops-cyan" />
          Technical Parameters & Metadata
        </h3>
        <span className="text-[10px] text-slate-500">SYSTEM DIAGNOSTICS</span>
      </div>

      {/* Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <div>
          <span className="text-[10px] text-slate-500 uppercase block mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Applied Operational Tags
          </span>
          <div className="flex flex-wrap gap-1.5">
            {lead.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Operational Notes */}
      {lead.notes && (
        <div className="p-3 rounded-xl bg-ops-surface/60 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Operational Dispatch Notes
          </span>
          <p className="text-slate-300 text-xs font-sans">{lead.notes}</p>
        </div>
      )}

      {/* Raw Payload Inspector */}
      <div>
        <span className="text-[10px] text-slate-500 uppercase block mb-1.5">
          Ingested Lead JSON Record
        </span>
        <pre className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-slate-400 overflow-x-auto text-[10px] max-h-56">
          {JSON.stringify(
            {
              id: lead.id,
              name: lead.name,
              company: lead.company,
              email: lead.email,
              phone: lead.phone,
              source: lead.source,
              currentStage: lead.currentStage,
              assignedAgentId: lead.assignedAgentId,
              priority: lead.priority,
              score: lead.score,
              estimatedValue: lead.estimatedValue,
              health: lead.health,
              createdAt: lead.createdAt,
              updatedAt: lead.updatedAt,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};
