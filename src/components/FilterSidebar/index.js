import React from 'react';
import { Card, Slider, Checkbox, Divider, Input, Button, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../store/productSlice';

const { Text } = Typography;

const FilterSidebar = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector(state => state.products);

    const handlePriceChange = (value) => {
        dispatch(setFilters({ priceRange: value }));
    };

    const handleCategoryChange = (category) => {
        dispatch(setFilters({ category }));
    };

    const handleBrandChange = (brand) => {
        dispatch(setFilters({ brand }));
    };

    const handleStockChange = (e) => {
        dispatch(setFilters({ inStock: e.target.checked }));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    // 模拟分类和品牌数据
    const categories = ['电子产品', '服装', '家居', '食品'];
    const brands = ['品牌A', '品牌B', '品牌C', '品牌D'];

    // 计算当前价格范围内的商品数量（用于调试）
    const getPriceRangeInfo = () => {
        const [minPrice, maxPrice] = filters.priceRange;
        return `¥${minPrice} - ¥${maxPrice}`;
    };

    return (
        <Card
            title="商品筛选"
            size="small"
            extra={
                <Button type="link" size="small" onClick={handleClearFilters}>
                    清空
                </Button>
            }
            style={{ position: 'sticky', top: 84 }}
        >
            {/* 价格筛选 */}
            <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 12 }}>价格范围</h4>
                <Slider
                    range
                    min={0}
                    max={10000}
                    step={100}
                    marks={{ 0: '¥0', 10000: '¥10000' }}
                    value={filters.priceRange}
                    onChange={handlePriceChange}
                    tooltip={{ formatter: (value) => `¥${value}` }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                    {getPriceRangeInfo()}
                </div>
                {/* 添加调试信息 */}
                <div style={{ marginTop: 4, fontSize: 10, color: '#999' }}>
                    拖动滑块筛选指定价格区间的商品
                </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* 分类筛选 */}
            <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 12 }}>商品分类</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {categories.map(category => (
                        <Checkbox
                            key={category}
                            checked={filters.category === category}
                            onChange={() => handleCategoryChange(
                                filters.category === category ? '' : category
                            )}
                        >
                            {category}
                        </Checkbox>
                    ))}
                </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* 品牌筛选 */}
            <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 12 }}>品牌</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {brands.map(brand => (
                        <Checkbox
                            key={brand}
                            checked={filters.brand === brand}
                            onChange={() => handleBrandChange(
                                filters.brand === brand ? '' : brand
                            )}
                        >
                            {brand}
                        </Checkbox>
                    ))}
                </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* 库存筛选 */}
            <div>
                <Checkbox
                    checked={filters.inStock}
                    onChange={handleStockChange}
                >
                    仅显示有货
                </Checkbox>
            </div>
        </Card>
    );
};

export default React.memo(FilterSidebar);
