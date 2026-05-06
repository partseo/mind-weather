'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: form.email, password: form.password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      window.location.href = '/';
    } catch {
      setError('Email or password is incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Card */}
          <div className="card" style={{ padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔐</div>
              <h1 className="text-h2">Sign In</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                Welcome back to {process.env.APP_NAME || 'Korea Auto Export'}
              </p>
            </div>

            {error && (
              <div style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '20px' }}>
                <p className="text-sm" style={{ color: 'var(--danger)' }}>⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link href="/auth/forgot-password" className="text-sm" style={{ color: 'var(--primary)' }}>
                  Forgot password?
                </Link>
              </div>
              <button id="login-submit" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? '⏳ Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
              </p>
            </div>

            {/* WhatsApp fallback */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Prefer to contact directly?</p>
              <a
                href={`https://wa.me/${(process.env.APP_WHATSAPP || '').replace(/[^0-9]/g, '')}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
