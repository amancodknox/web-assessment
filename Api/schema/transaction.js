const { transactionTypes, categories, sortableFields } = require('../config');

const allCategories = [...new Set([...categories.income, ...categories.expense])];

const fields = {
  type: { type: 'string', enum: transactionTypes },
  amount: { type: 'number', exclusiveMinimum: 0, maximum: 1e12, multipleOf: 0.01 },
  category: { type: 'string', enum: allCategories },
  date: { type: 'string', anyOf: [{ format: 'date' }, { format: 'date-time' }] },
  description: { type: 'string', maxLength: 500 }
};

module.exports = {
  createTransaction: {
    type: 'object',
    properties: fields,
    required: ['type', 'amount', 'category', 'date'],
    additionalProperties: false
  },
  updateTransaction: {
    type: 'object',
    properties: fields,
    minProperties: 1,
    additionalProperties: false
  },
  listTransactions: {
    type: 'object',
    properties: {
      type: fields.type,
      category: fields.category,
      search: { type: 'string', maxLength: 100 },
      sortBy: { type: 'string', enum: sortableFields, default: 'date' },
      sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
    },
    additionalProperties: false
  }
};
