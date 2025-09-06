import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Vegetable from './models/Vegetable.js';
import './config/db.js';

const create = async () => {
  try {
    // remove existing
    await User.deleteMany({});
    await Vegetable.deleteMany({});

    // create admin
    const admin = await User.create({ name: 'Admin', email: 'admin@veg.com', password: 'admin123', role: 'admin' });
    console.log('Admin created:', admin.email, 'password: admin123');

    // sample vegetables
    const vegs = [
      { name: 'Potato', price: 30 },
      { name: 'Onion', price: 40 },
      { name: 'Tomato', price: 35 },
      { name: 'Spinach', price: 20 }
    ];
    await Vegetable.insertMany(vegs);
    console.log('Sample vegetables inserted');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

create();
