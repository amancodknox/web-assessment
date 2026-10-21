import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import type { TransactionType } from '../types/transaction';
import { colors } from '../theme';

export const TypeIcon: React.FC<{ type: TransactionType; size?: number }> = ({ type, size = 36 }) => {
  const isIncome = type === 'income';
  return (
    <div
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isIncome ? colors.incomeBg : colors.expenseBg,
        color: isIncome ? colors.income : colors.expense,
        fontSize: size * 0.42,
      }}
    >
      {isIncome ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
    </div>
  );
};
