import { buildPageMetadata } from "@/app/lib/metadata";
import JsonLd from "@/app/components/JsonLd";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Get in touch with Memento Mori. Customer service, orders, wholesale. Dark fashion & subculture apparel.",
  path: "/contact",
  keywords: ["contact memento mori", "customer service", "dark fashion support", "order help"],
});

const faqs = [
  { q: "How long does shipping take?", a: "Standard delivery is 5-7 business days. Express options available at checkout." },
  { q: "What is your return policy?", a: "30-day returns for unworn items with original tags. See our Returns page for details." },
  { q: "How do I find my size?", a: "Use our Size Guide for measurements. When in doubt, size up for a relaxed fit." },
  { q: "How do I care for my pieces?", a: "Spot clean only for most items. Check the product care label for specifics." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
