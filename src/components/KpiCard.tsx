'use client';

import { useEffect, useRef, useState } from 'react';
import type { KpiCardData, Format } from '@/lib/data';

const NEGATIVE_IDS = new Set(['noShows', 'cancelledCalls', 'reschedules']);

function fmt(raw: number, format: Format): string {
  if (format === 'currency') {
    if (raw >= 1_000_000) return `$${(raw / 1_000_000).toFixed(2)}M`;
    if (raw >= 10_000)    return `$${(raw / 1_000).toFixed(1)}K`;
    if (raw >= 1_000)     return `$${(raw / 1_000).toFixed(2)}K`;
    return `$${Math.round(raw).toLocaleString()}`;
  }
  if (format === 'percent') return `${raw.toFixed(1)}%`;
  return Math.round(raw).toLocaleString();
}

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return value;
}

export default function KpiCard({ id, label, value, format, trend }: KpiCardData) {
  const animated = useCountUp(value);
  const trendGood = NEGATIVE_IDS.has(id) ? trend < 0 : trend >= 0;

  return (
    <div className="flex flex-col gap-3 rounded border border-border bg-card p-4 transition-colors hover:border-border-light">
      <span className="section-label">{label}</span>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-2xl font-medium text-text tabular-nums">
          {fmt(animated, format)}
        </span>
        {trend !== 0 && (
          <span className={`font-mono text-xs ${trendGood ? 'text-positive' : 'text-negative'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}
