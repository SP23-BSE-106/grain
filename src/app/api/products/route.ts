import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';



export async function GET(request: NextRequest) {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database successfully');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    const limit = searchParams.get('limit');

    let query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }

    let sortOption: any = {};
    if (sort === 'price_asc') {
      sortOption.price = 1;
    } else if (sort === 'price_desc') {
      sortOption.price = -1;
    } else if (sort === 'rating') {
      sortOption.rating = -1;
    }

    console.log('Query:', query);
    console.log('Sort option:', sortOption);
    console.log('Limit:', limit);

    let productsQuery = Product.find(query).sort(sortOption);
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    let products = await productsQuery;

    console.log('Found products:', products.length);
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
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
