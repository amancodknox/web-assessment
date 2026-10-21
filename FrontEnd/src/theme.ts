import type { ThemeConfig } from 'antd';

export const colors = {
  primary: '#4f46e5',
  income: '#16a34a',
  incomeBg: '#dcfce7',
  expense: '#dc2626',
  expenseBg: '#fee2e2',
  text: '#111827',
  muted: '#6b7280',
  border: '#e5e7eb',
  page: '#f5f6fa',
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorSuccess: colors.income,
    colorError: colors.expense,
    colorText: colors.text,
    colorTextSecondary: colors.muted,
    colorBorderSecondary: colors.border,
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
  },
  components: {
    Card: { borderRadiusLG: 12 },
    Table: { headerBg: '#fafafa', rowHoverBg: '#f9fafb', bodySortBg: 'transparent', headerSortActiveBg: '#f3f4f6' },
    Layout: { headerBg: '#ffffff', bodyBg: colors.page },
  },
};
