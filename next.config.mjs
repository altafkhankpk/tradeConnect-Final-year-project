/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true, // ✅ use "instrumentationHook" (singular)
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'karim-next-2.s3.amazonaws.com',
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default nextConfig;

