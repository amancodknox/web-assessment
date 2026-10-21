require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const auth = require('./routes/auth');
const transactions = require('./routes/transactions');
const error = require('./middlewares/error');
const { NotFound } = require('./helpers/response');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(helmet());
app.use(compression());
app.use(express.json());

app.use('/auth', auth);
app.use('/transactions', transactions);

app.use((req, res, next) => next(NotFound('Route not found')));
app.use(error);

module.exports = app;
