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
    dateRange:  'All Time',
    leadSource: 'All Sources',
  });

  const computed = useMemo(
    () => computeDashboard(data.eod, data.pcf, filters),
    [data, filters],
  );

  return (
    <div className="min-h-screen text-white" style={{ background: '#030305' }}>
      <div className="max-w-[1700px] mx-auto px-5 py-7 lg:px-8 lg:py-8">

        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-black text-base shrink-0"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#00ff88)' }}
              >
                $
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                <span
                  style={{
                    background: 'linear-gradient(90deg,#00d4ff,#00ff88)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Sales
                </span>
                <span className="text-white"> Dashboard</span>
              </h1>
            </div>
            <p className="text-slate-500 text-sm pl-12">High Ticket Performance · Live from Airtable</p>
          </div>

          <div className="pl-12 sm:pl-0 sm:text-right">
            <p className="text-white font-semibold text-sm">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <div className="flex items-center sm:justify-end gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-slate-500 text-xs">Live · refreshes every 60 s</span>
            </div>
          </div>
        </header>

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
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
