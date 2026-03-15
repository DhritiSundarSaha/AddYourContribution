'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Order = {
  _id: string;
  items: Array<{ productId: { name: string }; size: string; color: string }>;
  orderAssets: Array<{ designFile: string; mockupFile: string }>;
  shippingAddress: { fullName: string; line1: string; city: string; state: string; postalCode: string };
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api<Order[]>('/orders/admin').then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Order Panel</h1>
      {orders.map((order) => (
        <article key={order._id} className="card space-y-2">
          <h3>Order #{order._id.slice(-6)}</h3>
          {order.items.map((item, idx) => (
            <p key={idx}>{item.productId?.name} · {item.size} · {item.color}</p>
          ))}
          <p className="text-sm text-slate-300">
            {order.shippingAddress.fullName}, {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postalCode}
          </p>
          {order.orderAssets.map((asset, idx) => (
            <div key={idx} className="text-sm">
              <a className="text-indigo-300 underline" href={asset.designFile} target="_blank">Design file</a>
              {' · '}
              <a className="text-indigo-300 underline" href={asset.mockupFile} target="_blank">Mockup</a>
            </div>
          ))}
        </article>
      ))}
    </section>
  );
}
