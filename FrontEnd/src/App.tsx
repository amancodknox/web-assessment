import React, { useEffect, useState } from 'react';
import {
  App as AntdApp,
  Avatar,
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  Grid,
  Layout,
  Space,
  Spin,
  Typography,
} from 'antd';
import { DownOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import type { Categories, Transaction, TransactionFilters, TransactionInput, User } from './types/transaction';
import { AuthAPI, TransactionAPI, setUnauthorizedHandler, tokenStorage } from './services/api';
import { FilterBar } from './components/FilterBar';
import { LoginPage } from './components/LoginPage';
import { Logo } from './components/Logo';
import { TransactionModal } from './components/TransactionModal';
import { TransactionTable } from './components/TransactionTable';
import { colors, theme } from './theme';
import { initials } from './utils/format';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const CONTAINER: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', width: '100%' };

const DEFAULT_FILTERS: TransactionFilters = {
  type: 'all',
  search: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

const Dashboard: React.FC = () => {
  const { message, notification } = AntdApp.useApp();
  const screens = Grid.useBreakpoint();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categories>({ income: [], expense: [] });
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Transaction | null>(null);

  useEffect(() => {
    TransactionAPI.categories()
      .then(setCategories)
      .catch((err: Error) => notification.error({ title: 'Failed to load categories', description: err.message }));
  }, [notification]);

  useEffect(() => {
    let cancelled = false;
    TransactionAPI.list(filters)
      .then((list) => {
        if (!cancelled) setTransactions(list);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setTransactions([]);
        notification.error({ title: 'Failed to fetch transactions', description: err.message });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters, reloadKey, notification]);

  const changeFilters = (changes: Partial<TransactionFilters>) => {
    setLoading(true);
    setFilters((prev) => ({ ...prev, ...changes }));
  };

  const refresh = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (values: TransactionInput, id?: string) => {
    setActionLoading(true);
    try {
      if (id) {
        await TransactionAPI.update(id, values);
        message.success('Transaction updated');
      } else {
        await TransactionAPI.create(values);
        message.success('Transaction added');
      }
      closeModal();
      refresh();
    } catch (err) {
      notification.error({ title: 'Operation failed', description: (err as Error).message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await TransactionAPI.remove(id);
      message.success('Transaction deleted');
      refresh();
    } catch (err) {
      notification.error({ title: 'Failed to delete transaction', description: (err as Error).message });
    }
  };

  const hasActiveFilters = filters.type !== 'all' || Boolean(filters.category) || Boolean(filters.search);

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={screens.md ? 3 : 4} style={{ margin: 0 }}>
            Transactions
          </Title>
          <Text type="secondary">Track your daily income and expenses</Text>
        </div>
        <Button type="primary" size={screens.md ? 'large' : 'middle'} icon={<PlusOutlined />} onClick={openCreate}>
          {screens.sm ? 'Add entry' : 'Add'}
        </Button>
      </div>

      <Card
        variant="borderless"
        style={{ boxShadow: '0 1px 2px rgba(17, 24, 39, 0.05)' }}
        styles={{ body: { padding: screens.md ? 24 : 16 } }}
      >
        <FilterBar
          filters={filters}
          categories={categories}
          loading={loading}
          onFilterChange={changeFilters}
          onRefresh={refresh}
        />

        <TransactionTable
          transactions={transactions}
          loading={loading}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          onChange={changeFilters}
          onEdit={(item) => {
            setEditingItem(item);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
          onCreate={openCreate}
        />
      </Card>

      <TransactionModal
        open={modalOpen}
        initialData={editingItem}
        categories={categories}
        loading={actionLoading}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
};

const Shell: React.FC = () => {
  const screens = Grid.useBreakpoint();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(() => Boolean(tokenStorage.get()));

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    if (!tokenStorage.get()) return;
    AuthAPI.me()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = async () => {
    try {
      await AuthAPI.logout();
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) return <LoginPage onLogin={setUser} />;

  const gutter = screens.md ? 32 : 16;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          padding: `0 ${gutter}px`,
          height: 64,
          borderBottom: `1px solid ${colors.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ ...CONTAINER, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space size={10} align="center">
            <Logo />
            <Text strong style={{ fontSize: 17 }}>
              Expense Diary
            </Text>
          </Space>

          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 'email',
                  label: <Text type="secondary">{user.email}</Text>,
                  disabled: true,
                },
                { type: 'divider' },
                { key: 'logout', icon: <LogoutOutlined />, label: 'Log out', onClick: handleLogout },
              ],
            }}
          >
            <Button type="text" style={{ height: 40, paddingInline: 8 }}>
              <Space size={8}>
                <Avatar size={30} style={{ background: colors.primary, fontSize: 13 }}>
                  {initials(user.name || user.email)}
                </Avatar>
                {screens.sm && <Text>{user.name || user.email}</Text>}
                <DownOutlined style={{ fontSize: 10, color: colors.muted }} />
              </Space>
            </Button>
          </Dropdown>
        </div>
      </Header>

      <Content style={{ padding: `${screens.md ? 32 : 20}px ${gutter}px` }}>
        <div style={CONTAINER}>
          <Dashboard />
        </div>
      </Content>
    </Layout>
  );
};

export const App: React.FC = () => (
  <ConfigProvider theme={theme}>
    <AntdApp>
      <Shell />
    </AntdApp>
  </ConfigProvider>
);

export default App;
