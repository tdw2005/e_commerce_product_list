import React from 'react';
import { Layout, Row, Col } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer = () => {
    return (
        <AntFooter style={{
            textAlign: 'center',
            background: '#f0f2f5',
            borderTop: '1px solid #e8e8e8'
        }}>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <h4>客户服务</h4>
                    <div>帮助中心</div>
                    <div>联系我们</div>
                </Col>
                <Col span={8}>
                    <h4>关于我们</h4>
                    <div>公司介绍</div>
                    <div>招聘信息</div>
                </Col>
                <Col span={8}>
                    <h4>关注我们</h4>
                    <div>微信公众号</div>
                    <div>微博</div>
                </Col>
            </Row>
            <div style={{ marginTop: '24px', color: '#999' }}>
                © 2025 电商平台 版权所有
            </div>
        </AntFooter>
    );
};

export default Footer;