// 模拟商品数据
export const mockProducts = Array.from({ length: 48 }, (_, index) => {
    // 确保有一些低价商品用于测试
    const price = index < 12 ?
        Math.floor(Math.random() * 300) + 50 : // 前12个商品价格在50-350之间
        Math.floor(Math.random() * 1000) + 100; // 其他商品价格在100-1100之间

    // 确保大部分商品有货，只有少部分缺货
    const inStock = Math.random() > 0.2; // 80%的商品有货

    // 修改商品名称格式：去掉空格
    const productName = `商品${index + 1}`;

    return {
        id: index + 1,
        name: productName, // 使用不带空格的名称
        price: price,
        originalPrice: price + Math.floor(Math.random() * 200) + 50,
        category: ['电子产品', '服装', '家居', '食品'][index % 4],
        brand: ['品牌A', '品牌B', '品牌C', '品牌D'][index % 4],
        image: `https://picsum.photos/200/200?random=${index + 1}`,
        description: `这是${productName}的详细描述，价格¥${price}。`,
        inStock: inStock, // 使用随机库存状态
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviewCount: Math.floor(Math.random() * 500),
        sales: Math.floor(Math.random() * 1000),
        tags: ['热销', '新品', '推荐'][Math.floor(Math.random() * 3)] ? ['热销', '新品', '推荐'][Math.floor(Math.random() * 3)] : '热销',
    };
});

// 模拟 API 响应（保持不变）
export const mockAPI = {
    getProducts: (params = {}) => {
        const {
            page = 1,
            limit = 12,
            category,
            brand,
            minPrice,
            maxPrice,
            inStock, // 注意：这里可能是 true, false, 或 undefined
            sort = 'default',
            search,
            feedSeed
        } = params;

        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredProducts = [...mockProducts];

                if (process.env.NODE_ENV !== 'production') {
                    console.log('筛选参数:', { minPrice, maxPrice, category, brand, inStock, search, feedSeed });
                }

                // 筛选逻辑
                if (category) {
                    filteredProducts = filteredProducts.filter(product => product.category === category);
                }

                if (brand) {
                    filteredProducts = filteredProducts.filter(product => product.brand === brand);
                }

                // 修复价格筛选逻辑
                if (minPrice !== undefined && minPrice !== null) {
                    filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
                }

                if (maxPrice !== undefined && maxPrice !== null) {
                    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
                }

                // 修复库存筛选逻辑：只有当 inStock 为 true 时才筛选有货商品
                // 如果 inStock 是 false 或 undefined，显示所有商品
                if (inStock === true) {
                    filteredProducts = filteredProducts.filter(product => product.inStock === true);
                }
                // 如果 inStock 是 false 或 undefined，不过滤库存状态

                if (search) {
                    filteredProducts = filteredProducts.filter(product =>
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase())
                    );
                }

                if (process.env.NODE_ENV !== 'production') {
                    console.log(`筛选后商品数量: ${filteredProducts.length}, 库存筛选: ${inStock}`);
                }

                // 排序逻辑
                switch (sort) {
                    case 'price_asc':
                        filteredProducts.sort((a, b) => a.price - b.price);
                        break;
                    case 'price_desc':
                        filteredProducts.sort((a, b) => b.price - a.price);
                        break;
                    case 'sales':
                        filteredProducts.sort((a, b) => b.sales - a.sales);
                        break;
                    case 'rating':
                        filteredProducts.sort((a, b) => b.rating - a.rating);
                        break;
                    default:
                        // 默认排序（新品优先）
                        filteredProducts.sort((a, b) => b.id - a.id);
                }

                if (typeof feedSeed === 'number') {
                    const rotateBy = filteredProducts.length > 0 ? ((feedSeed * limit) % filteredProducts.length) : 0;
                    if (rotateBy > 0) {
                        filteredProducts = [...filteredProducts.slice(rotateBy), ...filteredProducts.slice(0, rotateBy)];
                    }
                }

                // 分页逻辑
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

                resolve({
                    products: paginatedProducts,
                    total: filteredProducts.length,
                    page,
                    limit,
                    totalPages: Math.ceil(filteredProducts.length / limit)
                });
            }, 300); // 减少延迟以便更快看到效果
        });
    }
};
