import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { remove, clear } from '../store/slices/cartSlice.js';
import api from '../api/axios';

export  function Cart() {
  const items = useSelector((s) => s.cart.items);
  const dispatch = useDispatch();

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const place = async () => {
    await api.post('/orders', {
      items: items.map((i) => ({ id: i.id, qty: i.qty })),
      subtotal,
      discount,
      total,
    });
    dispatch(clear());
    alert(
      `Order placed${discount > 0 ? ` with ₹${discount.toFixed(2)} discount!` : ''}`
    );
  };

  if (!items.length)
    return (
      <p className="text-center text-lg text-gray-600 mt-10">🛒 Your cart is empty</p>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🛍️ Your Cart</h2>

      {items.map((it) => (
        <div
          key={it.id}
          className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 border border-gray-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition"
        >
          <div>
            <strong className="text-gray-800">{it.name}</strong>
            <div className="text-sm text-gray-500">
              ₹{it.price} × {it.qty}
            </div>
          </div>

          <button
            className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition shadow-md"
            onClick={() => dispatch(remove(it.id))}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-6 border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Discount (10%):</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
            <div className="text-center text-green-700 font-medium">
              🎉 You got 10% discount for orders above ₹500!
            </div>
          </>
        )}

        <h3 className="text-lg font-semibold text-gray-800 flex justify-between">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </h3>

        <button
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow-lg hover:from-green-500 hover:to-emerald-600 transition"
          onClick={place}
        >
          ✅ Place Order (COD)
        </button>
      </div>
    </div>
  );
}  