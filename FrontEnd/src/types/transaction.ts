export type TransactionType = 'income' | 'expense';

export interface Transaction {
  _id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionInput = Pick<Transaction, 'type' | 'category' | 'amount' | 'date' | 'description'>;

export type Categories = Record<TransactionType, string[]>;

export type SortField = 'date' | 'amount' | 'category' | 'type';

export interface TransactionFilters {
  search?: string;
  type: 'all' | TransactionType;
  category?: string;
  sortBy: SortField;
  sortOrder: 'asc' | 'desc';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}
