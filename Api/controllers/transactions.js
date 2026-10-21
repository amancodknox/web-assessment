const Transaction = require('../models/transaction');
const { categories } = require('../config');
const { NotFound, ValidationError } = require('../helpers/response');

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isCategoryValidForType = (type, category) => categories[type].includes(category);

const findOwned = async (id, user) => {
  const transaction = await Transaction.findOne({ _id: id, user: user._id });
  if (!transaction) throw NotFound('Transaction not found');
  return transaction;
};

exports.list = async (req, res) => {
  const { type, category, search, sortBy, sortOrder } = req.query;

  const query = { user: req.user._id };
  if (type) query.type = type;
  if (category) query.category = category;
  if (search) query.description = new RegExp(escapeRegex(search), 'i');

  const list = await Transaction.find(query)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1, _id: -1 })
    .lean();

  res.json(list);
};

exports.categories = async (req, res) => {
  res.json(categories);
};

exports.getById = async (req, res) => {
  res.json(await findOwned(req.params.id, req.user));
};

exports.create = async (req, res) => {
  if (!isCategoryValidForType(req.body.type, req.body.category)) {
    throw ValidationError('category is not valid for the selected type');
  }

  const transaction = await new Transaction({ ...req.body, user: req.user._id }).save();
  res.status(201).json(transaction);
};

exports.update = async (req, res) => {
  const transaction = await findOwned(req.params.id, req.user);

  const type = req.body.type || transaction.type;
  const category = req.body.category || transaction.category;
  if (!isCategoryValidForType(type, category)) {
    throw ValidationError('category is not valid for the selected type');
  }

  transaction.set(req.body);
  await transaction.save();
  res.json(transaction);
};

exports.remove = async (req, res) => {
  const transaction = await findOwned(req.params.id, req.user);
  await transaction.deleteOne();
  res.json({ _id: transaction._id });
};
