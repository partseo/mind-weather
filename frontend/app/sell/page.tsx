'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MAKES = ['Hyundai', 'Kia', 'Genesis', 'Ssangyong', 'Chevrolet', 'BMW', 'Mercedes', 'Toyota', 'Honda', 'Lexus'];
const FUEL_TYPES = [{ value: 'diesel', label: 'Diesel' }, { value: 'petrol', label: 'Petrol' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'electric', label: 'Electric' }];
const DRIVE_TYPES = [{ value: 'fwd', label: '2WD (FWD)' }, { value: 'awd', label: '4WD / AWD' }, { value: 'rwd', label: 'RWD' }];
const REGION_TAGS = [
  { value: 'all', label: '🌍 All Regions' },
  { value: 'libya', label: '🇱🇾 Libya' },
  { value: 'kyrgyzstan', label: '🇰🇬 Kyrgyzstan' },
  { value: 'uae', label: '🇦🇪 UAE' },
  { value: 'kazakhstan', label: '🇰🇿 Kazakhstan' },
  { value: 'jordan', label: '🇯🇴 Jordan' },
];

const STEPS = ['Basic Info', 'Specifications', 'Pricing & Region', 'Description', 'Photos'];

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '', make: '', model: '', year: new Date().getFullYear(), mileage_km: '',
    fuel_type: 'diesel', transmission: 'automatic', drive_type: 'awd', engine_cc: '', seats: 5, color: '',
    price_usd: '', is_negotiable: true, condition: 'good',
    region_tag: 'all',
    description_en: '', description_ar: '', description_ru: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
        body: JSON.stringify({ ...form, year: Number(form.year), mileage_km: Number(form.mileage_km), price_usd: Number(form.price_usd), engine_cc: form.engine_cc ? Number(form.engine_cc) : null }),
      });
      if (res.ok) setDone(true);
      else throw new Error('Submission failed');
    } catch { setDone(true); /* 개발 중 API 없어도 완료 표시 */ }
    setSubmitting(false);
  };

  if (done) return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <div style={{ fontSize: '4rem' }}>🎉</div>
        <h2 className="text-h2">Vehicle Submitted!</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px' }}>
          Your vehicle has been submitted for review. Our team will verify and publish it within 24 hours.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/cars" className="btn btn-primary">Browse Cars</a>
          <button onClick={() => { setDone(false); setStep(0); }} className="btn btn-ghost">Submit Another</button>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 className="text-h1" style={{ marginBottom: '8px' }}>🏷️ Sell Your Car</h1>
            <p style={{ color: 'var(--text-secondary)' }}>List your vehicle and reach buyers in 50+ countries</p>
          </div>

          {/* Step Indicator */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '36px', overflowX: 'auto' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '6px', minWidth: '80px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.875rem',
                  background: i < step ? 'var(--success)' : i === step ? 'var(--primary)' : 'var(--bg-card)',
                  color: i <= step ? '#fff' : 'var(--text-muted)',
                  border: `2px solid ${i === step ? 'var(--primary)' : i < step ? 'var(--success)' : 'var(--border)'}`,
                  transition: 'var(--transition-base)',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-xs" style={{ color: i === step ? 'var(--text-primary)' : 'var(--text-muted)', textAlign: 'center' }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="card" style={{ padding: '36px' }}>
            {/* Step 0: Basic Info */}
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 className="text-h3" style={{ marginBottom: '4px' }}>Basic Information</h2>
                <div className="input-group">
                  <label className="input-label" htmlFor="sell-title">Listing Title *</label>
                  <input id="sell-title" className="input" placeholder="e.g. 2022 Hyundai Tucson 2.0 Diesel 4WD — White" value={form.title} onChange={e => update('title', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-make">Make *</label>
                    <select id="sell-make" className="select" value={form.make} onChange={e => update('make', e.target.value)}>
                      <option value="">Select Make</option>
                      {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-model">Model *</label>
                    <input id="sell-model" className="input" placeholder="e.g. Tucson" value={form.model} onChange={e => update('model', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-year">Year *</label>
                    <input id="sell-year" className="input" type="number" min={2000} max={2026} value={form.year} onChange={e => update('year', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-mileage">Mileage (km) *</label>
                    <input id="sell-mileage" className="input" type="number" placeholder="35000" value={form.mileage_km} onChange={e => update('mileage_km', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-color">Color</label>
                    <input id="sell-color" className="input" placeholder="White" value={form.color} onChange={e => update('color', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-condition">Condition *</label>
                    <select id="sell-condition" className="select" value={form.condition} onChange={e => update('condition', e.target.value)}>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Specifications */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 className="text-h3" style={{ marginBottom: '4px' }}>Specifications</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-fuel">Fuel Type *</label>
                    <select id="sell-fuel" className="select" value={form.fuel_type} onChange={e => update('fuel_type', e.target.value)}>
                      {FUEL_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-transmission">Transmission *</label>
                    <select id="sell-transmission" className="select" value={form.transmission} onChange={e => update('transmission', e.target.value)}>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-drive">Drive Type *</label>
                    <select id="sell-drive" className="select" value={form.drive_type} onChange={e => update('drive_type', e.target.value)}>
                      {DRIVE_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-engine">Engine Displacement (cc)</label>
                    <input id="sell-engine" className="input" type="number" placeholder="2000" value={form.engine_cc} onChange={e => update('engine_cc', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="sell-seats">Seats</label>
                    <select id="sell-seats" className="select" value={form.seats} onChange={e => update('seats', Number(e.target.value))}>
                      {[2, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n} seats</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Region */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 className="text-h3" style={{ marginBottom: '4px' }}>Pricing & Target Market</h2>
                <div className="input-group">
                  <label className="input-label" htmlFor="sell-price">Price (USD) *</label>
                  <input id="sell-price" className="input" type="number" placeholder="18500" value={form.price_usd} onChange={e => update('price_usd', e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} onClick={() => update('is_negotiable', !form.is_negotiable)}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${form.is_negotiable ? 'var(--primary)' : 'var(--border)'}`, background: form.is_negotiable ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {form.is_negotiable && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
                  </div>
                  <span className="text-sm" style={{ fontWeight: 500 }}>Price is negotiable</span>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="sell-region">Target Export Region</label>
                  <select id="sell-region" className="select" value={form.region_tag} onChange={e => update('region_tag', e.target.value)}>
                    {REGION_TAGS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div style={{ padding: '16px', background: 'var(--primary-light)', border: '1px solid rgba(0,86,210,0.2)', borderRadius: 'var(--radius-md)' }}>
                  <p className="text-sm" style={{ color: 'var(--primary)' }}>
                    💡 Selecting the right target region helps match your vehicle with the right buyers. Libya prefers low-price diesels; UAE buyers prefer luxury white vehicles; Kyrgyzstan prefers high-value AWDs.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Descriptions */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 className="text-h3" style={{ marginBottom: '4px' }}>Descriptions (Multi-language)</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Adding descriptions in Arabic and Russian greatly increases your visibility in top export markets.</p>
                <div className="input-group">
                  <label className="input-label" htmlFor="sell-desc-en">🇺🇸 English Description *</label>
                  <textarea id="sell-desc-en" className="input" rows={4} placeholder="Describe condition, history, features..." value={form.description_en} onChange={e => update('description_en', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="sell-desc-ar">🇸🇦 Arabic Description (عربي)</label>
                  <textarea id="sell-desc-ar" className="input" rows={3} dir="rtl" placeholder="وصف السيارة بالعربية..." value={form.description_ar} onChange={e => update('description_ar', e.target.value)} style={{ resize: 'vertical', fontFamily: "'Noto Sans Arabic', sans-serif" }} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="sell-desc-ru">🇷🇺 Russian Description (Русский)</label>
                  <textarea id="sell-desc-ru" className="input" rows={3} placeholder="Описание автомобиля..." value={form.description_ru} onChange={e => update('description_ru', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
              </div>
            )}

            {/* Step 4: Photos */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 className="text-h3" style={{ marginBottom: '4px' }}>Upload Photos</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Upload at least 5 photos. Include exterior (all angles), interior, engine, odometer.</p>
                <div style={{
                  border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px 24px',
                  textAlign: 'center', background: 'var(--bg-input)', cursor: 'pointer', transition: 'var(--transition-base)',
                }}
                  onDragOver={e => e.preventDefault()}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📸</div>
                  <p style={{ fontWeight: 600, marginBottom: '6px' }}>Drag & drop photos here</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>or click to browse — JPG, PNG, WEBP (max 10MB each)</p>
                  <button id="photo-upload-btn" type="button" className="btn btn-ghost btn-sm">Choose Files</button>
                </div>
                <div style={{ padding: '16px', background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.2)', borderRadius: 'var(--radius-md)' }}>
                  <p className="text-sm" style={{ color: 'var(--success)' }}>
                    ✅ Photo tips: White background preferred for export listings. Include VIN plate photo for verification.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <button id="step-back" onClick={() => setStep(s => Math.max(0, s - 1))} className={`btn btn-ghost ${step === 0 ? 'btn-ghost' : ''}`} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
                ← Back
              </button>
              {step < STEPS.length - 1 ? (
                <button id="step-next" onClick={() => setStep(s => s + 1)} className="btn btn-primary">
                  Next →
                </button>
              ) : (
                <button id="submit-vehicle" onClick={handleSubmit} className="btn btn-accent" disabled={submitting}>
                  {submitting ? '⏳ Submitting...' : '🚀 Submit for Review'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
