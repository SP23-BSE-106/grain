'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, MapPin, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface BillingForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'cash_on_delivery' | 'jazzcash' | 'easypaisa' | 'bank_transfer';
  jazzcashNumber?: string;
  easypaisaNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

const CheckoutPage = () => {
  const { user, isHydrated } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BillingForm>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash_on_delivery',
  });

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    // Update form with user data
    setFormData(prev => ({
      ...prev,
      fullName: user.name || '',
      email: user.email || '',
    }));
  }, [user, isHydrated, items.length, router]);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.paymentMethod === 'jazzcash' && !formData.jazzcashNumber) {
      toast.error('Please enter your JazzCash number');
      return;
    }

    if (formData.paymentMethod === 'easypaisa' && !formData.easypaisaNumber) {
      toast.error('Please enter your EasyPaisa number');
      return;
    }

    if (formData.paymentMethod === 'bank_transfer' && (!formData.bankAccountNumber || !formData.bankName)) {
      toast.error('Please enter your bank details');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          billingInfo: formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-bg pt-[73px]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8 animate-fade-right">
            <Link
              href="/cart"
              className="flex items-center text-gray-600 hover:text-olive-green transition mr-4 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-bold font-display text-gray-900">Secure Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Billing Form (Left Column - 2/3 width) */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-6 md:p-8 rounded-3xl animate-fade-up">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-olive-green text-white flex items-center justify-center text-sm">1</div>
                  Billing Information
                </h2>

                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Contact Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="input-field w-full"
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-field w-full"
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="03XX-XXXXXXX"
                          className="input-field w-full"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Shipping Details</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className="input-field w-full min-h-[80px]"
                        placeholder="House number, street name, area..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="input-field w-full"
                          placeholder="e.g. Lahore"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="input-field w-full"
                          placeholder="e.g. 54000"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="glass-panel p-6 md:p-8 rounded-3xl mt-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-olive-green text-white flex items-center justify-center text-sm">2</div>
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {[
                    { id: 'cash_on_delivery', name: 'Cash on Delivery', icon: Truck },
                    { id: 'jazzcash', name: 'JazzCash', icon: Phone },
                    { id: 'easypaisa', name: 'EasyPaisa', icon: Phone },
                    { id: 'bank_transfer', name: 'Bank Transfer', icon: CreditCard },
                  ].map((method) => (
                    <div
                      key={method.id}
                      className={`relative rounded-xl border-2 transition-all duration-200 p-4 cursor-pointer hover:shadow-md ${formData.paymentMethod === method.id
                          ? 'border-olive-green bg-olive-green/5'
                          : 'border-gray-100 bg-white/50 hover:border-olive-green/30'
                        }`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method.id ? 'border-olive-green' : 'border-gray-300'
                          }`}>
                          {formData.paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-olive-green" />}
                        </div>
                        <method.icon className={`w-6 h-6 ${formData.paymentMethod === method.id ? 'text-olive-green' : 'text-gray-400'}`} />
                        <span className={`font-medium ${formData.paymentMethod === method.id ? 'text-gray-900' : 'text-gray-600'}`}>
                          {method.name}
                        </span>
                      </div>

                      {/* Payment Details Inputs */}
                      {formData.paymentMethod === method.id && method.id !== 'cash_on_delivery' && (
                        <div className="mt-4 pl-9 animate-slide-down">
                          {method.id === 'jazzcash' && (
                            <input
                              type="text"
                              name="jazzcashNumber"
                              value={formData.jazzcashNumber || ''}
                              onChange={handleInputChange}
                              placeholder="Enter JazzCash Mobile Number"
                              className="input-field w-full text-sm"
                              required
                              // Prevent form submission on click inside
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          {method.id === 'easypaisa' && (
                            <input
                              type="text"
                              name="easypaisaNumber"
                              value={formData.easypaisaNumber || ''}
                              onChange={handleInputChange}
                              placeholder="Enter EasyPaisa Mobile Number"
                              className="input-field w-full text-sm"
                              required
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          {method.id === 'bank_transfer' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                name="bankName"
                                value={formData.bankName || ''}
                                onChange={handleInputChange}
                                placeholder="Bank Name"
                                className="input-field w-full text-sm"
                                required
                              />
                              <input
                                type="text"
                                name="bankAccountNumber"
                                value={formData.bankAccountNumber || ''}
                                onChange={handleInputChange}
                                placeholder="Account Number (IBAN)"
                                className="input-field w-full text-sm"
                                required
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary (Right Column - 1/3 width, sticky) */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 rounded-3xl sticky top-24 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex gap-4 py-2">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-200 my-6 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                    <span>Total</span>
                    <span className="text-olive-green">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => document.getElementById('checkout-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                  disabled={loading}
                  className="w-full btn-primary py-4 rounded-xl text-lg shadow-xl shadow-olive-green/20 hover:shadow-olive-green/30 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'Processing...' : (
                      <>
                        Complete Order <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Secure 256-bit SSL Encrypted Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
