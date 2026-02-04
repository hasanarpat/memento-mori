import { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/account", "/account/", "/cart", "/checkout", "/wishlist"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/account", "/account/", "/cart", "/checkout", "/wishlist"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
