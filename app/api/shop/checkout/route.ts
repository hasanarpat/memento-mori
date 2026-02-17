import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
  const payload = await getPayload({ config: configPromise });

  try {
    const body = await request.json();

    // 1. Strict Validation
    const validationResult = checkoutSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { items, shippingAddress, paymentMethod } = validationResult.data;

    // Authenticate User
    const { user } = await payload.auth(request);

    if (user) {
      // Check if user email is explicitly unverified (only enforce in production)
      // In development, _verified might be undefined (treated as verified)
      // In production, _verified must be true to proceed
      if (
        process.env.NODE_ENV === 'production' &&
        (user as { _verified?: boolean })._verified === false
      ) {
        return NextResponse.json(
          { error: 'Email not verified. Please check your inbox or profile.' },
          { status: 403 },
        );
      }
    } else {
      // If we want to force login for checkout, uncomment below:
      // return NextResponse.json({ error: 'You must be logged in to checkout.' }, { status: 401 });
    }

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

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.id);

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.id} not found or unavailable` },
          { status: 400 },
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          },
          { status: 400 },
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
    const paymentStatus = 'paid';

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
        user: user ? user.id : undefined,
      },
    });

    // 5. Send Order Summary Email
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { background-color: #0d0a0f; color: #e8dcc4; font-family: sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a0a1f; border: 1px solid #8b7355; }
            .header { text-align: center; border-bottom: 1px solid #5c0a0a; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; color: #b8860b; font-weight: bold; text-decoration: none; }
            .order-info { margin-bottom: 20px; color: #9a9a9a; }
            .item { display: flex; align-items: center; border-bottom: 1px solid #3d3d3d; padding: 15px 0; }
            .item img { width: 64px; height: 64px; object-fit: cover; border-radius: 4px; border: 1px solid #5c0a0a; margin-right: 15px; }
            .item-details { flex: 1; }
            .item-name { color: #e8dcc4; font-weight: bold; display: block; margin-bottom: 5px; }
            .item-meta { color: #9a9a9a; font-size: 14px; }
            .total-section { margin-top: 20px; text-align: right; border-top: 1px solid #5c0a0a; padding-top: 20px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; color: #9a9a9a; }
            .total-final { font-size: 18px; color: #b8860b; font-weight: bold; margin-top: 10px; }
            .address { background-color: #0d0a0f; padding: 15px; border-radius: 4px; margin-top: 20px; color: #9a9a9a; font-size: 14px; }
            .button { display: inline-block; background-color: #5c0a0a; color: #e8dcc4; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 30px; font-weight: bold; }
            .footer { text-align: center; margin-top: 40px; color: #555; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">MEMENTO MORI</div>
              <p>Order Confirmed</p>
            </div>
            
            <div class="order-info">
              <p>Thank you for your ritual. Your order has been received.</p>
              <p><strong>Order ID:</strong> ${order.id}</p>
            </div>

            <div class="items">
              ${orderItems.map((item, index) => {
        const product = products.find(p => p.id === item.product);
        // Safely get image URL
        let imgUrl = '';
        if (product && product.images) {
          if (Array.isArray(product.images) && product.images[0]?.url) {
            imgUrl = product.images[0].url;
          } else if (typeof product.images === 'object' && 'url' in product.images) {
            imgUrl = (product.images as any).url;
          }
        }

        return `
                  <div class="item">
                    ${imgUrl ? `<img src="${imgUrl}" alt="${product?.name || 'Product'}" />` : '<div style="width:64px;height:64px;background:#333;margin-right:15px;"></div>'}
                    <div class="item-details">
                      <span class="item-name">${product?.name || 'Unknown Item'}</span>
                      <div class="item-meta">Qty: ${item.quantity} × ₺${item.price}</div>
                    </div>
                    <div style="color: #e8dcc4;">₺${item.price * item.quantity}</div>
                  </div>
                 `;
      }).join('')}
            </div>

            <div class="total-section">
              <div class="total-row">
                <span>Subtotal</span>
                <span>₺${total}</span>
              </div>
              <div class="total-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="total-row total-final">
                <span>Total</span>
                <span>₺${total}</span>
              </div>
            </div>

            <div class="address">
              <strong>Shipping to:</strong><br/>
              ${shippingAddress.fullName}<br/>
              ${shippingAddress.addressLine1}<br/>
              ${shippingAddress.city}, ${shippingAddress.postalCode}<br/>
              ${shippingAddress.country}
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/account/orders" class="button">View Your Order</a>
            </div>

            <div class="footer">
              <p>Memento Mori - Digital Rituals</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await payload.sendEmail({
        to: user ? (user as any).email : 'customer@example.com', // Use actual user email if available, or fallback/shipping email
        subject: `Order Confirmed - #${order.id}`,
        html: emailHtml,
      });

    } catch (emailErr) {
      console.error('Failed to send order email:', emailErr);
      // Don't fail the request, just log it
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        message: 'Order created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Checkout Security Alert:', error);
    return NextResponse.json(
      { error: 'Checkout failed due to system error' },
      { status: 500 },
    );
  }
}
