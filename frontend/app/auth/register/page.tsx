'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const COUNTRIES = [
  { code: 'LY', name: '🇱🇾 Libya' },
  { code: 'AE', name: '🇦🇪 UAE' },
  { code: 'KG', name: '🇰🇬 Kyrgyzstan' },
  { code: 'KZ', name: '🇰🇿 Kazakhstan' },
  { code: 'JO', name: '🇯🇴 Jordan' },
  { code: 'SA', name: '🇸🇦 Saudi Arabia' },
  { code: 'PH', name: '🇵🇭 Philippines' },
  { code: 'KH', name: '🇰🇭 Cambodia' },
  { code: 'CL', name: '🇨🇱 Chile' },
  { code: 'OTHER', name: '🌍 Other' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    full_name: '', country: '', phone_whatsapp: '',
    preferred_language: 'en', role: 'buyer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email, password: form.password,
          full_name: form.full_name, country: form.country,
          phone_whatsapp: form.phone_whatsapp,
          preferred_language: form.preferred_language,
          role: form.role,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Registration failed'); }
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      setSuccess(true);
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '4rem' }}>✅</div>
      <h2 className="text-h2">Registration Successful!</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Redirecting to home...</p>
    </div>
  );

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div className="card" style={{ padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚗</div>
              <h1 className="text-h2">Create Account</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                Join {process.env.APP_NAME || 'Korea Auto Export'} — Buy or Sell globally
              </p>
            </div>

            {/* Role Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[{ value: 'buyer', icon: '🛒', label: 'I want to Buy' }, { value: 'seller', icon: '🏷️', label: 'I want to Sell' }].map(r => (
                <button
                  key={r.value}
                  id={`role-${r.value}`}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, role: r.value }))}
                  style={{
                    padding: '14px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    border: `2px solid ${form.role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                    background: form.role === r.value ? 'var(--primary-light)' : 'var(--bg-input)',
                    color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9375rem',
                    transition: 'var(--transition-base)', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{r.icon}</div>
                  {r.label}
                </button>
              ))}
            </div>

            {error && (
              <div style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '20px' }}>
                <p className="text-sm" style={{ color: 'var(--danger)' }}>⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="reg-name">Full Name</label>
                  <input id="reg-name" className="input" type="text" placeholder="John Doe" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="reg-country">Country</label>
                  <select id="reg-country" className="select" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                    <option value="">Select Country</option>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="reg-email">Email Address</label>
                <input id="reg-email" className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="reg-whatsapp">WhatsApp Number (with country code)</label>
                <input id="reg-whatsapp" className="input" type="tel" placeholder="+218 91 234 5678" value={form.phone_whatsapp} onChange={e => setForm(f => ({ ...f, phone_whatsapp: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="reg-lang">Preferred Language</label>
                <select id="reg-lang" className="select" value={form.preferred_language} onChange={e => setForm(f => ({ ...f, preferred_language: e.target.value }))}>
                  <option value="en">🇺🇸 English</option>
                  <option value="ar">🇸🇦 Arabic / عربي</option>
                  <option value="ru">🇷🇺 Russian / Русский</option>
                  <option value="es">🇪🇸 Spanish / Español</option>
                  <option value="fr">🇫🇷 French / Français</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="reg-password">Password</label>
                  <input id="reg-password" className="input" type="password" placeholder="Min. 8 chars" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="reg-confirm">Confirm Password</label>
                  <input id="reg-confirm" className="input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
                </div>
              </div>
              <button id="register-submit" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
                {loading ? '⏳ Creating account...' : '🚀 Create Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
