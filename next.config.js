/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  // Support very large file uploads for admin course creation (up to 5GB)
  experimental: {
    serverActions: {
      bodySizeLimit: '5gb',
    },
  },
  // Enable standalone output for Docker
  output: 'standalone',
  // Skip build errors for dynamic pages during Docker build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
