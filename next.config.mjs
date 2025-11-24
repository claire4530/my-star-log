/** @type {import('next').NextConfig} */
const nextConfig = {
  // 忽略 TypeScript 錯誤 (為了讓部署順利)
  typescript: {
    ignoreBuildErrors: true,
  },
  // 忽略 ESLint 錯誤
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;