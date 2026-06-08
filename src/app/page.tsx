import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#030305' }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-lg animate-pulse"
          style={{ background: 'linear-gradient(135deg,#00d4ff,#00ff88)' }}
        >
          $
        </div>
        <p className="text-slate-500 text-sm">Loading dashboard…</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <Dashboard />;
}
