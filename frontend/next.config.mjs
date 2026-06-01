/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    quality: 100,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [256, 384, 512, 720, 1080, 1440],
    formats: ['image/webp'],
  },
};

export default nextConfig;
