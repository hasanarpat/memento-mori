import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';

type CartItemInput = {
  product?: string | { id?: string };
  quantity: number;
};

type UserWithCart = {
  cart?: unknown[];
};

export async function GET(request: Request) {
  const payload = await getPayload({ config: configPromise });

  try {
    const { user } = await payload.auth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Populate cart products and their images (media) for frontend
    const userWithCart = (await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 2, // cart[].product + product.images (media with url)
    })) as UserWithCart;

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



    // Update User's cart
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        cart: items.map((item: CartItemInput) => ({
          product:
            item.product && typeof item.product === 'object'
              ? item.product.id
              : item.product,
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
