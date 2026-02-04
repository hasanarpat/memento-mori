import Link from "next/link";
import { ArrowRight, Moon, Cog, Flame, Sparkles, BookOpen, Box, Zap, Droplets } from "lucide-react";
import { genres } from "@/app/data/shop";

const iconMap = {
  Moon,
  Cog,
  Flame,
  Sparkles,
  BookOpen,
  Box,
  Zap,
  Droplets,
} as const;

export const metadata = {
  title: "Worlds | Memento Mori",
  description: "Explore subcultures: Gothic, Steampunk, Metal, Occult, Dark Academia, Industrial, Deathrock, Ritual.",
};

export default function WorldsPage() {
  return (
    <div className="worlds-page">
      <section className="worlds-hero">
        <h1 className="home-section-title">Worlds</h1>
        <p className="worlds-hero-desc">
          Each subculture has its own language. Choose your realm and wear it.
        </p>
      </section>
      <div className="worlds-grid">
        {genres.map((genre) => {
          const Icon = iconMap[genre.icon as keyof typeof iconMap] ?? Moon;
          return (
            <Link
              key={genre.slug}
              href={`/collections/${genre.slug}`}
              className="worlds-card"
              style={{ "--world-accent": genre.accent } as React.CSSProperties}
            >
              <div className="worlds-card-icon-wrap">
                <Icon className="worlds-card-icon" size={48} />
              </div>
              <h2 className="worlds-card-name">{genre.name}</h2>
              <p className="worlds-card-tagline">{genre.tagline}</p>
              <p className="worlds-card-desc">{genre.shortDesc}</p>
              <span className="worlds-card-link">
                Enter
                <ArrowRight size={18} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
