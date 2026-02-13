import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MIN_QUERY_LENGTH = 1;
const MAX_QUERY_LENGTH = 100;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 20;

/**
 * Optimized product search endpoint.
 * - Single DB round-trip, minimal payload (select), no pagination overhead.
 * - Uses Payload "contains" (case-insensitive); ensure products.name and products.slug
 *   have index: true in collection config for fast lookups.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const limitParam = searchParams.get('limit');
  const limit = Math.min(
    Math.max(limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );

  if (q.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ results: [], total: 0 });
  }

  if (q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
      collection: 'products',
      where: {
        or: [
          { name: { contains: q } },
          { slug: { contains: q } },
        ],
      },
      limit,
      depth: 1,
      pagination: false,
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        theme: true,
        productType: true,
        images: true,
      },
    });

    return NextResponse.json({
      results: result.docs,
      total: result.docs.length,
    });
  } catch (error) {
    console.error('[search]', error);
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    );
  }
}
