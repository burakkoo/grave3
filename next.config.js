/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'graveappmemoria.s3.north-1.amazonaws.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'graveap.s3.eu-north-1.amazonaws.com',
        port: '',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
//hostname: 'memoria-s3-bucket.s3.us-east-1.amazonaws.com',
// hostname: 'memoria-graveapp.s3.eu-north-1.amazonaws.com',