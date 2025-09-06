import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add, decrease } from "../store/slices/cartSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function ProductCard({ item }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const [cartTotal, setCartTotal] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const audioRef = useRef(null);

  const cartItem = cart.find((c) => c.id === item._id);
  const qty = cartItem ? cartItem.qty : 0;
  const totalPrice = cartItem ? cartItem.qty * item.price : 0;

  useEffect(() => {
    const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
    setCartTotal(total);

    const alreadyShown = localStorage.getItem("congratsShown");

    // Trigger when total crosses 500+ for the first time
    if (total >= 500 && !alreadyShown) {
      setShowCongrats(true);
      localStorage.setItem("congratsShown", "true");

      // Hindi voice
      const utterance = new SpeechSynthesisUtterance(
        "बधाई हो! आपने 500 रुपये का ऑर्डर पूरा किया और 10% छूट पा ली!"
      );
      utterance.lang = "hi-IN";
      window.speechSynthesis.speak(utterance);

      // Optional: audio file
      audioRef.current = new Audio("/congrats.mp3");
      audioRef.current.play();

      // Auto hide popup after 4 seconds
      const timer = setTimeout(() => {
        setShowCongrats(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }, 4000);

      return () => clearTimeout(timer);
    }

    // Reset localStorage flag if total drops below 500
    if (total < 500 && alreadyShown) {
      localStorage.removeItem("congratsShown");
    }
  }, [cart]);

  const handleAdd = () => {
    dispatch(add({ id: item._id, name: item.name, price: item.price, qty: 1 }));
  };

  const handleRemove = () => {
    if (cartItem) {
      dispatch(decrease(cartItem.id));
    }
  };

  const minimumOrder = 500;
  const discountPercent = 10;
  const remaining = cartTotal < minimumOrder ? minimumOrder - cartTotal : 0;
  const discountedTotal =
    cartTotal >= minimumOrder ? cartTotal * (1 - discountPercent / 100) : cartTotal;

  return (
    <>
      {/* Product Card */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden flex flex-col relative"
      >
        {/* Image */}
        {item.imageUrl ? (
          <div className="overflow-hidden relative">
            <img
              src={
                item.imageUrl.startsWith("http")
                  ? item.imageUrl
                  : `http://localhost:5000${item.imageUrl}`
              }
              alt={item.name}
              className="w-full h-48 object-cover transform hover:scale-110 transition duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
            <p className="text-green-600 font-bold text-lg">₹{item.price}</p>
          </div>

          {/* Add/Remove Controls */}
          <div className="mt-4 flex items-center justify-between bg-gray-100 p-2 rounded-xl">
            <button
              onClick={handleRemove}
              className="bg-red-500 text-white p-1 rounded-full disabled:opacity-50"
              disabled={qty === 0}
            >
              <Minus size={16} />
            </button>
            <span className="font-medium">
              {qty} item{qty !== 1 ? "s" : ""} - ₹{totalPrice}
            </span>
            <button
              onClick={handleAdd}
              className="bg-green-500 text-white p-1 rounded-full"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Discount / minimum order */}
          <div className="mt-3 p-3 rounded-lg bg-yellow-100 text-yellow-800 font-medium text-sm">
            {cartTotal < minimumOrder ? (
              <p>
                और ₹{remaining} जोड़ें और 10% छूट पाएं! न्यूनतम ऑर्डर ₹{minimumOrder}.
              </p>
            ) : (
              <p>
                आपको {discountPercent}% छूट मिली! कुल: ₹{discountedTotal.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Full-page Hindi Congrats Popup */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center pointer-events-auto">
              <h2 className="text-5xl font-bold text-pink-500 mb-4">🎉 बधाई हो! 🎉</h2>
              <p className="text-lg text-gray-700">
                आपका ऑर्डर ₹500+ हो गया है और आपको 10% छूट मिल गई है!
              </p>

              {/* Confetti + flowers animation */}
              {[...Array(50)].map((_, i) => {
                const startX = Math.random() * window.innerWidth;
                const delay = Math.random() * 0.5;
                const duration = 2 + Math.random() * 2;
                const rotate = Math.random() * 360;
                const rotateDirection = Math.random() > 0.5 ? 360 : -360;
                const emoji = Math.random() > 0.5 ? "🌸" : "🎉";

                return (
                  <motion.div
                    key={i}
                    initial={{ y: -50, x: startX, opacity: 1, rotate: rotate }}
                    animate={{
                      y: window.innerHeight + 50,
                      opacity: 0,
                      rotate: rotate + rotateDirection,
                    }}
                    transition={{ duration: duration, delay: delay }}
                    className="absolute text-2xl"
                  >
                    {emoji}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
