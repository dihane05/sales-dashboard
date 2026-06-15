import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { fetchDashboardData, type DashboardData } from '@/lib/airtable';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

const CACHE_KEY = 'dashboard:data';
const CACHE_TTL_SECONDS = 60;

export async function GET() {
  try {
    let data: DashboardData | null = null;

    try {
      data = await redis.get<DashboardData>(CACHE_KEY);
    } catch (err) {
      Sentry.captureException(err);
    }

    if (!data) {
      data = await fetchDashboardData();
      redis.set(CACHE_KEY, data, { ex: CACHE_TTL_SECONDS }).catch(err => Sentry.captureException(err));
    }

    return NextResponse.json(data);
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch dashboard data' },
      { status: 500 },
    );
  }
}
