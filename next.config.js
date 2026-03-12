/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "tech.localhost",
    "beauty.localhost",
    "belleza.localhost",
    "hogar.localhost",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};

module.exports = nextConfig;