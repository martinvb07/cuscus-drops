import type { Metadata } from 'next';
import { Cormorant_Garamond, JetBrains_Mono, Pirata_One } from 'next/font/google';
import Nav          from '@/components/Nav';
import Loader       from '@/components/Loader';
import CustomCursor from '@/components/CustomCursor';
import LenisProvider from '@/components/LenisProvider';
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

const pirataOne = Pirata_One({
  subsets: ['latin'],
  weight:  ['400'],
  variable: '--font-gothic',
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
        className={`${garamond.variable} ${jetbrainsMono.variable} ${pirataOne.variable} grain`}
        suppressHydrationWarning
      >
        <Loader />
        <CustomCursor />
        <LenisProvider>
          <Nav />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
