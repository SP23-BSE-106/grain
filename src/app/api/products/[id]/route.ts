import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const product = await Product.findById(id).populate('reviews');
    if (!product) {
      // Return sample if not found
      if (id === '1') {
        return NextResponse.json({
          _id: '1',
          name: 'Organic Wheat',
          category: 'Whole Grains',
          price: 5.99,
          description: 'High-quality organic wheat grains.',
          image: '/next.svg',
          rating: 4.5,
          reviews: []
        });
      }
      // Add for others
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { name, category, price, description, image, stock } = body;
    if (!name || !category || !price || !description || !image || stock === undefined) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, price, description, image, stock },
      { new: true }
    );
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
