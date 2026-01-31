'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { Star, Heart, ShoppingCart, Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/product/${product._id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to product page
    if (!user) {
      toast.error('Please login to continue');
      router.push('/login?redirect=/shop');
      return;
    }
    addItem(product);
    toast.success('Added to cart!');
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div
      className="group relative bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 mb-4 cursor-pointer" onClick={handleProductClick}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-all duration-200 z-10"
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`}
          />
        </button>

        {/* Quick Add Overlay */}
        <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-olive-green py-3 rounded-xl font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 hover:bg-olive-green hover:text-white"
          >
            <Plus className="w-5 h-5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div onClick={handleProductClick} className="cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-olive-green font-medium mb-1">{product.category}</p>
            <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-olive-green transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center bg-wheat-light/30 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 text-wheat-gold fill-current" />
            <span className="ml-1 text-sm font-semibold text-gray-700">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="md:hidden p-2 bg-olive-green text-white rounded-lg"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
