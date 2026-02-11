'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import './(app)/globals.css'; 

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        <AlertTriangle size={64} className="text-[#8b0000] mb-6" />
        <h2 className="text-3xl md:text-4xl font-serif text-[#e0e0e0] mb-4 tracking-widest">
            REALITY FRACTURE
        </h2>
        <p className="text-[#a6a6a6] max-w-md mb-8 font-light leading-relaxed">
            Something went wrong. The ritual failed. 
            The spirits are restless.
        </p>
        <button
            onClick={reset}
            className="px-8 py-3 bg-[#8b0000] text-white
                    hover:bg-[#a00000] transition-all duration-300
                    uppercase tracking-wider text-sm"
        >
            Attempt Ritual Again
        </button>
        </div>
      </body>
    </html>
  );
}
