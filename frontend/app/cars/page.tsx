'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MAKES = ['All', 'Hyundai', 'Kia', 'Genesis', 'Ssangyong', 'Chevrolet', 'BMW', 'Mercedes', 'Toyota'];
const FUEL_TYPES = ['All', 'diesel', 'petrol', 'hybrid', 'electric'];
const DRIVE_TYPES = ['All', '4WD', '2WD'];
const REGIONS = [
  { value: 'all', label: '🌍 All Regions' },
  { value: 'libya', label: '🇱🇾 Libya' },
  { value: 'kyrgyzstan', label: '🇰🇬 Kyrgyzstan' },
  { value: 'uae', label: '🇦🇪 UAE' },
  { value: 'kazakhstan', label: '🇰🇿 Kazakhstan' },
  { value: 'jordan', label: '🇯🇴 Jordan' },
];

// 목 데이터 (실제 API 연동 전)
const MOCK_VEHICLES = Array.from({ length: 12 }, (_, i) => ({
  id: `v-${i + 1}`,
  title: ['2022 Hyundai Tucson 2.0 Diesel 4WD', '2021 Kia Sportage 2.0 AWD', '2023 Genesis GV80 3.5T', '2020 Hyundai Santa Fe 2.2 Diesel', '2022 Kia Carnival 2.2D', '2019 Ssangyong Rexton 4WD'][i % 6],
  make: ['Hyundai', 'Kia', 'Genesis', 'Hyundai', 'Kia', 'Ssangyong'][i % 6],
  model: ['Tucson', 'Sportage', 'GV80', 'Santa Fe', 'Carnival', 'Rexton'][i % 6],
  year: 2020 + (i % 4),
  mileage_km: 30000 + i * 5000,
  fuel_type: i % 3 === 0 ? 'diesel' : i % 3 === 1 ? 'petrol' : 'hybrid',
  transmission: 'automatic',
  drive_type: i % 2 === 0 ? '4WD' : '2WD',
  price_usd: 8000 + i * 1500,
  condition: 'good',
  region_tag: REGIONS[(i % 5) + 1].value,
  color: ['White', 'Black', 'Silver', 'Gray'][i % 4],
  view_count: 100 + i * 23,
  primary_image_url: null,
}));

const REGION_BADGE: Record<string, string> = {
  libya: 'badge-libya',
  uae: 'badge-uae',
  kyrgyzstan: 'badge-kyrgyz',
  kazakhstan: 'badge-kazakh',
  jordan: 'badge-jordan',
};

function VehicleCard({ v }: { v: typeof MOCK_VEHICLES[0] }) {
  return (
    <Link href={`/cars/${v.id}`}>
      <div className="vehicle-card">
        <div className="vehicle-card__image">
          <div style={{
            width: '100%', height: '100%', minHeight: '180px',
            background: 'linear-gradient(135deg, #141C30 0%, #1A2438 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem',
          }}>
            🚗
          </div>
          {/* Region Badge */}
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <span className={`badge ${REGION_BADGE[v.region_tag] || 'badge-primary'}`}>
              {REGIONS.find(r => r.value === v.region_tag)?.label || v.region_tag}
            </span>
          </div>
        </div>
        <div className="vehicle-card__body">
          <div className="vehicle-card__title">{v.title}</div>
          <div className="vehicle-card__price">${v.price_usd.toLocaleString()}</div>
          <div className="vehicle-card__specs">
            <span className="badge badge-primary">{v.year}</span>
            <span className="badge badge-eco">{v.fuel_type}</span>
            {v.drive_type === '4WD' && <span className="badge badge-4wd">4WD</span>}
            <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              {(v.mileage_km / 1000).toFixed(0)}k km
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>👁 {v.view_count} views</span>
            <span className="badge badge-success">Available</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CarsPage() {
  const [filters, setFilters] = useState({ make: 'All', fuel: 'All', drive: 'All', region: 'all', priceMax: '', sort: 'newest' });
  const [vehicles] = useState(MOCK_VEHICLES);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ background: 'var(--bg-secondary)', padding: '40px 0 32px', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <h1 className="text-h1" style={{ marginBottom: '8px' }}>Browse All Cars</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{vehicles.length} vehicles available for export</p>
          </div>
        </div>

        <div className="container" style={{ padding: '32px 24px' }}>
          {/* Filter Bar */}
          <div className="filter-bar" style={{ marginBottom: '32px' }}>
            <div className="input-group">
              <label className="input-label">Make</label>
              <select className="select" id="filter-make" value={filters.make} onChange={e => setFilters(f => ({ ...f, make: e.target.value }))}>
                {MAKES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Fuel</label>
              <select className="select" id="filter-fuel" value={filters.fuel} onChange={e => setFilters(f => ({ ...f, fuel: e.target.value }))}>
                {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Drive</label>
              <select className="select" id="filter-drive" value={filters.drive} onChange={e => setFilters(f => ({ ...f, drive: e.target.value }))}>
                {DRIVE_TYPES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Target Market</label>
              <select className="select" id="filter-region" value={filters.region} onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}>
                {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Max Price (USD)</label>
              <input className="input" id="filter-price" type="number" placeholder="Any" value={filters.priceMax} onChange={e => setFilters(f => ({ ...f, priceMax: e.target.value }))} />
            </div>
            <div className="input-group">
              <label className="input-label">Sort By</label>
              <select className="select" id="filter-sort" value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}>
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="mileage">Lowest Mileage</option>
              </select>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="grid-vehicles">
            {vehicles.map(v => <VehicleCard key={v.id} v={v} />)}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
            {[1, 2, 3, 4, 5].map(p => (
              <button key={p} id={`page-${p}`} className={`btn ${p === 1 ? 'btn-primary' : 'btn-ghost'} btn-sm`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
