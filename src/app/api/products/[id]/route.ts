import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const product = await Product.findById(params.id).populate('reviews');
    if (!product) {
      // Return sample if not found
      if (params.id === '1') {
        return NextResponse.json({
          _id: '1',
          name: 'Organic Wheat',
          category: 'Whole Grains',
          price: 5.99,
          description: 'High-quality organic wheat grains.',
          image: '/placeholder.jpg',
          rating: 4.5,
          reviews: []
        });
      }
      // Add for others
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}