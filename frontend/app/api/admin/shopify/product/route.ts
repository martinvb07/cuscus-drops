import { NextResponse } from 'next/server';
import {
  getProductDetails,
  updateVariantPrice,
  updateDropStatus,
} from '@/lib/shopify-admin';
import { verifyAdminRequest } from '@/lib/admin-auth';

const VARIANT_ID = process.env.SHOPIFY_VARIANT_ID ?? '';

/* GET — obtener datos actuales del producto */
export async function GET(req: Request) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const details = await getProductDetails(VARIANT_ID);
  if (!details) {
    return NextResponse.json({ error: 'Error al obtener el producto de Shopify' }, { status: 502 });
  }

  return NextResponse.json(details);
}

/* PATCH — actualizar precio y/o estado del drop */
export async function PATCH(req: Request) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json() as {
    price?:     string;
    status?:    'ACTIVE' | 'DRAFT';
    productId?: string;
  };

  const results: Record<string, unknown> = {};

  if (body.price !== undefined) {
    const cleanPrice = body.price.replace(/[^\d.]/g, '');
    if (!cleanPrice || isNaN(parseFloat(cleanPrice))) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
    }
    const priceResult = await updateVariantPrice(VARIANT_ID, cleanPrice);
    if (!priceResult.ok) {
      return NextResponse.json({ error: 'Error al actualizar el precio en Shopify' }, { status: 502 });
    }
    results.price = priceResult.price;
  }

  if (body.status !== undefined && body.productId) {
    const statusResult = await updateDropStatus(body.productId, body.status);
    if (!statusResult.ok) {
      return NextResponse.json({ error: 'Error al cambiar el estado del drop en Shopify' }, { status: 502 });
    }
    results.status = statusResult.status;
  }

  return NextResponse.json({ ok: true, ...results });
}
