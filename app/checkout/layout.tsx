import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Checkout",
  description: "Secure checkout at Memento Mori. Shipping and payment. Complete your dark fashion order.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
