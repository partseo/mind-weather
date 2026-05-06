import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const WHATSAPP = process.env.APP_WHATSAPP || '+82-10-XXXX-XXXX';

// 목업 데이터 (실제 API 연동 전)
const MOCK_VEHICLE = {
  id: 'v-1',
  title: '2022 Hyundai Tucson 2.0 Diesel 4WD',
  make: 'Hyundai', model: 'Tucson', year: 2022,
  mileage_km: 35000, fuel_type: 'Diesel', transmission: 'Automatic',
  drive_type: '4WD', engine_cc: 1998, seats: 5, color: 'White',
  price_usd: 18500, is_negotiable: true,
  condition: 'Excellent', region_tag: 'uae',
  origin_country: 'KR', export_ready: true,
  view_count: 342,
  description_en: 'Well-maintained 2022 Hyundai Tucson in excellent condition. Single owner, full service history. Perfect for UAE climate — diesel engine, white exterior, excellent fuel efficiency. Comes with full inspection report and export documentation.',
  description_ar: 'هيونداي توسان 2022 بحالة ممتازة، مالك واحد، سجل صيانة كامل. مثالي لمناخ الإمارات - محرك ديزل، لون أبيض، كفاءة ممتازة في استهلاك الوقود. يأتي مع تقرير فحص كامل.',
  description_ru: 'Hyundai Tucson 2022 года в отличном состоянии. Один владелец, полная история обслуживания. Идеально подходит для климата ОАЭ. Поставляется с полным инспекционным отчетом.',
  inspection_report_url: null,
  images: [],
};

const SPECS = [
  { label: 'Year', value: '2022' },
  { label: 'Mileage', value: '35,000 km' },
  { label: 'Fuel', value: 'Diesel' },
  { label: 'Transmission', value: 'Automatic' },
  { label: 'Drive', value: '4WD' },
  { label: 'Engine', value: '2,000cc' },
  { label: 'Seats', value: '5' },
  { label: 'Color', value: 'White' },
  { label: 'Origin', value: 'Korea' },
  { label: 'Condition', value: 'Excellent' },
];

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const v = MOCK_VEHICLE;
  const waMessage = encodeURIComponent(`Hello, I'm interested in: ${v.title} (ID: ${params.id}). Please provide more details.`);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingBottom: '64px' }}>
        {/* Breadcrumb */}
        <div style={{ background: 'var(--bg-secondary)', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <nav aria-label="breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
              <span>/</span>
              <Link href="/cars" style={{ color: 'var(--text-muted)' }}>Cars</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)' }}>{v.title}</span>
            </nav>
          </div>
        </div>

        <div className="container" style={{ padding: '32px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>

            {/* LEFT — Images + Details */}
            <div>
              {/* Image Gallery */}
              <div style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', overflow: 'hidden',
                aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '6rem', marginBottom: '16px',
              }}>
                🚗
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{
                    width: '80px', height: '60px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', cursor: 'pointer',
                  }}>🚗</div>
                ))}
              </div>

              {/* Title & Price */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span className="badge badge-uae">🇦🇪 UAE Market</span>
                  <span className="badge badge-success">Available</span>
                  <span className="badge badge-eco">Export Ready</span>
                </div>
                <h1 className="text-h1" style={{ marginBottom: '8px' }}>{v.title}</h1>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>${v.price_usd.toLocaleString()}</span>
                  {v.is_negotiable && <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Negotiable</span>}
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>👁 {v.view_count} views</p>
              </div>

              {/* Specs Table */}
              <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h2 className="text-h3" style={{ marginBottom: '16px' }}>Vehicle Specifications</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                  {SPECS.map((s, i) => (
                    <div key={s.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: i < SPECS.length - 2 ? '1px solid var(--border)' : 'none',
                      gridColumn: '1 / -1',
                    }}>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                      <span className="text-sm" style={{ fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description (Multi-language) */}
              <div className="card" style={{ padding: '24px' }}>
                <h2 className="text-h3" style={{ marginBottom: '16px' }}>Description</h2>
                <p className="text-body" style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{v.description_en}</p>
                {v.description_ar && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>🇸🇦 Arabic / عربي</p>
                    <p dir="rtl" style={{ color: 'var(--text-secondary)', fontFamily: "'Noto Sans Arabic', sans-serif", lineHeight: '1.8', fontSize: '0.9375rem' }}>
                      {v.description_ar}
                    </p>
                  </div>
                )}
                {v.description_ru && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>🇷🇺 Russian / Русский</p>
                    <p style={{ color: 'var(--text-secondary)' }}>{v.description_ru}</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Contact Card */}
            <div style={{ position: 'sticky', top: '88px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <h3 className="text-h3" style={{ marginBottom: '20px' }}>Interested? Contact Us</h3>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}?text=${waMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-full btn-lg"
                  style={{ marginBottom: '12px' }}
                >
                  💬 WhatsApp (Instant Reply)
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/${process.env.APP_TELEGRAM || 'yourhandle'}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-ghost btn-full"
                  style={{ marginBottom: '20px' }}
                >
                  ✈️ Telegram
                </a>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 600 }}>
                    Or send us a quick message:
                  </p>
                  <input className="input" type="text" placeholder="Your Name" style={{ marginBottom: '10px' }} />
                  <input className="input" type="text" placeholder="WhatsApp Number (with country code)" style={{ marginBottom: '10px' }} />
                  <select className="select" style={{ marginBottom: '10px' }}>
                    <option>Contact via WhatsApp</option>
                    <option>Contact via Telegram</option>
                    <option>Contact via Email</option>
                  </select>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Your message..."
                    style={{ resize: 'vertical', marginBottom: '12px' }}
                  />
                  <button className="btn btn-primary btn-full">Send Inquiry</button>
                </div>

                <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                    ✅ Export documents included<br />
                    🚢 Shipping to 50+ countries<br />
                    🔍 Full inspection report available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
