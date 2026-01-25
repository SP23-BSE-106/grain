import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

const defaultProducts = [
  {
    name: 'Organic Wheat',
    category: 'Whole Grains',
    price: 5.99,
    description: 'High-quality organic wheat grains.',
    image: '/next.svg',
    rating: 4.5,
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
    return NextResponse.json(products);
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
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
