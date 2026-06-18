'use client';

import type { InstalmentEntry } from '@/lib/data';

interface Props { instalments: InstalmentEntry[]; }

export default function InstalmentsTable({ instalments }: Props) {
  const total = instalments.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container p-5 flex flex-col">
      <h3 className="text-base font-semibold text-on-surface">Upcoming Instalments Due</h3>
      <p className="text-xs text-on-surface-variant mt-1 mb-4">Next scheduled payments</p>

      {instalments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10 text-on-surface-variant text-sm">
          No upcoming instalments
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto max-h-[310px] pr-1 -mr-1">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-surface-container-high">
                <tr className="border-b border-outline-variant/30">
                  <th className="section-label text-left pb-2.5 pt-1">Lead</th>
                  <th className="section-label text-left pb-2.5 pt-1">Date</th>
                  <th className="section-label text-right pb-2.5 pt-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                {instalments.map((row, i) => (
                  <tr key={i} className="border-b border-outline-variant/20 transition-colors hover:bg-surface-variant/20 group">
                    <td className="py-2.5 text-on-surface-variant group-hover:text-on-surface transition-colors">
                      {row.leadName}
                    </td>
                    <td className="py-2.5 text-on-surface-variant font-mono">{row.dateExpected}</td>
                    <td className="py-2.5 text-right font-mono text-positive">
                      ${row.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant/30 flex justify-between items-center">
            <span className="section-label">Total due</span>
            <span className="font-mono font-semibold text-base text-on-surface">
              ${total.toLocaleString()}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
