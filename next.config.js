// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [["next-superjson-plugin", {}]],
  },
  images: {
    // domains: [
    //   "avatars.githubusercontent.com",
    //   "res.cloudinary.com",
    //   "lh3.googleusercontent.com"
    // ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      }
    ],
  },
}

console.log("Next.js config loaded!");

module.exports = nextConfig