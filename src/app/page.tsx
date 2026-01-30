'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Star, Truck, Shield, Award, RefreshCw } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
}

const Home = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchProducts = (category = '') => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', '4');

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedProducts(data);
        } else {
          console.error('API returned non-array data:', data);
          setFeaturedProducts([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCategoryClick = (category: string) => {
    if (!user) {
      router.push('/login?redirect=/shop');
    } else {
      setSelectedCategory(category);
      fetchProducts(category);
    }
  };

  const handleShopAllClick = () => {
    if (!user) {
      router.push('/login?redirect=/shop');
    } else {
      router.push('/shop');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-olive-green/20 via-beige to-wheat-brown/10 min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grain-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            {user && (
              <div className="text-center mb-6">
                <p className="text-xl md:text-2xl text-olive-green font-medium">
                  Hello, {user.name}!
                </p>
              </div>
            )}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-olive-green leading-tight">
              Pure Grains,<br />
              <span className="text-wheat-brown">Honest Nutrition</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Discover the finest grains and pulses for a healthy lifestyle. Sourced from nature, delivered with care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="#categories" className="btn-outline text-lg px-8 py-4">
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 text-olive-green rotate-90" />
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="modern-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-olive-green mb-4 animate-float">Our Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Explore our wide range of premium grains and pulses, carefully selected for quality and nutrition.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button onClick={() => handleCategoryClick('Whole Grains')} className="group animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="modern-card">
                <div className="w-20 h-20 bg-gradient-to-br from-olive-green to-dark-green rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 animate-float">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-olive-green mb-4">Whole Grains</h3>
                <p className="text-gray-700 mb-4">Wheat, Rice, Oats, Quinoa, and more premium grains for your daily nutrition.</p>
                <span className="text-wheat-brown font-semibold group-hover:text-olive-green transition-colors duration-300 animate-shimmer">
                  Shop Whole Grains →
                </span>
              </div>
            </button>
            <button onClick={() => handleCategoryClick('Pulses')} className="group animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="modern-card">
                <div className="w-20 h-20 bg-gradient-to-br from-olive-green to-dark-green rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 animate-float">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-olive-green mb-4">Pulses (Dals)</h3>
                <p className="text-gray-700 mb-4">Lentils, Beans, Chickpeas, and other protein-rich pulses for balanced meals.</p>
                <span className="text-wheat-brown font-semibold group-hover:text-olive-green transition-colors duration-300 animate-shimmer">
                  Shop Pulses →
                </span>
              </div>
            </button>
            <button onClick={() => handleCategoryClick('Flours')} className="group animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="modern-card">
                <div className="w-20 h-20 bg-gradient-to-br from-olive-green to-dark-green rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 animate-float">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-olive-green mb-4">Flours</h3>
                <p className="text-gray-700 mb-4">Whole Wheat, Cornmeal, Rice Flour, and specialty flours for all your baking needs.</p>
                <span className="text-wheat-brown font-semibold group-hover:text-olive-green transition-colors duration-300 animate-shimmer">
                  Shop Flours →
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-beige">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-olive-green mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked selections from our finest collection. Fresh, organic, and ready to nourish your family.
              {selectedCategory && (
                <span className="block mt-2 text-olive-green font-medium">
                  Showing {selectedCategory} products
                </span>
              )}
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            {/* Shop button removed as per requirements */}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-olive-green mb-4">Why Choose GrainyMart?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the highest quality grains and pulses with exceptional service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-beige to-transparent card-hover">
              <div className="w-16 h-16 bg-olive-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-olive-green mb-4">100% Organic</h3>
              <p className="text-gray-700 leading-relaxed">
                Sourced from trusted organic farms with rigorous quality control and sustainable farming practices.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-beige to-transparent card-hover">
              <div className="w-16 h-16 bg-olive-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-olive-green mb-4">Fresh & Fast Delivery</h3>
              <p className="text-gray-700 leading-relaxed">
                Freshly harvested and delivered straight to your door with our reliable shipping partners.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-beige to-transparent card-hover">
              <div className="w-16 h-16 bg-olive-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-olive-green mb-4">Best Prices</h3>
              <p className="text-gray-700 leading-relaxed">
                Competitive prices without compromising on quality. Get the best value for your nutrition needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-olive-green via-olive-green/80 to-wheat-brown text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Healthy Journey?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust GrainyMart for their daily nutrition needs.
          </p>
          <div className="flex justify-center">
            <Link href="/signup" className="bg-white text-olive-green px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
