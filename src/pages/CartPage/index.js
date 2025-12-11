import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Card, Table, Button, InputNumber, Space, Typography, Empty, Divider } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { removeFromCart, updateCartItemQuantity, clearCart } from '../../store/cartSlice';
import LazyImage from '../../components/LazyImage';

const { Title, Text } = Typography;
const { Content } = Layout;

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalCount, totalPrice } = useSelector(state => state.cart);

  const handleQuantityChange = (cartId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItemQuantity({ cartId, quantity }));
  };

  const handleRemoveItem = (cartId) => {
    dispatch(removeFromCart(cartId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    // 这里可以添加结算逻辑
    alert(`结算成功！总金额: ¥${totalPrice}`);
    dispatch(clearCart());
  };

  const handleBackToShopping = () => {
    navigate('/');
  };

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LazyImage 
            src={record.image} 
            alt={text}
            style={{ 
              width: 60, 
              height: 60, 
              objectFit: 'cover',
              marginRight: 12,
              borderRadius: 4
            }}
          />
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{text}</div>
            <div style={{ color: '#666', fontSize: 12 }}>
              {record.brand} · {record.category}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`,
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={99}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.cartId, value)}
          style={{ width: 80 }}
        />
      ),
      align: 'center',
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (_, record) => `¥${record.price * record.quantity}`,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.cartId)}
        >
          删除
        </Button>
      ),
      align: 'center',
    },
  ];

  if (items.length === 0) {
    return (
      <Layout style={{ minHeight: '60vh', background: '#f5f5f5' }}>
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Empty
            description="购物车为空"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={handleBackToShopping}>
              继续购物
            </Button>
          </Empty>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Space>
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={handleBackToShopping}
              >
                继续购物
              </Button>
              <Title level={2} style={{ margin: 0 }}>
                <ShoppingOutlined /> 购物车
              </Title>
            </Space>
            <Button danger onClick={handleClearCart}>
              清空购物车
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={items}
            rowKey="cartId"
            pagination={false}
            scroll={{ x: 800 }}
          />

          <Divider />

          <div style={{ textAlign: 'right', padding: '0 24px' }}>
            <Space size="large" direction="vertical" align="end">
              <div>
                <Text strong style={{ fontSize: 16 }}>
                  商品总数: {totalCount} 件
                </Text>
              </div>
              <div>
                <Text strong style={{ fontSize: 20, color: '#ff4d4f' }}>
                  总金额: ¥{totalPrice}
                </Text>
              </div>
              <Button 
                type="primary" 
                size="large" 
                style={{ width: 200, height: 50, fontSize: 16 }}
                onClick={handleCheckout}
              >
                立即结算
              </Button>
            </Space>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default CartPage;
