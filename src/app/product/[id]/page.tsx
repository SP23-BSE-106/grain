'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star } from 'lucide-react';

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
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);
  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;
  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Image src={product.image} alt={product.name} width={500} height={500} className="w-full rounded" />
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-2">{product.category}</p>
          <div className="flex items-center mb-4">
            <Star className="text-yellow-500" size={20} />
            <span className="ml-2">{product.rating}</span>
          </div>
          <p className="text-2xl font-bold mb-4">${product.price}</p>
          <p className="mb-6">{product.description}</p>
          <button className="bg-olive-green text-white px-6 py-3 rounded hover:bg-wheat-brown transition">Add to Cart</button>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {product.reviews.map(review => (
          <div key={review._id} className="bg-beige p-4 rounded mb-4">
            <div className="flex items-center mb-2">
              <span className="font-semibold">{review.userId.name}</span>
              <div className="ml-4 flex">
                {Array.from({ length: review.rating }, (_, i) => (
                  <Star key={i} className="text-yellow-500" size={16} />
                ))}
              </div>
            </div>
            <p>{review.comment}</p>
            <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;