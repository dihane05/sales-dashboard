'use client';

import { CLOSERS, DATE_RANGES, LEAD_SOURCES, SETTERS } from '@/lib/data';

export interface Filters {
  closer: string;
  setter: string;
  dateRange: string;
  leadSource: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const FILTER_DEFS = [
  { key: 'dateRange'  as const, label: 'Date Range',  options: DATE_RANGES  },
  { key: 'closer'     as const, label: 'Closer',      options: CLOSERS      },
  { key: 'setter'     as const, label: 'Setter',      options: SETTERS      },
  { key: 'leadSource' as const, label: 'Lead Source', options: LEAD_SOURCES },
];

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest mr-1">
        Filters
      </span>

      {FILTER_DEFS.map(({ key, label, options }) => (
        <div key={key} className="relative">
          <select
            value={filters[key]}
            onChange={e => onChange({ ...filters, [key]: e.target.value })}
            className="appearance-none bg-[#0d1117] border border-[#1a2035] text-slate-300 text-sm
                       rounded-lg pl-3 pr-8 py-2 cursor-pointer transition-colors
                       hover:border-[#2a3450] focus:outline-none focus:ring-1
                       focus:ring-[#00d4ff] focus:border-[#00d4ff]"
            aria-label={label}
          >
            {options.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            width="10" height="10" viewBox="0 0 10 10" fill="none"
          >
            <path d="M1.5 3.5L5 7L8.5 3.5" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ))}
    </div>
  );
}
