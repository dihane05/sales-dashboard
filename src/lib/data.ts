// Shared type definitions used across components and computations.

export type Format = 'number' | 'currency' | 'percent';

export interface KpiCardData {
  id: string;
  label: string;
  value: number;
  format: Format;
  trend: number;
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

export const DATE_RANGES = ['7D', '30D', '90D', 'All'];
