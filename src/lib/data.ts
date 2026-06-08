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

const sp = (values: number[]): { v: number }[] => values.map(v => ({ v }));

export const KPI_CARDS: KpiCardData[] = [
  {
    id: 'callsBooked',
    label: 'Calls Booked',
    value: 847,
    format: 'number',
    trend: 12.3,
    accentColor: '#00d4ff',
    sparkline: sp([52, 61, 58, 74, 69, 82, 55, 71, 88, 65, 79, 91, 73, 86]),
  },
  {
    id: 'dealsClosed',
    label: 'Deals Closed',
    value: 213,
    format: 'number',
    trend: 8.7,
    accentColor: '#00ff88',
    sparkline: sp([12, 15, 11, 18, 14, 20, 16, 22, 17, 19, 21, 23, 18, 25]),
  },
  {
    id: 'callsTaken',
    label: 'Calls Taken',
    value: 612,
    format: 'number',
    trend: 5.2,
    accentColor: '#00d4ff',
    sparkline: sp([38, 44, 41, 52, 48, 56, 42, 51, 61, 47, 55, 64, 50, 58]),
  },
  {
    id: 'closeRate',
    label: 'Close Rate',
    value: 34.8,
    format: 'percent',
    trend: 2.1,
    accentColor: '#00ff88',
    sparkline: sp([29, 31, 28, 34, 32, 37, 30, 35, 38, 33, 36, 39, 34, 42]),
  },
  {
    id: 'callsOnCalendar',
    label: 'Calls On Calendar',
    value: 94,
    format: 'number',
    trend: -3.2,
    accentColor: '#a78bfa',
    sparkline: sp([8, 6, 9, 7, 11, 5, 8, 10, 6, 9, 7, 8, 6, 7]),
  },
  {
    id: 'showRate',
    label: 'Show Rate',
    value: 72.3,
    format: 'percent',
    trend: 1.8,
    accentColor: '#00ff88',
    sparkline: sp([65, 68, 62, 71, 69, 74, 67, 73, 76, 70, 72, 75, 71, 78]),
  },
  {
    id: 'upfrontDealCash',
    label: 'Upfront Deal Cash',
    value: 487250,
    format: 'currency',
    trend: 14.5,
    accentColor: '#00d4ff',
    sparkline: sp([28400, 32100, 29800, 38500, 34200, 41700, 31200, 40100, 45300, 36800, 42500, 48200, 38700, 52100]),
  },
  {
    id: 'deposits',
    label: 'Deposits',
    value: 156,
    format: 'number',
    trend: 6.3,
    accentColor: '#00ff88',
    sparkline: sp([9, 11, 8, 13, 10, 15, 11, 14, 16, 12, 13, 17, 11, 16]),
  },
  {
    id: 'cashFromDeposits',
    label: 'Cash from Deposits',
    value: 78000,
    format: 'currency',
    trend: 9.1,
    accentColor: '#00d4ff',
    sparkline: sp([4500, 5500, 4000, 6500, 5000, 7500, 5500, 7000, 8000, 6000, 6500, 8500, 5500, 8000]),
  },
  {
    id: 'aov',
    label: 'AOV',
    value: 8450,
    format: 'currency',
    trend: 3.4,
    accentColor: '#00ff88',
    sparkline: sp([7800, 8100, 7600, 8400, 8200, 8700, 7900, 8500, 8900, 8200, 8600, 9100, 8400, 9200]),
  },
  {
    id: 'cashCollected',
    label: 'Cash Collected',
    value: 623750,
    format: 'currency',
    trend: 18.2,
    accentColor: '#00d4ff',
    sparkline: sp([38400, 43200, 39800, 51500, 46200, 58700, 42200, 55100, 62300, 48800, 57500, 65200, 51700, 68100]),
  },
  {
    id: 'revenueGenerated',
    label: 'Revenue Generated',
    value: 1847500,
    format: 'currency',
    trend: 22.7,
    accentColor: '#00ff88',
    sparkline: sp([112000, 128000, 118000, 148000, 138000, 165000, 125000, 158000, 178000, 142000, 168000, 188000, 152000, 198000]),
  },
  {
    id: 'noShows',
    label: 'No Shows',
    value: 143,
    format: 'number',
    trend: -8.4,
    accentColor: '#ff3d57',
    sparkline: sp([13, 11, 14, 9, 12, 8, 11, 9, 10, 8, 9, 7, 10, 8]),
  },
  {
    id: 'cancelledCalls',
    label: 'Cancelled Calls',
    value: 89,
    format: 'number',
    trend: -5.1,
    accentColor: '#ff9f43',
    sparkline: sp([8, 7, 9, 6, 8, 5, 7, 6, 7, 5, 6, 5, 7, 6]),
  },
  {
    id: 'reschedules',
    label: 'Reschedules',
    value: 67,
    format: 'number',
    trend: -2.3,
    accentColor: '#ff9f43',
    sparkline: sp([6, 5, 7, 4, 6, 4, 5, 5, 6, 4, 5, 4, 5, 5]),
  },
  {
    id: 'cashPerDay',
    label: 'Cash per Day',
    value: 20792,
    format: 'currency',
    trend: 11.6,
    accentColor: '#00d4ff',
    sparkline: sp([15200, 17800, 16400, 21500, 19200, 24300, 17400, 22800, 25700, 20100, 23700, 26900, 21300, 28100]),
  },
  {
    id: 'cashPerCallTaken',
    label: 'Cash per Call Taken',
    value: 1019,
    format: 'currency',
    trend: 7.8,
    accentColor: '#00ff88',
    sparkline: sp([842, 918, 876, 1024, 968, 1087, 905, 1042, 1124, 978, 1065, 1148, 1012, 1187]),
  },
  {
    id: 'cashPerAppointment',
    label: 'Cash per Appointment',
    value: 737,
    format: 'currency',
    trend: 4.2,
    accentColor: '#00d4ff',
    sparkline: sp([621, 678, 642, 724, 695, 758, 661, 731, 782, 712, 748, 795, 728, 812]),
  },
];

export const CLOSERS = ['All Closers', 'James K.', 'Sarah M.', 'Mike T.', 'Priya S.'];
export const SETTERS = ['All Setters', 'Alex R.', 'Jordan L.', 'Taylor W.', 'Casey B.'];
export const DATE_RANGES = ['Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'Last 90 Days', 'This Month', 'Last Month'];
export const LEAD_SOURCES = ['All Sources', 'Facebook', 'Instagram', 'YouTube', 'Referral', 'Cold Email', 'Podcast'];

export const CLOSER_NAMES = ['James K.', 'Sarah M.', 'Mike T.', 'Priya S.'];
export const CLOSER_COLORS = ['#00d4ff', '#00ff88', '#a78bfa', '#ff9f43'];

export const BAR_CHART_DATA = [
  { date: 'May 27', 'James K.': 18200, 'Sarah M.': 14800, 'Mike T.': 12100, 'Priya S.': 9800 },
  { date: 'May 28', 'James K.': 22400, 'Sarah M.': 16200, 'Mike T.': 15800, 'Priya S.': 11200 },
  { date: 'May 29', 'James K.': 19800, 'Sarah M.': 18400, 'Mike T.': 13200, 'Priya S.': 13800 },
  { date: 'May 30', 'James K.': 28600, 'Sarah M.': 21200, 'Mike T.': 18400, 'Priya S.': 16200 },
  { date: 'May 31', 'James K.': 24200, 'Sarah M.': 19800, 'Mike T.': 16800, 'Priya S.': 14400 },
  { date: 'Jun 1',  'James K.': 31200, 'Sarah M.': 24600, 'Mike T.': 21200, 'Priya S.': 18800 },
  { date: 'Jun 2',  'James K.': 26800, 'Sarah M.': 22400, 'Mike T.': 19600, 'Priya S.': 16200 },
  { date: 'Jun 3',  'James K.': 34400, 'Sarah M.': 28200, 'Mike T.': 24800, 'Priya S.': 20600 },
  { date: 'Jun 4',  'James K.': 38800, 'Sarah M.': 31200, 'Mike T.': 27400, 'Priya S.': 23200 },
  { date: 'Jun 5',  'James K.': 29200, 'Sarah M.': 24800, 'Mike T.': 21600, 'Priya S.': 18400 },
  { date: 'Jun 6',  'James K.': 35600, 'Sarah M.': 29400, 'Mike T.': 25800, 'Priya S.': 21600 },
  { date: 'Jun 7',  'James K.': 41200, 'Sarah M.': 33800, 'Mike T.': 29200, 'Priya S.': 25400 },
  { date: 'Jun 8',  'James K.': 32800, 'Sarah M.': 27200, 'Mike T.': 23400, 'Priya S.': 19800 },
  { date: 'Jun 9',  'James K.': 44800, 'Sarah M.': 36400, 'Mike T.': 31600, 'Priya S.': 27200 },
];

export const LEAD_SOURCE_DATA: LeadSourceEntry[] = [
  { name: 'Facebook',    value: 187500, color: '#00d4ff' },
  { name: 'Instagram',   value: 143200, color: '#00ff88' },
  { name: 'YouTube',     value: 112400, color: '#a78bfa' },
  { name: 'Referral',    value:  98600, color: '#ff9f43' },
  { name: 'Cold Email',  value:  54800, color: '#ff3d57' },
  { name: 'Podcast',     value:  27250, color: '#38bdf8' },
];

export const INSTALMENTS_DATA: InstalmentEntry[] = [
  { leadName: 'Marcus Williams',  dateExpected: 'Jun 10, 2026', amount: 3500 },
  { leadName: 'Jennifer Chen',    dateExpected: 'Jun 11, 2026', amount: 2800 },
  { leadName: 'Robert Okafor',    dateExpected: 'Jun 12, 2026', amount: 5000 },
  { leadName: 'Sofia Martinez',   dateExpected: 'Jun 13, 2026', amount: 4200 },
  { leadName: 'David Thompson',   dateExpected: 'Jun 14, 2026', amount: 1750 },
  { leadName: 'Aisha Patel',      dateExpected: 'Jun 15, 2026', amount: 6500 },
  { leadName: "James O'Brien",    dateExpected: 'Jun 16, 2026', amount: 3200 },
  { leadName: 'Lauren Kim',       dateExpected: 'Jun 17, 2026', amount: 2500 },
  { leadName: 'Carlos Rivera',    dateExpected: 'Jun 18, 2026', amount: 4800 },
  { leadName: 'Emma Davidson',    dateExpected: 'Jun 19, 2026', amount: 3100 },
];
