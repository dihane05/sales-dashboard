'use client';

import { useEffect, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import type { TooltipContentProps, DefaultLegendContentProps } from 'recharts';
import type { BarEntry } from '@/lib/computations';

interface Props {
  data: BarEntry[];
  closerNames: string[];
  closerColors: string[];
}

const fmtK = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`;

function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const entries = payload as ReadonlyArray<{ value?: number; name?: string; color?: string }>;
  const total = entries.reduce((s, e) => s + (e.value ?? 0), 0);
  return (
    <div
      className="rounded-xl border text-xs p-3 shadow-2xl"
      style={{ background: '#0a0d14', borderColor: '#1a2035', minWidth: 160 }}
    >
      <p className="font-semibold text-slate-200 mb-2">{String(label ?? '')}</p>
      {entries.map((e, i) => (
        <div key={i} className="flex justify-between gap-4 mt-1">
          <span style={{ color: e.color }}>{e.name}</span>
          <span className="text-slate-300 font-medium">${e.value?.toLocaleString()}</span>
        </div>
      ))}
      <div className="flex justify-between gap-4 pt-1.5 mt-1.5 border-t border-slate-700">
        <span className="text-slate-400 font-semibold">Total</span>
        <span className="text-white font-bold">${total.toLocaleString()}</span>
      </div>
    </div>
  );
}

function CustomLegend({ payload }: DefaultLegendContentProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
      {payload?.map(e => (
        <div key={String(e.value)} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: e.color }} />
          <span className="text-xs text-slate-400">{String(e.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function CashBarChart({ data, closerNames, closerColors }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'linear-gradient(160deg,#0d1117,#090d16)', borderColor: '#1a2035' }}
    >
      <h3 className="text-white font-semibold text-sm">Cash Collected by Date &amp; Closer</h3>
      <p className="text-slate-500 text-xs mt-0.5 mb-5">Stacked by team member</p>

      {!mounted ? (
        <div className="h-[314px]" />
      ) : data.length === 0 ? (
        <div className="h-[314px] flex items-center justify-center text-slate-600 text-sm">
          No data for selected filters
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2035" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={{ stroke: '#1a2035' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmtK}
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={46}
            />
            <Tooltip content={CustomTooltip} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend content={CustomLegend} />
            {closerNames.map((name, i) => (
              <Bar
                key={name}
                dataKey={name}
                stackId="a"
                fill={closerColors[i]}
                radius={i === closerNames.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
