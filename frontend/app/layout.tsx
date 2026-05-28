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

export const metadata: Metadata = {
  title:       'CUSCUS HATS — Drop #1',
  description: 'Solo 100 unidades. Gorra edición limitada — compra ahora.',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
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
