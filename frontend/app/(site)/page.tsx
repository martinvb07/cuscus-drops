import HeroSection      from '@/components/HeroSection';
import DropSection      from '@/components/DropSection';
import Ticker           from '@/components/Ticker';
import EditorialSection from '@/components/EditorialSection';
import Footer           from '@/components/Footer';
import SoldOut          from '@/components/SoldOut';
import PageViewTracker  from '@/components/PageViewTracker';
import { getDropDetails } from '@/lib/drop-cache';

function formatPrice(amount: string, currencyCode: string): { price: string; currency: string } {
  const num = parseFloat(amount);
  if (currencyCode === 'COP') {
    return {
      price:    num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      currency: 'COP',
    };
  }
  return {
    price:    num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    currency: currencyCode,
  };
}

export default async function Home() {
  const details = await getDropDetails(); // mismo fetch que el layout — sin coste extra

  const soldOut = details?.status === 'DRAFT' || details?.inventory === 0;
  if (soldOut) return <SoldOut />;

  const available = details?.inventory ?? null;

  const { price, currency } = details
    ? formatPrice(details.price, details.currencyCode)
    : {
        price:    process.env.PRODUCT_PRICE    || '150.000',
        currency: process.env.PRODUCT_CURRENCY || 'COP',
      };

  const rawPrice = details?.price ?? process.env.PRODUCT_PRICE ?? '210000';
  const jsonLd = {
    '@context':       'https://schema.org',
    '@type':          'Product',
    name:             'Gorra Cuscus Hats — Drop #1',
    description:      'Edición limitada de 100 unidades. Algodón premium, bordado 3D, gamuza artesanal. Producida bajo pedido.',
    image:            'https://cuscushats.com/drop1-img/front.png',
    brand:            { '@type': 'Brand', name: 'Cuscus Hats' },
    sku:              'CUSCUS-DROP1',
    offers: {
      '@type':        'Offer',
      url:            'https://cuscushats.com',
      priceCurrency:  details?.currencyCode ?? 'COP',
      price:          parseFloat(rawPrice),
      availability:   available && available > 0
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
      seller:         { '@type': 'Organization', name: 'Cuscus Hats' },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageViewTracker />
      <HeroSection />
      <DropSection available={available} price={price} currency={currency} />
      <Ticker />
      <EditorialSection available={available} />
      <Footer />
    </div>
  );
}
