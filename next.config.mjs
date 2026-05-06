/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
      }
    ],
  },
};

export default nextConfig;
