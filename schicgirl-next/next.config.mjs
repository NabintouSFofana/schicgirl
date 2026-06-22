/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow the existing Selar / external thumbnails if ever used.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
