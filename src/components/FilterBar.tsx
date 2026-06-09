'use client';

export interface Filters {
  closer: string;
  setter: string;
  dateRange: string;
  leadSource: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  dateRanges: string[];
  closers: string[];
  setters: string[];
  leadSources: string[];
}

export default function FilterBar({
  filters, onChange,
  dateRanges, closers, setters, leadSources,
}: FilterBarProps) {
  const defs = [
    { key: 'dateRange'  as const, options: dateRanges,  label: 'Date Range'  },
    { key: 'closer'     as const, options: closers,     label: 'Closer'      },
    { key: 'setter'     as const, options: setters,     label: 'Setter'      },
    { key: 'leadSource' as const, options: leadSources, label: 'Lead Source' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest mr-1">
        Filters
      </span>

      {defs.map(({ key, options, label }) => (
        <div key={key} className="relative">
          <select
            value={filters[key]}
            onChange={e => onChange({ ...filters, [key]: e.target.value })}
            aria-label={label}
            className="appearance-none bg-[#0d1117] border border-[#1a2035] text-slate-300 text-sm
                       rounded-lg pl-3 pr-8 py-2 cursor-pointer transition-colors
                       hover:border-[#2a3450] focus:outline-none focus:ring-1
                       focus:ring-[#00d4ff] focus:border-[#00d4ff]"
          >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
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
