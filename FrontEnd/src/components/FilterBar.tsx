import React from 'react';
import { Button, Col, Grid, Input, Row, Segmented, Select, Tooltip } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { Categories, SortField, TransactionFilters, TransactionType } from '../types/transaction';

interface FilterBarProps {
  filters: TransactionFilters;
  categories: Categories;
  loading: boolean;
  onFilterChange: (changes: Partial<TransactionFilters>) => void;
  onRefresh: () => void;
}

const SORT_OPTIONS = [
  { label: 'Newest first', value: 'date:desc' },
  { label: 'Oldest first', value: 'date:asc' },
  { label: 'Highest amount', value: 'amount:desc' },
  { label: 'Lowest amount', value: 'amount:asc' },
  { label: 'Category A-Z', value: 'category:asc' },
];

const categoriesFor = (categories: Categories, type: TransactionFilters['type']) =>
  type === 'all' ? [...new Set([...categories.income, ...categories.expense])] : categories[type];

export const FilterBar: React.FC<FilterBarProps> = ({ filters, categories, loading, onFilterChange, onRefresh }) => {
  const screens = Grid.useBreakpoint();
  const categoryOptions = categoriesFor(categories, filters.type).map((c) => ({ label: c, value: c }));

  const handleTypeChange = (type: TransactionFilters['type']) => {
    const keepCategory = filters.category && categoriesFor(categories, type).includes(filters.category);
    onFilterChange({ type, category: keepCategory ? filters.category : undefined });
  };

  return (
    <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 16 }}>
      <Col xs={24} md={9} lg={8}>
        <Input
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          placeholder="Search description"
          allowClear
          defaultValue={filters.search}
          onPressEnter={(e) => onFilterChange({ search: e.currentTarget.value })}
          onChange={(e) => {
            if (!e.target.value) onFilterChange({ search: '' });
          }}
          onBlur={(e) => {
            if (e.target.value !== (filters.search || '')) onFilterChange({ search: e.target.value });
          }}
        />
      </Col>

      <Col xs={24} sm={12} md={7} lg={6}>
        <Segmented
          block
          value={filters.type}
          onChange={(value) => handleTypeChange(value as 'all' | TransactionType)}
          options={[
            { label: 'All', value: 'all' },
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
          ]}
        />
      </Col>

      <Col xs={12} sm={6} md={6} lg={5}>
        <Select
          value={filters.category ?? ''}
          onChange={(category) => onFilterChange({ category: category || undefined })}
          options={[{ label: 'All categories', value: '' }, ...categoryOptions]}
          virtual={false}
          style={{ width: '100%' }}
        />
      </Col>

      {!screens.md && (
        <Col xs={12} sm={6}>
          <Select
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={(value) => {
              const [sortBy, sortOrder] = value.split(':') as [SortField, 'asc' | 'desc'];
              onFilterChange({ sortBy, sortOrder });
            }}
            options={SORT_OPTIONS}
            style={{ width: '100%' }}
          />
        </Col>
      )}

      {screens.md && (
        <Col flex="none" style={{ marginLeft: 'auto' }}>
          <Tooltip title="Refresh">
            <Button icon={<ReloadOutlined spin={loading} />} onClick={onRefresh} />
          </Tooltip>
        </Col>
      )}
    </Row>
  );
};
