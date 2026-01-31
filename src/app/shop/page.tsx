'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Search, Filter, SortAsc, RefreshCw, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
}

const Shop = () => {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Whole Grains', 'Pulses', 'Flours'];

  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/login?redirect=/shop');
    }
  }, [isHydrated, user, router]);

  useEffect(() => {
    const category = searchParams.get('category');
    setSelectedCategory(category || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeSearchTerm) params.append('search', activeSearchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sort', sortBy);

      fetch(`/api/products?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchProducts();
  }, [activeSearchTerm, selectedCategory, minPrice, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
  };

  return (
    <div className="min-h-screen bg-beige-bg pb-20 pt-[73px]">
      {/* Header */}
      <div className="bg-olive-green text-white py-12 md:py-16 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.05)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        <div className="container-custom relative z-10 text-center animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Shop Collection</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto font-light">
            Discover our premium selection of organic grains, sourced for quality and nutrition.
          </p>
        </div>
      </div>

      <div className="container-custom relative z-20">
        {/* Search & Filter Bar */}
        <div className="glass-panel p-4 md:p-6 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for grains, pulses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setActiveSearchTerm(searchTerm)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all placeholder-gray-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setActiveSearchTerm(searchTerm)}
                className="btn-primary py-3 px-8 whitespace-nowrap flex-1 md:flex-none justify-center"
              >
                Search
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all flex-1 md:flex-none ${showFilters
                    ? 'bg-olive-green text-white shadow-lg shadow-olive-green/20'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="md:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[500px] opacity-100 mt-6 pt-6 border-t border-gray-200/50' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20 cursor-pointer hover:border-olive-green/30 transition-colors"
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Price Range */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20"
                    />
                  </div>
                  <span className="text-gray-400 font-medium">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20"
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sort By</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20 cursor-pointer hover:border-olive-green/30 transition-colors"
                  >
                    <option value="">Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <SortAsc className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200/50">
              <span className="text-sm text-gray-500 font-medium">
                Showing {products.length} results
              </span>
              <button
                onClick={clearFilters}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" /> Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-3xl animate-fade-in">
            <div className="w-24 h-24 bg-olive-green/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-olive-green/50" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No grains found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find matches for your current filters. Try adjusting your search, category, or price range.</p>
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-stagger-fade">
            {products.map((product) => (
              <div key={product._id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-beige-bg" />}>
      <Shop />
    </Suspense>
  );
}

export default ShopPage;
