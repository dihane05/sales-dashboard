'use client';

import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { TooltipContentProps } from 'recharts';
import type { LeadSourceEntry } from '@/lib/data';

interface Props { data: LeadSourceEntry[]; }

function CustomTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0] as { payload?: LeadSourceEntry };
  const entry = d.payload;
  if (!entry) return null;
  const total = (payload[0] as { payload?: { __total?: number } }).payload?.__total ?? 0;
  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface-container-high text-xs p-3">
      <p className="font-medium mb-1" style={{ color: entry.color }}>{entry.name}</p>
      <p className="font-mono text-on-surface-variant">${entry.value.toLocaleString()}</p>
      {total > 0 && (
        <p className="text-on-surface-variant">{((entry.value / total) * 100).toFixed(1)}% of total</p>
      )}
    </div>
  );
}

export default function LeadSourceDonut({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const total = data.reduce((s, d) => s + d.value, 0);
  const enriched = data.map(d => ({ ...d, __total: total }));

  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container p-5 flex flex-col">
      <h3 className="text-base font-semibold text-on-surface">Cash Collected</h3>
      <p className="text-xs text-on-surface-variant mt-1 mb-4">By lead source</p>

      {!mounted ? (
        <div className="h-[180px]" />
      ) : data.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center text-on-surface-variant text-sm">
          No data
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={enriched}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={3}
                dataKey="value"
                isAnimationActive
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {enriched.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={CustomTooltip} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="section-label">Total</span>
            <span className="font-mono font-semibold text-sm text-on-surface mt-0.5">
              ${total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 space-y-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-on-surface-variant">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-on-surface-variant">
                ${d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}K` : d.value}
              </span>
              {total > 0 && (
                <span className="font-mono font-medium text-on-surface-variant w-10 text-right">
                  {((d.value / total) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
