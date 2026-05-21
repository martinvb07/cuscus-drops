import Image         from 'next/image';
import Starfield     from '@/components/Starfield';
import ShootingStars from '@/components/ShootingStars';
import ProductHero   from '@/components/ProductHero';
import Footer        from '@/components/Footer';
import { getStock }  from '@/lib/shopify';

const PRICE    = process.env.PRODUCT_PRICE    || '150.000';
const CURRENCY = process.env.PRODUCT_CURRENCY || 'COP';

export default async function Home() {
  const variantId = process.env.SHOPIFY_VARIANT_ID || '';
  const available = await getStock(variantId);

  return (
    <div className="flex flex-col relative">

      {/* Fondo — fixed para que no se mueva al hacer scroll */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage:    "url('/fondo.png')",
          backgroundSize:     'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat:   'no-repeat',
        }}
      />
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.80) 100%)' }}
      />

      <Starfield />
      <ShootingStars />

      {/* Wordmark — espacio top ajustado al nav */}
      <div className="relative z-[5] flex justify-center pt-20 sm:pt-24 pb-0">
        <Image
          src="/NOMBRE_FINAL.png"
          alt="Cuscus Hats"
          width={280} height={80}
          priority
          className="h-auto object-contain w-[140px] sm:w-[180px]"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* Producto */}
      <div className="relative z-[5]">
        <ProductHero available={available} price={PRICE} currency={CURRENCY} />
      </div>

      <div className="relative z-[5]">
        <Footer />
      </div>

    </div>
  );
}
