'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Truck, Shield, RefreshCw, Heart, ShoppingCart, Plus, Minus, ArrowLeft, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  userId: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews: Review[];
  stock?: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { user, isHydrated } = useAuthStore();
  const { addItem, saveCart } = useCartStore();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/login?redirect=' + encodeURIComponent(`/product/${id}`));
    }
  }, [isHydrated, user, router, id]);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      fetch(`/api/products?category=${encodeURIComponent(product.category)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRelatedProducts(data.filter((p: Product) => p._id !== product._id).slice(0, 4));
          }
        })
        .catch(() => setRelatedProducts([]));
    }
  }, [product]);

  if (loading) return (
    <div className="min-h-screen bg-beige-bg flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-olive-green border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-beige-bg flex items-center justify-center">
      <div className="glass-panel p-8 rounded-2xl text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <Link href="/shop" className="btn-primary">Return to Shop</Link>
      </div>
    </div>
  );

  const images = [product.image, product.image, product.image]; // Mock multiple images for gallery effect

  const handleAddToCart = async () => {
    if (!product || !user) {
      if (!user) {
        toast.error('Please login to continue');
        router.push('/login?redirect=' + encodeURIComponent(`/product/${id}`));
      }
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
    await saveCart(user.id);
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-beige-bg pb-20 pt-20">
      <div className="container-custom">
        {/* Breadcrumb */}
        <Link href="/shop" className="inline-flex items-center text-gray-500 hover:text-olive-green mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 animate-fade-up">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl hover-lift">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                onError={() => setImageErrors(prev => new Set(prev).add(selectedImage))}
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all ${selectedImage === idx ? 'ring-2 ring-olive-green ring-offset-2' : 'opacity-70 hover:opacity-100'
                    }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-olive-green font-medium mb-3">
                <span className="px-3 py-1 bg-olive-green/10 rounded-full text-sm">{product.category}</span>
                {product.stock && product.stock > 0 && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <Check className="w-3 h-3" /> In Stock
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-display">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center bg-yellow-400/10 px-3 py-1 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="ml-2 font-bold text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600 underline cursor-pointer hover:text-olive-green">{product.reviews?.length || 0} reviews</span>
              </div>

              <div className="text-4xl font-bold text-olive-green mb-8">${product.price.toFixed(2)}</div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">{product.description}</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center gap-4 bg-white rounded-xl p-1 border border-gray-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 text-lg shadow-xl shadow-olive-green/20"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button className="p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'On orders over $50' },
                { icon: Shield, label: 'Quality Guarantee', sub: '100% Organic' },
                { icon: RefreshCw, label: 'Easy Returns', sub: '30 Day Policy' },
              ].map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-gray-100">
                  <feat.icon className="w-6 h-6 mx-auto text-olive-green mb-2" />
                  <div className="font-semibold text-sm text-gray-900">{feat.label}</div>
                  <div className="text-xs text-gray-500">{feat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="glass-panel rounded-3xl overflow-hidden mb-20 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-5 font-semibold text-lg transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-olive-green' : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-olive-green rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-12 bg-white/50">
            {activeTab === 'description' ? (
              <div className="prose max-w-none text-gray-600">
                <p>{product.description}</p>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Nutritional Benefits</h4>
                    <ul className="space-y-2">
                      {['Rich in antioxidants', 'High fiber content', 'Essential minerals', 'No preservatives'].map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-olive-green" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {product.reviews?.length > 0 ? (
                  product.reviews.map(review => (
                    <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-olive-green/10 flex items-center justify-center font-bold text-olive-green">
                            {review.userId?.name?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{review.userId?.name}</div>
                            <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">No reviews yet. Be the first to review!</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <Link key={p._id} href={`/product/${p._id}`} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
                    <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                  <div className="text-olive-green font-bold">${p.price.toFixed(2)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
