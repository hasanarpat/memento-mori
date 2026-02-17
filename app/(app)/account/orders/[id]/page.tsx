import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { headers } from 'next/headers';
import { Package, ArrowLeft, MapPin, CreditCard } from 'lucide-react';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const payload = await getPayload({ config: configPromise });
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });

  if (!user) {
    // redirect(`/login?redirect=/account/orders/${id}`);
    // Allow rendering to see if client-side auth can pick it up or show error
  }

  let order;
  if (user) {
    try {
      order = await payload.findByID({
        collection: 'orders',
        id,
        depth: 2, // Ensure we get product details
      });
    } catch {
      notFound();
    }
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-[#a6a6a6] mb-4">You must be logged in to view this order.</p>
        <Link href={`/login?redirect=/account/orders/${id}`} className="px-6 py-2 bg-[#e0e0e0] text-[#0d0a0f] font-semibold">
          Login to View
        </Link>
      </div>
    )
  }


  // Security Check: Ensure user owns the order
  // We already checked if user exists above, but for safety:
  const orderUserId = typeof order.user === 'object' ? order.user?.id : order.user;
  if (!user || orderUserId !== user.id) {
    // If not logged in or not owner, show same "login to view" or not found
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-[#a6a6a6] mb-4">You are not authorized to view this order.</p>
        <Link href="/account/orders" className="text-sm underline">
          Return to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto py-16 px-6'>
      <div className='mb-12 border-b border-white/5 pb-8'>
        <Link href='/account/orders' className='group inline-flex items-center text-aged-silver hover:text-bone transition-colors mb-8 font-cinzel text-sm tracking-widest uppercase'>
          <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform text-blood-red" />
          Back to Chronicles
        </Link>

        <div className='flex flex-col md:flex-row md:items-end justify-between gap-8'>
          <div>
            <h1 className='text-3xl md:text-5xl font-cinzel text-bone mb-4 tracking-wide leading-tight'>
              Order <span className="text-blood-red">#{order.id.toString().slice(-6).toUpperCase()}</span>
            </h1>
            <p className='text-aged-silver font-crimson italic text-lg opacity-80'>
              Ritual initiated on <span className="text-bone/90 font-normal not-italic">{new Date(order.createdAt).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
          </div>

          <div className={`px-5 py-2 border rounded-sm font-cinzel text-sm tracking-widest uppercase backdrop-blur-md ${order.status === 'delivered' ? 'border-green-900/30 bg-green-900/10 text-green-400 shadow-[0_0_15px_-3px_rgba(74,222,128,0.1)]' :
              order.status === 'cancelled' ? 'border-red-900/30 bg-red-900/10 text-red-400 shadow-[0_0_15px_-3px_rgba(248,113,113,0.1)]' :
                'border-yellow-900/30 bg-yellow-900/10 text-yellow-500 shadow-[0_0_15px_-3px_rgba(250,204,21,0.1)]'
            }`}>
            <span className="mr-2 opacity-50">•</span>
            {order.status?.toUpperCase()}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
        {/* Order Items */}
        <div className='lg:col-span-2 space-y-8'>
          <div className='bg-black/40 border border-white/5 rounded-sm overflow-hidden backdrop-blur-sm relative'>
            {/* Decorative corner accent */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>

            <div className='p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between'>
              <h2 className='font-cinzel text-xl text-bone flex items-center gap-4 tracking-wider'>
                <span className="p-2 border border-white/10 rounded-full bg-white/5">
                  <Package size={18} className="text-blood-red" />
                </span>
                Acquired Artifacts
              </h2>
              <span className="text-xs text-aged-silver font-cinzel tracking-widest border border-white/10 px-3 py-1 rounded-full">{order.items.length} ITEMS</span>
            </div>

            <div className='divide-y divide-white/5'>
              {order.items.map((item: any, i: number) => {
                const product = item.product;
                const image = (product.images as any)?.url || (Array.isArray(product.images) ? (product.images[0] as any)?.url : null);
                const productSlug = product.slug || '#';

                return (
                  <div key={i} className='p-6 md:p-8 flex gap-6 md:gap-8 hover:bg-white/[0.02] transition-colors group relative overflow-hidden'>
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blood-red/0 via-blood-red/5 to-blood-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] transform" style={{ transitionDuration: '1.5s' }}></div>

                    <Link href={`/products/${productSlug}`} className='relative w-24 h-32 md:w-32 md:h-40 bg-white/5 border border-white/10 shrink-0 overflow-hidden shadow-2xl shadow-black/80'>
                      {image ? (
                        <Image
                          src={image}
                          alt={product.name || 'Product'}
                          fill
                          className='object-cover group-hover:scale-110 group-hover:sepia-[0.2] transition-all duration-700 ease-out'
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-[10px] text-white/20 font-cinzel">NO IMAGE</div>
                      )}
                    </Link>
                    <div className='flex-1 flex flex-col justify-between py-1 z-10'>
                      <div>
                        <Link href={`/products/${productSlug}`} className='font-cinzel text-lg md:text-xl text-bone hover:text-blood-red transition-colors block mb-3 tracking-wide'>
                          {product.name}
                        </Link>
                        <p className='text-sm text-aged-silver font-crimson italic flex items-center gap-2'>
                          Quantity: <span className="text-bone not-italic bg-white/5 px-2 py-0.5 rounded text-xs border border-white/5">{item.quantity}</span>
                        </p>
                      </div>
                      <div className='flex justify-between items-end mt-4'>
                        <span className='text-xs text-white/30 font-cinzel tracking-wider uppercase border-b border-white/10 pb-1'>Unit: ₺{item.price.toLocaleString()}</span>
                        <p className='font-cinzel text-xl md:text-2xl text-white/90 text-shadow-glow'>₺{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='p-8 bg-white/[0.02] border-t border-white/5 flex justify-between items-center relative overflow-hidden'>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
              <span className='text-aged-silver font-cinzel tracking-widest text-xs uppercase relative z-10'>Total Tribute Paid</span>
              <span className='text-3xl font-cinzel text-blood-red text-shadow-sm relative z-10'>₺{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-8 h-fit lg:sticky lg:top-32'>
          {/* Destination */}
          <div className='p-8 border border-white/10 bg-white/[0.02] rounded-sm relative overflow-hidden group hover:border-white/20 transition-colors'>
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <MapPin size={80} className="text-white transform rotate-12" />
            </div>
            <h3 className='font-cinzel text-lg text-bone mb-6 flex items-center gap-3 pb-4 border-b border-white/5'>
              <span className="w-1.5 h-1.5 rounded-full bg-blood-red shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
              Destination
            </h3>
            <address className='not-italic text-aged-silver font-crimson text-lg space-y-1.5 leading-relaxed relative z-10'>
              <p className='text-bone mb-3 font-cinzel tracking-wide text-base'>{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress?.city} {order.shippingAddress?.postalCode}</p>
              <p className="border-t border-white/5 pt-2 mt-2 inline-block text-white/40 text-base">{order.shippingAddress?.country}</p>
            </address>
          </div>

          {/* Payment */}
          <div className='p-8 border border-white/10 bg-white/[0.02] rounded-sm relative overflow-hidden group hover:border-white/20 transition-colors'>
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <CreditCard size={80} className="text-white transform -rotate-12" />
            </div>
            <h3 className='font-cinzel text-lg text-bone mb-6 flex items-center gap-3 pb-4 border-b border-white/5'>
              <span className="w-1.5 h-1.5 rounded-full bg-blood-red shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
              Tribute Method
            </h3>
            <div className="relative z-10">
              <p className='text-aged-silver font-cinzel capitalize flex items-center gap-3 text-lg'>
                {(order.paymentMethod || 'Credit Card').replace(/_/g, ' ')}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-green-400/80 font-cinzel bg-green-900/10 border border-green-900/30 px-3 py-1.5 rounded w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                SECURE TRANSACTION
              </div>
            </div>
          </div>

          <div className='text-center pt-8 opacity-60 hover:opacity-100 transition-opacity'>
            <Link href='/contact' className='text-xs text-aged-silver hover:text-blood-red underline decoration-white/10 hover:decoration-blood-red/50 font-cinzel tracking-widest transition-all uppercase underline-offset-4'>
              Report an issue with this ritual
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
