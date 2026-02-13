import type { CollectionConfig } from 'payload';

export const Reels: CollectionConfig = {
  slug: 'reels',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'campaignTitle', 'showOnHomepage', 'order'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Başlık',
      admin: {
        description: 'Reel / video kartında görünecek kısa başlık',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Açıklama',
      admin: {
        description: 'Kartta gösterilecek kısa açıklama',
      },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      label: 'Video dosyası (arka planda oynatılır)',
      admin: {
        description: 'Yükleyin: kartta video arkada sessiz döngüde oynar. MP4 önerilir. Boşsa sadece kapak görseli kullanılır.',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video linki (harici)',
      admin: {
        description: 'Instagram/TikTok vb. link; "Videoyu İzle" butonu buraya gider. Video dosyası yoksa kapakla birlikte kullanılır.',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Kapak görseli',
      admin: {
        description: 'Video yüklenirken veya video yokken gösterilir',
      },
    },
    {
      name: 'linkType',
      type: 'select',
      required: true,
      defaultValue: 'product',
      label: 'Link türü',
      options: [
        { label: 'Tek ürün', value: 'product' },
        { label: 'Koleksiyon / kategori', value: 'category' },
        { label: 'Sayfa (kampanya vb.)', value: 'page' },
        { label: 'Özel URL', value: 'custom' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Karttaki buton nereye gidecek?',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Ürün',
      admin: {
        condition: (data) => data?.linkType === 'product',
        description: 'Link tıklanınca gidilecek ürün',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Koleksiyon / Kategori',
      admin: {
        condition: (data) => data?.linkType === 'category',
        description: 'Link tıklanınca gidilecek koleksiyon',
      },
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Sayfa',
      admin: {
        condition: (data) => data?.linkType === 'page',
        description: 'Link tıklanınca gidilecek kampanya / özel sayfa',
      },
    },
    {
      name: 'customUrl',
      type: 'text',
      label: 'Özel URL',
      admin: {
        condition: (data) => data?.linkType === 'custom',
        description: 'Örn: p/yaz-kampanyasi veya https://...',
      },
    },
    {
      name: 'linkLabel',
      type: 'text',
      label: 'Buton metni (opsiyonel)',
      admin: {
        description: 'Boş bırakılırsa "Ürünü Gör" / "Koleksiyona Git" otomatik kullanılır',
      },
    },
    {
      name: 'campaignTitle',
      type: 'text',
      label: 'Kampanya adı',
      admin: {
        description: 'Kartta etiket olarak gösterilir (örn: Yaz Koleksiyonu)',
      },
    },
    {
      name: 'campaignSubline',
      type: 'text',
      label: 'Kampanya alt metni',
      admin: {
        description: 'Kampanya etiketinin altında opsiyonel kısa metin',
      },
    },
    {
      name: 'showOnHomepage',
      type: 'checkbox',
      label: 'Anasayfada göster',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'İşaretlenen reeller anasayfada "Sponsor Reelleri" bölümünde listelenir.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sıra (anasayfa)',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Küçük numara önce gelir.',
      },
    },
  ],
};
