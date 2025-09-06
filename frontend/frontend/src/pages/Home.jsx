import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard.jsx";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("name");

  useEffect(() => {
    api
      .get("/vegetables")
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  }, []);

  const filtered = items
    .filter((i) => i.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl font-extrabold text-green-800 mb-2">
          Fresh Vegetables Market
        </h1>
        <p className="text-gray-600 text-lg">
          Discover fresh & organic veggies delivered to your doorstep 🌱
        </p>
      </motion.div>

      {/* Search + Filter Bar */}
      <motion.div
        className="flex flex-col sm:flex-row items-center gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center w-full sm:flex-1 bg-white shadow-md rounded-xl px-4 py-2 border focus-within:ring-2 focus-within:ring-green-400">
          <Search className="text-gray-500 mr-2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search fresh vegetables..."
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-green-700" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 rounded-lg border shadow-sm bg-white focus:ring-2 focus:ring-green-400"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-6 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {filtered.map((it) => (
          <motion.div
            key={it._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <ProductCard item={it} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
