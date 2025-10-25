import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id || !token) return;
    api(`/orders/${id}`, {}, token).then(setOrder).catch(()=>setOrder(null));
  }, [id, token]);

  const pay = async () => {
    if (!token || !id) return;
    await api('/payments/mock', { method: 'POST', body: JSON.stringify({ orderId: id }) }, token);
    const updated = await api(`/orders/${id}`, {}, token);
    setOrder(updated);
    alert('Payment successful');
  };

  if (!id) return null;
  if (!token) return <div>Please login.</div>;
  if (!order) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Order #{order.id}</h1>
      <div>Status: {order.status}</div>
      <div>Total: ₹ {order.totalAmount}</div>
      {order.status === 'CREATED' && (
        <button onClick={pay} className="mt-4 bg-agrigreen text-white px-4 py-2 rounded">Pay Now</button>
      )}
    </div>
  );
}
