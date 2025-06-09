import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],          // { productId, name, price, quantity } 배열
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, { payload }) {
      const found = state.items.find((i) => i.productId === payload.productId);
      if (found) found.quantity += payload.quantity;
      else state.items.push(payload);
    },
    updateQuantity(state, { payload: { productId, delta } }) {
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity += delta;
    },
    removeFromCart(state, { payload: productId }) {
      state.items = state.items.filter((i) => i.productId !== productId);
    },
    resetCart() {
      return initialState;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, resetCart } =
  cartSlice.actions;
export default cartSlice.reducer;
