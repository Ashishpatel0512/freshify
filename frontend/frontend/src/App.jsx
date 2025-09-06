import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import Orders from './pages/Orders.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AdminVegetables from './pages/admin/Vegetables.jsx'
import AdminOrders from './pages/admin/Orders.jsx'
import AdminAnalytics from './pages/admin/Analytics.jsx'
import Navbar from './components/Navbar.jsx'
import { Cart } from './pages/Cart.jsx'
export default function App(){
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
          <Route path="/admin/vegetables" element={<AdminVegetables/>} />
          <Route path="/admin/orders" element={<AdminOrders/>} />
          <Route path="/admin/analytics" element={<AdminAnalytics/>} />
        </Routes>
      </div>
    </div>
  )
}
