const mongoose = require('mongoose');
const { transactionTypes } = require('../config');

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: transactionTypes, required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    description: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

schema.index({ user: 1, date: -1 });

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', schema);
