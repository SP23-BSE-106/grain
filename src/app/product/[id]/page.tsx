'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Truck, Shield, RefreshCw, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

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
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Client-side authentication check - wait for hydration
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
    if (product && product.category) {
      fetch(`/api/products?category=${encodeURIComponent(product.category)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const filtered = data.filter((p: Product) => p._id !== product._id).slice(0, 4);
            setRelatedProducts(filtered);
          } else {
            setRelatedProducts([]);
          }
        })
        .catch(() => {
          setRelatedProducts([]);
        });
    }
  }, [product]);

  if (loading) return (
    <div className="min-h-screen bg-beige flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
        <p className="text-gray-600">Loading product details...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-beige flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600">The product you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  const images = [product.image, product.image]; // Placeholder for multiple images

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const getImageSrc = (originalSrc: string, index: number) => {
    if (imageErrors.has(index)) {
      // Fallback images based on product name
      const fallbackImages: { [key: string]: string } = {
        'Brown Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnJvd24lMjBSaWNlfGVufDB8fDB8fHww',
        'Lentils': 'https://images.unsplash.com/photo-1515942400420-2b98fed1a518?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TGVudGlsa3xlbnwwfHwwfHx8MA%3D%3D',
        'Quinoa': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UXVpbm9hfGVufDB8fDB8fHww',
        'Chickpeas': 'https://images.unsplash.com/photo-1515548239417-3c3b713d10d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2hpY2twZWFzfGVufDB8fDB8fHww',
        'Oats': 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8T2F0c3xlbnwwfHwwfHx8MA%3D%3D'
      };
      return fallbackImages[product.name] || '/next.svg';
    }
    return originalSrc;
  };

  return (
    <div className="min-h-screen bg-beige">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8">
          <span>Home</span> / <span>Shop</span> / <span>{product.category}</span> / <span className="text-olive-green">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <Image
                src={getImageSrc(images[selectedImage], selectedImage) || '/next.svg'}
                alt={`Image of ${product.name}`}
                width={600}
                height={600}
                className="w-full h-96 object-cover rounded-lg"
                onError={() => handleImageError(selectedImage)}
              />
            </div>
            <div className="flex space-x-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-olive-green' : 'border-gray-200'
                  }`}
                >
                  <Image src={img || '/next.svg'} alt={`${product.name} ${index + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-olive-green font-medium mb-4">{product.category}</p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({product.rating}) • {product.reviews?.length || 0} reviews</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-gray-900 mb-6">${(product.price || 0).toFixed(2)}</div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock && product.stock > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Shield className="w-4 h-4 mr-1" />
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                <button className="flex-1 bg-olive-green text-white px-8 py-4 rounded-lg hover:bg-wheat-brown transition flex items-center justify-center font-semibold">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="w-5 h-5 mr-2 text-olive-green" />
                  Free Shipping
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-5 h-5 mr-2 text-olive-green" />
                  30-Day Return
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <RefreshCw className="w-5 h-5 mr-2 text-olive-green" />
                  Quality Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button className="px-6 py-4 text-olive-green border-b-2 border-olive-green font-medium">
                Description
              </button>
              <button className="px-6 py-4 text-gray-600 hover:text-olive-green transition">
                Nutritional Info
              </button>
              <button className="px-6 py-4 text-gray-600 hover:text-olive-green transition">
                Reviews ({product.reviews?.length || 0})
              </button>
            </nav>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold mb-4">Product Description</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Key Features</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-olive-green rounded-full mr-3"></span>
                      Premium quality grains
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-olive-green rounded-full mr-3"></span>
                      Organically grown
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-olive-green rounded-full mr-3"></span>
                      Rich in nutrients
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-olive-green rounded-full mr-3"></span>
                      Long shelf life
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Storage & Care</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-olive-green rounded-full mr-3"></span>
                      Store in cool, dry place
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-olive-green rounded-full mr-3"></span>
                      Keep away from moisture
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-olive-green rounded-full mr-3"></span>
                      Use within 6 months
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.reviews.map(review => (
                <div key={review._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-olive-green rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {review.userId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">{review.userId?.name}</span>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500">Be the first to review this product!</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct._id} href={`/product/${relatedProduct._id}`}>
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <Image
                      src={relatedProduct.image || '/next.svg'}
                      alt={`Image of ${relatedProduct.name}`}
                      width={200}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        // Simple fallback for related products
                        const fallbackImages: { [key: string]: string } = {
                          'Brown Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnJvd24lMjBSaWNlfGVufDB8fDB8fHww',
                          'Lentils': 'https://images.unsplash.com/photo-1515942400420-2b98fed1a518?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TGVudGlsa3xlbnwwfHwwfHx8MA%3D%3D',
                          'Quinoa': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UXVpbm9hfGVufDB8fDB8fHww',
                          'Chickpeas': 'https://images.unsplash.com/photo-1515548239417-3c3b713d10d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2hpY2twZWFzfGVufDB8fDB8fHww',
                          'Oats': 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8T2F0c3xlbnwwfHwwfHx8MA%3D%3D'
                        };
                        const img = e.target as HTMLImageElement;
                        img.src = fallbackImages[relatedProduct.name] || '/next.svg';
                      }}
                    />
                    <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                    <p className="text-olive-green font-medium">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No related products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
