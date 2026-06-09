// Shared type definitions used across components and computations.

export type Format = 'number' | 'currency' | 'percent';

export interface KpiCardData {
  id: string;
  label: string;
  value: number;
  format: Format;
  trend: number;
  accentColor: string;
  sparkline: { v: number }[];
}

export interface LeadSourceEntry {
  name: string;
  value: number;
  color: string;
}

export interface InstalmentEntry {
  leadName: string;
  dateExpected: string;
  amount: number;
}

export const DATE_RANGES = [
  'All Time',
  'Last 7 Days',
  'Last 14 Days',
  'Last 30 Days',
  'Last 90 Days',
  'This Month',
  'Last Month',
];
