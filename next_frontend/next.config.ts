/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow API requests to your ASP.NET backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:5232/api/:path*', // Your ASP.NET backend
      },
      // Also handle auth endpoints
      {
        source: '/auth/:path*',
        destination: 'https://localhost:5232/auth/:path*',
      },
    ];
  },
  // Images configuration for external URLs
  images: {
    domains: ['localhost', 'yourdomain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable React strict mode
  reactStrictMode: true,
  // For better performance
  swcMinify: true,
}

module.exports = nextConfig