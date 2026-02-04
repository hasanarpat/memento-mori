import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Wishlist",
  description: "Your saved items at Memento Mori. Favorites and wishlist. Dark fashion and subculture pieces.",
  path: "/wishlist",
  keywords: ["wishlist", "saved items", "favorites", "memento mori wishlist"],
  noIndex: true,
});

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
