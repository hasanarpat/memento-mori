import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'status', 'total', 'createdAt'],
    group: 'Shop',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.collection === 'users') {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: () => true, // Herkes sipariş oluşturabilir (Guest checkout)
    update: ({ req: { user } }) => {
      // Sadece admin veya sipariş sahibi güncelleyebilir (kısıtlı alanlar)
      return !!user
    },
    delete: () => false, // Siparişler silinemez, iptal edilir
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true, // Sipariş anındaki fiyatı saklamak önemli
        },
      ],
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'fullName', type: 'text', required: true },
        { name: 'addressLine1', type: 'text', required: true },
        { name: 'addressLine2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'Credit Card', value: 'credit_card' },
        { label: 'PayPal', value: 'paypal' },
      ],
      required: true,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
