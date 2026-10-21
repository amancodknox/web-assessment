module.exports = {
  transactionTypes: ['income', 'expense'],
  categories: {
    income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Refund', 'Other'],
    expense: [
      'Food',
      'Groceries',
      'Transport',
      'Rent',
      'Utilities',
      'Shopping',
      'Entertainment',
      'Health',
      'Education',
      'Travel',
      'Bills',
      'Other'
    ]
  },
  sortableFields: ['date', 'amount', 'category', 'type', 'createdAt']
};
