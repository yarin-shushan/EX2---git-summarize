/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Enable server components by default
    serverComponentsExternalPackages: [],
  },
  // Optimize for Vercel deployment
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig