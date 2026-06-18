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

const NAV_ITEMS = [
  { label: 'Dashboard', active: true  },
  { label: 'Analytics', active: false },
  { label: 'Leads',     active: false },
  { label: 'Accounts',  active: false },
];

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
        if (!cancelled) { setData(json); setError(null); }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      }
    }

    load();
    const interval = setInterval(load, REFRESH_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const closerOptions = useMemo(() => {
    if (!data) return ['All Closers'];
    const names = data.members
      .filter(m => m.roles.some(r => r.toLowerCase().includes('closer')))
      .map(m => m.name).filter(Boolean).sort();
    return ['All Closers', ...names];
  }, [data]);

  const setterOptions = useMemo(() => {
    if (!data) return ['All Setters'];
    const names = data.members
      .filter(m => m.roles.some(r => r.toLowerCase().includes('setter')))
      .map(m => m.name).filter(Boolean).sort();
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
    <div className="flex min-h-screen overflow-hidden bg-surface text-on-surface">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-full w-sidebar-width bg-surface-container border-r border-outline-variant/30 flex flex-col py-6 z-50">
        <div className="px-6 mb-10">
          <h1 className="text-xl font-semibold text-primary mb-1">SalesForce HQ</h1>
          <p className="text-sm text-on-surface-variant">Direct Sales Division</p>
        </div>

        <button className="mx-6 mb-8 bg-primary text-on-primary py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95">
          <span className="text-base leading-none font-bold">+</span>
          New Report
        </button>

        <nav className="flex-1 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <div key={item.label} className="px-3">
              <a
                href="#"
                className={`flex items-center gap-3 px-4 py-3 text-sm rounded transition-all ${
                  item.active
                    ? 'text-on-surface border-l-4 border-primary bg-primary/10 font-medium'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 border-l-4 border-transparent'
                }`}
              >
                {item.label}
              </a>
            </div>
          ))}

          <div className="px-3 border-t border-outline-variant/30 mt-4 pt-4">
            <div className="px-4">
              <label className="section-label block mb-3">Date Range</label>
              <div className="flex flex-wrap gap-1.5">
                {DATE_RANGES.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFilters(f => ({ ...f, dateRange: r }))}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      filters.dateRange === r
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-auto border-t border-outline-variant/30 pt-4 px-3 space-y-0.5">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface transition-colors text-sm">
            Support
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface transition-colors text-sm">
            Sign Out
          </a>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <main className="flex-1 ml-sidebar-width h-screen overflow-y-auto bg-surface">

        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant/30 h-16 flex justify-between items-center px-6">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-on-surface">SalesEngine</span>
            <div className="hidden md:flex items-center bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/30 gap-2 focus-within:border-primary transition-colors">
              <svg className="w-4 h-4 text-on-surface-variant shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/50 w-56 outline-none"
                placeholder="Search data..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
              <span className="font-mono text-xs text-on-surface-variant">Live · 60s</span>
            </div>
            <div className="h-6 w-px bg-outline-variant/30" />
            <span className="font-mono text-xs text-on-surface-variant hidden lg:block">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="rounded-xl border border-error/30 bg-error-container/10 p-4 text-sm text-error">
              Failed to load dashboard data: {error}
            </div>
          )}

          {!data && !error && (
            <div className="flex items-center justify-center py-24">
              <span className="font-mono text-sm text-on-surface-variant">Loading dashboard…</span>
            </div>
          )}

          {data && computed && (
            <>
              {/* Filters */}
              <FilterBar
                filters={filters}
                onChange={setFilters}
                dateRanges={DATE_RANGES}
                closers={closerOptions}
                setters={setterOptions}
                leadSources={leadSourceOptions}
              />

              {/* KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {computed.kpiCards.map(card => (
                  <KpiCard key={card.id} {...card} />
                ))}
              </div>

              {/* Charts */}
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
      </main>
    </div>
  );
}
