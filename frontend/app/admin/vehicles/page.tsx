'use client';
import { useState } from 'react';
import Link from 'next/link';

const MOCK_VEHICLES = [
  { id: 'v1', title: '2022 Hyundai Tucson 2.0D 4WD', make: 'Hyundai', year: 2022, price: 18500, status: 'available', region: '🇦🇪 UAE', views: 342, inquiries: 8 },
  { id: 'v2', title: '2021 Kia Sportage 2.0 AWD', make: 'Kia', year: 2021, price: 14200, status: 'available', region: '🇱🇾 Libya', views: 218, inquiries: 5 },
  { id: 'v3', title: '2023 Genesis GV80 3.5T', make: 'Genesis', year: 2023, price: 38000, status: 'pending', region: '🇰🇬 Kyrgyzstan', views: 91, inquiries: 2 },
  { id: 'v4', title: '2020 Hyundai Santa Fe 2.2D', make: 'Hyundai', year: 2020, price: 12800, status: 'pending', region: '🇯🇴 Jordan', views: 155, inquiries: 4 },
  { id: 'v5', title: '2022 Kia Carnival 2.2D', make: 'Kia', year: 2022, price: 21000, status: 'sold', region: '🇱🇾 Libya', views: 428, inquiries: 12 },
  { id: 'v6', title: '2019 Ssangyong Rexton 4WD', make: 'Ssangyong', year: 2019, price: 11500, status: 'available', region: '🇰🇿 Kazakhstan', views: 187, inquiries: 6 },
];

const STATUS_BADGE: Record<string, string> = {
  available: 'badge-success', pending: 'badge-warning', sold: 'badge-primary', rejected: 'badge-danger',
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? vehicles : vehicles.filter(v => v.status === filter);

  const updateStatus = (id: string, status: string) => {
    setVehicles(vs => vs.map(v => v.id === id ? { ...v, status } : v));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar (simplified) */}
      <aside style={{ width: '240px', flexShrink: 0, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', padding: '24px 16px' }}>
        <Link href="/" style={{ display: 'block', fontSize: '1rem', fontWeight: 800, background: 'linear-gradient(135deg,#0080FF,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '24px' }}>
          🚗 Korea Auto Export
        </Link>
        {[
          { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
          { href: '/admin/vehicles', icon: '🚗', label: 'Vehicles', active: true },
          { href: '/admin/users', icon: '👥', label: 'Users' },
          { href: '/admin/inquiries', icon: '💬', label: 'Inquiries' },
        ].map(m => (
          <Link key={m.href} href={m.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: '4px', fontWeight: 500, fontSize: '0.9375rem', color: m.active ? 'var(--text-primary)' : 'var(--text-secondary)', background: m.active ? 'var(--primary-light)' : 'transparent' }}>
            {m.icon} {m.label}
          </Link>
        ))}
      </aside>

      <main style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="text-h2">🚗 Vehicle Management</h1>
          <Link href="/sell" className="btn btn-primary btn-sm">+ Add Vehicle</Link>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          {['all', 'available', 'pending', 'sold', 'rejected'].map(s => (
            <button key={s} id={`tab-${s}`} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span style={{ marginLeft: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '1px 7px', fontSize: '0.75rem' }}>
                {s === 'all' ? vehicles.length : vehicles.filter(v => v.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {/* Vehicles Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                {['Vehicle', 'Make', 'Year', 'Price', 'Region', 'Views', 'Inquiries', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={v.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.875rem', maxWidth: '200px' }}>
                    <Link href={`/cars/${v.id}`} style={{ color: 'var(--text-primary)' }}>{v.title}</Link>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{v.make}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem' }}>{v.year}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--accent)', fontSize: '0.875rem' }}>${v.price.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem' }}>{v.region}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>👁 {v.views}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>💬 {v.inquiries}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${STATUS_BADGE[v.status] || 'badge-primary'}`}>{v.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {v.status === 'pending' && (
                        <>
                          <button id={`approve-${v.id}`} onClick={() => updateStatus(v.id, 'available')} className="btn btn-sm" style={{ background: 'var(--success)', color: '#fff', padding: '4px 10px', fontSize: '0.75rem' }}>✓</button>
                          <button id={`reject-${v.id}`} onClick={() => updateStatus(v.id, 'rejected')} className="btn btn-sm" style={{ background: 'rgba(255,59,48,0.15)', color: 'var(--danger)', border: '1px solid rgba(255,59,48,0.3)', padding: '4px 10px', fontSize: '0.75rem' }}>✕</button>
                        </>
                      )}
                      {v.status === 'available' && (
                        <button id={`sold-${v.id}`} onClick={() => updateStatus(v.id, 'sold')} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>Mark Sold</button>
                      )}
                      <Link href={`/cars/${v.id}`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>View</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
