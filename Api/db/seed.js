const User = require('../models/user');

module.exports = async () => {
  const email = process.env.SEED_USER_EMAIL || 'test@meblabs.com';
  const password = process.env.SEED_USER_PASSWORD || 'testtest';

  const existing = await User.findOne({ email });
  if (existing) return existing;

  const user = await new User({ name: 'Test User', email, password }).save();
  console.log(`Seed user created: ${email}`);
  return user;
};
