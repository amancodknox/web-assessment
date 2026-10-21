require('dotenv').config();

const app = require('./app');
const connect = require('./db/connect');
const seed = require('./db/seed');

const port = process.env.PORT || 4000;

connect()
  .then(seed)
  .then(() => {
    app.listen(port, () => console.log(`API running on port ${port}`));
  })
  .catch(err => {
    console.error('Failed to start API:', err.message);
    process.exit(1);
  });
