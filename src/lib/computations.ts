import type { EodRecord, PcfRecord } from './airtable';
import type { KpiCardData, LeadSourceEntry, InstalmentEntry } from './data';
import type { Filters } from '@/components/FilterBar';

// ── Chart data shapes ─────────────────────────────────────────────────────────

export interface BarEntry {
  date: string;
  [name: string]: string | number;
}

export interface DashboardComputed {
  kpiCards: KpiCardData[];
  barData: BarEntry[];
  barCloserNames: string[];
  barCloserColors: string[];
  donutData: LeadSourceEntry[];
  instalments: InstalmentEntry[];
}

// ── Filtering ─────────────────────────────────────────────────────────────────

function dateRange(filters: Filters): { from: string; to: string } | null {
  if (filters.dateRange === 'All') return null;

  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const daysAgo = (n: number) => new Date(today.getTime() - n * 86_400_000);

  switch (filters.dateRange) {
    case '7D':  return { from: iso(daysAgo(7)),  to: iso(today) };
    case '30D': return { from: iso(daysAgo(30)), to: iso(today) };
    case '90D': return { from: iso(daysAgo(90)), to: iso(today) };
    default: return null;
  }
}

export function filterEod(eod: EodRecord[], filters: Filters): EodRecord[] {
  let r = eod;
  const dr = dateRange(filters);
  if (dr) r = r.filter(e => e.date >= dr.from && e.date <= dr.to);
  if (filters.closer !== 'All Closers') r = r.filter(e => e.memberName === filters.closer);
  return r;
}

export function filterPcf(pcf: PcfRecord[], filters: Filters): PcfRecord[] {
  let r = pcf;
  const dr = dateRange(filters);
  if (dr) r = r.filter(p => p.date >= dr.from && p.date <= dr.to);
  if (filters.closer     !== 'All Closers') r = r.filter(p => p.closerName === filters.closer);
  if (filters.setter     !== 'All Setters') r = r.filter(p => p.setterName === filters.setter);
  if (filters.leadSource !== 'All Sources') r = r.filter(p => p.leadSource === filters.leadSource);
  return r;
}

// ── KPI helpers ───────────────────────────────────────────────────────────────

const sumE = (rows: EodRecord[], k: keyof EodRecord) =>
  rows.reduce((s, r) => s + (Number(r[k]) || 0), 0);

function computeTrend(sparkline: { v: number }[]): number {
  if (sparkline.length < 2) return 0;
  const mid = Math.floor(sparkline.length / 2);
  const avg1 = sparkline.slice(0, mid).reduce((s, p) => s + p.v, 0) / mid;
  const avg2 = sparkline.slice(mid).reduce((s, p) => s + p.v, 0) / (sparkline.length - mid);
  if (avg1 === 0) return avg2 > 0 ? 100 : 0;
  return parseFloat(((avg2 - avg1) / avg1 * 100).toFixed(1));
}

function shortDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Sparkline computation ─────────────────────────────────────────────────────

function computeSparklines(
  eod: EodRecord[],
  pcf: PcfRecord[],
): Record<string, { v: number }[]> {
  const byDate: Record<string, EodRecord[]> = {};
  for (const r of eod) {
    if (!r.date) continue;
    (byDate[r.date] ??= []).push(r);
  }
  const pcfByDate: Record<string, PcfRecord[]> = {};
  for (const r of pcf) {
    if (!r.date) continue;
    (pcfByDate[r.date] ??= []).push(r);
  }

  const dates = Object.keys(byDate).sort();
  if (dates.length === 0) {
    const flat = (v: number): { v: number }[] => [{ v: 0 }, { v }];
    return {
      callsBooked: flat(0), dealsClosed: flat(0), callsTaken: flat(0),
      closeRate: flat(0), callsOnCalendar: flat(0), showRate: flat(0),
      upfrontDealCash: flat(0), deposits: flat(0), cashFromDeposits: flat(0),
      aov: flat(0), cashCollected: flat(0), revenueGenerated: flat(0),
      noShows: flat(0), cancelledCalls: flat(0), reschedules: flat(0),
      cashPerDay: flat(0), cashPerCallTaken: flat(0), cashPerAppointment: flat(0),
    };
  }

  const daily = (fn: (rs: EodRecord[]) => number) =>
    dates.map(d => ({ v: fn(byDate[d]) }));

  return {
    callsBooked:     daily(rs => sumE(rs, 'callsBooked')),
    dealsClosed:     daily(rs => sumE(rs, 'dealsClosed')),
    callsTaken:      daily(rs => sumE(rs, 'liveCalls')),
    closeRate: daily(rs => {
      const d = sumE(rs, 'dealsClosed'), t = sumE(rs, 'liveCalls');
      return t > 0 ? (d / t) * 100 : 0;
    }),
    callsOnCalendar: daily(rs => sumE(rs, 'callsOnCalendar')),
    showRate: daily(rs => {
      const t = sumE(rs, 'liveCalls'), n = sumE(rs, 'noShows'), c = sumE(rs, 'cancels');
      return (t + n + c) > 0 ? (t / (t + n + c)) * 100 : 0;
    }),
    upfrontDealCash: dates.map(d => ({
      v: (pcfByDate[d] ?? [])
        .filter(r => r.callOutcome === 'Closed')
        .reduce((s, r) => s + r.cashCollected, 0),
    })),
    deposits:        daily(rs => sumE(rs, 'depositsCollected')),
    cashFromDeposits:daily(rs => sumE(rs, 'cashFromDeposits')),
    aov: dates.map(d => {
      const closed = (pcfByDate[d] ?? []).filter(r => r.callOutcome === 'Closed');
      return { v: closed.length ? closed.reduce((s, r) => s + r.revenueGenerated, 0) / closed.length : 0 };
    }),
    cashCollected:   daily(rs => sumE(rs, 'cashCollected')),
    revenueGenerated:daily(rs => sumE(rs, 'revenueGenerated')),
    noShows:         daily(rs => sumE(rs, 'noShows')),
    cancelledCalls:  daily(rs => sumE(rs, 'cancels')),
    reschedules:     daily(rs => sumE(rs, 'reschedules')),
    cashPerDay:      daily(rs => sumE(rs, 'cashCollected')),
    cashPerCallTaken: daily(rs => {
      const cash = sumE(rs, 'cashCollected'), calls = sumE(rs, 'liveCalls');
      return calls > 0 ? cash / calls : 0;
    }),
    cashPerAppointment: daily(rs => {
      const cash = sumE(rs, 'cashCollected');
      const t = sumE(rs, 'liveCalls'), n = sumE(rs, 'noShows');
      return (t + n) > 0 ? cash / (t + n) : 0;
    }),
  };
}

// ── KPI card templates ────────────────────────────────────────────────────────

const TEMPLATES: Array<{ id: string; label: string; format: KpiCardData['format'] }> = [
  { id: 'callsBooked',        label: 'Calls Booked',          format: 'number'   },
  { id: 'dealsClosed',        label: 'Deals Closed',          format: 'number'   },
  { id: 'callsTaken',         label: 'Calls Taken',           format: 'number'   },
  { id: 'closeRate',          label: 'Close Rate',            format: 'percent'  },
  { id: 'callsOnCalendar',    label: 'Calls On Calendar',     format: 'number'   },
  { id: 'showRate',           label: 'Show Rate',             format: 'percent'  },
  { id: 'upfrontDealCash',    label: 'Upfront Deal Cash',     format: 'currency' },
  { id: 'deposits',           label: 'Deposits',              format: 'number'   },
  { id: 'cashFromDeposits',   label: 'Cash from Deposits',    format: 'currency' },
  { id: 'aov',                label: 'AOV',                   format: 'currency' },
  { id: 'cashCollected',      label: 'Cash Collected',        format: 'currency' },
  { id: 'revenueGenerated',   label: 'Revenue Generated',     format: 'currency' },
  { id: 'noShows',            label: 'No Shows',              format: 'number'   },
  { id: 'cancelledCalls',     label: 'Cancelled Calls',       format: 'number'   },
  { id: 'reschedules',        label: 'Reschedules',           format: 'number'   },
  { id: 'cashPerDay',         label: 'Cash per Day',          format: 'currency' },
  { id: 'cashPerCallTaken',   label: 'Cash per Call Taken',   format: 'currency' },
  { id: 'cashPerAppointment', label: 'Cash per Appointment',  format: 'currency' },
];

// ── Main compute function ─────────────────────────────────────────────────────

export function computeDashboard(
  eod: EodRecord[],
  pcf: PcfRecord[],
  filters: Filters,
): DashboardComputed {
  const fEod = filterEod(eod, filters);
  const fPcf = filterPcf(pcf, filters);

  // ── KPI values ──
  const callsTaken  = sumE(fEod, 'liveCalls');
  const dealsClosed = sumE(fEod, 'dealsClosed');
  const noShows     = sumE(fEod, 'noShows');
  const cancels     = sumE(fEod, 'cancels');
  const cashColl    = sumE(fEod, 'cashCollected');
  const closedPcf   = fPcf.filter(r => r.callOutcome === 'Closed');
  const uniqueDays  = new Set(fEod.map(r => r.date).filter(Boolean)).size;

  const values: Record<string, number> = {
    callsBooked:        sumE(fEod, 'callsBooked'),
    dealsClosed,
    callsTaken,
    closeRate:          callsTaken > 0 ? (dealsClosed / callsTaken) * 100 : 0,
    callsOnCalendar:    sumE(fEod, 'callsOnCalendar'),
    showRate:           (callsTaken + noShows + cancels) > 0
                          ? (callsTaken / (callsTaken + noShows + cancels)) * 100
                          : 0,
    upfrontDealCash:    closedPcf.reduce((s, r) => s + r.cashCollected, 0),
    deposits:           sumE(fEod, 'depositsCollected'),
    cashFromDeposits:   sumE(fEod, 'cashFromDeposits'),
    aov:                closedPcf.length
                          ? closedPcf.reduce((s, r) => s + r.revenueGenerated, 0) / closedPcf.length
                          : 0,
    cashCollected:      cashColl,
    revenueGenerated:   sumE(fEod, 'revenueGenerated'),
    noShows,
    cancelledCalls:     cancels,
    reschedules:        sumE(fEod, 'reschedules'),
    cashPerDay:         uniqueDays > 0 ? cashColl / uniqueDays : 0,
    cashPerCallTaken:   callsTaken > 0 ? cashColl / callsTaken : 0,
    cashPerAppointment: (callsTaken + noShows) > 0 ? cashColl / (callsTaken + noShows) : 0,
  };

  const sparklines = computeSparklines(fEod, fPcf);

  const kpiCards: KpiCardData[] = TEMPLATES.map(t => ({
    ...t,
    value:     values[t.id] ?? 0,
    trend:     computeTrend(sparklines[t.id] ?? []),
    sparkline: sparklines[t.id]?.length ? sparklines[t.id] : [{ v: 0 }, { v: values[t.id] ?? 0 }],
  }));

  // ── Bar chart: Cash Collected by Date & closer ──
  const CHART_COLORS = ['#4ade80', '#f5f5f5', '#a3a3a3', '#fbbf24', '#f87171', '#60a5fa'];
  const barByDate: Record<string, Record<string, number>> = {};
  for (const r of fEod) {
    if (!r.date) continue;
    const slot = (barByDate[r.date] ??= {});
    slot[r.memberName] = (slot[r.memberName] ?? 0) + r.cashCollected;
  }
  const seen = new Set<string>();
  const barCloserNames = fEod
    .map(r => r.memberName)
    .filter((n): n is string => Boolean(n) && !seen.has(n) && !!seen.add(n))
    .sort();
  const barData: BarEntry[] = Object.entries(barByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, byName]) => ({ date: shortDate(date), ...byName }));

  // ── Donut: Lead Source ──
  const sourceMap: Record<string, number> = {};
  for (const r of fPcf) {
    if (!r.leadSource) continue;
    sourceMap[r.leadSource] = (sourceMap[r.leadSource] ?? 0) + r.cashCollected;
  }
  const donutData: LeadSourceEntry[] = Object.entries(sourceMap)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }));

  // ── Upcoming instalments ──
  const today = new Date().toISOString().slice(0, 10);
  const instRows: InstalmentEntry[] = [];
  for (const r of fPcf) {
    if (r.installment2Due >= today && r.installment2Amount > 0) {
      instRows.push({ leadName: r.leadName || 'Unknown', dateExpected: r.installment2Due, amount: r.installment2Amount });
    }
    if (r.installment3Due >= today && r.installment3Amount > 0) {
      instRows.push({ leadName: r.leadName || 'Unknown', dateExpected: r.installment3Due, amount: r.installment3Amount });
    }
  }
  const instalments = instRows
    .sort((a, b) => a.dateExpected.localeCompare(b.dateExpected))
    .slice(0, 10)
    .map(r => ({
      ...r,
      dateExpected: shortDate(r.dateExpected) || r.dateExpected,
    }));

  return {
    kpiCards,
    barData,
    barCloserNames,
    barCloserColors: barCloserNames.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
    donutData,
    instalments,
  };
}
