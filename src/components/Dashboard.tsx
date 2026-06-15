'use client';

import { useEffect, useMemo, useState } from 'react';
import FilterBar, { type Filters } from './FilterBar';
import KpiCard from './KpiCard';
import CashBarChart from './CashBarChart';
import InstalmentsTable from './InstalmentsTable';
import LeadSourceDonut from './LeadSourceDonut';
import type { DashboardData } from '@/lib/airtable';
import { computeDashboard } from '@/lib/computations';
import { DATE_RANGES } from '@/lib/data';

const REFRESH_INTERVAL_MS = 60_000;

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? `Request failed: ${res.status}`);
        }
        const json: DashboardData = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      }
    }

    load();
    const interval = setInterval(load, REFRESH_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Build filter option lists from live data
  const closerOptions = useMemo(() => {
    if (!data) return ['All Closers'];
    const names = data.members
      .filter(m => m.roles.some(r => r.toLowerCase().includes('closer')))
      .map(m => m.name)
      .filter(Boolean)
      .sort();
    return ['All Closers', ...names];
  }, [data]);

  const setterOptions = useMemo(() => {
    if (!data) return ['All Setters'];
    const names = data.members
      .filter(m => m.roles.some(r => r.toLowerCase().includes('setter')))
      .map(m => m.name)
      .filter(Boolean)
      .sort();
    return ['All Setters', ...names];
  }, [data]);

  const leadSourceOptions = useMemo(() => {
    if (!data) return ['All Sources'];
    const seen = new Set<string>();
    const sources = data.pcf
      .map(r => r.leadSource)
      .filter((s): s is string => Boolean(s) && !seen.has(s) && !!seen.add(s))
      .sort();
    return ['All Sources', ...sources];
  }, [data]);

  const [filters, setFilters] = useState<Filters>({
    closer:     'All Closers',
    setter:     'All Setters',
    dateRange:  '30D',
    leadSource: 'All Sources',
  });

  const computed = useMemo(
    () => data ? computeDashboard(data.eod, data.pcf, filters) : null,
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

        {error && (
          <div className="mb-6 rounded border border-negative/30 bg-card p-4 text-sm text-negative">
            Failed to load dashboard data: {error}
          </div>
        )}

        {!data && !error && (
          <div className="flex items-center justify-center py-24">
            <span className="font-mono text-sm text-muted">Loading dashboard…</span>
          </div>
        )}

        {data && computed && (
          <>
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
          </>
        )}

      </div>
    </div>
  );
}
