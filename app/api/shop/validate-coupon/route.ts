import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function POST(request: NextRequest) {
  try {
    const { code, orderAmount, userId } = await request.json();

    if (!code || orderAmount === undefined) {
      return NextResponse.json(
        { error: 'Coupon code and order amount are required' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // Find the coupon
    const { docs: coupons } = await payload.find({
      collection: 'coupons',
      where: {
        code: { equals: code.toUpperCase() },
      },
    });

    if (!coupons || coupons.length === 0) {
      return NextResponse.json(
        { valid: false, error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    const coupon = coupons[0];

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, error: 'This coupon is no longer active' },
        { status: 400 }
      );
    }

    // Check date validity
    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return NextResponse.json(
        { valid: false, error: 'This coupon is not yet valid' },
        { status: 400 }
      );
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return NextResponse.json(
        { valid: false, error: 'This coupon has expired' },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (coupon.minimumOrderAmount && orderAmount < coupon.minimumOrderAmount) {
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum order amount is ₺${coupon.minimumOrderAmount}`,
        },
        { status: 400 }
      );
    }

    // Check max uses
    if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
      return NextResponse.json(
        { valid: false, error: 'This coupon has reached its usage limit' },
        { status: 400 }
      );
    }

    // Check if new user only
    if (coupon.applicableToNewUsersOnly && userId) {
      // Check user's order history
      const { docs: userOrders } = await payload.find({
        collection: 'orders',
        where: {
          and: [
            { user: { equals: userId } },
            { status: { not_equals: 'cancelled' } },
          ],
        },
        limit: 1,
      });

      if (userOrders && userOrders.length > 0) {
        return NextResponse.json(
          { valid: false, error: 'This coupon is only for new users' },
          { status: 400 }
        );
      }
    }

    // Check per-user usage limit
    if (coupon.maxUsesPerUser && userId) {
      const { docs: userCouponUsage } = await payload.find({
        collection: 'orders',
        where: {
          and: [
            { user: { equals: userId } },
            { couponCode: { equals: code.toUpperCase() } },
            { status: { not_equals: 'cancelled' } },
          ],
        },
      });

      if (userCouponUsage && userCouponUsage.length >= coupon.maxUsesPerUser) {
        return NextResponse.json(
          { valid: false, error: 'You have reached the usage limit for this coupon' },
          { status: 400 }
        );
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
