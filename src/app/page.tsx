'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Star, Truck, Shield, Award, CheckCircle } from 'lucide-react';

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

  const fetchProducts = () => {
    setLoading(true);
    // Fetch random products for featured section
    fetch(`/api/products?limit=4`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedProducts(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/shop?category=${category}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 lg:pt-0">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-beige-bg">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-olive-light/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 animate-float" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-wheat-gold/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container-custom relative z-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {user && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-olive-green/10 rounded-full text-olive-green font-medium mb-6 animate-fade-up">
                  <span className="w-2 h-2 bg-olive-green rounded-full animate-pulse" />
                  Welcome back, {user.name.split(' ')[0]}
                </div>
              )}

              <h1 className="text-5xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <span className="heading-gradient">Pure Grains</span>
                <br />
                <span className="text-gray-900">Honest Nutrition.</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
                Experience the finest collection of organic grains and pulses. Sourced responsibly from nature to your kitchen for a healthier lifestyle.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <Link href="/shop" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group text-lg px-8 py-4 shadow-xl shadow-olive-green/20">
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#categories" className="btn-secondary w-full sm:w-auto text-lg px-8 py-4">
                  Explore Categories
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative order-1 lg:order-2 animate-fade-left">
              <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1000"
                  alt="Premium Organic Grains Bowl"
                  className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="absolute -bottom-6 -left-6 glass-panel p-6 rounded-2xl shadow-xl animate-float lg:block hidden" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-olive-green rounded-full flex items-center justify-center text-white">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Premium Quality</div>
                    <div className="text-sm text-gray-500">Certified Organic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity hidden lg:block">
          <ArrowRight className="w-6 h-6 rotate-90 text-gray-400" />
        </div>
      </section>

      {/* Stats Section (Glassmorphism) */}
      <section className="relative z-20 -mt-20 container-custom">
        <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {[
              { label: 'Organic Products', value: '100%', icon: CheckCircle },
              { label: 'Happy Customers', value: '10k+', icon: Star },
              { label: 'Fast Delivery', value: '24h', icon: Truck },
            ].map((stat, idx) => (
              <div key={idx} className="text-center pt-8 md:pt-0 first:pt-0">
                <stat.icon className="w-8 h-8 mx-auto text-olive-green mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Curated Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore our wide range of premium products, carefully selected for superior quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Whole Grains', icon: '🌾', desc: 'Premium wheat, rice, and quinoa', color: 'from-olive-green to-[#3A4A1F]' },
              { name: 'Pulses', icon: '🥜', desc: 'Protein-rich lentils and beans', color: 'from-[#8FBC8F] to-[#556B2F]' },
              { name: 'Flours', icon: '🥣', desc: 'Freshly ground organic flours', color: 'from-wheat-gold to-[#B8860B]' },
            ].map((cat, idx) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative h-80 rounded-3xl overflow-hidden hover-lift"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center text-white">
                  <span className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                  <h3 className="text-3xl font-bold mb-2">{cat.name}</h3>
                  <p className="text-white/90 text-lg mb-6">{cat.desc}</p>
                  <span className="inline-flex items-center gap-2 font-semibold border-b-2 border-white/0 group-hover:border-white transition-all">
                    Browse Collection <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">Trending Now</h2>
              <p className="text-gray-600 text-lg">Our most loved products this week.</p>
            </div>
            <Link href="/shop" className="btn-secondary flex items-center gap-2">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-olive-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-beige-bg relative overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gray-200 overflow-hidden relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
                  alt="Quality Grains"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-wheat-gold/20 rounded-full blur-3xl z-0" />
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-olive-green/20 rounded-full blur-3xl z-0" />
            </div>

            <div className="pl-0 md:pl-12">
              <div className="inline-block px-4 py-1 bg-olive-green/10 text-olive-green rounded-full text-sm font-bold tracking-wide uppercase mb-6">
                Why Choose Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Quality You Can Taste, <br />Trust You Can Feel.</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We believe in the power of pure, unadulterated food. Our commitment to quality ensures that every grain you buy is packed with nutrition and free from harmful chemicals.
              </p>

              <ul className="space-y-6">
                {[
                  { title: '100% Organic', desc: 'Certified organic products from trusted farms.' },
                  { title: 'Farm to Table', desc: 'Direct sourcing ensures maximum freshness.' },
                  { title: 'Sustainable', desc: 'Eco-friendly packaging and farming practices.' },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 text-olive-green">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container-custom">
        <div className="relative rounded-[3rem] overflow-hidden bg-olive-green px-6 py-20 md:p-24 text-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Diet?</h2>
            <p className="text-white/80 text-xl mb-10">Start your journey towards a healthier lifestyle with our premium grain collection.</p>
            <Link href="/signup" className="inline-block bg-white text-olive-green px-10 py-5 rounded-2xl font-bold text-lg hover:bg-wheat-light hover:scale-105 transition-all duration-300 shadow-xl">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
