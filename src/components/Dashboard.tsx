'use client';

import { useState } from 'react';
import FilterBar, { type Filters } from './FilterBar';
import KpiCard from './KpiCard';
import CashBarChart from './CashBarChart';
import InstalmentsTable from './InstalmentsTable';
import LeadSourceDonut from './LeadSourceDonut';
import { KPI_CARDS } from '@/lib/data';

export default function Dashboard() {
  const [filters, setFilters] = useState<Filters>({
    closer:     'All Closers',
    setter:     'All Setters',
    dateRange:  'Last 30 Days',
    leadSource: 'All Sources',
  });

  return (
    <div className="min-h-screen text-white" style={{ background: '#030305' }}>
      <div className="max-w-[1700px] mx-auto px-5 py-7 lg:px-8 lg:py-8">

        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {/* Logo mark */}
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
            <p className="text-slate-500 text-sm pl-12">High Ticket Performance Overview</p>
          </div>

          <div className="pl-12 sm:pl-0 sm:text-right">
            <p className="text-white font-semibold text-sm">Jun 9, 2026</p>
            <div className="flex items-center sm:justify-end gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-slate-500 text-xs">Live</span>
            </div>
          </div>
        </header>

        {/* ── Filters ── */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {KPI_CARDS.map(card => (
            <KpiCard key={card.id} {...card} />
          ))}
        </div>

        {/* ── Bottom Panels ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1.5fr_1.1fr] gap-4 items-start">
          <CashBarChart />
          <InstalmentsTable />
          <LeadSourceDonut />
        </div>

      </div>
    </div>
  );
}
