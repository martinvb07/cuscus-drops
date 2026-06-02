import type { Metadata } from 'next';
import { Cormorant_Garamond, JetBrains_Mono, Bokor, Bebas_Neue } from 'next/font/google';
import './globals.css';

const garamond = Cormorant_Garamond({
  subsets: ['latin'],
  weight:  ['300', '400', '500'],
  style:   ['normal', 'italic'],
  variable: '--font-garamond',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight:  ['400', '500'],
  variable: '--font-mono',
});

const gothic = Bokor({
  subsets:  ['latin'],
  weight:   ['400'],
  variable: '--font-gothic',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight:  ['400'],
  variable: '--font-bebas',
});

const SITE_URL = 'https://cuscushats.com';
const OG_IMAGE = `${SITE_URL}/drop1-img/front.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:        'CUSCUS HATS — Drop #1',
  description:  'Solo 100 unidades en el mundo. Gorra edición limitada, producida bajo pedido. Una vez agotado, no vuelve.',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type:        'website',
    url:         SITE_URL,
    siteName:    'Cuscus Hats',
    title:       'CUSCUS HATS — Drop #1 | 100 unidades',
    description: 'Solo 100 unidades en el mundo. Gorra edición limitada, producida bajo pedido. Una vez agotado, no vuelve.',
    images: [{ url: OG_IMAGE, width: 1200, height: 1200, alt: 'Gorra Cuscus Hats Drop #1' }],
    locale: 'es_CO',
  },

  twitter: {
    card:        'summary_large_image',
    title:       'CUSCUS HATS — Drop #1 | 100 unidades',
    description: 'Solo 100 unidades en el mundo. Gorra edición limitada, producida bajo pedido.',
    images:      [OG_IMAGE],
  },

  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`${garamond.variable} ${jetbrainsMono.variable} ${gothic.variable} ${bebasNeue.variable} grain`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
