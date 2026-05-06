import type { Metadata } from 'next';
import './globals.css';

const APP_NAME = process.env.APP_NAME || 'Korea Auto Export';
const APP_DOMAIN = process.env.APP_DOMAIN || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} | Korea's #1 Used Car Export Platform`,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Buy trusted Korean used cars — Hyundai, Kia, Genesis. Shipping to Libya, UAE, Kyrgyzstan, Kazakhstan, Jordan and worldwide.',
  keywords: ['korean used cars', 'used car export', 'hyundai export', 'kia export', 'car from korea'],
  metadataBase: new URL(APP_DOMAIN),
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: `${APP_NAME} | Trusted Korean Used Car Exporter`,
    description: 'Quality Korean used cars exported globally. Libya, UAE, Central Asia, Southeast Asia.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
