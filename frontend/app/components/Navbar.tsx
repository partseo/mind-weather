'use client';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Browse Cars', href: '/cars' },
  { label: 'Sell Your Car', href: '/sell' },
  { label: 'Shipping Calculator', href: '/shipping' },
  { label: 'Contact', href: '#contact' },
];

const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
];

export default function Navbar() {
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        {/* Logo */}
        <Link href="/" className="navbar__logo">
          🚗 {process.env.APP_NAME || 'Korea Auto Export'}
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar__nav">
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Language Switcher */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className="lang-switcher"
                style={{
                  background: lang === l.code ? 'var(--primary-light)' : 'transparent',
                  color: lang === l.code ? 'var(--primary)' : 'var(--text-secondary)',
                  border: `1px solid ${lang === l.code ? 'rgba(0,86,210,0.3)' : 'var(--border)'}`,
                }}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          <Link href="/auth/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link href="/auth/register" className="btn btn-primary btn-sm">Register</Link>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
            className="mobile-only"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '68px', left: 0, right: 0,
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
