import { NextResponse } from 'next/server';
import { getAdminOrderStats, getLiveInventory } from '@/lib/shopify-admin';

function verifyAdmin(req: Request) {
  const token = req.headers.get('x-admin-token');
  return Boolean(token && token === process.env.ADMIN_PASSWORD);
}

export async function GET(req: Request) {
  if (!verifyAdmin(req)) {
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
    stats:     statsVal,
    inventory: inventoryVal,
    stockTotal: Number(process.env.STOCK_TOTAL ?? 100),
    timestamp: new Date().toISOString(),
    error: !connected
      ? (stats.status === 'rejected' ? String((stats as PromiseRejectedResult).reason) : 'Not configured')
      : undefined,
  });
}
