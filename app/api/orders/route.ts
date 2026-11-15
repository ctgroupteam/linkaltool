import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, getOrdersBySite, getOrdersByUser } from '@/lib/orders';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const site = searchParams.get('site');
    const user = searchParams.get('user');

    if (site) {
      const orders = await getOrdersBySite(site);
      return NextResponse.json({ success: true, orders });
    }

    if (user) {
      const orders = await getOrdersByUser(user);
      return NextResponse.json({ success: true, orders });
    }

    const all = await getAllOrders();
    return NextResponse.json({ success: true, orders: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

