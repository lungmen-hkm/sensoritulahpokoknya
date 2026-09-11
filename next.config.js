/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bikin asset CSS/JS selalu di-fetch lewat URL Vercel aslinya
  assetPrefix: 'https://esp32-gas-leak-sensor.vercel.app',
};

module.exports = nextConfig;