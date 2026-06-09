'use client';

import type { InstalmentEntry } from '@/lib/data';

interface Props { instalments: InstalmentEntry[]; }

export default function InstalmentsTable({ instalments }: Props) {
  const total = instalments.reduce((s, r) => s + r.amount, 0);

  return (
    <div
      className="rounded-xl border p-5 flex flex-col"
      style={{ background: 'linear-gradient(160deg,#0d1117,#090d16)', borderColor: '#1a2035' }}
    >
      <h3 className="text-white font-semibold text-sm">Upcoming Instalments Due</h3>
      <p className="text-slate-500 text-xs mt-0.5 mb-4">Next scheduled payments</p>

      {instalments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10 text-slate-600 text-sm">
          No upcoming instalments
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto max-h-[310px] pr-1 -mr-1">
            <table className="w-full text-xs">
              <thead className="sticky top-0" style={{ background: '#0d1117' }}>
                <tr className="border-b" style={{ borderColor: '#1a2035' }}>
                  <th className="text-left text-slate-500 font-semibold uppercase tracking-wider pb-2.5">Lead</th>
                  <th className="text-left text-slate-500 font-semibold uppercase tracking-wider pb-2.5">Date</th>
                  <th className="text-right text-slate-500 font-semibold uppercase tracking-wider pb-2.5">Amount</th>
                </tr>
              </thead>
              <tbody>
                {instalments.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b transition-colors hover:bg-white/[0.025] group"
                    style={{ borderColor: '#1a2035' }}
                  >
                    <td className="py-2.5 text-slate-300 font-medium group-hover:text-white transition-colors">
                      {row.leadName}
                    </td>
                    <td className="py-2.5 text-slate-500">{row.dateExpected}</td>
                    <td className="py-2.5 text-right font-bold" style={{ color: '#00ff88' }}>
                      ${row.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="mt-4 pt-3 border-t flex justify-between items-center"
            style={{ borderColor: '#1a2035' }}
          >
            <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Total due</span>
            <span
              className="text-base font-bold"
              style={{ color: '#00d4ff', textShadow: '0 0 16px #00d4ff60' }}
            >
              ${total.toLocaleString()}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
