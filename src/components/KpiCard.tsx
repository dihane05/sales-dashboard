'use client';

import { useEffect, useRef, useState } from 'react';
import type { KpiCardData, Format } from '@/lib/data';

const NEGATIVE_IDS = new Set(['noShows', 'cancelledCalls', 'reschedules']);
const GREEN_IDS    = new Set(['cashCollected', 'revenueGenerated']);

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
  const animated  = useCountUp(value);
  const isNeg     = NEGATIVE_IDS.has(id);
  const isGreen   = GREEN_IDS.has(id);
  const trendGood = isNeg ? trend < 0 : trend >= 0;

  const borderCls = isGreen
    ? 'border-2 border-green-500/50'
    : isNeg
      ? 'border border-error/50'
      : 'border border-outline-variant/30';

  const labelCls = isGreen
    ? 'text-green-400 font-bold'
    : isNeg
      ? 'text-error font-bold'
      : 'text-on-surface-variant';

  const valueCls = isGreen ? 'text-green-400' : isNeg ? 'text-error' : 'text-on-surface';

  const trendCls = isGreen
    ? 'text-green-400'
    : isNeg
      ? 'text-error'
      : trendGood ? 'text-primary' : 'text-error';

  return (
    <div className={`flex flex-col gap-1 rounded-xl bg-surface-container ${borderCls} p-4 transition-colors`}>
      <span className={`text-[10px] font-medium uppercase tracking-[0.05em] ${labelCls}`}>
        {label}
      </span>
      <div className={`font-mono text-2xl font-semibold tabular-nums leading-tight ${valueCls}`}>
        {fmt(animated, format)}
      </div>
      {trend !== 0 ? (
        <div className={`flex items-center gap-0.5 text-[10px] font-medium mt-0.5 ${trendCls}`}>
          <span>{trend >= 0 ? '▲' : '▼'}</span>
          <span>{trend >= 0 ? '+' : ''}{trend}%</span>
        </div>
      ) : (
        <div className="text-[10px] text-on-surface-variant mt-0.5">N/A</div>
      )}
    </div>
  );
}
