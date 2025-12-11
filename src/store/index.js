import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import userReducer from './userSlice';

// 创建并导出 store
const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        user: userReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;