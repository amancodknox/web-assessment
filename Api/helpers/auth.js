const jwt = require('jsonwebtoken');

const signToken = user =>
  jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  });

const verifyToken = token => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { signToken, verifyToken };
