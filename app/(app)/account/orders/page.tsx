import Link from 'next/link';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Package, ChevronRight, Calculator, Calendar } from 'lucide-react';

export default async function OrdersPage() {
  const payload = await getPayload({ config: configPromise });
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });

  // If no user on server, we don't redirect to login immediately to avoid loops.
  // Instead, we show an empty state or let client-side handle it if needed.
  // But strictly speaking, if we are here, we should be logged in. 
  
  if (!user) {
     // Check if we have a cookie at all
     // const cookieStore = await cookies();
     // const token = cookieStore.get('payload-token');
     // if (!token) redirect('/login?redirect=/account/orders'); 
     
     // For now, return empty or redirect?
     // User said: "order yok ise uygun şekilde görmem laızm yine de ekranı"
     // But if NOT LOGGED IN, we can't show orders.
     // THE BUG is that user IS logged in client side.
     // With the cookie fix in AuthSync, a refresh should fix it.
     // But initially, we might still fail if cookie isn't set yet.
     // Let's NOT redirect server side for now, just show empty or "Please login".
  }

  let orders: any[] = [];
  
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
    orders = result.docs;
  }

  return (
    <div className='account-section max-w-4xl mx-auto'>
      <div className='account-header mb-8'>
        <h1 className='text-3xl font-serif mb-2 tracking-wide'>Your Orders</h1>
        <p className='text-[#a6a6a6] font-light'>
          History of your past orders and their status in the void.
        </p>
      </div>

      <div className='orders-list space-y-4'>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] py-12 px-4 rounded-lg bg-[#0a0a0a] border border-[#222]">
            <div className="relative mb-6">
               <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
               <Package size={64} strokeWidth={1} className="relative text-[#333] z-10" />
            </div>
            <h2 className='text-2xl font-serif text-[#e0e0e0] mb-2 tracking-wide'>No Rituals Found</h2>
            <p className='text-[#666] mb-8 font-light max-w-sm text-center leading-relaxed'>
              Your journey has yet to be recorded in our chronicles. 
              The void awaits your selection.
            </p>
            <Link 
              href='/collections' 
              className='group relative px-8 py-3 bg-transparent border border-[#333] text-[#e0e0e0] 
                         overflow-hidden transition-all hover:border-[#666]'
            >
              <span className="relative z-10 text-sm tracking-[0.2em] font-medium">BEGIN JOURNEY</span>
              <div className="absolute inset-0 bg-[#1a1a1a] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <Link 
              key={order.id} 
              href={`/account/orders/${order.id}`}
              className="block bg-[#1a1a1a] border border-[#333] hover:border-[#666] transition-all p-6 group"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-[#666]">#{order.id.toString().slice(-6).toUpperCase()}</span>
                      <span className={`text-xs px-2 py-0.5 border ${
                        order.status === 'delivered' ? 'border-green-800 text-green-500' :
                        order.status === 'cancelled' ? 'border-red-900 text-red-500' :
                        'border-yellow-900 text-yellow-500'
                      }`}>
                        {order.status?.toUpperCase()}
                      </span>
                   </div>
                   <div className="flex items-center gap-4 text-sm text-[#a6a6a6]">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        {order.items.length} Items
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                   <div className="text-right">
                      <p className="text-xs text-[#666]">TOTAL</p>
                      <p className="font-serif text-lg">₺{order.total.toLocaleString()}</p>
                   </div>
                   <ChevronRight className="text-[#333] group-hover:text-[#e0e0e0] transition-colors" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
