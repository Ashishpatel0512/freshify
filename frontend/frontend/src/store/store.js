import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice.js';
import cart from './slices/cartSlice.js';
export const store = configureStore({ reducer: { auth, cart } });
