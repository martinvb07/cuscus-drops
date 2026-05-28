import { NextResponse } from 'next/server';
import { getStock }     from '@/lib/shopify';

export async function GET() {
  try {
    const variantId = process.env.SHOPIFY_VARIANT_ID!;
    const available = await getStock(variantId);
    return NextResponse.json({ available, total: 100 });
  } catch {
    return NextResponse.json({ available: null, total: 100 });
  }
}
