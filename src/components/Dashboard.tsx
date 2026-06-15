'use client';

import { useMemo, useState } from 'react';
import FilterBar, { type Filters } from './FilterBar';
import KpiCard from './KpiCard';
import CashBarChart from './CashBarChart';
import InstalmentsTable from './InstalmentsTable';
import LeadSourceDonut from './LeadSourceDonut';
import type { DashboardData } from '@/lib/airtable';
import { computeDashboard } from '@/lib/computations';
import { DATE_RANGES } from '@/lib/data';

interface Props { data: DashboardData; }

export default function Dashboard({ data }: Props) {
  // Build filter option lists from live data
  const closerOptions = useMemo(() => {
    const names = data.members
      .filter(m => m.roles.some(r => r.toLowerCase().includes('closer')))
      .map(m => m.name)
      .filter(Boolean)
      .sort();
    return ['All Closers', ...names];
  }, [data.members]);

  const setterOptions = useMemo(() => {
    const names = data.members
      .filter(m => m.roles.some(r => r.toLowerCase().includes('setter')))
      .map(m => m.name)
      .filter(Boolean)
      .sort();
    return ['All Setters', ...names];
  }, [data.members]);

  const leadSourceOptions = useMemo(() => {
    const seen = new Set<string>();
    const sources = data.pcf
      .map(r => r.leadSource)
      .filter((s): s is string => Boolean(s) && !seen.has(s) && !!seen.add(s))
      .sort();
    return ['All Sources', ...sources];
  }, [data.pcf]);

  const [filters, setFilters] = useState<Filters>({
    closer:     'All Closers',
    setter:     'All Setters',
    dateRange:  '30D',
    leadSource: 'All Sources',
  });

  const computed = useMemo(
    () => computeDashboard(data.eod, data.pcf, filters),
    [data, filters],
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ── Top nav ── */}
      <nav className="border-b border-border px-5 lg:px-8 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">Sales Dashboard</span>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-muted">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-positive" />
            <span className="text-xs text-muted">Live · refreshes every 60s</span>
          </div>
        </div>
      </nav>

      <div className="max-w-[1700px] mx-auto px-5 py-6 lg:px-8">

        {/* ── Filters ── */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          dateRanges={DATE_RANGES}
          closers={closerOptions}
          setters={setterOptions}
          leadSources={leadSourceOptions}
        />

        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {computed.kpiCards.map(card => (
            <KpiCard key={card.id} {...card} />
          ))}
        </div>

        {/* ── Bottom Panels ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1.5fr_1.1fr] gap-4 items-start">
          <CashBarChart
            data={computed.barData}
            closerNames={computed.barCloserNames}
            closerColors={computed.barCloserColors}
          />
          <InstalmentsTable instalments={computed.instalments} />
          <LeadSourceDonut data={computed.donutData} />
        </div>

      </div>
    </div>
  );
}
