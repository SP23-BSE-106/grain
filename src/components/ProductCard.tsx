'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { Star, Heart } from 'lucide-react';
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
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    // Add a brief animation or feedback here if desired
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 card-hover animate-fade-in focus-ring">
      <div className="relative">
        <Link href={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          />
        </Link>
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`}
          />
        </button>
      </div>
      <div className="mt-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-olive-green transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1">{product.category}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{product.rating}/5</span>
        </div>
        <p className="text-xl font-bold text-olive-green mt-2">${product.price.toFixed(2)}</p>
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full btn-primary focus-ring"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
