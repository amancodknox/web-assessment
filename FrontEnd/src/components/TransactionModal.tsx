import React, { useEffect } from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Modal, Radio, Row, Select, Space } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import type { Categories, Transaction, TransactionInput, TransactionType } from '../types/transaction';
import { toDay } from '../utils/format';
import { TypeIcon } from './TypeIcon';

interface TransactionModalProps {
  open: boolean;
  initialData: Transaction | null;
  categories: Categories;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: TransactionInput, id?: string) => Promise<void>;
}

interface FormValues {
  type: TransactionType;
  amount: number;
  category?: string;
  date: Dayjs;
  description?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  initialData,
  categories,
  loading,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<FormValues>();
  const type = Form.useWatch('type', form) || 'expense';

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      form.setFieldsValue({
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        date: toDay(initialData.date),
        description: initialData.description || '',
      });
    } else {
      form.resetFields();
    }
  }, [open, initialData, form]);

  const handleValuesChange = (changed: Partial<FormValues>) => {
    if (changed.type && !categories[changed.type].includes(form.getFieldValue('category'))) {
      form.setFieldValue('category', undefined);
    }
  };

  const handleFinish = async (values: FormValues) => {
    await onSubmit(
      {
        type: values.type,
        amount: values.amount,
        category: values.category as string,
        date: values.date.format('YYYY-MM-DD'),
        description: values.description?.trim() || '',
      },
      initialData?._id
    );
  };

  return (
    <Modal
      title={initialData ? 'Edit transaction' : 'New transaction'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={initialData ? 'Save changes' : 'Add transaction'}
      confirmLoading={loading}
      width={520}
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
        initialValues={{ type: 'expense', date: dayjs() }}
        style={{ marginTop: 20 }}
      >
        <Form.Item name="type" rules={[{ required: true, message: 'Please select type' }]}>
          <Radio.Group style={{ width: '100%', display: 'flex', gap: 12 }}>
            {(['expense', 'income'] as TransactionType[]).map((option) => (
              <Radio.Button key={option} value={option} className="type-option" style={{ borderRadius: 8 }}>
                <Space size={8}>
                  <TypeIcon type={option} size={24} />
                  <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{option}</span>
                </Space>
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: 'Please enter amount' },
            { type: 'number', min: 0.01, message: 'Amount must be greater than 0' },
          ]}
        >
          <InputNumber
            prefix="$"
            precision={2}
            min={0.01}
            style={{ width: '100%' }}
            placeholder="0.00"
            autoFocus
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select
                showSearch
                placeholder="Select category"
                options={categories[type].map((c) => ({ label: c, value: c }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select date' }]}>
              <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" allowClear={false} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description" style={{ marginBottom: 36 }}>
          <Input.TextArea rows={3} placeholder="What was it for?" maxLength={500} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};
