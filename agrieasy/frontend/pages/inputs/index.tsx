import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

interface InputProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  supplierId: string;
}

export default function InputsPage() {
  const [items, setItems] = useState<InputProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await api('/inputs');
      setItems(res || []);
    } catch (error) {
      console.error('Failed to load inputs:', error);
      setItems([]);
    }
    setLoading(false);
  };

  const addToCart = async (id: string, name: string) => {
    if (!token) {
      router.push('/login');
      return;
    }

    setAddingToCart(id);
    try {
      await api('/cart', {
        method: 'POST',
        body: JSON.stringify({ itemType: 'INPUT', itemId: id, quantity: 1 })
      }, token);
      alert(`✅ Added ${name} to cart!`);
    } catch (error) {
      alert('❌ Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'FERTILIZER':
        return 'bg-blue-100 text-blue-800';
      case 'PESTICIDE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agricultural Inputs</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium fertilizers, pesticides, and farming supplies from trusted suppliers.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading agricultural inputs...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white p-8 rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No inputs available</h3>
              <p className="mt-2 text-gray-600">Check back later for farming supplies from our suppliers.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                      <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                      </svg>
                    </div>
                  )}

                  {/* Stock Badge */}
                  <div className="absolute top-3 right-3">
                    {item.stock > 50 ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        In Stock
                      </span>
                    ) : item.stock > 10 ? (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{item.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      per unit
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      Stock: {item.stock} units
                    </span>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-gray-500">(4.7)</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(item.id, item.name)}
                    disabled={item.stock === 0 || addingToCart === item.id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      item.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : addingToCart === item.id
                        ? 'bg-green-600 text-white animate-pulse'
                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {item.stock === 0 ? (
                      'Out of Stock'
                    ) : addingToCart === item.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
                        </svg>
                        Add to Cart
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
