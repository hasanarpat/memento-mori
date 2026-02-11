import Link from 'next/link';
import { Ghost } from 'lucide-react';
import './(app)/globals.css'; // Import globals to ensure styling

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800;900&family=Crimson+Text:wght@400;600;700&family=IM+Fell+DW+Pica:ital@0;1&family=Pirata+One&family=UnifrakturMaguntia&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className="antialiased bg-[#0d0a0f] text-[#e0e0e0]">
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <Ghost size={64} className="text-[#a6a6a6] mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-serif text-[#e0e0e0] mb-4 tracking-widest">
            VOID DETECTED
            </h2>
            <p className="text-[#a6a6a6] max-w-md mb-8 font-light leading-relaxed">
            The path you seek has been swallowed by the shadows. 
            It does not exist in this realm.
            </p>
            <Link 
            href="/" 
            className="px-8 py-3 bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] 
                        hover:bg-[#333] hover:border-[#666] transition-all duration-300
                        uppercase tracking-wider text-sm"
            >
            Return to the Living
            </Link>
        </div>
      </body>
    </html>
  );
}
