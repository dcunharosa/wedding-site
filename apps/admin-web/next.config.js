/** @type {import('next').NextConfig} */

// Normalize the API base URL: strip any trailing /api, then always re-append it.
// This ensures the URL is correct whether NEXT_PUBLIC_ADMIN_API_URL is set with or without /api.
const adminApiBase = (process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001').replace(/\/api\/?$/, '');

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: `${adminApiBase}/api`,
  },
}

module.exports = nextConfig
