import fs from 'fs';
import path from 'path';
import os from 'os';

export interface OrderRecord {
  orderId: string;
  invoiceNo: string;
  siteId: string;
  siteSlug: string;
  siteName: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  planTier: string;
  planName: string;
  amount: number;
  subtotal: number;
  gst: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  paidAt: string;
  subscriptionEndsAt: string;
  isAutoPay?: boolean;
  createdAt: string;
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

function getOrdersFilePath(): string {
  if (isServerless) {
    const tmpFile = path.join(os.tmpdir(), 'orders.json');
    if (!fs.existsSync(tmpFile)) {
      const candidates = [
        path.join(process.cwd(), 'data', 'orders.json'),
        path.join(process.cwd(), 'Linkal Tool', 'data', 'orders.json'),
      ];
      for (const c of candidates) {
        if (fs.existsSync(c)) {
          try {
            fs.writeFileSync(tmpFile, fs.readFileSync(c, 'utf-8'), 'utf-8');
            break;
          } catch {}
        }
      }
    }
    return tmpFile;
  }

  const candidates = [
    path.join(process.cwd(), 'data', 'orders.json'),
    path.join(process.cwd(), 'Linkal Tool', 'data', 'orders.json'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }

  if (fs.existsSync(path.join(process.cwd(), 'Linkal Tool'))) {
    return path.join(process.cwd(), 'Linkal Tool', 'data', 'orders.json');
  }
  return path.join(process.cwd(), 'data', 'orders.json');
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  try {
    const filePath = getOrdersFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('[Orders] Read error:', err);
  }
  return [];
}

export async function saveOrder(order: OrderRecord): Promise<OrderRecord> {
  const orders = await getAllOrders();
  const existingIdx = orders.findIndex((o) => o.orderId === order.orderId);

  if (existingIdx >= 0) {
    orders[existingIdx] = { ...orders[existingIdx], ...order };
  } else {
    orders.unshift(order);
  }

  try {
    const filePath = getOrdersFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Orders] Write error:', err);
  }

  return order;
}

export async function getOrdersBySite(siteIdOrSlug: string): Promise<OrderRecord[]> {
  const orders = await getAllOrders();
  const clean = siteIdOrSlug.toLowerCase().trim();
  return orders.filter(
    (o) => o.siteId === siteIdOrSlug || o.siteSlug.toLowerCase() === clean
  );
}

export async function getOrdersByUser(email: string): Promise<OrderRecord[]> {
  const orders = await getAllOrders();
  const cleanEmail = email.toLowerCase().trim();
  return orders.filter((o) => (o.userEmail || '').toLowerCase().trim() === cleanEmail);
}

