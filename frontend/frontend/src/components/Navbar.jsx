import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // role भी fetch कर रहे हैं

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // logout पर role भी हटाओ
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-green-600 font-bold shadow-lg"
          >
            V
          </motion.div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Freshify
            </h1>
            <p className="text-xs text-green-100">Fresh for hotels</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {/* Admin सिर्फ admin role वाले users को */}
          {token && role === "admin" && (
            <NavLink to="/admin/dashboard">Admin</NavLink>
          )}

          {/* Orders सभी logged-in users को */}
          {token && <NavLink to="/orders">Orders</NavLink>}

          <Link to="/cart" className="relative group">
            <ShoppingCart className="text-white group-hover:text-yellow-300 transition" size={22} />
            <span className="absolute -top-2 -right-2 bg-amber-400 text-green-900 text-xs w-5 h-5 flex items-center justify-center rounded-full shadow font-bold">
              2
            </span>
          </Link>

          {/* Auth Buttons */}
          {!token ? (
            <>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white hover:text-yellow-300 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

/* Custom NavLink with underline animation */
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="relative text-sm font-medium text-white hover:text-yellow-300 transition group"
    >
      {children}
      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-300 transition-all group-hover:w-full"></span>
    </Link>
  );
}
