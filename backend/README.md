Veg MERN Backend - Ready

## Quick start

1. Copy env
   cp .env.sample .env
   Edit .env (MONGO_URI, JWT_SECRET)

2. Install & run
   npm install
   npm run seed    # creates admin@veg.com / admin123 and sample vegetables
   npm run dev

3. API
   - POST /api/auth/register { name, email, password, hotelName }
   - POST /api/auth/login { email, password }
   - GET /api/vegetables
   - POST /api/vegetables (admin, multipart/form-data) { name, price, image }
   - POST /api/orders (user) { items: [{ id, qty }] }
   - GET /api/admin/orders/analytics (admin)
   - GET /api/admin/orders/:id/invoice (protected)
