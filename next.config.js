/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'localhost', 'code-friend.vercel.app'],
  },
}

module.exports = nextConfig
