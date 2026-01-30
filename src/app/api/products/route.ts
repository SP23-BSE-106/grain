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

    // Fix image URLs that are still using shorturl.at
    const imageUpdates = {
      'Brown Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnJvd24lMjBSaWNlfGVufDB8fDB8fHww',
      'Lentils': 'https://images.unsplash.com/photo-1552585960-0e1069ce7405?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVudGlsc3xlbnwwfHwwfHx8MA%3D%3D',
      'Quinoa': 'https://plus.unsplash.com/premium_photo-1705207702015-0c1f567a14df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UXVpbm9hfGVufDB8fDB8fHww',
      'Chickpeas': 'https://images.unsplash.com/photo-1515548239417-3c3b713d10d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2hpY2twZWFzfGVufDB8fDB8fHww',
      'Oats': 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8T2F0c3xlbnwwfHwwfHx8MA%3D%3D'
    };

    products = products.map(product => {
      if (product.image && product.image.includes('shorturl.at')) {
        product.image = imageUpdates[product.name as keyof typeof imageUpdates] || product.image;
      }
      return product;
    });

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

    // Check if this is an update images request
    if (body.action === 'updateImages') {
      const imageUpdates = {
        'Brown Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnJvd24lMjBSaWNlfGVufDB8fDB8fHww',
        'Lentils': 'https://images.unsplash.com/photo-1552585960-0e1069ce7405?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVudGlsc3xlbnwwfHwwfHx8MA%3D%3D',
        'Quinoa': 'https://plus.unsplash.com/premium_photo-1705207702015-0c1f567a14df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UXVpbm9hfGVufDB8fDB8fHww',
        'Chickpeas': 'https://images.unsplash.com/photo-1644432757699-bb5a01e8fb0e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2hpY2twZWFzfGVufDB8fDB8fHww',
        'Oats': 'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b2F0c3xlbnwwfHwwfHx8MA%3D%3D'
      };

      const results = [];
      for (const [name, image] of Object.entries(imageUpdates)) {
        const result = await Product.updateOne({ name }, { image });
        results.push({ name, updated: result.modifiedCount > 0 });
      }

      return NextResponse.json({ message: 'Images updated', results });
    }

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
