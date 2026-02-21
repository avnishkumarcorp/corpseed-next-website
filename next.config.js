/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: "bottom-right",
    appIsrStatus: false, // 🔥 add this
  },
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
  },
};

module.exports = nextConfig;
