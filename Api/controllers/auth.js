const User = require('../models/user');
const { signToken } = require('../helpers/auth');
const { Unauthorized } = require('../helpers/response');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) throw Unauthorized('Invalid email or password');
  if (!user.active) throw Unauthorized('Account is inactive');

  const token = signToken(user);
  user.accessToken = token;
  user.lastLogin = new Date();
  await user.save();

  res.json({ token, user: user.toPublic() });
};

exports.me = async (req, res) => {
  res.json(req.user.toPublic());
};

exports.logout = async (req, res) => {
  req.user.accessToken = '';
  await req.user.save();
  res.json({ message: 'Logged out' });
};
