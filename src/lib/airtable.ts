const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TOKEN   = process.env.AIRTABLE_TOKEN!;

// ── Raw Airtable response shape ───────────────────────────────────────────────

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

async function fetchAll(tableId: string): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`);
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { revalidate: 60 },      // ISR: re-fetch every 60 s
    });

    if (!res.ok) throw new Error(`Airtable ${tableId}: ${res.status} ${res.statusText}`);

    const json = (await res.json()) as { records: AirtableRecord[]; offset?: string };
    records.push(...json.records);
    offset = json.offset;
  } while (offset);

  return records;
}

// ── Public types ──────────────────────────────────────────────────────────────

export interface MemberRecord {
  id: string;
  name: string;
  roles: string[];
}

export interface EodRecord {
  id: string;
  date: string;
  memberId: string;
  memberName: string;
  role: string;
  callsBooked: number;
  dealsClosed: number;
  depositsCollected: number;
  callsOnCalendar: number;
  cashCollected: number;
  revenueGenerated: number;
  cashFromDeposits: number;
  liveCalls: number;
  noShows: number;
  cancels: number;
  reschedules: number;
}

export interface PcfRecord {
  id: string;
  date: string;
  closerId: string;
  closerName: string;
  setterId: string;
  setterName: string;
  callOutcome: string;
  leadName: string;
  cashCollected: number;
  revenueGenerated: number;
  leadSource: string;
  installment2Amount: number;
  installment2Due: string;
  installment3Amount: number;
  installment3Due: string;
}

export interface DashboardData {
  members: MemberRecord[];
  eod: EodRecord[];
  pcf: PcfRecord[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const num = (v: unknown) => (typeof v === 'number' ? v : parseFloat(String(v ?? 0)) || 0);
const str = (v: unknown) => (v == null ? '' : String(v));

function cleanInstDate(v: unknown): string {
  const s = str(v);
  return s === '0000-01-01' || !s ? '' : s;
}

// ── Main fetch ────────────────────────────────────────────────────────────────

export async function fetchDashboardData(): Promise<DashboardData> {
  // Table IDs (stable; won't break if table is renamed)
  const [membersRaw, eodRaw, pcfRaw] = await Promise.all([
    fetchAll('tblKj9jsQNStOPJcm'), // Team members
    fetchAll('tblv5hUwacxEaGZ4b'), // EOD
    fetchAll('tbl21d0zp81D0NPE4'), // PCF
  ]);

  // Build a fast member lookup
  const memberMap = new Map<string, MemberRecord>();
  for (const r of membersRaw) {
    const f = r.fields;
    const name = str(f.Name).trim();
    memberMap.set(r.id, {
      id: r.id,
      name,
      roles: Array.isArray(f.Role) ? (f.Role as unknown[]).map(str) : [],
    });
  }

  const members = Array.from(memberMap.values()).filter(m => m.name);

  // Transform EOD records
  const eod: EodRecord[] = eodRaw
    .filter(r => r.fields.Date)
    .map(r => {
      const f = r.fields;
      const mIds = Array.isArray(f['Team members']) ? (f['Team members'] as string[]) : [];
      const member = mIds.length ? memberMap.get(mIds[0]) : undefined;
      return {
        id: r.id,
        date: str(f.Date),
        memberId: member?.id ?? '',
        memberName: member?.name ?? 'Unknown',
        role: str(f.Role),
        callsBooked:       num(f['Calls Booked']),
        dealsClosed:       num(f['Deals Closed']),
        depositsCollected: num(f['Deposits Collected']),
        callsOnCalendar:   num(f['Calls On Calendar']),
        cashCollected:     num(f['Cash Collected']),
        revenueGenerated:  num(f['Revenue Generated']),
        cashFromDeposits:  num(f['Cash From Deposits']),
        liveCalls:         num(f['Live Calls']),
        noShows:           num(f['No Shows']),
        cancels:           num(f.Cancels),
        reschedules:       num(f.Reschedules),
      };
    });

  // Transform PCF records
  const pcf: PcfRecord[] = pcfRaw
    .filter(r => r.fields.Date)
    .map(r => {
      const f = r.fields;
      const cIds = Array.isArray(f.Closer)  ? (f.Closer  as string[]) : [];
      const sIds = Array.isArray(f.Setters) ? (f.Setters as string[]) : [];
      const closer = cIds.length ? memberMap.get(cIds[0]) : undefined;
      const setter = sIds.length ? memberMap.get(sIds[0]) : undefined;
      return {
        id: r.id,
        date: str(f.Date),
        closerId:           closer?.id   ?? '',
        closerName:         closer?.name ?? 'Unknown',
        setterId:           setter?.id   ?? '',
        setterName:         setter?.name ?? 'Unknown',
        callOutcome:        str(f['Call outcome']),
        leadName:           str(f['Lead Name']),
        cashCollected:      num(f['Cash Collected']),
        revenueGenerated:   num(f['Revenue Generated']),
        leadSource:         str(f['Lead Source']),
        installment2Amount: num(f['Installment 2 amount']),
        installment2Due:    cleanInstDate(f['Installment 2 due']),
        installment3Amount: num(f['Installment 3 amount']),
        installment3Due:    cleanInstDate(f['Installment 3 due']),
      };
    });

  return { members, eod, pcf };
}
