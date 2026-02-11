import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { z } from 'zod';

const itemSchema = z.object({
  id: z.union([z.string(), z.number()]), // Payload IDs can be string or number
  quantity: z.number().min(1).max(99),
  price: z.number().min(0),
});

const addressSchema = z.object({
  fullName: z.string().min(2),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  postalCode: z.string().min(2),
  country: z.string().min(2),
});

const checkoutSchema = z.object({
  items: z.array(itemSchema).min(1, 'Cart is empty'),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['credit_card', 'paypal']),
  user: z.string().optional(), // User ID if logged in
});

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })

  try {
    const body = await request.json()
    
    // 1. Strict Validation
    const validationResult = checkoutSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { items, shippingAddress, paymentMethod, user } = validationResult.data;

    // 2. Secure Calculation (Server-Side)
    // Fetch fresh product data to get actual prices
    const productIds = items.map((item) => item.id);
    
    // Check if IDs are numbers or strings based on schema, but Payload usually uses one or the other per collection.
    // Assuming string for now based on typicalPayload/Mongo usage, but schema allows both.
    // If Mongo, IDs are strings. If SQL, usually numbers.
    // Let's use `in` operator which handles array.
    
    const { docs: products } = await payload.find({
      collection: 'products',
      where: {
        id: { in: productIds },
      },
      pagination: false,
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    
    let total = 0
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.id);
      
      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.id} not found or unavailable` }, 
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
           { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
           { status: 400 }
        );
      }

      const qty = Math.abs(Math.floor(item.quantity));
      const price = product.price; // Trust Server Price

      total += price * qty;

      orderItems.push({
        product: product.id,
        quantity: qty,
        price: price,
      });
    }

    // 3. Payment Simulation (Secure Placeholder)
    // In real app, create PaymentIntent here with `total`
    const paymentStatus = 'paid' 

    // 4. Create Order
    const order = await payload.create({
      collection: 'orders',
      data: {
        items: orderItems,
        total,
        shippingAddress,
        paymentMethod,
        paymentStatus,
        status: 'processing',
        user: user || undefined,
      },
    })

    return NextResponse.json({ success: true, orderId: order.id, message: 'Order created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Checkout Security Alert:', error)
    return NextResponse.json({ error: 'Checkout failed due to system error' }, { status: 500 })
  }
}
