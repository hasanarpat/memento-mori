import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const payload = await getPayload({ config: configPromise })

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const idsParam = searchParams.get('ids') // comma-separated ids for wishlist etc.
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1

  try {
    const where: Record<string, unknown> = {}

    if (idsParam) {
      const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean)
      if (ids.length > 0) {
        where.id = { in: ids }
      }
    }

    if (category) {
      where.category = {
        equals: category,
      }
    }

    if (searchParams.get('isFeatured') === 'true') {
      where.isFeatured = {
        equals: true,
      }
    }

    if (searchParams.get('isNew') === 'true') {
      where.isNewArrival = {
        equals: true,
      }
    }

    if (searchParams.get('badge')) {
      where.badge = {
        equals: searchParams.get('badge'),
      }
    }

    const sort = searchParams.get('sort') || '-createdAt' // Varsayılan olarak en yeni en üstte

    const products = await payload.find({
      collection: 'products',
      where,
      limit,
      page,
      sort,
      depth: 1, 
    })

    return NextResponse.json(products)
  } catch (error) {

    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
