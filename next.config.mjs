/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true, // ✅ use "instrumentationHook" (singular)
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'altaf-next-1.s3.amazonaws.com',
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default nextConfig;

