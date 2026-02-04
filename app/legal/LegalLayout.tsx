import Link from "next/link";

type LegalLayoutProps = {
  title: string;
  updated?: string;
  children: React.ReactNode;
};

export default function LegalLayout({ title, updated = "Şubat 2024", children }: LegalLayoutProps) {
  return (
    <div className="legal-page">
      <nav className="legal-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>{title}</span>
      </nav>
      <h1 className="home-section-title">{title}</h1>
      <p className="legal-updated">Son güncelleme: {updated}</p>
      <div className="legal-content">{children}</div>
    </div>
  );
}
