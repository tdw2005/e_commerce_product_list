import React, { useState } from 'react';
import { Card, Tag, Rate, Button, Badge, message, Tooltip, Modal, InputNumber, Space, Divider } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import LazyImage from '../LazyImage';

const { Meta } = Card;

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const [qtyModalOpen, setQtyModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const quickOptions = [1, 2, 3, 5, 10];

    const {
        name,
        price,
        originalPrice,
        image,
        rating,
        reviewCount,
        sales,
        inStock,
        tags,
        category,
        brand
    } = product;

    const unitPrice = Number(price) || 0;
    const totalPrice = Math.max(1, quantity) * unitPrice;

    const discount = originalPrice && originalPrice > price
        ? Math.round((1 - price / originalPrice) * 100)
        : 0;

    const handleAddToCartClick = (e) => {
        e.stopPropagation();
        if (!inStock) {
            message.warning('该商品暂时缺货');
            return;
        }
        setQuantity(1);
        setQtyModalOpen(true);
    };

    const handleConfirmAddToCart = () => {
        dispatch(addToCart({ product, quantity }));
        setQtyModalOpen(false);
        message.success('已添加到购物车');
    };

    const handleAddToWishlist = (e) => {
        e.stopPropagation();
        message.info('已添加到收藏夹');
    };

    return (
        <Badge.Ribbon
            text={tags}
            color={inStock ? 'blue' : 'red'}
            style={{ display: tags ? 'block' : 'none' }}
        >
            <Card
                hoverable
                cover={
                    <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                        <LazyImage
                            alt={name}
                            src={image}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                            }}
                        />
                        {discount > 0 && (
                            <Tag
                                color="red"
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    fontWeight: 'bold'
                                }}
                            >
                                {discount}% OFF
                            </Tag>
                        )}
                        {!inStock && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: 16
                                }}
                            >
                                缺货
                            </div>
                        )}
                    </div>
                }
                actions={[
                    <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        disabled={!inStock}
                        onClick={handleAddToCartClick}
                        aria-label="加入购物车"
                    >
                        加入购物车
                    </Button>,
                    <Tooltip title="收藏">
                      <Button
                          type="text"
                          icon={<HeartOutlined />}
                          onClick={handleAddToWishlist}
                          aria-label="添加到收藏夹"
                      />
                    </Tooltip>
                ]}
                styles={{ body: { padding: '12px' } }}
                style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'box-shadow .2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)'; }}
            >
                <Meta
                    title={
                        <div style={{
                            fontSize: 14,
                            fontWeight: 500,
                            height: 40,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {name}
                        </div>
                    }
                    description={
                        <div>
                            {/* 品牌和分类 */}
                            <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
                                {brand} · {category}
                            </div>

                            {/* 评分 */}
                            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                                <Rate
                                    disabled
                                    defaultValue={parseFloat(rating)}
                                    style={{ fontSize: 12 }}
                                />
                                <span style={{ marginLeft: 4, fontSize: 12, color: '#999' }}>
                                    {rating} ({reviewCount})
                                </span>
                            </div>

                            {/* 价格 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}>
                                        ¥{price}
                                    </span>
                                    {originalPrice && originalPrice > price && (
                                        <span style={{
                                            fontSize: 12,
                                            color: '#999',
                                            textDecoration: 'line-through',
                                            marginLeft: 8
                                        }}>
                                            ¥{originalPrice}
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: 12, color: '#999' }}>
                                    销量: {sales}
                                </div>
                            </div>
                        </div>
                    }
                />
            </Card>
            <Modal
                title="选择数量"
                open={qtyModalOpen}
                onCancel={() => setQtyModalOpen(false)}
                destroyOnHidden
                styles={{
                    body: {
                        paddingTop: 8
                    }
                }}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#666' }}>合计：<span style={{ color: '#ff4d4f', fontWeight: 600 }}>¥{totalPrice}</span></div>
                        <Space>
                            <Button onClick={() => setQtyModalOpen(false)}>取消</Button>
                            <Button type="primary" onClick={handleConfirmAddToCart}>加入购物车</Button>
                        </Space>
                    </div>
                }
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                        src={image}
                        alt={name}
                        style={{ width: 56, height: 56, borderRadius: 6, objectFit: 'cover', border: '1px solid #f0f0f0' }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4, lineHeight: '20px' }}>{name}</div>
                        <div style={{ color: '#999', fontSize: 12 }}>{brand} · {category}</div>
                    </div>
                    <div style={{ color: '#ff4d4f', fontWeight: 700 }}>¥{price}</div>
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: '#666' }}>数量</span>
                        <InputNumber 
                            min={1} 
                            max={99} 
                            value={quantity} 
                            onChange={(val) => setQuantity(Math.max(1, val || 1))}
                            size="large"
                            style={{ width: 120 }}
                        />
                    </div>
                    <Space wrap>
                        {quickOptions.map(q => (
                            <Button key={q} size="small" onClick={() => setQuantity(q)} type={quantity === q ? 'primary' : 'default'}>
                                x{q}
                            </Button>
                        ))}
                    </Space>
                </div>
            </Modal>
        </Badge.Ribbon>
    );
};

export default React.memo(ProductCard);
