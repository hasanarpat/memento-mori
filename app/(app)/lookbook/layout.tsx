import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Lookbook",
  description:
    "Memento Mori lookbook — Gothic, steampunk, metal editorial. Seasonal campaigns and style inspiration. Dark fashion photography.",
  path: "/lookbook",
  keywords: ["gothic lookbook", "dark fashion editorial", "steampunk style", "alternative fashion lookbook"],
});

export default function LookbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
