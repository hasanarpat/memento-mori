import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata = buildPageMetadata({
  title: "New Arrivals",
  description:
    "Latest drops at Memento Mori. New gothic, steampunk, metal, occult pieces. Handmade and limited editions. Shop new dark fashion.",
  path: "/new-arrivals",
  keywords: ["new gothic fashion", "latest dark fashion", "new arrivals alternative", "memento mori new"],
});

export default function NewArrivalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
