import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env'); process.exit(1);
}
mongoose.connect(MONGO_URI, { dbName: 'veg_mern_ready' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error:', err.message); process.exit(1); });
