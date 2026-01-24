import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import mongoose from 'mongoose';

const defaultProducts = [
  {
    name: 'Organic Wheat',
    category: 'Whole Grains',
    price: 5.99,
    description: 'High-quality organic wheat grains.',
    image: '/placeholder.jpg',
    rating: 4.5,
    stock: 100,
    reviews: []
  },
  {
    name: 'Brown Rice',
    category: 'Whole Grains',
    price: 4.99,
    description: 'Nutritious brown rice.',
    image: '/placeholder.jpg',
    rating: 4.0,
    stock: 100,
    reviews: []
  },
  {
    name: 'Lentils',
    category: 'Pulses',
    price: 3.99,
    description: 'Protein-rich lentils.',
    image: '/placeholder.jpg',
    rating: 4.2,
    stock: 100,
    reviews: []
  },
  {
    name: 'Quinoa',
    category: 'Whole Grains',
    price: 7.99,
    description: 'Superfood quinoa.',
    image: '/placeholder.jpg',
    rating: 4.8,
    stock: 100,
    reviews: []
  },
  {
    name: 'Chickpeas',
    category: 'Pulses',
    price: 4.49,
    description: 'Versatile chickpeas.',
    image: '/placeholder.jpg',
    rating: 4.3,
    stock: 100,
    reviews: []
  },
  {
    name: 'Barley',
    category: 'Whole Grains',
    price: 4.99,
    description: 'Nutritious barley grains.',
    image: '/placeholder.jpg',
    rating: 4.1,
    stock: 100,
    reviews: []
  },
  {
    name: 'Black Beans',
    category: 'Pulses',
    price: 5.49,
    description: 'Rich and flavorful black beans.',
    image: '/placeholder.jpg',
    rating: 4.4,
    stock: 100,
    reviews: []
  },
  {
    name: 'Oats',
    category: 'Whole Grains',
    price: 3.49,
    description: 'Healthy rolled oats.',
    image: '/placeholder.jpg',
    rating: 4.6,
    stock: 100,
    reviews: []
  }
];

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    let products = await Product.find();
    if (products.length === 0) {
      await Product.insertMany(defaultProducts);
      products = await Product.find();
    }
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
    const filteredProducts = await Product.find(query).sort(sortOption);
    return NextResponse.json(filteredProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, category, price, description, image, rating, stock } = body;
    if (!name || !category || !price || !description || !image || rating === undefined || stock === undefined) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const newProduct = new Product({
      name,
      category,
      price,
      description,
      image,
      rating,
      stock,
      reviews: []
    });
    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
