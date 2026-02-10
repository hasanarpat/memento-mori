import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  try {
    const categories = await payload.find({
      collection: 'categories',
      limit: 100, // Tüm kategorileri çekelim
    })

    return NextResponse.json(categories.docs)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
