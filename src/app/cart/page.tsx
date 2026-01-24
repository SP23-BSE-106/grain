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
  const { user } = useAuthStore();
  const { items, removeItem, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const { token } = useAuthStore();

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        clearCart();
        alert('Order placed successfully!');
        router.push('/');
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (error) {
      alert('Error placing order');
    }
    setLoading(false);
  };

  if (items.length === 0) {
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

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            {items.map((item, index) => (
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
            <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
            <div className="space-x-4">
              <button
                onClick={clearCart}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="px-6 py-2 bg-olive-green text-white rounded hover:bg-wheat-brown transition disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
