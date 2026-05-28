import Nav          from '@/components/Nav';
import Loader       from '@/components/Loader';
import LenisProvider from '@/components/LenisProvider';
import { getDropDetails } from '@/lib/drop-cache';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const details = await getDropDetails();
  const soldOut = details?.status === 'DRAFT' || details?.inventory === 0;

  // SOLD OUT: sin navbar, sin pantalla de carga
  if (soldOut) return <>{children}</>;

  return (
    <>
      <Loader />
      <LenisProvider>
        <Nav />
        {children}
      </LenisProvider>
    </>
  );
}
