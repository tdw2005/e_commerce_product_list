import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../utils/api';

// 异步获取商品列表
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params, { getState, rejectWithValue }) => {
        try {
            const state = getState().products;
            const key = JSON.stringify(params);
            if (state.cache[key]) {
                return state.cache[key];
            }
            const response = await productAPI.getProducts(params);
            return response;
        } catch (error) {
            const mockResponse = await productAPI.getProducts(params);
            return mockResponse;
        }
    }
);

export const prefetchProducts = createAsyncThunk(
    'products/prefetchProducts',
    async (params) => {
        const response = await productAPI.getProducts(params);
        return response;
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
        cache: {},
        hasMore: true,
        filters: {
            category: '',
            priceRange: [0, 10000],
            brand: '',
            inStock: false, // 这里改为 false，默认显示所有商品
            search: ''
        },
        sort: 'default',
        feedSeed: 0,
        pagination: {
            current: 1,
            pageSize: 12,
            total: 0
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.current = 1; // 重置页码
            state.hasMore = true;
        },
        setSort: (state, action) => {
            state.sort = action.payload;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                category: '',
                priceRange: [0, 10000],
                brand: '',
                inStock: false, // 这里也改为 false
                search: ''
            };
            state.pagination.current = 1;
            state.hasMore = true;
        },
        refreshFeed: (state) => {
            state.feedSeed += 1;
            state.pagination.current = 1;
            state.hasMore = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                const page = action.meta.arg?.page || 1;
                if (page > 1) {
                    state.items = state.items.concat(action.payload.products || []);
                } else {
                    state.items = action.payload.products;
                }
                state.pagination.total = action.payload.total;
                const loadedCount = state.pagination.current * state.pagination.pageSize;
                state.hasMore = loadedCount < state.pagination.total && (action.payload.products || []).length > 0;
                const key = JSON.stringify(action.meta.arg);
                state.cache[key] = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(prefetchProducts.fulfilled, (state, action) => {
                const key = JSON.stringify(action.meta.arg);
                state.cache[key] = action.payload;
            });
    }
});

export const { setFilters, setSort, setPagination, clearFilters, refreshFeed } = productSlice.actions;
export default productSlice.reducer;
