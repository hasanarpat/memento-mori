// Root layout - Minimal wrapper
// HTML structure is handled by route group layouts: (app) and (payload)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
