const mongoose = require('mongoose');

module.exports = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_diary';
  await mongoose.connect(uri);
  console.log(`Connected to MongoDB: ${uri}`);
};
