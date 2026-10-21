import dayjs from 'dayjs';

export const formatAmount = (amount: number) =>
  `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const toDay = (date: string) => dayjs(date.slice(0, 10));

export const formatDate = (date: string) => toDay(date).format('DD MMM YYYY');

const TAG_COLORS = ['blue', 'purple', 'cyan', 'gold', 'magenta', 'geekblue', 'volcano', 'lime', 'orange', 'green'];

export const categoryColor = (category: string) => {
  const hash = [...category].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[hash % TAG_COLORS.length];
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
