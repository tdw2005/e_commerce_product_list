import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: (() => {
      try {
        const raw = localStorage.getItem('cart_items');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })(),
    totalCount: (() => {
      try {
        const raw = localStorage.getItem('cart_items');
        const items = raw ? JSON.parse(raw) : [];
        return items.reduce((total, item) => total + item.quantity, 0);
      } catch {
        return 0;
      }
    })(),
    totalPrice: (() => {
      try {
        const raw = localStorage.getItem('cart_items');
        const items = raw ? JSON.parse(raw) : [];
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      } catch {
        return 0;
      }
    })()
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          ...product,
          quantity: quantity,
          cartId: Date.now() + Math.random() // ����ΨһID
        });
      }
      
      // �������������ܼ۸�
      state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      try {
        localStorage.setItem('cart_items', JSON.stringify(state.items));
      } catch {}
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.cartId !== itemId);
      
      // �������������ܼ۸�
      state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      try {
        localStorage.setItem('cart_items', JSON.stringify(state.items));
      } catch {}
    },
    updateCartItemQuantity: (state, action) => {
      const { cartId, quantity } = action.payload;
      const item = state.items.find(item => item.cartId === cartId);
      
      if (item) {
        item.quantity = quantity;
        
        // �������������ܼ۸�
        state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        try {
          localStorage.setItem('cart_items', JSON.stringify(state.items));
        } catch {}
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.totalPrice = 0;
      try {
        localStorage.removeItem('cart_items');
      } catch {}
    }
  }
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
