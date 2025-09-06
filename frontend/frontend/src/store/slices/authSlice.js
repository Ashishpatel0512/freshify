import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({ name: 'auth', initialState: { user: JSON.parse(localStorage.getItem('user')||'null') }, reducers: { setUser(s,a){ s.user=a.payload; localStorage.setItem('user', JSON.stringify(a.payload)) }, logout(s){ s.user=null; localStorage.removeItem('user'); localStorage.removeItem('token'); } } });
export const { setUser, logout } = slice.actions;
export default slice.reducer;
