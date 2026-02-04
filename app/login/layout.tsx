import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Giriş & Kayıt",
  description: "Memento Mori hesabınıza giriş yapın veya yeni üye olun. Dark fashion topluluğuna katılın.",
  path: "/login",
  keywords: ["giriş", "kayıt", "üye ol", "memento mori hesap"],
  noIndex: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
