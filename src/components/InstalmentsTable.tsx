'use client';

import type { InstalmentEntry } from '@/lib/data';

interface Props { instalments: InstalmentEntry[]; }

export default function InstalmentsTable({ instalments }: Props) {
  const total = instalments.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="rounded border border-border bg-card p-5 flex flex-col">
      <h3 className="section-label">Upcoming Instalments Due</h3>
      <p className="text-xs text-muted mt-1 mb-4">Next scheduled payments</p>

      {instalments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10 text-muted text-sm">
          No upcoming instalments
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto max-h-[310px] pr-1 -mr-1">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border">
                  <th className="section-label text-left pb-2.5">Lead</th>
                  <th className="section-label text-left pb-2.5">Date</th>
                  <th className="section-label text-right pb-2.5">Amount</th>
                </tr>
              </thead>
              <tbody>
                {instalments.map((row, i) => (
                  <tr key={i} className="border-b border-border transition-colors hover:bg-white/[0.02] group">
                    <td className="py-2.5 text-secondary group-hover:text-text transition-colors">
                      {row.leadName}
                    </td>
                    <td className="py-2.5 text-muted font-mono">{row.dateExpected}</td>
                    <td className="py-2.5 text-right font-mono text-positive">
                      ${row.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
            <span className="section-label">Total due</span>
            <span className="font-mono font-medium text-base text-text">
              ${total.toLocaleString()}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
