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
  if(user) {
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
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <div className='mb-8'>
        <Link href='/account/orders' className='flex items-center text-[#666] hover:text-[#e0e0e0] transition-colors mb-4'>
          <ArrowLeft size={16} className="mr-2" />
          Back to Orders
        </Link>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-serif text-[#e0e0e0] flex items-center gap-3'>
              Order #{order.id.toString().slice(-6).toUpperCase()}
              <span className={`text-sm px-3 py-1 border rounded-full ${
                order.status === 'delivered' ? 'border-green-800 text-green-500' :
                order.status === 'cancelled' ? 'border-red-900 text-red-500' :
                'border-yellow-900 text-yellow-500'
              }`}>
                {order.status?.toUpperCase()}
              </span>
            </h1>
            <p className='text-[#a6a6a6] mt-2'>
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          {order.status === 'pending' && (
             <div className="px-4 py-2 bg-[#2a2a2a] rounded text-sm text-[#ccc]">
                Payment Status: <span className="text-white font-semibold">{order.paymentStatus?.toUpperCase()}</span>
             </div>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Order Items */}
        <div className='md:col-span-2 space-y-6'>
          <div className='bg-[#111] border border-[#333] rounded-lg overflow-hidden'>
            <div className='p-4 border-b border-[#333] bg-[#161616]'>
              <h2 className='font-semibold text-[#e0e0e0] flex items-center gap-2'>
                <Package size={18} />
                Items
              </h2>
            </div>
            <div className='divide-y divide-[#333]'>
              {order.items.map((item: { product: { name?: string; images?: { url?: string } | null }; quantity: number }, i: number) => {
                const product = item.product;
                const image = product.images?.url;
                
                return (
                  <div key={i} className='p-4 flex gap-4'>
                    <div className='relative w-20 h-24 bg-[#000] border border-[#333] shrink-0'>
                      {image && (
                        <Image 
                          src={image} 
                          alt={product.name || 'Product'} 
                          fill 
                          className='object-cover'
                        />
                      )}
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-medium text-[#e0e0e0]'>{product.name}</h3>
                      <p className='text-sm text-[#666] mt-1'>Qty: {item.quantity}</p>
                      <p className='text-sm text-[#666]'>Price: ₺{item.price}</p>
                    </div>
                    <div className='text-right'>
                      <p className='font-serif text-[#e0e0e0]'>₺{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='p-4 bg-[#161616] border-t border-[#333] flex justify-between items-center'>
              <span className='text-[#a6a6a6]'>Total Amount</span>
              <span className='text-xl font-serif text-[#e0e0e0]'>₺{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Sidebar: Shipping & Payment */}
        <div className='space-y-6'>
          {/* Shipping Address */}
          <div className='bg-[#111] border border-[#333] rounded-lg p-6'>
            <h2 className='font-semibold text-[#e0e0e0] flex items-center gap-2 mb-4'>
              <MapPin size={18} />
              Shipping Address
            </h2>
            <address className='not-italic text-sm text-[#a6a6a6] space-y-1'>
              <p className='text-[#e0e0e0] font-medium'>{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </address>
          </div>

          {/* Payment Method */}
          <div className='bg-[#111] border border-[#333] rounded-lg p-6'>
            <h2 className='font-semibold text-[#e0e0e0] flex items-center gap-2 mb-4'>
              <CreditCard size={18} />
              Payment Method
            </h2>
            <p className='text-sm text-[#a6a6a6] capitalize'>
              {order.paymentMethod?.replace('_', ' ')}
            </p>
          </div>

          <div className='text-center'>
            <Link href='/contact' className='text-xs text-[#666] hover:text-[#999] underline'>
              Need help with this order?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
