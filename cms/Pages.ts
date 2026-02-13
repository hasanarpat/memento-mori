import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
    group: 'Content',
    description: 'WordPress tarzı dinamik sayfalar. Kampanya, reklam, anlaşma sayfaları oluşturabilirsiniz.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Sayfa başlığı',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL slug',
      admin: {
        description: 'Sayfa adresi: /p/[slug] — örn: yaz-kampanyasi',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Durum',
      options: [
        { label: 'Taslak', value: 'draft' },
        { label: 'Yayında', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Sadece "Yayında" sayfalar sitede görünür.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'İçerik blokları',
      minRows: 1,
      blocks: [
        {
          slug: 'content',
          labels: { singular: 'Metin / İçerik', plural: 'Metin blokları' },
          fields: [
            {
              name: 'content',
              type: 'richText',
              label: 'İçerik',
              required: true,
            },
          ],
        },
        {
          slug: 'productGrid',
          labels: { singular: 'Ürün gridi', plural: 'Ürün gridleri' },
          fields: [
            {
              name: 'blockTitle',
              type: 'text',
              label: 'Blok başlığı',
              admin: { description: 'Örn: Bu kampanyadaki ürünler' },
            },
            {
              name: 'products',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              required: true,
              label: 'Ürünler',
            },
            {
              name: 'layout',
              type: 'select',
              label: 'Görünüm',
              defaultValue: 'grid',
              options: [
                { label: 'Grid', value: 'grid' },
                { label: 'Yatay kaydırma', value: 'carousel' },
              ],
            },
          ],
        },
        {
          slug: 'hero',
          labels: { singular: 'Hero alanı', plural: 'Hero alanları' },
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Ana başlık',
              required: true,
            },
            {
              name: 'subheading',
              type: 'text',
              label: 'Alt başlık',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Arka plan / görsel',
            },
          ],
        },
      ],
    },
  ],
};
