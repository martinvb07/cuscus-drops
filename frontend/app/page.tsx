import HeroSection    from '@/components/HeroSection';
import DropSection    from '@/components/DropSection';
import EditorialSection from '@/components/EditorialSection';
import Footer         from '@/components/Footer';
import { getStock }   from '@/lib/shopify';

const PRICE    = process.env.PRODUCT_PRICE    || '150.000';
const CURRENCY = process.env.PRODUCT_CURRENCY || 'COP';

export default async function Home() {
  const variantId = process.env.SHOPIFY_VARIANT_ID || '';
  const available = await getStock(variantId);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <DropSection available={available} price={PRICE} currency={CURRENCY} />
      <EditorialSection />
      <Footer />
    </div>
  );
}
