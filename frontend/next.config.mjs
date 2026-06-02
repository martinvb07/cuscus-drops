/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Impide que la página se incruste en iframes (clickjacking)
  { key: 'X-Frame-Options',          value: 'DENY' },
  // El navegador no adivina el tipo MIME del contenido
  { key: 'X-Content-Type-Options',   value: 'nosniff' },
  // Fuerza HTTPS por 2 años e incluye subdominios
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Controla cuánta info del referrer se envía a terceros
  { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
  // Desactiva funciones del navegador que no se usan
  { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Content Security Policy — controla qué recursos puede cargar la página
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js necesita 'unsafe-inline' para hydration scripts y estilos
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      // Imágenes propias, data URIs y cualquier HTTPS (product images de Shopify)
      "img-src 'self' data: https:",
      "font-src 'self'",
      // Conexiones permitidas: misma origen + backend + checkout de Shopify
      "connect-src 'self' https://api.cuscushats.com https://payments.cuscushats.com",
      // No permite embeber en frames externos
      "frame-ancestors 'none'",
      // No permite cargar objetos Flash/Java
      "object-src 'none'",
      // Sube el base-uri para evitar inyección de base tag
      "base-uri 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  images: {
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [256, 384, 512, 720, 1080, 1440],
    formats: ['image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
