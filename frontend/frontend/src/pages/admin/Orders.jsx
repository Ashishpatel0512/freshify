import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All"); // 👈 filter state

  const loadOrders = () =>
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch(() => {});

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  const nextStatus = (status) =>
    status === 'Pending' ? 'Processing' : status === 'Processing' ? 'Delivered' : 'Delivered';

  // 👇 Filtered Orders
  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">All Orders</h2>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {["All", "Pending", "Processing", "Delivered"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded font-medium shadow transition 
              ${filter === f ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-gray-500">No {filter !== "All" ? filter : ""} orders found.</div>
      ) : (
        filteredOrders.map((o) => {
          const subtotal = o.items.reduce((sum, item) => sum + item.price * item.qty, 0);
          const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
          const total = subtotal - discount;

          return (
            <div
              key={o._id}
              className="bg-white shadow-lg rounded-lg p-5 mb-4 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              {/* User Info & Status */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <strong className="text-lg">{o.user?.name}</strong>
                  <div className="text-sm text-gray-500">{o.user?.email}</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    o.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : o.status === 'Processing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {o.status}
                </span>
              </div>

              {/* Items */}
              <div className="mt-2">
                <ul className="space-y-1">
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
              </div>

              {/* Subtotal, Discount & Total */}
              <div className="mt-3 text-right font-semibold text-lg space-y-1">
                <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
                {discount > 0 && (
                  <div className="text-green-600">
                    Discount (10%): -₹{discount.toFixed(2)}
                  </div>
                )}
                <div
                  className={`inline-block px-3 py-1 rounded ${
                    discount > 0 ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
                  } text-xl font-bold`}
                >
                  Total: ₹{total.toFixed(2)}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => updateStatus(o._id, nextStatus(o.status))}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Advance
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `http://localhost:5000/api/admin/orders/${o._id}/invoice`,
                      '_blank'
                    )
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Invoice
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
