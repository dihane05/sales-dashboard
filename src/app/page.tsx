import { fetchDashboardData } from '@/lib/airtable';
import Dashboard from '@/components/Dashboard';

export const revalidate = 60; // ISR: regenerate page every 60 seconds

export default async function Home() {
  const data = await fetchDashboardData();
  return <Dashboard data={data} />;
}
