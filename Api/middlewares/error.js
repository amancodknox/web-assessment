const { ApiError } = require('../helpers/response');

module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.error, message: err.message, data: err.data });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid JSON body' });
  }

  console.error(err);
  return res.status(500).json({ error: 'SERVER_ERROR', message: 'Internal server error' });
};
