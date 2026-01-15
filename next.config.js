/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
    ],
  },
};

module.exports = nextConfig;
