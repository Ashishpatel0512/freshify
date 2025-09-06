import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  vegetable: { type: mongoose.Schema.Types.ObjectId, ref: 'Vegetable', required: true },
  name: String,
  price: Number,
  qty: { type: Number, required: true, min: 1 }
}, { _id: false });

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },         // Location name / address label
  latitude: { type: Number, required: true },     // Geo latitude
  longitude: { type: Number, required: true }     // Geo longitude
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Pending', 'Processing', 'Delivered'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
  location: { type: locationSchema, required: true }   // ✅ Added Location info
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
