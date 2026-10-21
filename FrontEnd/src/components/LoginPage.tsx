import React, { useState } from 'react';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { AuthAPI, tokenStorage } from '../services/api';
import type { User } from '../types/transaction';
import { colors } from '../theme';
import { Logo } from './Logo';

const { Title, Text } = Typography;

interface LoginPageProps {
  onLogin: (user: User) => void;
}

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async ({ email, password }: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await AuthAPI.login(email, password);
      tokenStorage.set(token);
      onLogin(user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: `radial-gradient(circle at 20% 10%, #e0e7ff 0, transparent 45%),
          radial-gradient(circle at 85% 90%, #ede9fe 0, transparent 40%), ${colors.page}`,
      }}
    >
      <Card
        variant="borderless"
        style={{ width: '100%', maxWidth: 400, boxShadow: '0 10px 30px rgba(17, 24, 39, 0.08)' }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <Logo size={48} />
          <Title level={3} style={{ margin: '16px 0 4px' }}>
            Welcome back
          </Title>
          <Text type="secondary">Sign in to your expense diary</Text>
        </div>

        {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}

        <Form<LoginForm> layout="vertical" onFinish={handleFinish} requiredMark={false} size="large">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined style={{ color: '#9ca3af' }} />} placeholder="you@example.com" autoComplete="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading} style={{ marginTop: 4 }}>
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
};
