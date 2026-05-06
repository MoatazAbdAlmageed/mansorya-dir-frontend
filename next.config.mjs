/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mansorya.wp1.host',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
