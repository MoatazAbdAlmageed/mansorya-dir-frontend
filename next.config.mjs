import withPWAInit from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable response compression
  compress: true,

  images: {
    // Use WebP/AVIF format automatically
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mansorya.wp1.host',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.fna.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fcai19-7.fna.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.behance.net',
        pathname: '/**',
      },
    ],
    // Cache optimized images for 7 days
    minimumCacheTTL: 604800,
  },

  // Aggressive HTTP caching headers
  async headers() {
    return [
      {
        // Cache static assets (JS, CSS, fonts, images) for 1 year
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache optimized images for 7 days
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // PWA assets
        source: '/(manifest.json|sw.js|workbox-.*\\.js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  turbopack: {},
};

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
