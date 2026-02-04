// Subculture / sub-genre definitions for Worlds & collection pages
export type GenreSlug =
  | "gothic"
  | "steampunk"
  | "metal"
  | "occult"
  | "dark-academia"
  | "industrial"
  | "deathrock"
  | "ritual";

export type ProductType =
  | "apparel"
  | "outerwear"
  | "jewelry"
  | "accessories"
  | "footwear"
  | "ritual"
  | "harness";

export const genres: {
  slug: GenreSlug;
  name: string;
  tagline: string;
  shortDesc: string;
  longDesc: string;
  accent: string;
  icon: string; // lucide icon name for fallback
}[] = [
  {
    slug: "gothic",
    name: "Gothic",
    tagline: "Victorian shadows & velvet decay",
    shortDesc: "Mourning elegance, lace, velvet, and timeless darkness.",
    longDesc: "From Victorian mourning to romantic deathrock, gothic style embraces shadow as beauty. Velvet, lace, and brass come together for those who dress in midnight.",
    accent: "#8b3a3a",
    icon: "Moon",
  },
  {
    slug: "steampunk",
    name: "Steampunk",
    tagline: "Brass, gears & clockwork souls",
    shortDesc: "Victorian industry reimagined. Leather, brass, and mechanical romance.",
    longDesc: "Where the 19th century never ended and steam still powers dreams. Gears, goggles, and aged brass for the eternal inventor.",
    accent: "#b8860b",
    icon: "Cog",
  },
  {
    slug: "metal",
    name: "Metal",
    tagline: "Leather, chains & forged iron",
    shortDesc: "Black metal, industrial, and the armour of the stage.",
    longDesc: "From the forge to the front row. Studs, chains, and leather built for those who live in minor keys and mosh at midnight.",
    accent: "#3d3d3d",
    icon: "Flame",
  },
  {
    slug: "occult",
    name: "Occult",
    tagline: "Symbols, sigils & sacred dark",
    shortDesc: "Ritual jewelry, talismans, and the aesthetics of the unseen.",
    longDesc: "Wear the symbols of the craft. Pentacles, moons, and ritual pieces for the spiritually inclined and the aesthetically devoted.",
    accent: "#4a2c2a",
    icon: "Sparkles",
  },
  {
    slug: "dark-academia",
    name: "Dark Academia",
    tagline: "Tweed, leather & ancient libraries",
    shortDesc: "Scholarly gloom, vintage textures, and the romance of decay.",
    longDesc: "For those who live in musty libraries and autumn rain. Tweed, brass buttons, and the patina of old knowledge.",
    accent: "#5c4a3a",
    icon: "BookOpen",
  },
  {
    slug: "industrial",
    name: "Industrial",
    tagline: "Concrete, steel & utilitarian edge",
    shortDesc: "Raw materials, stark lines, and post-industrial armour.",
    longDesc: "Borrowed from the factory floor and the bunker. Hard edges, minimal ornament, maximum impact.",
    accent: "#6b6b6b",
    icon: "Box",
  },
  {
    slug: "deathrock",
    name: "Deathrock",
    tagline: "Punk roots, batcave nights",
    shortDesc: "Spikes, fishnet, and the birth of goth-punk.",
    longDesc: "Where punk met the crypt. Razor-sharp silhouettes, safety pins, and the sound of the first wave.",
    accent: "#2d2d2d",
    icon: "Zap",
  },
  {
    slug: "ritual",
    name: "Ritual",
    tagline: "Altar, candle & sacred space",
    shortDesc: "Ceremonial objects, incense, and tools for the practice.",
    longDesc: "Curate your sanctum. Candles, holders, incense, and altar pieces for meditation, ritual, or atmosphere.",
    accent: "#6b4423",
    icon: "Droplets",
  },
];

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  badge: string | null;
  theme: GenreSlug;
  productType: ProductType;
  new: boolean;
};

export const products: Product[] = [
  // Gothic
  { id: 1, name: "Bloodstained Leather Vest", price: 389, category: "Gothic × Metal", badge: "HANDMADE", theme: "gothic", productType: "outerwear", new: true },
  { id: 2, name: "Victorian Mourning Coat", price: 599, category: "Gothic × Steampunk", badge: null, theme: "gothic", productType: "outerwear", new: false },
  { id: 4, name: "Tattered Lace Shroud", price: 279, category: "Gothic", badge: "RARE", theme: "gothic", productType: "apparel", new: false },
  { id: 6, name: "Velvet & Bones Choker", price: 159, category: "Gothic × Metal", badge: "NEW", theme: "gothic", productType: "jewelry", new: true },
  { id: 8, name: "Crimson Velvet Cloak", price: 689, category: "Gothic", badge: "LIMITED", theme: "gothic", productType: "outerwear", new: false },
  { id: 9, name: "Black Lace Gloves", price: 89, category: "Gothic", badge: null, theme: "gothic", productType: "accessories", new: true },
  { id: 10, name: "Mourning Pearl Choker", price: 199, category: "Gothic", badge: null, theme: "gothic", productType: "jewelry", new: false },
  // Steampunk
  { id: 3, name: "Brass Skull Pauldron", price: 449, category: "Steampunk × Metal", badge: "LIMITED", theme: "steampunk", productType: "accessories", new: true },
  { id: 11, name: "Gear & Goggle Set", price: 249, category: "Steampunk", badge: null, theme: "steampunk", productType: "accessories", new: false },
  { id: 12, name: "Copper Corset Harness", price: 429, category: "Steampunk", badge: "HANDMADE", theme: "steampunk", productType: "harness", new: true },
  { id: 13, name: "Pocket Watch Chain Bracelet", price: 129, category: "Steampunk", badge: null, theme: "steampunk", productType: "jewelry", new: false },
  { id: 14, name: "Aviator Leather Jacket", price: 549, category: "Steampunk × Gothic", badge: null, theme: "steampunk", productType: "outerwear", new: false },
  // Metal
  { id: 5, name: "Oxidized Chain Harness", price: 329, category: "Metal × Steampunk", badge: null, theme: "metal", productType: "harness", new: false },
  { id: 7, name: "Riveted Leather Gauntlets", price: 429, category: "Metal × Steampunk", badge: "HANDMADE", theme: "metal", productType: "accessories", new: true },
  { id: 15, name: "Studded Cuff Bracelet", price: 79, category: "Metal", badge: null, theme: "metal", productType: "jewelry", new: true },
  { id: 16, name: "Spike Choker", price: 119, category: "Metal × Deathrock", badge: null, theme: "metal", productType: "jewelry", new: false },
  { id: 17, name: "Battle Vest Blank", price: 269, category: "Metal", badge: null, theme: "metal", productType: "outerwear", new: false },
  { id: 18, name: "Chainmail Necklace", price: 149, category: "Metal", badge: "HANDMADE", theme: "metal", productType: "jewelry", new: false },
  // Occult
  { id: 19, name: "Pentacle Pendant", price: 99, category: "Occult", badge: null, theme: "occult", productType: "jewelry", new: true },
  { id: 20, name: "Moon Phase Ring Set", price: 159, category: "Occult", badge: null, theme: "occult", productType: "jewelry", new: false },
  { id: 21, name: "Sigil Candle Holder", price: 89, category: "Occult × Ritual", badge: null, theme: "occult", productType: "ritual", new: false },
  { id: 22, name: "Black Tourmaline Choker", price: 139, category: "Occult", badge: "RARE", theme: "occult", productType: "jewelry", new: true },
  { id: 23, name: "Ritual Dagger Pendant", price: 119, category: "Occult", badge: null, theme: "occult", productType: "jewelry", new: false },
  // Dark Academia
  { id: 24, name: "Tweed Blazer", price: 449, category: "Dark Academia", badge: null, theme: "dark-academia", productType: "outerwear", new: true },
  { id: 25, name: "Leather Satchel", price: 329, category: "Dark Academia", badge: "HANDMADE", theme: "dark-academia", productType: "accessories", new: false },
  { id: 26, name: "Brass Button Cardigan", price: 279, category: "Dark Academia", badge: null, theme: "dark-academia", productType: "apparel", new: false },
  { id: 27, name: "Vintage Library Cufflinks", price: 79, category: "Dark Academia", badge: null, theme: "dark-academia", productType: "jewelry", new: true },
  { id: 28, name: "Waxed Cotton Trench", price: 499, category: "Dark Academia × Gothic", badge: "LIMITED", theme: "dark-academia", productType: "outerwear", new: false },
  // Industrial
  { id: 29, name: "Utility Harness", price: 289, category: "Industrial", badge: null, theme: "industrial", productType: "harness", new: true },
  { id: 30, name: "Steel Toe Boot", price: 399, category: "Industrial × Metal", badge: null, theme: "industrial", productType: "footwear", new: false },
  { id: 31, name: "Buckle Belt", price: 109, category: "Industrial", badge: null, theme: "industrial", productType: "accessories", new: false },
  { id: 32, name: "Concrete Ring", price: 89, category: "Industrial", badge: "NEW", theme: "industrial", productType: "jewelry", new: true },
  { id: 33, name: "Tactical Vest", price: 349, category: "Industrial", badge: null, theme: "industrial", productType: "outerwear", new: false },
  // Deathrock
  { id: 34, name: "Fishnet Sleeves", price: 49, category: "Deathrock", badge: null, theme: "deathrock", productType: "accessories", new: true },
  { id: 35, name: "Safety Pin Choker", price: 39, category: "Deathrock", badge: null, theme: "deathrock", productType: "jewelry", new: false },
  { id: 36, name: "Razor Collar", price: 129, category: "Deathrock × Metal", badge: null, theme: "deathrock", productType: "jewelry", new: false },
  { id: 37, name: "Batwing Top", price: 189, category: "Deathrock", badge: "RARE", theme: "deathrock", productType: "apparel", new: true },
  { id: 38, name: "Creepers", price: 279, category: "Deathrock", badge: null, theme: "deathrock", productType: "footwear", new: false },
  // Ritual
  { id: 39, name: "Black Candle Set", price: 59, category: "Ritual", badge: null, theme: "ritual", productType: "ritual", new: false },
  { id: 40, name: "Brass Incense Holder", price: 79, category: "Ritual × Occult", badge: null, theme: "ritual", productType: "ritual", new: true },
  { id: 41, name: "Skull Censer", price: 129, category: "Ritual", badge: "HANDMADE", theme: "ritual", productType: "ritual", new: false },
  { id: 42, name: "Altar Cloth", price: 69, category: "Ritual", badge: null, theme: "ritual", productType: "ritual", new: true },
  { id: 43, name: "Ritual Bell", price: 89, category: "Ritual", badge: null, theme: "ritual", productType: "ritual", new: false },
];

export const lookbookItems = [
  { id: 1, season: "Industrial Romance", year: "F/W 2023", category: "Gothic × Steampunk", size: "large" as const },
  { id: 2, season: "Leather & Iron", year: "S/S 2024", category: "Metal × Gothic", size: "medium" as const },
  { id: 3, season: "Brass Shadows", year: "F/W 2024", category: "Steampunk", size: "medium" as const },
  { id: 4, season: "Velvet Decay", year: "S/S 2023", category: "Gothic", size: "small" as const },
  { id: 5, season: "Rust & Bones", year: "F/W 2023", category: "Metal × Steampunk", size: "large" as const },
  { id: 6, season: "Mourning Ritual", year: "Archive", category: "Gothic", size: "medium" as const },
  { id: 7, season: "Chrome Nightmares", year: "S/S 2024", category: "Metal", size: "small" as const },
  { id: 8, season: "Victorian Requiem", year: "Archive", category: "Gothic × Steampunk", size: "large" as const },
  { id: 9, season: "Dark Academia", year: "F/W 2024", category: "Dark Academia", size: "medium" as const },
  { id: 10, season: "Sigils", year: "Archive", category: "Occult", size: "small" as const },
];

export const blogPosts = [
  { id: 1, title: "Manifesto of Shadows: Our Philosophy", category: "MANIFESTO", excerpt: "In darkness we find beauty. In leather and brass, our armor against the mundane world...", author: "The Atelier", date: "Feb 2024", readTime: "8 min", featured: true },
  { id: 2, title: "The Art of Layering: Gothic Metal Style Guide", category: "STYLE GUIDE", excerpt: "Master the balance between Victorian elegance and industrial edge with our layering techniques...", author: "Corvus", date: "Jan 2024", readTime: "5 min", featured: false },
  { id: 3, title: "Behind the Forge: Brass Craftsmanship", category: "CRAFTSMANSHIP", excerpt: "Every brass piece is hand-aged, oxidized, and polished to create unique patinas...", author: "The Smiths", date: "Jan 2024", readTime: "6 min", featured: false },
  { id: 4, title: "Gothic Subculture: A History in Velvet", category: "CULTURE", excerpt: "From Bauhaus to modern day, tracing the threads of gothic fashion through decades...", author: "Lilith", date: "Dec 2023", readTime: "10 min", featured: false },
  { id: 5, title: "New Drop: Leather & Rust Collection", category: "DROPS", excerpt: "Introducing our latest collaboration with master leather craftsmen from the old world...", author: "The Atelier", date: "Feb 2024", readTime: "3 min", featured: false },
  { id: 6, title: "Steampunk: When Victorian Meets Industrial", category: "CULTURE", excerpt: "Exploring the aesthetic fusion of 19th century elegance with mechanical revolution...", author: "Gideon", date: "Dec 2023", readTime: "7 min", featured: false },
  { id: 7, title: "Ritual Objects: Altar Essentials", category: "RITUAL", excerpt: "How to curate a sacred space—candles, incense, and the tools of the craft...", author: "Lilith", date: "Jan 2024", readTime: "5 min", featured: false },
  { id: 8, title: "Deathrock Revival", category: "CULTURE", excerpt: "The batcave aesthetic is back. Spikes, fishnet, and the sound of the first wave...", author: "Corvus", date: "Feb 2024", readTime: "6 min", featured: false },
];

// For product detail page type compatibility (theme was string before)
export type ProductTheme = Product["theme"];
