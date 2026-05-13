import type { Metadata } from 'next';
import { Cormorant_Garamond, JetBrains_Mono, Pirata_One } from 'next/font/google';
import './globals.css';

const garamond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

const pirataOne = Pirata_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-gothic',
});

export const metadata: Metadata = {
  title: 'CUSCUS HATS — World Is Yours',
  description: 'Ediciones limitadas. Sé el primero en enterarte del próximo drop.',
  icons: {
    icon: '/Logo_Principal-removebg-preview.png',
    apple: '/Logo_Principal-removebg-preview.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`${garamond.variable} ${jetbrainsMono.variable} ${pirataOne.variable} grain vignette h-full flex flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
