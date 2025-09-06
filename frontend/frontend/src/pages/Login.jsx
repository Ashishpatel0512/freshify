import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', { email, password })
      
      // Token save
      localStorage.setItem('token', data.token)

      // Role save
      localStorage.setItem('role', data.role)

      // पूरा user object भी save करना चाहो तो
      localStorage.setItem('user', JSON.stringify(data))

      nav('/')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/09a6d1e8-4ab5-4d70-ba0e-3f1d3d7e7478.jpg')",
      }}
    >
      {/* Attractive Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-emerald-800/60 to-green-600/60"></div>

      {/* Glassmorphism Form */}
      <form
        onSubmit={submit}
        className="relative z-10 bg-white/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-sm w-full border border-white/30"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          Welcome Back 👋
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="p-3 border border-white/40 bg-white/20 text-white placeholder-gray-200 rounded-lg w-full mb-3 focus:ring-2 focus:ring-green-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="p-3 border border-white/40 bg-white/20 text-white placeholder-gray-200 rounded-lg w-full mb-4 focus:ring-2 focus:ring-green-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition transform"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-200 mt-4">
          New here?{' '}
          <span className="text-green-300 font-semibold cursor-pointer hover:underline">
            Register
          </span>
        </p>
      </form>
    </div>
  )
}
