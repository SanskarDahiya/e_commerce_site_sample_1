/** @type {import('next').NextConfig} */
const { version } = require("./package.json");
const nextConfig = {
  reactStrictMode: true,
  env: {
    version,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
};

module.exports = nextConfig;
