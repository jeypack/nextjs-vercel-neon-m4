import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PokeAPI/sprites/master/sprites/pokemon/other/**',
      },
      {
        protocol: 'https',
        hostname: 'images.dog.ceo',
        pathname: '/breeds/**',
      }
    ],
  },
};

export default nextConfig;
