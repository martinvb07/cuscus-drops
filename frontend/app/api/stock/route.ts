import { NextResponse } from 'next/server';
import { getStock }     from '@/lib/shopify';

export async function GET() {
  const total = Number(process.env.STOCK_TOTAL ?? 100);
  try {
    const variantId = process.env.SHOPIFY_VARIANT_ID!;
    const available = await getStock(variantId);
    return NextResponse.json({ available, total });
  } catch {
    return NextResponse.json({ available: null, total });
  }
}
