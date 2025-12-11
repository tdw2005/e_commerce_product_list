import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider, Layout, Spin, App as AntdApp } from 'antd';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import store from './store';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const { Content } = Layout;

// 应用主题配置
const theme = {
    token: {
        colorPrimary: '#1890ff',
        borderRadius: 6,
        colorBgContainer: '#ffffff',
        colorBgLayout: '#f5f5f5',
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',Helvetica,Arial,sans-serif",
    },
    components: {
        Layout: {
            bodyBg: '#f5f5f5',
            headerBg: '#ffffff',
            footerBg: '#f0f2f5',
        },
        Card: {
            borderRadiusLG: 8,
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
        },
        Button: {
            borderRadius: 6,
        },
    },
};

function App() {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <ConfigProvider theme={theme}>
                    <AntdApp>
                    <Router>
                        <div className="App">
                            <Layout className="app-layout">
                                {/* 页面头部 */}
                                <Header />

                                {/* 主要内容区域 */}
                                <Content className="app-content">
                                    <React.Suspense fallback={
                                        <div className="loading-fallback">
                                            <Spin size="large" />
                                            <div style={{ marginTop: 8, color: '#999' }}>页面加载中...</div>
                                        </div>
                                    }>
                                        <Routes>
                                            <Route path="/" element={<ProductList />} />
                                            <Route path="/cart" element={<CartPage />} />
                                        </Routes>
                                    </React.Suspense>
                                </Content>

                                {/* 页面底部 */}
                                <Footer />
                            </Layout>
                        </div>
                    </Router>
                    </AntdApp>
                </ConfigProvider>
            </Provider>
        </ErrorBoundary>
    );
}

export default App;
