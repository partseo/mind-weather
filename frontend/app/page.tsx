import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const WHATSAPP = process.env.APP_WHATSAPP || '+82-10-XXXX-XXXX';

const TARGET_MARKETS = [
  { flag: '🇱🇾', country: 'Libya', rank: '#1 Volume', tag: 'badge-libya', desc: 'Low Price · Durability · North Africa Hub' },
  { flag: '🇰🇬', country: 'Kyrgyzstan', rank: '#1 Value', tag: 'badge-kyrgyz', desc: 'High-End · Central Asia Hub · $20K+' },
  { flag: '🇦🇪', country: 'UAE', rank: '#3 Overall', tag: 'badge-uae', desc: 'Luxury · White Cars · Gulf Reexport' },
  { flag: '🇰🇿', country: 'Kazakhstan', rank: '#4 Growing', tag: 'badge-kazakh', desc: 'SUV · 4WD · Fast Growing Market' },
  { flag: '🇯🇴', country: 'Jordan', rank: '#5 Stable', tag: 'badge-jordan', desc: 'Mid-Range · Family Cars · Steady Demand' },
];

const POPULAR_MAKES = ['Hyundai', 'Kia', 'Genesis', 'Ssangyong', 'Chevrolet', 'BMW', 'Mercedes'];

const STATS = [
  { value: '5,000+', label: 'Cars Exported' },
  { value: '50+', label: 'Countries' },
  { value: '8 Years', label: 'Experience' },
  { value: '4.9★', label: 'Buyer Rating' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO ─────────────────────────────────── */}
        <section className="hero">
          <div className="hero__bg" />
          <div className="container">
            <div className="hero__content animate-fade-in">
              <div className="hero__eyebrow">
                🌍 Korea&apos;s #1 Trusted Used Car Exporter
              </div>
              <h1 className="text-display" style={{ marginBottom: '20px' }}>
                Buy Korean Cars,<br />
                <span className="gradient-text">Ship Anywhere</span>
              </h1>
              <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: '540px', fontSize: '1.125rem' }}>
                Hyundai, Kia, Genesis and more — inspected, documented, and delivered to Libya, UAE, Kyrgyzstan, Kazakhstan, Jordan, and 50+ countries worldwide.
              </p>
              <div className="hero__cta">
                <Link href="/cars" className="btn btn-primary btn-lg">
                  🔍 Browse All Cars
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}?text=Hello, I am interested in buying a Korean used car`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  💬 WhatsApp Us
                </a>
              </div>
              <div className="hero__stats">
                {STATS.map(s => (
                  <div key={s.label}>
                    <div className="hero__stat-value">{s.value}</div>
                    <div className="hero__stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TARGET MARKETS (실제 수출 데이터 기반) ── */}
        <section className="section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: '40px' }}>
              <h2 className="text-h1" style={{ marginBottom: '12px' }}>
                Our Top Export Markets
              </h2>
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                Based on real 2024 Korean used car export statistics (KITA)
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {TARGET_MARKETS.map((m, i) => (
                <Link key={m.country} href={`/cars?region_tag=${m.country.toLowerCase()}`}>
                  <div className="card" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{m.flag}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '6px' }}>{m.country}</div>
                    <span className={`badge ${m.tag}`} style={{ marginBottom: '12px', display: 'inline-flex' }}>
                      {m.rank}
                    </span>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{m.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── POPULAR MAKES ── */}
        <section style={{ padding: '48px 0', background: 'var(--bg-secondary)' }}>
          <div className="container">
            <h2 className="text-h2" style={{ textAlign: 'center', marginBottom: '28px' }}>Popular Makes</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {POPULAR_MAKES.map(m => (
                <Link key={m} href={`/cars?make=${m}`} className="btn btn-ghost">
                  {m}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUICK SEARCH ── */}
        <section className="section">
          <div className="container">
            <h2 className="text-h2" style={{ textAlign: 'center', marginBottom: '32px' }}>Quick Search</h2>
            <div className="filter-bar" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div className="input-group">
                <label className="input-label">Make</label>
                <select className="select" id="search-make">
                  <option value="">All Makes</option>
                  {POPULAR_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Min Year</label>
                <select className="select" id="search-year-min">
                  <option value="">Any</option>
                  {Array.from({ length: 15 }, (_, i) => 2024 - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Max Price (USD)</label>
                <select className="select" id="search-price">
                  <option value="">Any</option>
                  <option value="5000">Under $5,000</option>
                  <option value="10000">Under $10,000</option>
                  <option value="20000">Under $20,000</option>
                  <option value="50000">Under $50,000</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Fuel Type</label>
                <select className="select" id="search-fuel">
                  <option value="">All</option>
                  <option value="diesel">Diesel</option>
                  <option value="petrol">Petrol</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Drive</label>
                <select className="select" id="search-drive">
                  <option value="">All</option>
                  <option value="4WD">4WD</option>
                  <option value="2WD">2WD</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">&nbsp;</label>
                <Link href="/cars" className="btn btn-primary btn-full">
                  Search
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section style={{ padding: '64px 0', background: 'var(--bg-secondary)' }}>
          <div className="container">
            <h2 className="text-h1" style={{ textAlign: 'center', marginBottom: '48px' }}>
              Why Buyers Trust Us
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              {[
                { icon: '🔍', title: 'Full Inspection', desc: 'Every vehicle comes with a detailed inspection report and photos' },
                { icon: '🚢', title: 'Global Shipping', desc: 'We handle shipping to Libya, UAE, Central Asia and 50+ countries' },
                { icon: '📄', title: 'Export Documents', desc: 'Full export documentation, customs clearance assistance' },
                { icon: '💬', title: '24/7 WhatsApp', desc: 'Real-time support via WhatsApp and Telegram in your language' },
              ].map(f => (
                <div key={f.title} className="card" style={{ padding: '28px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{f.icon}</div>
                  <h3 className="text-h3" style={{ marginBottom: '8px' }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="section" id="contact">
          <div className="container">
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,86,210,0.2) 0%, rgba(0,86,210,0.05) 100%)',
              border: '1px solid rgba(0,86,210,0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '48px',
              textAlign: 'center',
            }}>
              <h2 className="text-h1" style={{ marginBottom: '16px' }}>
                Ready to Buy Your Next Car?
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.0625rem' }}>
                Contact us now via WhatsApp for the fastest response. We speak Arabic, Russian, and English.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}?text=مرحبا، أريد شراء سيارة كورية مستعملة`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  💬 WhatsApp (Arabic)
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}?text=Здравствуйте, хочу купить корейский автомобиль`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-ghost btn-lg"
                >
                  💬 WhatsApp (Russian)
                </a>
                <Link href="/cars" className="btn btn-primary btn-lg">
                  🔍 Browse Inventory
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
