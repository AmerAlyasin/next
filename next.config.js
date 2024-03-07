/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      node = {
        net: 'empty'
      };
      config.resolve.fallback.dns = false;
      config.resolve.fallback.fs = false;
      config.resolve.fallback.child_process = false;
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
}

module.exports = nextConfig;
