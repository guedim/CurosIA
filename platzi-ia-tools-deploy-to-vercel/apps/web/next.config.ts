import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 120, // Aumenta a 120 segundos
  // typedRoutes se activará en un sprint posterior cuando el mapa de rutas esté estable.
  // Por ahora se mantiene desactivado para no fricción en la fase de scaffolding.
  typedRoutes: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
