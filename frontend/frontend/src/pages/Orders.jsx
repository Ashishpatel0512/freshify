import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});

  // Load orders from API
  const loadOrders = () => {
    api
      .get('/orders/my')
      .then((r) => setOrders(r.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Toggle expand/collapse of order items
  const toggleExpand = (id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Calculate total saved dynamically whenever orders change
  const totalSaved = orders.reduce((sum, o) => {
    const subtotal = calculateTotal(o.items);
    const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
    return sum + discount;
  }, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">My Orders</h2>

      {/* Dynamic total saved banner */}
      {totalSaved > 0 && (
        <div className="mb-6 text-center bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold transition-all duration-300">
          🎉 You have saved ₹{totalSaved.toFixed(2)} so far!
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-gray-500 text-lg">You have no orders yet.</div>
      ) : (
        orders.map((o) => {
          const subtotal = calculateTotal(o.items);
          const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
          const total = subtotal - discount;

          return (
            <div
              key={o._id}
              className="bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => toggleExpand(o._id)}
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <strong className="text-lg">Order #{o._id}</strong>
                  <div className="text-sm text-gray-500">
                    Placed: {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                      o.status
                    )}`}
                  >
                    {o.status}
                  </span>
                  <span className="text-gray-400 text-xl">
                    {expandedOrders[o._id] ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {expandedOrders[o._id] && (
                <div className="mt-2">
                  <ul className="space-y-2">
                    {o.items.map((it, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between border-b border-gray-100 pb-1"
                      >
                        <span>{it.name}</span>
                        <span>
                          ₹{it.price} × {it.qty}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 text-right font-semibold text-gray-700">
                    <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
                    {discount > 0 && (
                      <div className="text-green-600">
                        Discount (10%): -₹{discount.toFixed(2)}
                      </div>
                    )}
                    <div
                      className={`inline-block px-3 py-1 rounded ${
                        discount > 0
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-800'
                      } text-lg font-bold`}
                    >
                      Total: ₹{total.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
