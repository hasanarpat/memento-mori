import { MetadataRoute } from "next";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { SITE_URL } from "@/app/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/collections`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/worlds`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/new-arrivals`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${SITE_URL}/ritual`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/archive`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/lookbook`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/journal`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/size-guide`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/kvkk`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/gizlilik-politikasi`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/kullanim-kosullari`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/iade-degisim`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/kargo`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const payload = await getPayload({ config: configPromise });

  const [categoriesResult, productsResult] = await Promise.all([
    payload.find({
      collection: "categories",
      limit: 500,
      pagination: false,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: "products",
      limit: 2000,
      pagination: false,
      select: { slug: true, id: true, updatedAt: true },
    }),
  ]);

  const categoryUrls: MetadataRoute.Sitemap = categoriesResult.docs.map((c) => ({
    url: `${SITE_URL}/collections/${c.slug}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastModified: c.updatedAt ? new Date(c.updatedAt as any) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productUrls: MetadataRoute.Sitemap = productsResult.docs.map((p) => ({
    url: `${SITE_URL}/product/${p.slug ?? p.id}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastModified: p.updatedAt ? new Date(p.updatedAt as any) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...base, ...categoryUrls, ...productUrls];
}
