import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 도메인 환경변수화 — .env의 APP_DOMAIN만 변경하면 전체 적용
  env: {
    APP_NAME: process.env.APP_NAME || 'Korea Auto Export',
    APP_DOMAIN: process.env.APP_DOMAIN || 'https://yourdomain.com',
    APP_WHATSAPP: process.env.APP_WHATSAPP || '+82-10-XXXX-XXXX',
    APP_TELEGRAM: process.env.APP_TELEGRAM || '@yourhandle',
    APP_EMAIL: process.env.APP_EMAIL || 'contact@yourdomain.com',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },

  // 이미지 도메인 허용
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  // 보안 헤더
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
