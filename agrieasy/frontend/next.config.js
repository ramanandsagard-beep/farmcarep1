/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Temporarily disable i18n to fix build issues
  // i18n: {
  //   locales: ['en', 'hi', 'ta', 'te'],
  //   defaultLocale: 'en',
  // },
  async rewrites() {
    return [
      {
        source: '/_api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
