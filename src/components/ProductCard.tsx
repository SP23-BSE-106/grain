'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { Star } from 'lucide-react';

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
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.category}</p>
      <div className="flex items-center mt-1">
        <Star className="text-yellow-500" size={16} />
        <span className="ml-1">{product.rating}</span>
      </div>
      <p className="text-xl font-bold mt-2">${product.price}</p>
      <button onClick={() => addItem(product)} className="mt-2 bg-olive-green text-white px-4 py-2 rounded hover:bg-wheat-brown transition">Add to Cart</button>
    </div>
  );
};

export default ProductCard;