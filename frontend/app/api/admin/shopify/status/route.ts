import { NextResponse } from 'next/server';
import { getAdminOrderStats, getLiveInventory } from '@/lib/shopify-admin';
import { verifyAdminRequest } from '@/lib/admin-auth';

export async function GET(req: Request) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const variantId = process.env.SHOPIFY_VARIANT_ID ?? '';

  const [stats, inventory] = await Promise.allSettled([
    getAdminOrderStats(),
    getLiveInventory(variantId),
  ]);

  const statsVal     = stats.status     === 'fulfilled' ? stats.value     : null;
  const inventoryVal = inventory.status === 'fulfilled' ? inventory.value : null;

  const connected = statsVal !== null;

  return NextResponse.json({
    connected,
    stats:      statsVal,
    inventory:  inventoryVal,
    stockTotal: Number(process.env.STOCK_TOTAL ?? 100),
    timestamp:  new Date().toISOString(),
    error:      !connected ? 'Error al conectar con Shopify' : undefined,
  });
}
