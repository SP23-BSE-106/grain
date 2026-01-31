'use client';

import { useState, useEffect } from 'react';
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
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!isHydrated) {
      // Wait for hydration
      return;
    }
    if (!user) {
      router.push('/login?returnUrl=' + encodeURIComponent('/cart'));
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url; // Redirect to Stripe Checkout
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (error) {
      alert('Error creating checkout session');
    }
    setCheckoutLoading(false);
  };

  if (isLoading) {
    return (
    <div className="min-h-screen bg-beige flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your cart...</p>
      </div>
    </div>
    );
  }

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-olive-green mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link href="/shop" className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-wheat-brown transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-olive-green mb-8">Shopping Cart</h1>

        {/* Cart Items */}
        {items.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Cart Items</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-gray-600">${item.product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900">Qty: {item.quantity}</span>
                    <span className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => saveForLater(item)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Save for Later
                    </button>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Total: ${total.toFixed(2)}</h2>
              <div className="space-x-4">
                <button
                  onClick={async () => {
                    clearCart();
                    if (user) {
                      await saveCart(user.id);
                    }
                  }}
                  className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-gray-900"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="px-6 py-2 bg-olive-green text-white rounded hover:bg-wheat-brown transition disabled:opacity-50"
                >
                  {checkoutLoading ? 'Placing Order...' : 'Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved for Later */}
        {savedForLater.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Saved for Later</h2>
            <div className="space-y-4">
              {savedForLater.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-gray-600">${item.product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Qty: {item.quantity}</span>
                    <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => moveToCart(item)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
