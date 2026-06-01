import { cache }          from 'react';
import { unstable_cache } from 'next/cache';
import { getProductDetails } from './shopify-admin';

const _fetchDropDetails = unstable_cache(
  (variantId: string) => getProductDetails(variantId),
  ['drop-details'],
  { revalidate: 5 },
);

export const getDropDetails = cache(async () => {
  const variantId = process.env.SHOPIFY_VARIANT_ID || '';
  return _fetchDropDetails(variantId);
});
