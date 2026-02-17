import { Shield, Star, Heart } from 'lucide-react';
import NewsletterForm from '../../components/NewsletterForm';
import { buildPageMetadata } from '../../lib/metadata';

export const metadata = buildPageMetadata({
  title: 'About Us',
  description:
    'Memento Mori — Craftsmanship, sustainability, and community. Our story, values, and mission. Dark fashion with purpose.',
  path: '/about',
  keywords: [
    'about memento mori',
    'dark fashion brand',
    'craftsmanship',
    'sustainability',
    'gothic fashion brand',
  ],
});

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Craftsmanship',
      desc: 'Every piece is forged with precision. We partner with skilled artisans to create wearable art that lasts generations.',
    },
    {
      icon: Star,
      title: 'Sustainability',
      desc: 'We source responsibly and minimize waste. Our packaging is recycled and our processes are constantly evolving.',
    },
    {
      icon: Heart,
      title: 'Community',
      desc: "The Nexus is more than a brand—it's a collective of rebels, dreamers, and makers who refuse the ordinary.",
    },
  ];

  const timeline = [
    {
      year: '2019',
      title: 'The Forge Opens',
      desc: 'Memento Mori was born in a small atelier, blending gothic and steampunk aesthetics.',
    },
    {
      year: '2021',
      title: 'First Collection',
      desc: 'Launched our flagship Leather & Bones line to critical acclaim.',
    },
    {
      year: '2023',
      title: 'Global Reach',
      desc: 'Expanded to international shipping and opened our first flagship experience.',
    },
    {
      year: '2025',
      title: 'The Nexus',
      desc: 'Where past meets future. Our manifesto becomes reality.',
    },
  ];

  return (
    <div className='about-page'>
      <section className='about-hero'>
        <h1 className='home-hero-title'>Where Past Meets Future</h1>
        <p className='home-hero-tagline'>
          In darkness we find beauty. In leather and brass, our armor. In
          shadows, our truth.
        </p>
      </section>

      <section className='about-story'>
        <div className='about-story-grid'>
          <div className='about-story-text'>
            <p className='about-story-p'>
              Memento Mori began in the space between midnight and dawn—when the
              old world sleeps and the new one has not yet awakened. We believed
              that fashion could be more than trend; it could be armor, ritual,
              and rebellion.
            </p>
          </div>
          <div
            className='about-story-image'
            style={{
              minHeight: 320,
              background:
                'linear-gradient(135deg, rgba(43,13,13,0.6), rgba(26,10,31,0.6))',
              border: '2px solid rgba(139,115,85,0.3)',
            }}
          />
        </div>
        <div className='about-story-grid about-story-grid-reverse'>
          <div className='about-story-text'>
            <p className='about-story-p'>
              Today we stand at the nexus: Victorian elegance meets industrial
              grit, gothic shadows embrace metallic light. Every piece we create
              is a bridge between then and now—for those who refuse to blend in.
            </p>
          </div>
          <div
            className='about-story-image'
            style={{
              minHeight: 320,
              background:
                'linear-gradient(135deg, rgba(26,10,31,0.6), rgba(92,10,10,0.2))',
              border: '2px solid rgba(139,115,85,0.3)',
            }}
          />
        </div>
      </section>

      <section className='about-values'>
        <h2 className='home-section-title'>Our Values</h2>
        <div className='about-values-grid'>
          {values.map((v) => (
            <div
              key={v.title}
              className='home-category-card'
              style={{ height: 'auto', padding: '2rem' }}
            >
              <v.icon className='home-category-icon' size={48} />
              <h3 className='home-category-name'>{v.title}</h3>
              <p className='home-category-desc'>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='about-timeline'>
        <h2 className='home-section-title'>Our Journey</h2>
        <div className='about-timeline-list'>
          {timeline.map((item) => (
            <div key={item.year} className='about-timeline-item'>
              <span className='about-timeline-year'>{item.year}</span>
              <h3 className='about-timeline-title'>{item.title}</h3>
              <p className='about-timeline-desc'>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='home-newsletter' style={{ marginTop: '4rem' }}>
        <h2 className='home-newsletter-title'>Join Our Story</h2>
        <NewsletterForm />
      </section>
    </div>
  );
}
