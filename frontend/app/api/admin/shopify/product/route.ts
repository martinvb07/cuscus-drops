import { NextResponse } from 'next/server';
import {
  getProductDetails,
  updateVariantPrice,
  updateDropStatus,
} from '@/lib/shopify-admin';

function verifyAdmin(req: Request) {
  const token = req.headers.get('x-admin-token');
  return Boolean(token && token === process.env.ADMIN_PASSWORD);
}

const VARIANT_ID = process.env.SHOPIFY_VARIANT_ID ?? '';

/* GET — obtener datos actuales del producto */
export async function GET(req: Request) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const details = await getProductDetails(VARIANT_ID);
  if (!details) {
    return NextResponse.json(
      { error: 'No se pudo obtener el producto. Verifica SHOPIFY_ADMIN_TOKEN y SHOPIFY_VARIANT_ID.' },
      { status: 502 },
    );
  }

  return NextResponse.json(details);
}

/* PATCH — actualizar precio y/o estado del drop */
export async function PATCH(req: Request) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json() as {
    price?:     string;
    status?:    'ACTIVE' | 'DRAFT';
    productId?: string;
  };

  const results: Record<string, unknown> = {};

  if (body.price !== undefined) {
    // Limpiar el precio: solo números y punto decimal
    const cleanPrice = body.price.replace(/[^\d.]/g, '');
    if (!cleanPrice || isNaN(parseFloat(cleanPrice))) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
    }
    const priceResult = await updateVariantPrice(VARIANT_ID, cleanPrice);
    if (!priceResult.ok) {
      return NextResponse.json({ error: priceResult.error }, { status: 502 });
    }
    results.price = priceResult.price;
  }

  if (body.status !== undefined && body.productId) {
    const statusResult = await updateDropStatus(body.productId, body.status);
    if (!statusResult.ok) {
      return NextResponse.json({ error: statusResult.error }, { status: 502 });
    }
    results.status = statusResult.status;
  }

  return NextResponse.json({ ok: true, ...results });
}
