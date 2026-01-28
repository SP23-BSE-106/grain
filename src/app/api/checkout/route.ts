import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
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

    const { items } = await request.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);

    // Create order
    const order = new Order({
      user: decoded.id,
      items: items.map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
      status: 'pending',
    });

    await order.save();

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
