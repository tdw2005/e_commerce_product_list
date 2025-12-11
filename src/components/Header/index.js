import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Input, Button, Space, Badge, message, Dropdown } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../store/productSlice';
import { logout } from '../../store/userSlice';
import LoginModal from '../LoginModal';

const { Header: AntHeader } = Layout;

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const cart = useSelector(state => state.cart);
    const user = useSelector(state => state.user);
    const [searchValue, setSearchValue] = useState('');
    const [loginModalVisible, setLoginModalVisible] = useState(false);

    const handleSearch = (value) => {
        
        // 如果在购物车页面，先跳转到首页
        if (location.pathname !== '/') {
            navigate('/');
            // 延迟设置搜索条件，确保页面已经跳转
            setTimeout(() => {
                dispatch(setFilters({ search: value }));
            }, 100);
        } else {
            dispatch(setFilters({ search: value }));
        }

        if (value) {
            message.info(`搜索: ${value}`);
        }
    };

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleLoginClick = () => {
        setLoginModalVisible(true);
    };

    const handleLogout = () => {
        dispatch(logout());
        message.success('Logged out');
    };

    const userMenuItems = [
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            onClick: handleLogout
        }
    ];

    return (
        <>
            <AntHeader style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '0 24px',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                {/* Logo */}
                <div
                    style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }}
                    onClick={handleLogoClick}
                >
                    电商平台
                </div>

                {/* 搜索框 */}
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <Space.Compact style={{ width: '100%' }}>
                        <Input
                            placeholder="搜索商品..."
                            size="large"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onPressEnter={() => handleSearch(searchValue)}
                        />
                        <Button
                            type="primary"
                            size="large"
                            icon={<SearchOutlined />}
                            onClick={() => handleSearch(searchValue)}
                        />
                    </Space.Compact>
                </div>

                {/* 用户操作 */}
                <Space size="middle">
                    {user.isLoggedIn ? (
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <Button type="text" icon={<UserOutlined />}>
                                {user.userInfo?.username}
                            </Button>
                        </Dropdown>
                    ) : (
                        <Button type="text" icon={<UserOutlined />} onClick={handleLoginClick}>
                            登录
                        </Button>
                    )}
                    <Badge count={cart.totalCount} size="small" showZero={false}>
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined />}
                            onClick={handleCartClick}
                        />
                    </Badge>
                </Space>
            </AntHeader>

            <LoginModal
                visible={loginModalVisible}
                onCancel={() => setLoginModalVisible(false)}
            />
        </>
    );
};

export default Header;
