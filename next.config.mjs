/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize package imports for faster compilation
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
  // Faster compilation in development
  experimental: {
    optimizePackageImports: ['recharts', 'framer-motion', 'emoji-picker-react'],
  },
};

export default nextConfig;
