import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const { productId, rating, comment } = await request.json();
    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const review = new Review({ userId: user.id, productId, rating, comment });
    await review.save();
    await Product.findByIdAndUpdate(productId, { $push: { reviews: review._id } });
    const reviews = await Review.find({ productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avgRating });
    return NextResponse.json({ message: 'Review added successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}