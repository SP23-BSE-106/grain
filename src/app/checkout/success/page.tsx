'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccessContent = () => {
  const { user, token } = useAuthStore();
  const { clearCart } = useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<{ sessionId: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!sessionId) {
      router.push('/cart');
      return;
    }

    // Clear the cart after successful payment
    clearCart();
    setLoading(false);
  }, [user, sessionId, router, clearCart]);

  useEffect(() => {
    if (sessionId) {
      setOrderDetails({
        sessionId,
        status: 'paid',
      });
    }
  }, [sessionId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-olive-green mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed and is being processed.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">Order Details</h2>
              <p className="text-sm text-gray-600">
                Session ID: {orderDetails?.sessionId}
              </p>
              <p className="text-sm text-gray-600">
                Status: {orderDetails?.status}
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/orders"
                className="inline-block px-6 py-3 bg-olive-green text-white rounded-lg hover:bg-wheat-brown transition"
              >
                View My Orders
              </Link>
              <br />
              <Link
                href="/shop"
                className="inline-block px-6 py-3 border border-olive-green text-olive-green rounded-lg hover:bg-olive-green hover:text-white transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutSuccess = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccess;
