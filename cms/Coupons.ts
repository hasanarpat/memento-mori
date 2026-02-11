import type { CollectionConfig } from 'payload';

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'discountValue', 'isActive', 'usageCount'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique coupon code (e.g., WELCOME10, NEWUSER20)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Internal description of the coupon purpose',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      defaultValue: 'percentage',
      options: [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Fixed Amount', value: 'fixed' },
      ],
    },
    {
      name: 'discountValue',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Percentage (1-100) or fixed amount in TRY',
      },
    },
    {
      name: 'minimumOrderAmount',
      type: 'number',
      min: 0,
      admin: {
        description: 'Minimum order amount required to use this coupon (optional)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable/disable this coupon',
      },
    },
    {
      name: 'validFrom',
      type: 'date',
      admin: {
        description: 'Coupon valid from date (optional)',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      admin: {
        description: 'Coupon expiration date (optional)',
      },
    },
    {
      name: 'maxUses',
      type: 'number',
      min: 0,
      admin: {
        description: 'Maximum number of times this coupon can be used (0 = unlimited)',
      },
    },
    {
      name: 'maxUsesPerUser',
      type: 'number',
      min: 0,
      admin: {
        description: 'Maximum uses per user (0 = unlimited)',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total number of times this coupon has been used',
      },
    },
    {
      name: 'applicableToNewUsersOnly',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Only allow new users to use this coupon',
      },
    },
    {
      name: 'applicableCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        description: 'Limit coupon to specific categories (leave empty for all)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Uppercase the coupon code for consistency
        if (data.code) {
          data.code = data.code.toUpperCase();
        }
        return data;
      },
    ],
  },
};
