import { createClient } from '@libsql/client/web';

interface Env {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderRequest {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  notes?: string;
}

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) {
    return json({ success: false, error: 'Order service is not configured.' }, 503);
  }

  let body: OrderRequest;
  try {
    body = await request.json() as OrderRequest;
  } catch {
    return json({ success: false, error: 'Request body must be valid JSON.' }, 400);
  }

  const orderId = `ORD-${crypto.randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`;
  const client = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

  try {
    await client.execute({
      sql: `INSERT INTO orders
        (id, customer_name, customer_phone, customer_address, items, total, notes, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      args: [
        orderId,
        body.customerName.trim(),
        body.customerPhone.trim(),
        body.customerAddress.trim(),
        JSON.stringify(body.items),
        body.total,
        typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : '',
        'pending',
      ],
    });
    return json({ success: true, orderId });
  } catch (error) {
    return json({ success: false, error: 'We could not save your order. Please try again shortly.' }, 500);
  } finally {
    client.close();
  }
};
