import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    // Get active coupons
    const { docs: coupons } = await payload.find({
      collection: 'coupons',
      where: {
        and: [
          { isActive: { equals: true } },
          {
            or: [
              { validUntil: { exists: false } },
              { validUntil: { greater_than: new Date().toISOString() } },
            ],
          },
        ],
      },
      sort: '-createdAt',
      limit: 50,
    });

    // Filter and format coupons for public display
    const publicCoupons = coupons
      .filter((coupon) => {
        // Check if max uses reached
        if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
          return false;
        }
        
        // Check valid from date
        if (coupon.validFrom && new Date(coupon.validFrom) > new Date()) {
          return false;
        }
        
        return true;
      })
      .map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount,
        validUntil: coupon.validUntil,
        applicableToNewUsersOnly: coupon.applicableToNewUsersOnly,
        maxUsesPerUser: coupon.maxUsesPerUser,
      }));

    return NextResponse.json({
      coupons: publicCoupons,
      count: publicCoupons.length,
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}
