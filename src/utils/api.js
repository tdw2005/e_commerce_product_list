import axios from 'axios';
import { message } from 'antd';
import { mockAPI } from './mockData';

// 创建 axios 实例
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么，比如添加 token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加时间戳防止缓存
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now(),
            };
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log(`🚀 发送请求: ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`✅ 请求成功: ${response.config.url}`, response.data);
        }
        return response.data;
    },
    (error) => {
        if (process.env.NODE_ENV !== 'production') {
            console.error(`❌ 请求失败: ${error.config?.url}`, error.response?.data || error.message);
        }

        // 统一错误处理
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    message.error('登录已过期，请重新登录');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    message.error('没有权限访问该资源');
                    break;
                case 404:
                    message.error('请求的资源不存在');
                    break;
                case 500:
                    message.error('服务器内部错误');
                    break;
                default:
                    message.error(data?.message || '网络请求失败');
            }
        } else if (error.request) {
            // 网络错误，使用模拟数据
            if (process.env.NODE_ENV !== 'production') {
                console.log('🌐 网络错误，使用模拟数据');
            }
        } else {
            message.error('请求配置错误');
        }

        return Promise.reject(error);
    }
);

// 商品相关的 API 接口
export const productAPI = {
    // 获取商品列表 - 使用模拟数据
    getProducts: async (params = {}) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('API 请求参数:', params);
        }

        // 处理价格范围参数
        const processedParams = { ...params };

        // 将 priceRange 数组转换为 minPrice 和 maxPrice
        if (params.priceRange && Array.isArray(params.priceRange)) {
            const [minPrice, maxPrice] = params.priceRange;
            processedParams.minPrice = minPrice;
            processedParams.maxPrice = maxPrice;
            // 移除 priceRange 参数，避免传递给模拟数据
            delete processedParams.priceRange;
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('处理后的参数:', processedParams);
        }

        const useReal = process.env.REACT_APP_ENABLE_REAL_API === 'true';
        if (useReal) {
            try {
                const response = await api.get('/products', { params: processedParams });
                return response;
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('使用模拟数据获取商品列表');
                }
                return mockAPI.getProducts(processedParams);
            }
        } else {
            return mockAPI.getProducts(processedParams);
        }
    },

    // 获取商品详情 - 使用模拟数据
    getProductDetail: async (productId) => {
        const useReal = process.env.REACT_APP_ENABLE_REAL_API === 'true';
        if (useReal) {
            try {
                const response = await api.get(`/products/${productId}`);
                return response;
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('使用模拟数据获取商品详情');
                }
            }
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: productId,
                    name: `商品 ${productId}`,
                    price: Math.floor(Math.random() * 1000) + 100,
                    description: `这是商品 ${productId} 的详细描述`,
                    image: `https://picsum.photos/400/400?random=${productId}`,
                    category: ['电子产品', '服装', '家居', '食品'][productId % 4],
                    brand: ['品牌A', '品牌B', '品牌C', '品牌D'][productId % 4],
                    inStock: true,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    reviewCount: Math.floor(Math.random() * 500),
                });
            }, 300);
        });
    },

    // 获取商品分类 - 使用模拟数据
    getCategories: async () => {
        const useReal = process.env.REACT_APP_ENABLE_REAL_API === 'true';
        if (useReal) {
            try {
                const response = await api.get('/categories');
                return response;
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('使用模拟数据获取分类');
                }
            }
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(['电子产品', '服装', '家居', '食品']);
            }, 200);
        });
    },

    // 获取品牌列表 - 使用模拟数据
    getBrands: async () => {
        const useReal = process.env.REACT_APP_ENABLE_REAL_API === 'true';
        if (useReal) {
            try {
                const response = await api.get('/brands');
                return response;
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('使用模拟数据获取品牌');
                }
            }
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(['品牌A', '品牌B', '品牌C', '品牌D']);
            }, 200);
        });
    },

    // 搜索商品 - 使用模拟数据
    searchProducts: async (keyword, params = {}) => {
        const useReal = process.env.REACT_APP_ENABLE_REAL_API === 'true';
        if (useReal) {
            try {
                const response = await api.get('/products/search', {
                    params: {
                        q: keyword,
                        ...params,
                    },
                });
                return response;
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('使用模拟数据搜索商品');
                }
            }
        }
        return mockAPI.getProducts({ ...params, search: keyword });
    },
};

// 用户相关的 API 接口
export const userAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/user/profile'),
    updateProfile: (userData) => api.put('/user/profile', userData),
};

// 购物车相关的 API 接口
export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }),
    updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
    removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
    clearCart: () => api.delete('/cart'),
};

// 导出默认的 axios 实例，以便其他特殊请求使用
export default api;
