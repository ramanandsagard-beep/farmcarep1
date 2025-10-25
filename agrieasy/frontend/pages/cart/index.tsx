import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

interface CartItem {
  id: string;
  itemType: string;
  itemId: string;
  quantity: number;
  createdAt: string;
  product?: any; // Product details will be fetched separately
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const router = useRouter();

  const load = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api('/cart', {}, token);
      const cartItems = res || [];

      // Fetch product details for each cart item
      const enhancedItems = await Promise.all(
        cartItems.map(async (item: CartItem) => {
          try {
            let productRes;
            if (item.itemType === 'PRODUCE') {
              productRes = await api(`/produce/${item.itemId}`, {}, token);
            } else if (item.itemType === 'INPUT') {
              productRes = await api(`/inputs/${item.itemId}`, {}, token);
            } else {
              return item; // Return item without product details if type unknown
            }
            return { ...item, product: productRes };
          } catch (error) {
            console.error('Failed to fetch product details for', item.itemType, item.itemId, error);
            return item; // Return item without product details if fetch fails
          }
        })
      );

      setItems(enhancedItems);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    await api(`/cart/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity: newQuantity })
    }, token);
    load(); // Reload cart
  };

  const removeFromCart = async (itemId: string) => {
    await api(`/cart/${itemId}`, { method: 'DELETE' }, token);
    load(); // Reload cart
  };

  const checkout = async () => {
    if (!token) return alert('Login required');
    try {
      const order = await api('/orders/checkout', { method: 'POST' }, token);
      router.push(`/orders/${order.id}`);
    } catch (error) {
      alert('Failed to create order. Please try again.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
            <div className="bg-white p-8 rounded-lg shadow">
              <p className="text-gray-600 mb-4">Please login to view your cart.</p>
              <button
                onClick={() => router.push('/login')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white p-8 rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-2 text-gray-600">Start shopping to add items to your cart.</p>
              <button
                onClick={() => router.push('/produce')}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {item.product?.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product?.name || `${item.itemType} Item`}
                      </h3>
                      <p className="text-gray-600">
                        {item.product?.category && `Category: ${item.product.category}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Unit Price: ₹{parseFloat(item.product?.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{((parseFloat(item.product?.price) || 0) * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 text-sm hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Cart Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cart Summary</h3>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{items.reduce((total, item) => total + ((parseFloat(item.product?.price) || 0) * item.quantity), 0).toFixed(2)}
                </span>
              </div>
              <button
                onClick={checkout}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
