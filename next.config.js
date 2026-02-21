/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "www.corpseed.com" },
      { protocol: "https", hostname: "corpseed.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      {
        protocol: "https",
        hostname: "corpseed-main.s3.ap-south-1.amazonaws.com",
      },
      { protocol: "https", hostname: "corpseed.com" },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "13.202.186.223",
        port: "8080",
        pathname: "/**",
      },
    ],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 160, 192, 256],
    deviceSizes: [360, 390, 414, 640, 768, 1024, 1280, 1536],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

module.exports = nextConfig;
