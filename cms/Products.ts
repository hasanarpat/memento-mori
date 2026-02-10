import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category'],
    group: 'Shop',
  },
  access: {
    read: () => true, // Herkes okuyabilir
    create: () => true, // Geliştirme kolaylığı için herkese açık (Production'da kapatılmalı)
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Product Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Price (TRY)',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      label: 'Category',
      required: true,
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      label: 'Product Image',
      required: true, // Şimdilik zorunlu yapalım, görsel önemli
    },
    {
      name: 'additionalImages',
      type: 'array',
      label: 'Additional Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isNewArrival',
      type: 'checkbox',
      label: 'New Arrival',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'badge',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Sale', value: 'sale' },
        { label: 'New', value: 'new' },
        { label: 'Limited', value: 'limited' },
      ],
      defaultValue: 'none',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
