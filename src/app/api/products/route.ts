import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    let query: any = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    const products = await Product.find(query).sort(sortOption);
    if (products.length === 0) {
      return NextResponse.json([
        {
          _id: '1',
          name: 'Organic Wheat',
          category: 'Whole Grains',
          price: 5.99,
          description: 'High-quality organic wheat grains.',
          image: '/placeholder.jpg',
          rating: 4.5,
          reviews: []
        },
        {
          _id: '2',
          name: 'Brown Rice',
          category: 'Whole Grains',
          price: 4.99,
          description: 'Nutritious brown rice.',
          image: '/placeholder.jpg',
          rating: 4.0,
          reviews: []
        },
        {
          _id: '3',
          name: 'Lentils',
          category: 'Pulses',
          price: 3.99,
          description: 'Protein-rich lentils.',
          image: '/placeholder.jpg',
          rating: 4.2,
          reviews: []
        },
        {
          _id: '4',
          name: 'Quinoa',
          category: 'Whole Grains',
          price: 7.99,
          description: 'Superfood quinoa.',
          image: '/placeholder.jpg',
          rating: 4.8,
          reviews: []
        },
        {
          _id: '5',
          name: 'Chickpeas',
          category: 'Pulses',
          price: 4.49,
          description: 'Versatile chickpeas.',
          image: '/placeholder.jpg',
          rating: 4.3,
          reviews: []
        }
      ]);
    }
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}