import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    let token = request.cookies.get('accessToken')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { items, billingInfo } = await request.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!billingInfo) {
      return NextResponse.json({ error: 'Billing information is required' }, { status: 400 });
    }

    // Check stock and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      let product;
      try {
        product = await Product.findOne({ _id: new mongoose.Types.ObjectId(item.product._id) });
      } catch {
        // If _id is not a valid ObjectId, try finding by name
        product = await Product.findOne({ name: item.product.name });
      }
      if (!product) {
        return NextResponse.json({ error: `Product ${item.product.name} not found` }, { status: 404 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
      total += product.price * item.quantity;
    }

    // Create order
    const order = new Order({
      user: decoded.id,
      items: orderItems,
      total,
      status: billingInfo.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      billingInfo,
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: decoded.id }, { items: [] });

    // Simulate payment processing (mock)
    // In a real implementation, you would integrate with a payment provider available in your region
    // For now, we'll simulate a successful payment

    // Generate a mock session ID
    const mockSessionId = `mock_session_${Date.now()}`;

    return NextResponse.json({
      url: `${request.nextUrl.origin}/checkout/success?session_id=${mockSessionId}`,
      mock: true // Indicate this is a mock payment
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
