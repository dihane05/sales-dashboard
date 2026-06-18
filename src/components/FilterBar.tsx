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
  const dropdowns = [
    { key: 'closer'     as const, options: closers,     label: 'Closer'      },
    { key: 'setter'     as const, options: setters,     label: 'Setter'      },
    { key: 'leadSource' as const, options: leadSources, label: 'Lead Source' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="section-label mr-1">Range</span>
        {dateRanges.map(r => (
          <button
            key={r}
            type="button"
            onClick={() => onChange({ ...filters, dateRange: r })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              filters.dateRange === r
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-outline-variant/30 bg-surface-container text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {dropdowns.map(({ key, options, label }) => (
          <div key={key} className="relative">
            <select
              value={filters[key]}
              onChange={e => onChange({ ...filters, [key]: e.target.value })}
              aria-label={label}
              className="appearance-none bg-surface-container border border-outline-variant/30
                         text-on-surface-variant text-xs rounded-lg pl-3 pr-7 py-2
                         cursor-pointer transition-colors hover:border-outline-variant
                         focus:outline-none focus:border-primary"
            >
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
              width="10" height="10" viewBox="0 0 10 10" fill="none"
            >
              <path d="M1.5 3.5L5 7L8.5 3.5" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
