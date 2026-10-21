import React from 'react';
import { Typography } from 'antd';
import type { TransactionType } from '../types/transaction';
import { colors } from '../theme';
import { formatAmount } from '../utils/format';

export const Amount: React.FC<{ amount: number; type: TransactionType }> = ({ amount, type }) => {
  const isIncome = type === 'income';
  return (
    <Typography.Text
      strong
      style={{ color: isIncome ? colors.income : colors.expense, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
    >
      {isIncome ? '+' : '-'}
      {formatAmount(amount)}
    </Typography.Text>
  );
};
