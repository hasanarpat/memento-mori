import { notFound } from "next/navigation";
import Link from "next/link";
import { genres, products } from "@/app/data/shop";
import type { GenreSlug } from "@/app/data/shop";
import GenreCollectionClient from "@/app/collections/[genre]/GenreCollectionClient";

export async function generateStaticParams() {
  return genres.map((g) => ({ genre: g.slug }));
}

function getGenre(slug: string) {
  return genres.find((g) => g.slug === slug) ?? null;
}

export default async function GenreCollectionPage({
  params,
}: {
  params: Promise<{ genre: string }>;
}) {
  const { genre: genreSlug } = await params;
  const genre = getGenre(genreSlug);
  if (!genre) notFound();

  const genreProducts = products.filter((p) => p.theme === genreSlug);

  return (
    <div className="genre-page">
      <nav className="legal-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/collections">Collections</Link>
        <span aria-hidden="true"> / </span>
        <span>{genre.name}</span>
      </nav>
      <section
        className="genre-hero"
        style={{ "--genre-accent": genre.accent } as React.CSSProperties}
      >
        <h1 className="genre-hero-title">{genre.name}</h1>
        <p className="genre-hero-tagline">{genre.tagline}</p>
        <p className="genre-hero-desc">{genre.longDesc}</p>
      </section>
      <GenreCollectionClient
        genreSlug={genre.slug as GenreSlug}
        genreName={genre.name}
        genreProducts={genreProducts}
      />
    </div>
  );
}
