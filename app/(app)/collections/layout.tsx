import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Collections",
  description:
    "Browse all dark fashion collections. Gothic, steampunk, metal, occult, dark academia, industrial, deathrock. Filter by world and type.",
  path: "/collections",
  keywords: ["gothic collection", "steampunk clothing", "dark fashion shop", "alternative fashion", "memento mori collections"],
});

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
