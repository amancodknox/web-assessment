import React from 'react';
import { Button, Empty, Grid, List, Popconfirm, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { SorterResult, SortOrder } from 'antd/es/table/interface';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { SortField, Transaction, TransactionFilters } from '../types/transaction';
import { categoryColor, formatDate } from '../utils/format';
import { Amount } from './Amount';
import { TypeIcon } from './TypeIcon';

const { Text } = Typography;

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  filters: TransactionFilters;
  hasActiveFilters: boolean;
  onChange: (changes: Partial<TransactionFilters>) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

const Actions: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => (
  <Space size={2} className="tx-actions">
    <Tooltip title="Edit">
      <Button type="text" shape="circle" icon={<EditOutlined />} onClick={onEdit} />
    </Tooltip>
    <Popconfirm
      title="Delete entry"
      description="Are you sure you want to delete this transaction?"
      onConfirm={onDelete}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
      placement="topRight"
    >
      <Tooltip title="Delete">
        <Button type="text" shape="circle" danger icon={<DeleteOutlined />} />
      </Tooltip>
    </Popconfirm>
  </Space>
);

const Details: React.FC<{ record: Transaction }> = ({ record }) => (
  <Space size={12} align="center" style={{ minWidth: 0 }}>
    <TypeIcon type={record.type} />
    <div style={{ minWidth: 0 }}>
      <Text strong ellipsis style={{ display: 'block', maxWidth: 360 }}>
        {record.description || record.category}
      </Text>
      <Text type="secondary" style={{ fontSize: 12, textTransform: 'capitalize' }}>
        {record.type}
      </Text>
    </div>
  </Space>
);

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  filters,
  hasActiveFilters,
  onChange,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const screens = Grid.useBreakpoint();

  const empty = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={hasActiveFilters ? 'No transactions match your filters' : 'No transactions yet'}
      style={{ padding: '32px 0' }}
    >
      {!hasActiveFilters && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Add your first entry
        </Button>
      )}
    </Empty>
  );

  const pagination = {
    defaultPageSize: 10,
    hideOnSinglePage: true,
    showSizeChanger: screens.md,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: screens.md
      ? (count: number, range: [number, number]) => `${range[0]}-${range[1]} of ${count}`
      : undefined,
  };

  if (!screens.md) {
    return (
      <List
        dataSource={transactions}
        loading={loading}
        rowKey="_id"
        locale={{ emptyText: empty }}
        pagination={transactions.length > 10 ? { pageSize: 10, size: 'small', align: 'center' } : false}
        renderItem={(record) => (
          <List.Item style={{ padding: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
              <TypeIcon type={record.type} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text strong ellipsis style={{ display: 'block' }}>
                  {record.description || record.category}
                </Text>
                <Space size={6} wrap>
                  <Tag color={categoryColor(record.category)} bordered={false} style={{ marginInlineEnd: 0 }}>
                    {record.category}
                  </Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatDate(record.date)}
                  </Text>
                </Space>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Amount amount={record.amount} type={record.type} />
                <div>
                  <Actions onEdit={() => onEdit(record)} onDelete={() => onDelete(record._id)} />
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  }

  const sortOrderFor = (field: SortField): SortOrder =>
    filters.sortBy === field ? (filters.sortOrder === 'asc' ? 'ascend' : 'descend') : null;

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => <Details record={record} />,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 160,
      sorter: true,
      sortOrder: sortOrderFor('category'),
      render: (category: string) => (
        <Tag color={categoryColor(category)} bordered={false}>
          {category}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 140,
      sorter: true,
      sortOrder: sortOrderFor('date'),
      render: (date: string) => <Text type="secondary">{formatDate(date)}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right',
      sorter: true,
      sortOrder: sortOrderFor('amount'),
      render: (amount: number, record) => <Amount amount={amount} type={record.type} />,
    },
    {
      key: 'actions',
      width: 96,
      align: 'right',
      render: (_, record) => (
        <Actions onEdit={() => onEdit(record)} onDelete={() => onDelete(record._id)} />
      ),
    },
  ];

  const handleTableChange = (
    _pagination: unknown,
    _filters: unknown,
    sorter: SorterResult<Transaction> | SorterResult<Transaction>[]
  ) => {
    const sort = Array.isArray(sorter) ? sorter[0] : sorter;
    onChange({
      sortBy: sort.order ? (sort.columnKey as SortField) : 'date',
      sortOrder: sort.order === 'ascend' ? 'asc' : 'desc',
    });
  };

  return (
    <Table
      className="tx-table"
      columns={columns}
      dataSource={transactions}
      rowKey="_id"
      loading={loading}
      onChange={handleTableChange}
      locale={{ emptyText: empty }}
      pagination={pagination}
      scroll={{ x: 720 }}
    />
  );
};
