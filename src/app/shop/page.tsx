'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Search, Filter, SortAsc, RefreshCw } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
}

const Shop = () => {
  const { user, isHydrated, token } = useAuthStore();
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
    if (!isHydrated) return;
    if (!user) {
      if (token) {
        // Verify the token from the store
        fetch('/api/verifyToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.valid) {
              useAuthStore.getState().login(data.user, token);
            } else {
              router.push('/login');
            }
          })
          .catch(() => router.push('/login'));
      } else {
        router.push('/login');
      }
    }
  }, [isHydrated, user, token, router]);

  // Initialize state from URL parameters
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
          setProducts(data);
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

  if (loading) return (
    <div className="min-h-screen bg-beige">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-olive-green mb-8">Shop Our Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-beige">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-olive-green mb-8">Shop Our Products</h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 flex">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={() => setActiveSearchTerm(searchTerm)}
                className="px-4 py-3 bg-olive-green text-white rounded-r-lg hover:bg-wheat-brown transition"
              >
                Search
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SortAsc className="text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Sort by</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-olive-green text-white rounded-lg hover:bg-wheat-brown transition"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent bg-white text-gray-900"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {products.length} product{products.length !== 1 ? 's' : ''} found
            {selectedCategory && (
              <span className="ml-2 text-olive-green font-medium">
                in {selectedCategory}
              </span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-olive-green text-white rounded-lg hover:bg-wheat-brown transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Shop />
    </Suspense>
  );
}

export default ShopPage;
