import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../../store/userSlice';

const { TabPane } = Tabs;

const LoginModal = ({ visible, onCancel }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [activeTab, setActiveTab] = useState('login');
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();

    const handleLogin = async (values) => {
        try {
            const result = dispatch(login(values));
            if (result && result.error) {
                message.error('Login failed');
            } else {
                message.success('Login successful!');
                onCancel();
                loginForm.resetFields();
            }
        } catch (error) {
            message.error('Login failed');
        }
    };

    const handleRegister = async (values) => {
        try {
            if (values.password !== values.confirmPassword) {
                message.error('Passwords do not match');
                return;
            }

            dispatch(register(values));
            message.success('Registration successful! Please login');
            setActiveTab('login');
            registerForm.resetFields();
        } catch (error) {
            message.error(error.message || 'Registration failed');
        }
    };

    return (
        <Modal
            title="Login / Register"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            style={{
                top: '50%',
                transform: 'translateY(-50%)',
            }}
            styles={{
                body: {
                    height: '600px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
            destroyOnHidden
        >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    style={{ flex: 1 }}
                    items={[
                        {
                            key: 'login',
                            label: 'Login',
                            children: (
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Form
                                        form={loginForm}
                                        onFinish={handleLogin}
                                        style={{ flex: 1 }}
                                    >
                                        <Form.Item
                                            name="username"
                                            rules={[{ required: true, message: 'Please input username!' }]}
                                        >
                                            <Input
                                                prefix={<UserOutlined />}
                                                placeholder="Username"
                                                size="large"
                                                style={{ height: '50px', fontSize: '16px' }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            rules={[{ required: true, message: 'Please input password!' }]}
                                        >
                                            <Input.Password
                                                prefix={<LockOutlined />}
                                                placeholder="Password"
                                                size="large"
                                                style={{ height: '50px', fontSize: '16px' }}
                                            />
                                        </Form.Item>
                                        <Form.Item style={{ marginTop: 'auto' }}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                size="large"
                                                style={{
                                                    width: '100%',
                                                    height: '50px',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Login
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                    <div style={{
                                        textAlign: 'center',
                                        color: '#999',
                                        fontSize: '16px',
                                        marginTop: '20px',
                                        padding: '20px',
                                        borderTop: '1px solid #f0f0f0'
                                    }}>
                                        <p style={{ margin: '8px 0', fontSize: '18px' }}>Test accounts:</p>
                                        <p style={{ margin: '8px 0', fontSize: '16px' }}>admin / 123456</p>
                                        <p style={{ margin: '8px 0', fontSize: '16px' }}>user1 / 123456</p>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            key: 'register',
                            label: 'Register',
                            children: (
                                <Form
                                    form={registerForm}
                                    onFinish={handleRegister}
                                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <Form.Item
                                        name="username"
                                        rules={[{ required: true, message: 'Please input username!' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Username"
                                            size="large"
                                            style={{ height: '50px', fontSize: '16px' }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please input email!' },
                                            { type: 'email', message: 'Please input valid email!' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<MailOutlined />}
                                            placeholder="Email"
                                            size="large"
                                            style={{ height: '50px', fontSize: '16px' }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: 'Please input password!' }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Password"
                                            size="large"
                                            style={{ height: '50px', fontSize: '16px' }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirmPassword"
                                        rules={[{ required: true, message: 'Please confirm password!' }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Confirm Password"
                                            size="large"
                                            style={{ height: '50px', fontSize: '16px' }}
                                        />
                                    </Form.Item>
                                    <Form.Item style={{ marginTop: 'auto' }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            style={{
                                                width: '100%',
                                                height: '50px',
                                                fontSize: '18px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Register
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                    ]}
                />
            </div>
        </Modal>
    );
};

export default LoginModal;
