import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { headers } from 'next/headers';
import { Package, ChevronRight, Calendar } from 'lucide-react';

export default async function OrdersPage() {
  const payload = await getPayload({ config: configPromise });
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });

  if (!user) {
    redirect('/login?redirect=/account/orders');
  }

  // Define a local Order interface as Payload types are not available
  interface Order {
    id: string | number;
    status: string;
    createdAt: string;
    total: number;
    items: unknown[];
    [key: string]: unknown;
  }

  let orders: Order[] = [];

  if (user) {
    const result = await payload.find({
      collection: 'orders',
      where: {
        user: {
          equals: user.id,
        },
      },
      sort: '-createdAt',
    });
    // Cast to unknown first if needed, but docs usually matches generic
    orders = result.docs as unknown as Order[];
  }

  return (
    <div className='account-section max-w-5xl mx-auto px-4 py-8'>
      <div className='account-header mb-10 border-b border-white/10 pb-6'>
        <h1 className='text-3xl md:text-4xl font-cinzel text-bone mb-3 tracking-wider'>Your Chronicle</h1>
        <p className='text-aged-silver font-crimson text-lg italic'>
          History of your acquired artifacts and their journey through the void.
        </p>
      </div>

      <div className='orders-list space-y-6'>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] py-16 px-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm text-center">
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
              <Package size={64} strokeWidth={1} className="relative text-aged-silver group-hover:text-bone transition-colors duration-500 z-10" />
            </div>
            <h2 className='text-2xl font-cinzel text-bone mb-3 tracking-wide'>No Rituals Recorded</h2>
            <p className='text-aged-silver mb-8 font-crimson text-lg max-w-md leading-relaxed'>
              Your journey has yet to be written.
              The void awaits your selection.
            </p>
            <Link
              href='/collections'
              className='group relative px-8 py-3 bg-transparent border border-aged-brass/30 text-bone 
                         overflow-hidden transition-all hover:border-accent hover:shadow-[0_0_20px_rgba(184,134,11,0.2)]'
            >
              <span className="relative z-10 text-sm tracking-[0.2em] font-cinzel font-medium group-hover:text-white transition-colors">BEGIN JOURNEY</span>
              <div className="absolute inset-0 bg-accent/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="group block relative bg-white/5 border border-white/10 hover:border-accent/40 transition-all duration-300 p-6 rounded-sm overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-cinzel text-lg text-bone tracking-widest">
                        #{order.id.toString().slice(-6).toUpperCase()}
                      </span>
                      <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 border ${order.status === 'delivered' ? 'border-green-800/50 bg-green-900/10 text-green-400' :
                        order.status === 'cancelled' ? 'border-red-900/50 bg-red-900/10 text-red-400' :
                          'border-yellow-900/50 bg-yellow-900/10 text-yellow-500'
                        }`}>
                        {order.status?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-aged-silver font-crimson">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-accent/60" />
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-accent/60" />
                        {order.items.length} {order.items.length === 1 ? 'Artifact' : 'Artifacts'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-right">
                      <p className="text-xs text-aged-silver uppercase tracking-widest mb-1">Total Tribute</p>
                      <p className="font-cinzel text-xl text-accent">₺{order.total.toLocaleString()}</p>
                    </div>
                    <div className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 group-hover:border-accent/50 group-hover:bg-accent/10 transition-all">
                      <ChevronRight size={18} className="text-aged-silver group-hover:text-bone transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
