/** @type {import('next').NextConfig} */

// Normalize the API base URL:
// 1. Default to localhost if not set
// 2. Add https:// if no protocol is present (env var may be set without it)
// 3. Strip any trailing /api, then always re-append it
const rawAdminApiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
const urlWithProtocol = /^https?:\/\//.test(rawAdminApiUrl) ? rawAdminApiUrl : `https://${rawAdminApiUrl}`;
const adminApiBase = urlWithProtocol.replace(/\/api\/?$/, '');

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: `${adminApiBase}/api`,
  },
}

module.exports = nextConfig
