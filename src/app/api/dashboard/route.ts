import { NextResponse } from 'next/server';
import { fetchDashboardData } from '@/lib/airtable';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchDashboardData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch dashboard data' },
      { status: 500 },
    );
  }
}
