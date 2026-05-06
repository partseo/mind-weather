'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ── 어드민 레이아웃 ──────────────────────────────────────
const MENU = [
  { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/admin/vehicles', icon: '🚗', label: 'Vehicles' },
  { href: '/admin/users', icon: '👥', label: 'Users' },
  { href: '/admin/inquiries', icon: '💬', label: 'Inquiries' },
  { href: '/admin/automation', icon: '⚙️', label: 'Automation' },
];

function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const [active, setActive] = useState('/admin/dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0, background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)', position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ display: 'block' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, background: 'linear-gradient(135deg,#0080FF,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              🚗 Korea Auto Export
            </div>
          </Link>
          <span className="badge badge-warning" style={{ marginTop: '8px', display: 'inline-flex' }}>Admin Panel</span>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {MENU.map(m => (
            <Link
              key={m.href}
              href={m.href}
              onClick={() => setActive(m.href)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: 'var(--radius-md)',
                marginBottom: '4px', fontWeight: 500, fontSize: '0.9375rem',
                color: active === m.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: active === m.href ? 'var(--primary-light)' : 'transparent',
                transition: 'var(--transition-fast)',
              }}
            >
              <span>{m.icon}</span>{m.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <Link href="/" className="btn btn-ghost btn-sm btn-full">← Back to Site</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Top Bar */}
        <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="text-h3">{title}</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="badge badge-success">● Live</span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Admin</span>
          </div>
        </div>
        <div style={{ padding: '28px' }}>{children}</div>
      </main>
    </div>
  );
}

// ── 통계 카드 ────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
        {sub && <span className="badge badge-success">{sub}</span>}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: color || 'var(--text-primary)', marginBottom: '4px' }}>{value}</div>
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}

// ── 어드민 대시보드 메인 ─────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    vehicles: { total: 0, available: 0, pending: 0 },
    users: { total: 0 },
    inquiries: { total: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/stats`)
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => {
        // API 미연결 시 목업 데이터
        setStats({ vehicles: { total: 48, available: 38, pending: 7 }, users: { total: 234 }, inquiries: { total: 89 } });
        setLoading(false);
      });
  }, []);

  // 지역별 문의 비율 (목업)
  const regionData = [
    { region: '🇱🇾 Libya', count: 32, pct: 36 },
    { region: '🇰🇬 Kyrgyzstan', count: 21, pct: 24 },
    { region: '🇦🇪 UAE', count: 18, pct: 20 },
    { region: '🇰🇿 Kazakhstan', count: 11, pct: 12 },
    { region: '🇯🇴 Jordan', count: 7, pct: 8 },
  ];

  // 최근 문의 (목업)
  const recentInquiries = [
    { id: 'inq-1', vehicle: '2022 Hyundai Tucson 4WD', from: 'Ahmed M.', country: '🇱🇾', method: 'WhatsApp', time: '5 min ago', status: 'pending' },
    { id: 'inq-2', vehicle: '2021 Kia Sportage AWD', from: 'Ivan K.', country: '🇰🇬', method: 'Telegram', time: '28 min ago', status: 'replied' },
    { id: 'inq-3', vehicle: '2023 Genesis GV80', from: 'Mohammed A.', country: '🇦🇪', method: 'WhatsApp', time: '1h ago', status: 'replied' },
    { id: 'inq-4', vehicle: '2020 Hyundai Santa Fe', from: 'Nursultan B.', country: '🇰🇿', method: 'Email', time: '2h ago', status: 'pending' },
  ];

  // 승인 대기 차량 (목업)
  const pendingVehicles = [
    { id: 'v-p1', title: '2022 Kia Sorento 2.2D 4WD', price: '$22,000', seller: 'DealerKorea', submitted: '2h ago' },
    { id: 'v-p2', title: '2021 Hyundai Palisade 3.8', price: '$29,500', seller: 'AutoSeoul', submitted: '4h ago' },
    { id: 'v-p3', title: '2020 Ssangyong Rexton AWD', price: '$15,800', seller: 'KoreaCars', submitted: '6h ago' },
  ];

  return (
    <AdminLayout title="📊 Dashboard">
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '120px' }} />)}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <StatCard icon="🚗" label="Total Vehicles" value={String(stats.vehicles.total)} sub="Active" color="var(--primary)" />
            <StatCard icon="✅" label="Available" value={String(stats.vehicles.available)} color="var(--success)" />
            <StatCard icon="⏳" label="Pending Approval" value={String(stats.vehicles.pending)} color="var(--warning)" />
            <StatCard icon="👥" label="Registered Users" value={String(stats.users.total)} color="var(--accent)" />
            <StatCard icon="💬" label="Total Inquiries" value={String(stats.inquiries.total)} sub="↑12%" color="var(--primary)" />
          </div>

          {/* Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
            {/* Region breakdown */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 className="text-h3" style={{ marginBottom: '20px' }}>📍 Inquiries by Region</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {regionData.map(r => (
                  <div key={r.region}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="text-sm" style={{ fontWeight: 600 }}>{r.region}</span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{r.count} ({r.pct}%)</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${r.pct}%`, background: 'linear-gradient(90deg, var(--primary), #0080FF)', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending approvals */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="text-h3">⏳ Pending Approval</h2>
                <Link href="/admin/vehicles" className="btn btn-ghost btn-sm">View All</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingVehicles.map(v => (
                  <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div>
                      <div className="text-sm" style={{ fontWeight: 600, marginBottom: '2px' }}>{v.title}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.seller} · {v.submitted}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.875rem' }}>{v.price}</span>
                      <button
                        id={`approve-${v.id}`}
                        className="btn btn-sm"
                        style={{ background: 'var(--success)', color: '#fff', padding: '4px 12px', fontSize: '0.75rem' }}
                        onClick={() => alert(`Approved: ${v.title}`)}
                      >✓ Approve</button>
                      <button
                        id={`reject-${v.id}`}
                        className="btn btn-sm"
                        style={{ background: 'rgba(255,59,48,0.15)', color: 'var(--danger)', border: '1px solid rgba(255,59,48,0.3)', padding: '4px 12px', fontSize: '0.75rem' }}
                        onClick={() => alert(`Rejected: ${v.title}`)}
                      >✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="text-h3">💬 Recent Inquiries</h2>
              <span className="badge badge-warning">Live</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Vehicle', 'From', 'Country', 'Method', 'Time', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map(inq => (
                    <tr key={inq.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: 600 }}>{inq.vehicle}</td>
                      <td style={{ padding: '12px', fontSize: '0.875rem' }}>{inq.from}</td>
                      <td style={{ padding: '12px', fontSize: '1.25rem' }}>{inq.country}</td>
                      <td style={{ padding: '12px' }}><span className="badge badge-primary">{inq.method}</span></td>
                      <td style={{ padding: '12px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{inq.time}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${inq.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <a
                          id={`reply-${inq.id}`}
                          href={`https://wa.me/?text=Hello+${inq.from}`}
                          target="_blank" rel="noopener noreferrer"
                          className="btn btn-whatsapp btn-sm"
                        >Reply</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
