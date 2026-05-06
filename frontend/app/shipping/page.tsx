'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 실제 수출 TOP 5 국가 항구 (하드코딩 fallback — API 연동 전)
const PORTS = [
  { id: 'ly-mis', country: '🇱🇾 Libya', city: 'Misrata', port: 'Port of Misrata', region: 'Africa', cost: 1800, days: 25 },
  { id: 'ly-tri', country: '🇱🇾 Libya', city: 'Tripoli', port: 'Port of Tripoli', region: 'Africa', cost: 1900, days: 26 },
  { id: 'ly-ben', country: '🇱🇾 Libya', city: 'Benghazi', port: 'Port of Benghazi', region: 'Africa', cost: 2000, days: 27 },
  { id: 'ae-jea', country: '🇦🇪 UAE', city: 'Dubai', port: 'Jebel Ali Port', region: 'Middle East', cost: 1200, days: 18 },
  { id: 'ae-auh', country: '🇦🇪 UAE', city: 'Abu Dhabi', port: 'Zayed Port', region: 'Middle East', cost: 1250, days: 19 },
  { id: 'jo-aqj', country: '🇯🇴 Jordan', city: 'Aqaba', port: 'Port of Aqaba', region: 'Middle East', cost: 1400, days: 21 },
  { id: 'sa-jed', country: '🇸🇦 Saudi Arabia', city: 'Jeddah', port: 'Jeddah Islamic Port', region: 'Middle East', cost: 1300, days: 20 },
  { id: 'kg-bik', country: '🇰🇬 Kyrgyzstan', city: 'Bishkek', port: '(Land) Dostyk → Bishkek', region: 'Central Asia', cost: 2500, days: 35 },
  { id: 'kz-ala', country: '🇰🇿 Kazakhstan', city: 'Almaty', port: 'Almaty Dry Port (Rail)', region: 'Central Asia', cost: 2200, days: 30 },
  { id: 'kz-sco', country: '🇰🇿 Kazakhstan', city: 'Aktau', port: 'Port of Aktau (Caspian)', region: 'Central Asia', cost: 2400, days: 32 },
  { id: 'ph-mnl', country: '🇵🇭 Philippines', city: 'Manila', port: 'Port of Manila', region: 'Southeast Asia', cost: 900, days: 7 },
  { id: 'kh-pnh', country: '🇰🇭 Cambodia', city: 'Sihanoukville', port: 'Sihanoukville Port', region: 'Southeast Asia', cost: 1000, days: 8 },
  { id: 'cl-iqq', country: '🇨🇱 Chile', city: 'Iquique', port: 'Puerto de Iquique', region: 'South America', cost: 3500, days: 45 },
  { id: 'pe-clo', country: '🇵🇪 Peru', city: 'Callao', port: 'Puerto del Callao', region: 'South America', cost: 3600, days: 46 },
];

const REGIONS = ['All', 'Africa', 'Middle East', 'Central Asia', 'Southeast Asia', 'South America'];

const VEHICLE_SIZES = [
  { id: 'sedan', label: '🚗 Sedan / Hatchback', multiplier: 1.0 },
  { id: 'suv', label: '🚙 SUV / Crossover', multiplier: 1.2 },
  { id: 'van', label: '🚐 Van / Minibus', multiplier: 1.4 },
  { id: 'truck', label: '🚛 Truck / Commercial', multiplier: 1.7 },
];

export default function ShippingPage() {
  const [region, setRegion] = useState('All');
  const [selectedPort, setSelectedPort] = useState<typeof PORTS[0] | null>(null);
  const [vehicleSize, setVehicleSize] = useState(VEHICLE_SIZES[0]);
  const [quantity, setQuantity] = useState(1);

  const filteredPorts = region === 'All' ? PORTS : PORTS.filter(p => p.region === region);

  const totalCost = selectedPort
    ? Math.round(selectedPort.cost * vehicleSize.multiplier * quantity)
    : 0;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingBottom: '64px' }}>
        {/* Header */}
        <div style={{ background: 'var(--bg-secondary)', padding: '48px 0 40px', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚢</div>
            <h1 className="text-h1" style={{ marginBottom: '12px' }}>Shipping Cost Calculator</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: '540px', margin: '0 auto' }}>
              Estimate shipping costs from <strong style={{ color: 'var(--text-primary)' }}>Busan Port, Korea</strong> to your destination.
              Based on real freight rates to our top export markets.
            </p>
          </div>
        </div>

        <div className="container" style={{ padding: '48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>

            {/* LEFT — Port Selection */}
            <div>
              {/* Region Filter */}
              <div style={{ marginBottom: '24px' }}>
                <h2 className="text-h3" style={{ marginBottom: '14px' }}>1. Select Destination Region</h2>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {REGIONS.map(r => (
                    <button
                      key={r}
                      id={`region-${r.toLowerCase().replace(' ', '-')}`}
                      onClick={() => { setRegion(r); setSelectedPort(null); }}
                      className={`btn btn-sm ${region === r ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Port Grid */}
              <div style={{ marginBottom: '32px' }}>
                <h2 className="text-h3" style={{ marginBottom: '14px' }}>2. Select Destination Port</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                  {filteredPorts.map(p => (
                    <div
                      key={p.id}
                      id={`port-${p.id}`}
                      onClick={() => setSelectedPort(p)}
                      style={{
                        padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                        border: `2px solid ${selectedPort?.id === p.id ? 'var(--primary)' : 'var(--border)'}`,
                        background: selectedPort?.id === p.id ? 'var(--primary-light)' : 'var(--bg-card)',
                        transition: 'var(--transition-base)',
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>{p.country} — {p.city}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>{p.port}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="badge badge-primary">~${p.cost.toLocaleString()}</span>
                        <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>~{p.days} days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Size */}
              <div>
                <h2 className="text-h3" style={{ marginBottom: '14px' }}>3. Select Vehicle Type</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {VEHICLE_SIZES.map(v => (
                    <button
                      key={v.id}
                      id={`vehicle-size-${v.id}`}
                      onClick={() => setVehicleSize(v)}
                      style={{
                        padding: '14px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
                        border: `2px solid ${vehicleSize.id === v.id ? 'var(--primary)' : 'var(--border)'}`,
                        background: vehicleSize.id === v.id ? 'var(--primary-light)' : 'var(--bg-card)',
                        color: 'var(--text-primary)', fontWeight: 600, transition: 'var(--transition-base)',
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Result Card */}
            <div style={{ position: 'sticky', top: '88px' }}>
              <div className="card" style={{ padding: '28px' }}>
                <h3 className="text-h3" style={{ marginBottom: '20px' }}>📋 Shipping Estimate</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { label: 'Origin', value: '🇰🇷 Busan Port, Korea' },
                    { label: 'Destination', value: selectedPort ? `${selectedPort.country} — ${selectedPort.city}` : '— Select a port' },
                    { label: 'Port', value: selectedPort?.port || '—' },
                    { label: 'Transit Time', value: selectedPort ? `~${selectedPort.days} days` : '—' },
                    { label: 'Vehicle Type', value: vehicleSize.label },
                    { label: 'Quantity', value: `${quantity} unit(s)` },
                  ].map((row, i, arr) => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      gap: '12px',
                    }}>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>{row.label}</span>
                      <span className="text-sm" style={{ fontWeight: 600, textAlign: 'right' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Quantity */}
                <div style={{ margin: '20px 0' }}>
                  <label className="input-label" htmlFor="qty-input">Number of Vehicles</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <button id="qty-minus" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="btn btn-ghost btn-sm">−</button>
                    <input id="qty-input" className="input" type="number" min={1} max={50} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} style={{ textAlign: 'center', width: '80px' }} />
                    <button id="qty-plus" onClick={() => setQuantity(q => q + 1)} className="btn btn-ghost btn-sm">+</button>
                  </div>
                </div>

                {/* Total */}
                <div style={{
                  background: selectedPort ? 'var(--primary-light)' : 'var(--bg-secondary)',
                  border: `1px solid ${selectedPort ? 'rgba(0,86,210,0.3)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', marginBottom: '20px',
                }}>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>Estimated Total Cost</p>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: selectedPort ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {selectedPort ? `$${totalCost.toLocaleString()}` : 'Select a port'}
                  </div>
                  {selectedPort && <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Estimate only. Final cost may vary based on vehicle dimensions and weight.</p>}
                </div>

                <a
                  href={`https://wa.me/${(process.env.APP_WHATSAPP || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(selectedPort ? `Hello, I need a shipping quote to ${selectedPort.city}, ${selectedPort.country}. ${quantity} vehicle(s), type: ${vehicleSize.label}. Estimated: $${totalCost}` : 'Hello, I need a shipping quote.')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-full"
                >
                  💬 Get Exact Quote via WhatsApp
                </a>

                <p className="text-xs" style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
                  We respond within 1 hour during business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
