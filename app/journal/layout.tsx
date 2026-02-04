import { buildPageMetadata } from "@/app/lib/metadata";
import { absoluteUrl } from "@/app/lib/site";
import { blogPosts } from "@/app/data/shop";
import JsonLd from "@/app/components/JsonLd";

export const metadata = buildPageMetadata({
  title: "The Grimoire — Journal",
  description:
    "Manifesto, style guides, craftsmanship, and culture. Read the Memento Mori journal — dark fashion, subculture, and the stories behind the pieces.",
  path: "/journal",
  keywords: ["gothic blog", "dark fashion journal", "steampunk culture", "subculture style guide", "memento mori blog"],
});

const journalUrl = absoluteUrl("/journal");
const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "The Grimoire",
  description: "Memento Mori journal. Manifesto, style guides, craftsmanship, and subculture culture.",
  url: journalUrl,
  blogPost: blogPosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    url: journalUrl,
  })),
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={blogJsonLd} />
      {children}
    </>
  );
}
