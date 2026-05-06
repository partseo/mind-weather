import Link from 'next/link';

const WHATSAPP = process.env.APP_WHATSAPP || '+82-10-XXXX-XXXX';
const APP_NAME = process.env.APP_NAME || 'Korea Auto Export';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <div className="footer__brand-name">🚗 {APP_NAME}</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: '1.7' }}>
              Korea&apos;s most trusted used car exporter. Shipping to Libya, UAE, Kyrgyzstan, Kazakhstan, Jordan and 50+ countries.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a
                href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                💬 WhatsApp
              </a>
              <a
                href={`https://t.me/${process.env.APP_TELEGRAM || 'yourhandle'}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                ✈️ Telegram
              </a>
            </div>
          </div>

          {/* Vehicles */}
          <div className="footer__link-group">
            <h4>Browse</h4>
            <ul className="footer__links">
              <li><Link href="/cars?fuel_type=diesel">Diesel Cars</Link></li>
              <li><Link href="/cars?drive_type=4WD">4WD / SUV</Link></li>
              <li><Link href="/cars?region_tag=uae">UAE Market</Link></li>
              <li><Link href="/cars?region_tag=libya">Libya Market</Link></li>
              <li><Link href="/cars?region_tag=kyrgyzstan">Central Asia</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer__link-group">
            <h4>Services</h4>
            <ul className="footer__links">
              <li><Link href="/shipping">Shipping Calculator</Link></li>
              <li><Link href="/sell">Sell Your Car</Link></li>
              <li><Link href="/auth/register">Create Account</Link></li>
              <li><Link href="/wishlist">My Wishlist</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer__link-group">
            <h4>Support</h4>
            <ul className="footer__links">
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/shipping-guide">Shipping Guide</Link></li>
              <li><Link href="/inspection">Inspection Report</Link></li>
              <li><a href={`mailto:${process.env.APP_EMAIL}`}>Email Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          marginTop: '40px',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(t => (
              <Link key={t} href="#" className="text-xs" style={{ color: 'var(--text-muted)' }}>{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
