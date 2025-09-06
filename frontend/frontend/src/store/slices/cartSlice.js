import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "cart",
  initialState: { items: JSON.parse(localStorage.getItem("cart") || "[]") },
  reducers: {
    add(s, a) {
      const it = a.payload;
      const idx = s.items.findIndex((x) => x.id === it.id);
      if (idx >= 0) s.items[idx].qty += it.qty || 1;
      else s.items.push(it);
      localStorage.setItem("cart", JSON.stringify(s.items));
    },
    decrease(s, a) {
      const idx = s.items.findIndex((x) => x.id === a.payload);
      if (idx >= 0) {
        if (s.items[idx].qty > 1) s.items[idx].qty -= 1;
        else s.items.splice(idx, 1); // remove if qty = 1
      }
      localStorage.setItem("cart", JSON.stringify(s.items));
    },
    remove(s, a) {
      s.items = s.items.filter((x) => x.id !== a.payload);
      localStorage.setItem("cart", JSON.stringify(s.items));
    },
    clear(s) {
      s.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { add, decrease, remove, clear } = slice.actions;
export default slice.reducer;
