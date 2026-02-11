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

    const userData = (await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 1, // Populate products for frontend
    })) as any;

    return NextResponse.json({
      wishlist: userData.wishlist || [],
      success: true,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
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

    const { productIds } = await request.json(); // Array of strings (IDs)

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Invalid wishlist format' },
        { status: 400 },
      );
    }

    console.log('Wishlist Update IDs:', productIds);

    const validIds = productIds
      .filter((id: any) => {
        // AcceptONLY 24-char hex (ObjectId). Reject integers/legacy IDs.
        const isObjectId =
          typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

        if (!isObjectId) {
          console.warn(`Skipping invalid wishlist item ID: ${id}`);
          return false;
        }
        return true;
      })
      .map((id: any) => id);

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        wishlist: validIds,
      },
      overrideAccess: true, // Bypass validation for fields not being updated
    });

    return NextResponse.json({ success: true, message: 'Wishlist updated' });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to update wishlist' },
      { status: 500 },
    );
  }
}
