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
    <div className='max-w-5xl mx-auto py-12 px-4'>
      <div className='mb-10'>
        <Link href='/account/orders' className='group inline-flex items-center text-aged-silver hover:text-bone transition-colors mb-6 font-cinzel text-sm spacing-widest'>
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Chronicles
        </Link>

        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8'>
          <div>
            <h1 className='text-3xl md:text-4xl font-cinzel text-bone flex flex-col md:flex-row md:items-center gap-4 mb-2'>
              Order #{order.id.toString().slice(-6).toUpperCase()}
              <span className={`text-xs px-3 py-1 border rounded-full self-start md:self-auto tracking-widest ${order.status === 'delivered' ? 'border-green-800/50 bg-green-900/10 text-green-400' :
                order.status === 'cancelled' ? 'border-red-900/50 bg-red-900/10 text-red-400' :
                  'border-yellow-900/50 bg-yellow-900/10 text-yellow-500'
                }`}>
                {order.status?.toUpperCase()}
              </span>
            </h1>
            <p className='text-aged-silver font-crimson italic'>
              Placed on {new Date(order.createdAt).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          {order.status === 'pending' && (
            <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-sm text-sm text-aged-silver font-cinzel">
              Payment Status: <span className="text-accent ml-2">{order.paymentStatus?.toUpperCase()}</span>
            </div>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Order Items */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white/5 border border-white/10 rounded-sm overflow-hidden'>
            <div className='p-6 border-b border-white/10 bg-white/5'>
              <h2 className='font-cinzel text-xl text-bone flex items-center gap-3'>
                <Package size={20} className="text-accent" />
                Acquired Artifacts
              </h2>
            </div>
            <div className='divide-y divide-white/10'>
              {order.items.map((item: { product: { slug?: string; name?: string; images?: { url?: string } | null }; quantity: number, price: number }, i: number) => {
                const product = item.product;
                const image = (product.images as any)?.url || (Array.isArray(product.images) ? (product.images[0] as any)?.url : null);
                const productSlug = product.slug || '#';

                return (
                  <div key={i} className='p-6 flex gap-6 hover:bg-white/5 transition-colors group'>
                    <Link href={`/products/${productSlug}`} className='relative w-24 h-32 bg-black/40 border border-white/10 shrink-0 overflow-hidden'>
                      {image && (
                        <Image
                          src={image}
                          alt={product.name || 'Product'}
                          fill
                          className='object-cover group-hover:scale-105 transition-transform duration-500'
                        />
                      )}
                    </Link>
                    <div className='flex-1 flex flex-col justify-between'>
                      <div>
                        <Link href={`/products/${productSlug}`} className='font-cinzel text-lg text-bone hover:text-accent transition-colors block mb-1'>
                          {product.name}
                        </Link>
                        <p className='text-sm text-aged-silver font-crimson'>Quantity: {item.quantity}</p>
                      </div>
                      <div className='flex justify-between items-end'>
                        <span className='text-xs text-aged-silver font-cinzel tracking-wider'>UNIT PRICE: ₺{item.price.toLocaleString()}</span>
                        <p className='font-cinzel text-xl text-bone'>₺{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='p-6 bg-white/5 border-t border-white/10 flex justify-between items-center'>
              <span className='text-aged-silver font-cinzel tracking-widest text-sm'>TOTAL TRIBUTE</span>
              <span className='text-2xl font-cinzel text-accent'>₺{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Sidebar: Shipping & Payment */}
        <div className='space-y-6'>
          {/* Shipping Address */}
          <div className='bg-white/5 border border-white/10 rounded-sm p-6'>
            <h2 className='font-cinzel text-lg text-bone flex items-center gap-2 mb-6 pb-2 border-b border-white/10'>
              <MapPin size={18} className="text-accent" />
              Destination
            </h2>
            <address className='not-italic text-aged-silver font-crimson text-lg space-y-2 leading-relaxed'>
              <p className='text-bone font-cinzel mb-2'>{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </address>
          </div>

          {/* Payment Method */}
          <div className='bg-white/5 border border-white/10 rounded-sm p-6'>
            <h2 className='font-cinzel text-lg text-bone flex items-center gap-2 mb-6 pb-2 border-b border-white/10'>
              <CreditCard size={18} className="text-accent" />
              Method of Tribute
            </h2>
            <p className='text-aged-silver font-cinzel capitalize flex items-center gap-2'>
              {order.paymentMethod?.replace('_', ' ')}
              <span className="text-xs px-2 py-0.5 border border-white/20 rounded text-white/50">SECURE</span>
            </p>
          </div>

          <div className='text-center pt-4'>
            <Link href='/contact' className='text-xs text-aged-silver hover:text-accent underline font-cinzel tracking-wider transition-colors'>
              REPORT AN ISSUE WITH THIS RITUAL
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
