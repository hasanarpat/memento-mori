import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const payload = await getPayload({ config: configPromise })
  const { slug } = await context.params

  try {
    const products = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1, // Sadece 1 ürün bulmalı
      depth: 2, // Görseller, kategori vs. detaylı gelsin
    })

    if (products.docs.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(products.docs[0])
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
