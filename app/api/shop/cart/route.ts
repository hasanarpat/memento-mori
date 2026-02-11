import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const payload = await getPayload({ config: configPromise });

  try {
    const { user } = await payload.auth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // User's cart is in user.cart array (populated or id)
    // We should populate products to send full details to frontend
    const userWithCart = (await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 1, // Populate relationships
    })) as any;

    return NextResponse.json({
      cart: userWithCart.cart || [],
      success: true,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise });

  try {
    const { user } = await payload.auth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json(); // Array of { product: id, quantity: num }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid cart format' },
        { status: 400 },
      );
    }

    console.log('Cart Update Request Items:', JSON.stringify(items, null, 2));

    const processedCart = items
      .filter((item: any) => {
        const id = item.product?.id || item.product;
        // AcceptONLY 24-char hex (ObjectId). Reject integers/legacy IDs.
        const isObjectId =
          typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

        if (!isObjectId) {
          console.warn(`Skipping invalid cart item ID: ${id}`);
          return false;
        }
        return true;
      })
      .map((item: any) => {
        const id = item.product?.id || item.product;
        return {
          product: id,
          quantity: item.quantity,
        };
      });

    console.log(
      'Processed Cart for Update:',
      JSON.stringify(processedCart, null, 2),
    );

    // Update User's cart
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        cart: items.map((item: any) => ({
          product: item.product.id || item.product, // ensure ID is used
          quantity: item.quantity,
        })),
      },
      overrideAccess: true, // Bypass validation for fields not being updated
    });

    return NextResponse.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 },
    );
  }
}
