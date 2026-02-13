// Subculture / sub-genre definitions for Worlds & collection pages
export type GenreSlug =
  | 'gothic'
  | 'steampunk'
  | 'metal'
  | 'occult'
  | 'dark-academia'
  | 'industrial'
  | 'deathrock'
  | 'ritual';

export type ProductType =
  | 'apparel'
  | 'outerwear'
  | 'jewelry'
  | 'accessories'
  | 'footwear'
  | 'ritual'
  | 'harness';

export type LookbookItem = {
  id: number;
  slug: string;
  season: string;
  year: string;
  category: string;
  size: 'small' | 'medium' | 'large';
  tagline: string;
  description: string;
  details: string;
};

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
    slug: 'gothic',
    name: 'Gothic',
    tagline: 'Victorian shadows & velvet decay',
    shortDesc: 'Mourning elegance, lace, velvet, and timeless darkness.',
    longDesc:
      'From Victorian mourning to romantic deathrock, gothic style embraces shadow as beauty. Velvet, lace, and brass come together for those who dress in midnight.',
    accent: '#8b3a3a',
    icon: 'Moon',
  },
  {
    slug: 'steampunk',
    name: 'Steampunk',
    tagline: 'Brass, gears & clockwork souls',
    shortDesc:
      'Victorian industry reimagined. Leather, brass, and mechanical romance.',
    longDesc:
      'Where the 19th century never ended and steam still powers dreams. Gears, goggles, and aged brass for the eternal inventor.',
    accent: '#b8860b',
    icon: 'Cog',
  },
  {
    slug: 'metal',
    name: 'Metal',
    tagline: 'Leather, chains & forged iron',
    shortDesc: 'Black metal, industrial, and the armour of the stage.',
    longDesc:
      'From the forge to the front row. Studs, chains, and leather built for those who live in minor keys and mosh at midnight.',
    accent: '#3d3d3d',
    icon: 'Flame',
  },
  {
    slug: 'occult',
    name: 'Occult',
    tagline: 'Symbols, sigils & sacred dark',
    shortDesc: 'Ritual jewelry, talismans, and the aesthetics of the unseen.',
    longDesc:
      'Wear the symbols of the craft. Pentacles, moons, and ritual pieces for the spiritually inclined and the aesthetically devoted.',
    accent: '#4a2c2a',
    icon: 'Sparkles',
  },
  {
    slug: 'dark-academia',
    name: 'Dark Academia',
    tagline: 'Tweed, leather & ancient libraries',
    shortDesc: 'Scholarly gloom, vintage textures, and the romance of decay.',
    longDesc:
      'For those who live in musty libraries and autumn rain. Tweed, brass buttons, and the patina of old knowledge.',
    accent: '#5c4a3a',
    icon: 'BookOpen',
  },
  {
    slug: 'industrial',
    name: 'Industrial',
    tagline: 'Concrete, steel & utilitarian edge',
    shortDesc: 'Raw materials, stark lines, and post-industrial armour.',
    longDesc:
      'Borrowed from the factory floor and the bunker. Hard edges, minimal ornament, maximum impact.',
    accent: '#6b6b6b',
    icon: 'Box',
  },
  {
    slug: 'deathrock',
    name: 'Deathrock',
    tagline: 'Punk roots, batcave nights',
    shortDesc: 'Spikes, fishnet, and the birth of goth-punk.',
    longDesc:
      'Where punk met the crypt. Razor-sharp silhouettes, safety pins, and the sound of the first wave.',
    accent: '#2d2d2d',
    icon: 'Zap',
  },
  {
    slug: 'ritual',
    name: 'Ritual',
    tagline: 'Altar, candle & sacred space',
    shortDesc: 'Ceremonial objects, incense, and tools for the practice.',
    longDesc:
      'Curate your sanctum. Candles, holders, incense, and altar pieces for meditation, ritual, or atmosphere.',
    accent: '#6b4423',
    icon: 'Droplets',
  },
];

export type Product = {
  id: number;
  slug?: string;
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
  {
    id: 1,
    name: 'Bloodstained Leather Vest',
    price: 389,
    category: 'Gothic × Metal',
    badge: 'HANDMADE',
    theme: 'gothic',
    productType: 'outerwear',
    new: true,
  },
  {
    id: 2,
    name: 'Victorian Mourning Coat',
    price: 599,
    category: 'Gothic × Steampunk',
    badge: null,
    theme: 'gothic',
    productType: 'outerwear',
    new: false,
  },
  {
    id: 4,
    name: 'Tattered Lace Shroud',
    price: 279,
    category: 'Gothic',
    badge: 'RARE',
    theme: 'gothic',
    productType: 'apparel',
    new: false,
  },
  {
    id: 6,
    name: 'Velvet & Bones Choker',
    price: 159,
    category: 'Gothic × Metal',
    badge: 'NEW',
    theme: 'gothic',
    productType: 'jewelry',
    new: true,
  },
  {
    id: 8,
    name: 'Crimson Velvet Cloak',
    price: 689,
    category: 'Gothic',
    badge: 'LIMITED',
    theme: 'gothic',
    productType: 'outerwear',
    new: false,
  },
  {
    id: 9,
    name: 'Black Lace Gloves',
    price: 89,
    category: 'Gothic',
    badge: null,
    theme: 'gothic',
    productType: 'accessories',
    new: true,
  },
  {
    id: 10,
    name: 'Mourning Pearl Choker',
    price: 199,
    category: 'Gothic',
    badge: null,
    theme: 'gothic',
    productType: 'jewelry',
    new: false,
  },
  // Steampunk
  {
    id: 3,
    name: 'Brass Skull Pauldron',
    price: 449,
    category: 'Steampunk × Metal',
    badge: 'LIMITED',
    theme: 'steampunk',
    productType: 'accessories',
    new: true,
  },
  {
    id: 11,
    name: 'Gear & Goggle Set',
    price: 249,
    category: 'Steampunk',
    badge: null,
    theme: 'steampunk',
    productType: 'accessories',
    new: false,
  },
  {
    id: 12,
    name: 'Copper Corset Harness',
    price: 429,
    category: 'Steampunk',
    badge: 'HANDMADE',
    theme: 'steampunk',
    productType: 'harness',
    new: true,
  },
  {
    id: 13,
    name: 'Pocket Watch Chain Bracelet',
    price: 129,
    category: 'Steampunk',
    badge: null,
    theme: 'steampunk',
    productType: 'jewelry',
    new: false,
  },
  {
    id: 14,
    name: 'Aviator Leather Jacket',
    price: 549,
    category: 'Steampunk × Gothic',
    badge: null,
    theme: 'steampunk',
    productType: 'outerwear',
    new: false,
  },
  // Metal
  {
    id: 5,
    name: 'Oxidized Chain Harness',
    price: 329,
    category: 'Metal × Steampunk',
    badge: null,
    theme: 'metal',
    productType: 'harness',
    new: false,
  },
  {
    id: 7,
    name: 'Riveted Leather Gauntlets',
    price: 429,
    category: 'Metal × Steampunk',
    badge: 'HANDMADE',
    theme: 'metal',
    productType: 'accessories',
    new: true,
  },
  {
    id: 15,
    name: 'Studded Cuff Bracelet',
    price: 79,
    category: 'Metal',
    badge: null,
    theme: 'metal',
    productType: 'jewelry',
    new: true,
  },
  {
    id: 16,
    name: 'Spike Choker',
    price: 119,
    category: 'Metal × Deathrock',
    badge: null,
    theme: 'metal',
    productType: 'jewelry',
    new: false,
  },
  {
    id: 17,
    name: 'Battle Vest Blank',
    price: 269,
    category: 'Metal',
    badge: null,
    theme: 'metal',
    productType: 'outerwear',
    new: false,
  },
  {
    id: 18,
    name: 'Chainmail Necklace',
    price: 149,
    category: 'Metal',
    badge: 'HANDMADE',
    theme: 'metal',
    productType: 'jewelry',
    new: false,
  },
  // Occult
  {
    id: 19,
    name: 'Pentacle Pendant',
    price: 99,
    category: 'Occult',
    badge: null,
    theme: 'occult',
    productType: 'jewelry',
    new: true,
  },
  {
    id: 20,
    name: 'Moon Phase Ring Set',
    price: 159,
    category: 'Occult',
    badge: null,
    theme: 'occult',
    productType: 'jewelry',
    new: false,
  },
  {
    id: 21,
    name: 'Sigil Candle Holder',
    price: 89,
    category: 'Occult × Ritual',
    badge: null,
    theme: 'occult',
    productType: 'ritual',
    new: false,
  },
  {
    id: 22,
    name: 'Black Tourmaline Choker',
    price: 139,
    category: 'Occult',
    badge: 'RARE',
    theme: 'occult',
    productType: 'jewelry',
    new: true,
  },
  {
    id: 23,
    name: 'Ritual Dagger Pendant',
    price: 119,
    category: 'Occult',
    badge: null,
    theme: 'occult',
    productType: 'jewelry',
    new: false,
  },
  // Dark Academia
  {
    id: 24,
    name: 'Tweed Blazer',
    price: 449,
    category: 'Dark Academia',
    badge: null,
    theme: 'dark-academia',
    productType: 'outerwear',
    new: true,
  },
  {
    id: 25,
    name: 'Leather Satchel',
    price: 329,
    category: 'Dark Academia',
    badge: 'HANDMADE',
    theme: 'dark-academia',
    productType: 'accessories',
    new: false,
  },
  {
    id: 26,
    name: 'Brass Button Cardigan',
    price: 279,
    category: 'Dark Academia',
    badge: null,
    theme: 'dark-academia',
    productType: 'apparel',
    new: false,
  },
  {
    id: 27,
    name: 'Vintage Library Cufflinks',
    price: 79,
    category: 'Dark Academia',
    badge: null,
    theme: 'dark-academia',
    productType: 'jewelry',
    new: true,
  },
  {
    id: 28,
    name: 'Waxed Cotton Trench',
    price: 499,
    category: 'Dark Academia × Gothic',
    badge: 'LIMITED',
    theme: 'dark-academia',
    productType: 'outerwear',
    new: false,
  },
  // Industrial
  {
    id: 29,
    name: 'Utility Harness',
    price: 289,
    category: 'Industrial',
    badge: null,
    theme: 'industrial',
    productType: 'harness',
    new: true,
  },
  {
    id: 30,
    name: 'Steel Toe Boot',
    price: 399,
    category: 'Industrial × Metal',
    badge: null,
    theme: 'industrial',
    productType: 'footwear',
    new: false,
  },
  {
    id: 31,
    name: 'Buckle Belt',
    price: 109,
    category: 'Industrial',
    badge: null,
    theme: 'industrial',
    productType: 'accessories',
    new: false,
  },
  {
    id: 32,
    name: 'Concrete Ring',
    price: 89,
    category: 'Industrial',
    badge: 'NEW',
    theme: 'industrial',
    productType: 'jewelry',
    new: true,
  },
  {
    id: 33,
    name: 'Tactical Vest',
    price: 349,
    category: 'Industrial',
    badge: null,
    theme: 'industrial',
    productType: 'outerwear',
    new: false,
  },
  // Deathrock
  {
    id: 34,
    name: 'Fishnet Sleeves',
    price: 49,
    category: 'Deathrock',
    badge: null,
    theme: 'deathrock',
    productType: 'accessories',
    new: true,
  },
  {
    id: 35,
    name: 'Safety Pin Choker',
    price: 39,
    category: 'Deathrock',
    badge: null,
    theme: 'deathrock',
    productType: 'jewelry',
    new: false,
  },
  {
    id: 36,
    name: 'Razor Collar',
    price: 129,
    category: 'Deathrock × Metal',
    badge: null,
    theme: 'deathrock',
    productType: 'jewelry',
    new: false,
  },
  {
    id: 37,
    name: 'Batwing Top',
    price: 189,
    category: 'Deathrock',
    badge: 'RARE',
    theme: 'deathrock',
    productType: 'apparel',
    new: true,
  },
  {
    id: 38,
    name: 'Creepers',
    price: 279,
    category: 'Deathrock',
    badge: null,
    theme: 'deathrock',
    productType: 'footwear',
    new: false,
  },
  // Ritual
  {
    id: 39,
    name: 'Black Candle Set',
    price: 59,
    category: 'Ritual',
    badge: null,
    theme: 'ritual',
    productType: 'ritual',
    new: false,
  },
  {
    id: 40,
    name: 'Brass Incense Holder',
    price: 79,
    category: 'Ritual × Occult',
    badge: null,
    theme: 'ritual',
    productType: 'ritual',
    new: true,
  },
  {
    id: 41,
    name: 'Skull Censer',
    price: 129,
    category: 'Ritual',
    badge: 'HANDMADE',
    theme: 'ritual',
    productType: 'ritual',
    new: false,
  },
  {
    id: 42,
    name: 'Altar Cloth',
    price: 69,
    category: 'Ritual',
    badge: null,
    theme: 'ritual',
    productType: 'ritual',
    new: true,
  },
  {
    id: 43,
    name: 'Ritual Bell',
    price: 89,
    category: 'Ritual',
    badge: null,
    theme: 'ritual',
    productType: 'ritual',
    new: false,
  },
];

export const lookbookItems = [
  {
    id: 1,
    slug: 'industrial-romance',
    season: 'Industrial Romance',
    year: 'F/W 2023',
    category: 'Gothic × Steampunk',
    size: 'large' as const,
    tagline: 'Where Victorian elegance meets grimy machinery',
    description:
      'A exploration of steampunks deepest fantasy: the marriage of aged brass and delicate lace. Industrial Revolution revisited through a gothic lens, where corsetry meets hydraulics and velvet drapes across cold, austere frames.',
    details:
      'Featuring our Brass Skull Pauldrons, Victorian Mourning Coats, and custom-aged leather pieces. The palette: deep blacks, tarnished coppers, and blood reds. Each piece tells a story of decay and reconstruction.',
  },
  {
    id: 2,
    slug: 'leather-and-iron',
    season: 'Leather & Iron',
    year: 'S/S 2024',
    category: 'Metal × Gothic',
    size: 'medium' as const,
    tagline: 'The intersection of armor and elegance',
    description:
      'Raw, uncompromising, and deeply beautiful. This collection embraces the brutal grace of leather and iron—the tools of both ritual and rebellion. Studs and spikes arranged with surgical precision. Hardware as decoration. Darkness as the ultimate luxury.',
    details:
      'Showcasing Oxidized Chain Harnesses, Riveted Leather Gauntlets, and custom metallurgy. Built not just to look formidable, but to be worn as declaration of intent.',
  },
  {
    id: 3,
    slug: 'brass-shadows',
    season: 'Brass Shadows',
    year: 'F/W 2024',
    category: 'Steampunk',
    size: 'medium' as const,
    tagline: 'Mechanical dreams in aged metal and leather',
    description:
      'A gentle exploration of steampunks more refined side. Goggles and gears become jewelry. Pocket watches become talismans. The aesthetic is less dystopian workshop and more curious inventors attic—a place where beauty and function merge.',
    details:
      'Featuring Gear & Goggle Sets, Pocket Watch Chain Bracelets, and our signature Aviator Leather Jackets. Each piece is aged to perfection, creating patinas that look found rather than made.',
  },
  {
    id: 4,
    slug: 'velvet-decay',
    season: 'Velvet Decay',
    year: 'S/S 2023',
    category: 'Gothic',
    size: 'small' as const,
    tagline: 'Mourning silk meets romantic darkness',
    description:
      'Lace and velvet in their most dramatic arrangement. This collection is a love letter to Victorian mourning wear, reimagined for those who understand that darkness need not be loud to be powerful. Whisper-soft fabrics in absolute black.',
    details:
      'Tattered Lace Shrouds, Crimson Velvet Cloaks, and delicate Black Lace Gloves. A study in what happens when textile meets tradition. Wearable poetry in every stitch.',
  },
  {
    id: 5,
    slug: 'rust-and-bones',
    season: 'Rust & Bones',
    year: 'F/W 2023',
    category: 'Metal × Steampunk',
    size: 'large' as const,
    tagline: 'The beauty of decay and transformation',
    description:
      'Where steampunk meets post-apocalyptic fantasy. Salvaged materials, aged metals, and bones arranged into wearable art. Utilitarian hardware becomes ornamental. The broken becomes beautiful.',
    details:
      'A collection of bold pieces: Brass-studded vests, iron-reinforced boots, and handmade harnesses. Each item bears the marks of age—intentional patina that speaks to a world where history is worn on the body.',
  },
  {
    id: 6,
    slug: 'mourning-ritual',
    season: 'Mourning Ritual',
    year: 'Archive',
    category: 'Gothic',
    size: 'medium' as const,
    tagline: 'Ceremonial darkness and sacred mourning',
    description:
      'Our most iconic collection. A deep dive into the ritualistic aspects of gothic fashion. Every piece is a meditation on loss, remembrance, and the profound beauty found in the act of mourning.',
    details:
      'Featuring pieces pulled from our archive—our original Velvet & Bones Chokers, hand-oxidized chain pieces, and bespoke mourning garments created in collaboration with dark academia scholars and ritual practitioners.',
  },
  {
    id: 7,
    slug: 'chrome-nightmares',
    season: 'Chrome Nightmares',
    year: 'S/S 2024',
    category: 'Metal',
    size: 'small' as const,
    tagline: 'Metallic visions of industrial terror',
    description:
      'Uncompromising metal aesthetic. This collection takes inspiration from the stage—the armor of performers who reject safety and polish for raw power. Chrome, steel, and provocation.',
    details:
      'Spike Chokers, Battle Vests, and Chainmail Necklaces rendered in their most aggressive form. Designed for those who live for the mosh pit and midnight rebellion.',
  },
  {
    id: 8,
    slug: 'victorian-requiem',
    season: 'Victorian Requiem',
    year: 'Archive',
    category: 'Gothic × Steampunk',
    size: 'large' as const,
    tagline: 'The ghost of elegance in a fallen age',
    description:
      'Our definitive statement piece collection. Victorian tailoring meets steampunk rebellion. Every element is intentional: the fall of the fabric, the placement of each button, the weight of brass.It is a collection about privilege and its dissolution, elegance and its corruption.',
    details:
      'Custom-tailored coats with hand-aged brass hardware, velvet piecing in unexpected places, and intricate beadwork that catches light like distant stars. These pieces were crafted to last generations.',
  },
  {
    id: 9,
    slug: 'dark-academia',
    season: 'Dark Academia',
    year: 'F/W 2024',
    category: 'Dark Academia',
    size: 'medium' as const,
    tagline: 'The romance of musty libraries and old secrets',
    description:
      'For those who live in tweed and aged leather, in the shadows of historic buildings. This collection draws from the aesthetics of old academia—the quiet rebellion of wearing tradition as armor.',
    details:
      'Tweed Blazers with brass buttons, Leather Satchels worn with intention, and Vintage Library Cufflinks sourced from actual estate sales. A collection about intellect, history, and the beauty of wearing your lineage.',
  },
  {
    id: 10,
    slug: 'sigils',
    season: 'Sigils',
    year: 'Archive',
    category: 'Occult',
    size: 'small' as const,
    tagline: 'Sacred symbols rendered in precious metals',
    description:
      'Our most spiritual collection. Each piece bears a sigil—a mark of power, protection, or intention. This is jewelry as amulet, fashion as ritual practice.',
    details:
      'Pentacle Pendants, Moon Phase Ring Sets, and Ritual Dagger Pendant crafted in collaboration with practicing occultists and spiritual leaders. Every piece is blessed and carries intention.',
  },
];

export const blogPosts = [
  {
    id: 1,
    slug: 'manifesto-of-shadows',
    title: 'Manifesto of Shadows: Our Philosophy',
    category: 'MANIFESTO',
    excerpt:
      'In darkness we find beauty. In leather and brass, our armor against the mundane world...',
    content: `In darkness we find beauty. In leather and brass, our armor against the mundane world.

Memento Mori was born from a simple truth: we are all dancing with death. Not in a morbid sense, but in recognition of mortality's profound gift—the urgency to live authentically, to wear our truth, and to reject the hollow comfort of the mainstream.

Our collections are more than clothing. They are a philosophy made tangible. Each piece carries the weight of intention, the patina of craft, and the defiance of those who choose shadow over light.

We believe that fashion should be armor. That style should be a statement. That darkness is not the absence of beauty, but its deepest expression.

This is who we are. This is what we make.`,
    author: 'The Atelier',
    date: 'Feb 2024',
    readTime: '8 min',
    featured: true,
  },
  {
    id: 2,
    slug: 'art-of-layering-gothic-metal',
    title: 'The Art of Layering: Gothic Metal Style Guide',
    category: 'STYLE GUIDE',
    excerpt:
      'Master the balance between Victorian elegance and industrial edge with our layering techniques...',
    content: `Master the balance between Victorian elegance and industrial edge with our layering techniques.

Gothic metal style is about contrast. It's where the romance of the 19th century collides with the raw power of industrial aesthetics. The key to perfecting this look lies in understanding how to layer without overwhelming.

**The Foundation**
Start with a fitted black base. A simple long-sleeved bodysuit or fitted tee sets the stage for everything else. This is your canvas—keep it clean and intentional.

**The Structure**
Layer a structured piece over your foundation. A leather vest, corset, or harness adds depth and silhouette. This is where brass hardware and quality leather come into play. The goal is to create visual interest through texture and line.

**The Drama**
Top it off with a flowing piece—a cloak, long cardigan, or oversized coat. This final layer adds movement and establishes your mood. Dark academia, gothic romance, or pure metal warrior: choose your narrative.

**The Details**
Chains, chokers, and jewelry tell the story. A single statement piece is more powerful than many. Consider pendants, collar chains, or layered necklaces that reference your chosen aesthetic.

**Pro Tips**
- Black goes with everything, but don't be afraid of deep burgundy, forest green, or dark bronze
- Mixing metals (brass + silver) creates intentional discord
- Texture matters more than color variety
- Proportions are everything—balance fitted and loose pieces`,
    author: 'Corvus',
    date: 'Jan 2024',
    readTime: '5 min',
    featured: false,
  },
  {
    id: 3,
    slug: 'brass-craftsmanship',
    title: 'Behind the Forge: Brass Craftsmanship',
    category: 'CRAFTSMANSHIP',
    excerpt:
      'Every brass piece is hand-aged, oxidized, and polished to create unique patinas...',
    content: `Every brass piece is hand-aged, oxidized, and polished to create unique patinas that no factory could replicate.

Brass is not just a material for Memento Mori—it's a philosophy. Unlike shiny, lifeless metals, brass ages gracefully. It oxidizes. It develops patina. It tells a story.

**The Process**
Our craftspeople begin with raw brass stock. Each piece is hand-worked, shaped, and refined. The hardware is soldered with precision, the surfaces are filed to silken smoothness. Then comes the aging.

We use traditional oxidation techniques passed down through generations of metalworkers. Controlling heat, humidity, and chemical exposure, we can develop deep browns, emerald greens, and charcoal blacks across a single piece. No two are identical.

**Why It Matters**
Mass-produced jewelry looks assembled. Our brass looks inherited. It carries the weight of time, even as it's brand new. When you wear it, you're wearing something that already has a past—something that tells a story of transformation.

**Maintenance**
We encourage our customers to let their brass pieces age further in the world. Don't polish them to a mirror shine. Let them patina. In five years, your choker will look like it was excavated from an antique shop. That's the point.`,
    author: 'The Smiths',
    date: 'Jan 2024',
    readTime: '6 min',
    featured: false,
  },
  {
    id: 4,
    slug: 'gothic-subculture-history',
    title: 'Gothic Subculture: A History in Velvet',
    category: 'CULTURE',
    excerpt:
      'From Bauhaus to modern day, tracing the threads of gothic fashion through decades...',
    content: `From Bauhaus to modern day, tracing the threads of gothic fashion through decades of darkness and beauty.

Gothic didn't emerge from nowhere. It evolved, mutated, and self-actualized through decades of cultural rebellion and artistic expression.

**The Bauhaus Era (1920s-1930s)**
The roots run deep into European modernism. The Bauhaus rejected ornamentation, favoring stark lines and dark palettes. This framework—function, darkness, and intentional design—would echo through everything that came after.

**The Romantic Revival (1970s-1980s)**
Bands like Bauhaus, Siouxsie and the Banshees, and The Sisters of Mercy reimagined gothic aesthetics for a new generation. They paired Victorian mourning wear with punk's raw edges. Black became less a color and more a statement.

**The Velvet Phase (1980s-1990s)**
As the movement matured, velvet, lace, and period silhouettes became central to gothic fashion. The look became more romantic, more theatrical. The batcave opened in London, and goth became undeniably a culture, not just a aesthetic.

**The Cyber Era (1990s-2000s)**
Industrial influences merged with gothic sensibilities. Buckles, latex, and chrome mixed with lace and leather. The goths went electric.

**Today**
Gothic fashion is thriving. It's more accessible, more diverse, and more unapologetic than ever. From dark academia to industrial goth to romantic gothic lolita, the spectrum has expanded exponentially.

What remains constant is the core truth: gothic fashion is about beauty found in darkness, elegance in shadow, and the refusal to compromise.`,
    author: 'Lilith',
    date: 'Dec 2023',
    readTime: '10 min',
    featured: false,
  },
  {
    id: 5,
    slug: 'leather-and-rust-collection',
    title: 'New Drop: Leather & Rust Collection',
    category: 'DROPS',
    excerpt:
      'Introducing our latest collaboration with master leather craftsmen from the old world...',
    content: `Introducing our latest collaboration with master leather craftsmen from the old world.

We're thrilled to announce the Leather & Rust Collection—a limited release born from a partnership with artisans in Eastern Europe whose families have worked leather for three generations.

**The Collaboration**
These craftspeople don't use modern tanning. They use vegetable tanning methods that create leather of extraordinary depth and character. The leather breathes. It ages. It develops a patina unique to each wearer.

**The Pieces**
- **The Siege Vest**: A structured leather piece with brass rivets and aged buckles
- **The Wanderer Jacket**: Long, flowing, and built for those who move between worlds
- **The Ritual Cuffs**: Minimalist wrist armor in naturally-tanned leather
- **The Archive Satchel**: Both beautiful and functional, designed to last decades

**Limited Run**
Only 50 pieces of each item worldwide. Once this collection is gone, these pieces retire until inspiration strikes again.

**Pricing**
$349 - $649 depending on piece

Available now. Only online. Ships worldwide.

This is leather made the old way, for those who understand that quality is the ultimate rebellion.`,
    author: 'The Atelier',
    date: 'Feb 2024',
    readTime: '3 min',
    featured: false,
  },
  {
    id: 6,
    slug: 'steampunk-victorian-industrial',
    title: 'Steampunk: When Victorian Meets Industrial',
    category: 'CULTURE',
    excerpt:
      'Exploring the aesthetic fusion of 19th century elegance with mechanical revolution...',
    content: `Exploring the aesthetic fusion of 19th century elegance with mechanical revolution.

Steampunk is a paradox—it takes the machinery of progress and dresses it in velvet. It's nostalgia for a future that never was.

**The Aesthetic**
Brass, gears, leather, and the ghost of what the Industrial Revolution could have been if it were also beautiful. Steampunk rejects the stark, utilitarian machinery of our actual 19th century and reimagines it as ornate, intentional, romantic.

**Why It Resonates**
In an age of sleek minimalism and digital invisibility, steampunk offers something tangible. Visible mechanisms. Hardware you can touch. A world where function and beauty are not opposites.

**In Fashion**
Steampunk style incorporates:
- Brass and copper accents
- Goggles (practical and symbolic)
- Leather in structured, architectural cuts
- Watch parts and mechanical imagery
- Victorian silhouettes with modern functionality
- Layered, rich textures

**The Philosophy**
There's an underlying anarchism to steampunk. It's about imagining an alternative path—one where culture didn't sacrifice beauty for efficiency. It's a quiet rebellion against the digital erasure of the mechanical world.

Wear it as armor against the invisible machines that surround us.`,
    author: 'Gideon',
    date: 'Dec 2023',
    readTime: '7 min',
    featured: false,
  },
  {
    id: 7,
    slug: 'ritual-objects-altar-essentials',
    title: 'Ritual Objects: Altar Essentials',
    category: 'RITUAL',
    excerpt:
      'How to curate a sacred space—candles, incense, and the tools of the craft...',
    content: `How to curate a sacred space—candles, incense, and the tools of the craft.

An altar is not a decoration. It's an anchor point. A place where intention becomes physical reality.

**The Foundation**
Start with cloth. A quality altar cloth in black, deep red, or rich purple creates a boundary between the sacred and profane. It says: this space is intentional.

**Light**
Candles are essential. Not LED, not novelty—real candles. Fire is transformation. Black candles for binding and banishment. Red for passion and power. White for clarity. The flame is the most ancient technology of ritual.

**Scent**
Incense carries intention upward. Frankincense for clarity. Myrrh for protection. Palo santo for cleansing. Let the smoke do the work.

**The Tools**
Depending on your practice, you might include:
- A dagger or athame (for directing energy)
- A chalice or cup (for water, wine, or intention)
- A wand or staff (for calling and commanding)
- Crystals or stones (for their vibrational properties)
- Image of the divine (in whatever form speaks to you)

**The Arrangement**
There's no "right" way. Your altar should reflect your practice and your space. What matters is intentionality. Every object should have purpose.

**Maintenance**
A living altar changes. Refresh it seasonally. Add items that call to you. Remove what no longer serves. An altar is a conversation with the divine—keep talking.`,
    author: 'Lilith',
    date: 'Jan 2024',
    readTime: '5 min',
    featured: false,
  },
  {
    id: 8,
    slug: 'deathrock-revival',
    title: 'Deathrock Revival',
    category: 'CULTURE',
    excerpt:
      'The batcave aesthetic is back. Spikes, fishnet, and the sound of the first wave...',
    content: `The batcave aesthetic is back. Spikes, fishnet, and the sound of the first wave.

Deathrock is where punk met the crypt. It's the moment subcultures collided and created something wholly new. And it's happening again.

**The Origins**
In the early 1980s, London's Batcave club became ground zero for a new aesthetic. Punks were discovering gothic atmosphere. Goths were discovering punk's raw energy. The result was deathrock—angular, dark, utterly uncompromising.

**The Visual Code**
- Spikes and studs (weaponized fashion)
- Fishnets (showing skin vulnerably)
- Creepers and combat boots
- Heavy, dramatic makeup
- Sometimes grotesque, always intentional

**The Attitude**
Deathrock rejected both punk's nihilism and goth's romanticism. It was something darker—a confrontation with mortality itself.

**Why Now?**
In 2024, deathrock is experiencing a renaissance. Young people are discovering the original wave and making it new. There's something deeply appealing about an aesthetic that says: I am not comfortable. I am not here to be pretty. I simply am.

**The Sound**
Listen to Bauhaus, Deathdream, Christian Death. Understand that fashion and music are inseparable. You can't wear deathrock without hearing it. The jagged guitar lines, the vocals like a haunting, the haunting rhythms—this is the soundtrack to the look.

**Embrace the Revival**
Wear spikes. Wear fishnets. Wear the unapologetic. The first wave was radical. The revival is rebellion.`,
    author: 'Corvus',
    date: 'Feb 2024',
    readTime: '6 min',
    featured: false,
  },
];

// For product detail page type compatibility (theme was string before)
export type ProductTheme = Product['theme'];
