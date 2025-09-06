# Vegetable Business MERN Website

## Setup Instructions

### Backend
```bash
cd backend
cp .env.sample .env   # update MONGO_URI and JWT_SECRET
npm install
npm run seed          # create default admin user
npm run dev
```

### Frontend
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```

### Default Admin Credentials
- Email: admin@veg.com
- Password: admin123

Backend runs on **http://localhost:5000**  
Frontend runs on **http://localhost:5173**
