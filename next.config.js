/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack for dev completely
  webpack: (config) => {
    return config;
  },
  experimental: {
    turbo: false,
  },
};

module.exports = nextConfig;
