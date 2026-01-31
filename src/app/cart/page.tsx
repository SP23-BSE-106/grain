'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import Link from 'next/link';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

const Cart = () => {
  const { user, isHydrated } = useAuthStore();
  const { items, savedForLater, isLoading, removeItem, clearCart, saveForLater, moveToCart, saveCart } = useCartStore();
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Client-side authentication check - wait for hydration
  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/login?redirect=/cart');
    }
  }, [isHydrated, user, router]);

  const handleCheckout = () => {
    if (!isHydrated) return;
    if (!user) {
      router.push('/login?returnUrl=' + encodeURIComponent('/cart'));
      return;
    }
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-screen bg-beige-bg flex items-center justify-center p-4">
        <div className="glass-panel p-8 md:p-12 rounded-3xl text-center max-w-lg mx-auto animate-fade-up">
          <div className="w-20 h-20 bg-olive-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-display">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/shop" className="btn-primary inline-flex">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-bg pt-[73px] pb-20">
      <div className="container-custom py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-display">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-8">
            {items.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 md:p-8 animate-fade-up">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  Cart Items <span className="text-sm font-normal text-gray-500">({items.length})</span>
                </h2>
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6 border-b border-gray-100 last:border-0 last:pb-0">
                      {/* Product Image */}
                      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.product.name}</h3>
                          <p className="font-bold text-olive-green text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <div className="bg-gray-50 rounded-lg px-3 py-1 text-sm font-medium text-gray-600 border border-gray-200">
                            Qty: {item.quantity}
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => saveForLater(item)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            >
                              Save for Later
                            </button>
                            <button
                              onClick={() => removeItem(item.product._id)}
                              className="text-sm text-red-500 hover:text-red-600 font-medium hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved For Later */}
            {savedForLater.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Saved for Later</h2>
                <div className="space-y-6">
                  {savedForLater.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 w-full sm:text-left text-center">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-gray-500 text-sm">${item.product.price}</p>
                      </div>
                      <button
                        onClick={() => moveToCart(item)}
                        className="btn-secondary text-sm py-2 px-4 whitespace-nowrap w-full sm:w-auto"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checkout Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-3xl p-6 md:p-8 sticky top-24 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-olive-green">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                  className="w-full btn-primary py-4 text-lg shadow-xl shadow-olive-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={async () => {
                    clearCart();
                    if (user) await saveCart(user.id);
                  }}
                  className="w-full py-3 text-gray-500 hover:text-red-500 text-sm font-medium transition-colors"
                >
                  Clear Shopping Cart
                </button>
              </div>

              <div className="mt-6 flex justify-center gap-4 text-gray-400">
                {/* Icons could go here */}
                <span className="text-xs">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
