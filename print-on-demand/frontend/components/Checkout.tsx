'use client';

import { api } from '@/lib/api';
import { useAppStore } from '@/store/useStore';

export function Checkout() {
  const cart = useAppStore((state) => state.cart);
  const clearCart = useAppStore((state) => state.clearCart);

  const total = cart.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);

  const placeOrder = async () => {
    const order = await api<{ _id: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: cart.map((item) => ({
          productId: item.product._id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          designId: item.designId
        })),
        amount: total,
        shippingAddress: {
          fullName: 'Demo Customer',
          line1: 'Street 1',
          city: 'Mumbai',
          state: 'MH',
          postalCode: '400001',
          phone: '9999999999'
        }
      })
    });

    await api(`/orders/${order._id}/confirm-upi`, {
      method: 'POST',
      body: JSON.stringify({
        upiTransactionId: 'UPI-DEMO-123',
        designDataUrl: '',
        mockupDataUrl: ''
      })
    });

    clearCart();
    alert('Order placed and payment confirmed.');
  };

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-semibold">Checkout (Manual UPI)</h2>
        <p className="text-sm text-slate-300">Pay using UPI ID: pod-store@upi and submit transaction ID.</p>
      </div>

      {cart.map((item, idx) => (
        <div key={idx} className="card flex items-center justify-between">
          <div>
            <p>{item.product.name}</p>
            <p className="text-sm text-slate-300">{item.size} · {item.color} · Qty {item.quantity}</p>
          </div>
          <p>₹{item.product.basePrice * item.quantity}</p>
        </div>
      ))}

      <div className="card flex items-center justify-between">
        <p>Total</p>
        <p>₹{total}</p>
      </div>
      <button className="rounded bg-green-500 px-4 py-2" onClick={placeOrder} disabled={!cart.length}>Place Order</button>
    </section>
  );
}
