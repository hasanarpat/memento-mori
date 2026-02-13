import type { CollectionConfig } from 'payload';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'showOnHomepage', 'order'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Yazar / İsim',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: '1-5 arası puan',
      },
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Yorum metni',
    },
    {
      name: 'authorAvatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profil görseli',
      required: false,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'İlgili ürün (opsiyonel)',
      admin: {
        description: 'Yorum hangi ürün için yazıldıysa seçin',
      },
    },
    {
      name: 'date',
      type: 'text',
      label: 'Tarih (görüntüleme)',
      admin: {
        description: 'Örn: Ocak 2024, Dec 2023',
      },
    },
    {
      name: 'showOnHomepage',
      type: 'checkbox',
      label: 'Anasayfada göster',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'İşaretlenen yorumlar anasayfada seçili yorumlar bölümünde listelenir.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sıra (anasayfa)',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Anasayfada gösterim sırası. Küçük numara önce gelir.',
      },
    },
  ],
};
