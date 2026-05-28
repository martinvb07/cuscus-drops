import { cache } from 'react';
import { getProductDetails } from './shopify-admin';

/**
 * Cached per-render — layout y page comparten el mismo fetch
 * sin hacer dos llamadas a Shopify.
 */
export const getDropDetails = cache(async () => {
  const variantId = process.env.SHOPIFY_VARIANT_ID || '';
  return getProductDetails(variantId);
});
