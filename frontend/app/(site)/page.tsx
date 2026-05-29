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

  return (
    <div className="flex flex-col min-h-screen">
      <PageViewTracker />
      <HeroSection />
      <DropSection available={available} price={price} currency={currency} />
      <Ticker />
      <EditorialSection available={available} />
      <Footer />
    </div>
  );
}
