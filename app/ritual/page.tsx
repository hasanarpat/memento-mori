import Link from "next/link";
import { Droplets, Flame, Sparkles } from "lucide-react";
import { products } from "@/app/data/shop";
import RitualClient from "./RitualClient";

const ritualProducts = products.filter((p) => p.productType === "ritual");

export const metadata = {
  title: "Ritual & Altar | Memento Mori",
  description: "Candles, incense, and sacred objects for your practice and space.",
};

export default function RitualPage() {
  return (
    <div className="ritual-page">
      <section className="ritual-hero">
        <h1 className="home-section-title">Ritual & Altar</h1>
        <p className="ritual-hero-tagline">Sacred space, curated</p>
        <p className="ritual-hero-desc">
          From candlelight to incense, these pieces support meditation, ritual, or simply
          the atmosphere of the sanctum. No dogma—only intention and aesthetic.
        </p>
        <div className="ritual-hero-icons">
          <Flame size={32} aria-hidden="true" />
          <Droplets size={32} aria-hidden="true" />
          <Sparkles size={32} aria-hidden="true" />
        </div>
      </section>
      <RitualClient products={ritualProducts} />
      <section className="ritual-cta">
        <h2 className="ritual-cta-title">Deeper into the craft</h2>
        <p className="ritual-cta-desc">
          Read our Journal on altar essentials and ritual objects.
        </p>
        <Link href="/journal" className="home-cta-outline">
          Journal
        </Link>
      </section>
    </div>
  );
}
