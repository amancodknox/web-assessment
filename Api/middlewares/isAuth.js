const User = require('../models/user');
const { verifyToken } = require('../helpers/auth');
const { Unauthorized } = require('../helpers/response');

module.exports = async (req, res, next) => {
  const header = req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(Unauthorized('Missing token'));

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return next(Unauthorized(err.name === 'TokenExpiredError' ? 'Session expired' : 'Invalid token'));
  }

  const user = await User.findOne({ _id: payload.id, active: true });
  if (!user || user.accessToken !== token) return next(Unauthorized('Invalid token'));

  req.user = user;
  req.token = token;
  return next();
};
