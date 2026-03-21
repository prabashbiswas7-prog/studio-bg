/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // generates static HTML — no server needed
  trailingSlash: true,     // needed for cPanel hosting
  images: {
    unoptimized: true,     // required for static export
  },
}

module.exports = nextConfig
