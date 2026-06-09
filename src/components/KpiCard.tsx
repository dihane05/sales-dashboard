'use client';

import { useEffect, useRef, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
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

export default function KpiCard({ id, label, value, format, trend, accentColor, sparkline }: KpiCardData) {
  const animated  = useCountUp(value);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const trendGood = NEGATIVE_IDS.has(id) ? trend < 0 : trend >= 0;
  const gradId = `sg-${id}`;

  return (
    <div
      className="relative flex flex-col rounded-xl border overflow-hidden
                 transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(160deg,#0d1117 0%,#090d16 100%)',
        borderColor: '#1a2035',
      }}
    >
      {/* Neon top line */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(90deg,transparent,${accentColor},transparent)` }}
      />

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-1 mb-3">
          <span className="text-xs font-medium text-slate-400 leading-snug">{label}</span>
          <span
            className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
            style={{
              color:      trendGood ? '#00ff88' : '#ff3d57',
              background: trendGood ? 'rgba(0,255,136,0.12)' : 'rgba(255,61,87,0.12)',
            }}
          >
            {trend >= 0 ? '↑' : '↓'}&nbsp;{Math.abs(trend)}%
          </span>
        </div>

        <div
          className="text-[1.45rem] font-bold tracking-tight leading-none mb-3"
          style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}50` }}
        >
          {fmt(animated, format)}
        </div>
      </div>

      {/* Sparkline — only render in browser to avoid hydration diff */}
      <div className="h-14 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkline} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={accentColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={accentColor}
                strokeWidth={1.5}
                fill={`url(#${gradId})`}
                dot={false}
                isAnimationActive
                animationDuration={1600}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-14 w-full" />
        )}
      </div>
    </div>
  );
}
