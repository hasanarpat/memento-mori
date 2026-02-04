import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Size Guide",
  description:
    "Memento Mori size guide. Measurements for apparel, outerwear, jewelry. Fit guide: slim, regular, oversized. How to measure.",
  path: "/size-guide",
  keywords: ["size guide", "gothic fashion sizing", "how to measure", "fit guide", "memento mori sizes"],
});

export default function SizeGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
