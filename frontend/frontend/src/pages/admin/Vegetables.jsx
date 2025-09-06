import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function Vegetables() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // For image preview
  const [editItem, setEditItem] = useState(null);

  const loadVegetables = () =>
    api
      .get('/vegetables')
      .then((res) => setItems(res.data))
      .catch(() => setItems([]));

  useEffect(() => {
    loadVegetables();
  }, []);

  const createVegetable = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('price', form.price);
    if (image) fd.append('image', image);

    await api.post('/vegetables', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setForm({ name: '', price: '' });
    setImage(null);
    setPreview(null);
    loadVegetables();
  };

  const removeVegetable = async (id) => {
    await api.delete(`/vegetables/${id}`);
    loadVegetables();
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setForm({ name: item.name, price: item.price });
    setPreview(item.image ? `http://localhost:5000/uploads/${item.image}` : null);
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(editItem?.image ? `http://localhost:5000/uploads/${editItem.image}` : null);
    }
  };

  const updateVegetable = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('price', form.price);
    if (image) fd.append('image', image);

    await api.put(`/vegetables/${editItem._id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setEditItem(null);
    setForm({ name: '', price: '' });
    setImage(null);
    setPreview(null);
    loadVegetables();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Vegetables</h2>

      {/* Add Vegetable Form */}
      <form
        onSubmit={createVegetable}
        className="bg-white shadow-lg rounded-lg p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="col-span-1 sm:col-span-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Add
        </button>
      </form>

      {/* Vegetables List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <div
            key={it._id}
            className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center hover:shadow-xl transition"
          >
            <div className="flex items-center gap-4">
              {it.image && (
                <img
                  src={`http://localhost:5000/uploads/${it.image}`}
                  alt={it.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{it.name}</h3>
                <p className="text-gray-500">₹{it.price}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(it)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => removeVegetable(it._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Vegetable</h3>
            <form onSubmit={updateVegetable} className="grid gap-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Price"
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="p-2 border rounded"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded mx-auto my-2 border"
                />
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
