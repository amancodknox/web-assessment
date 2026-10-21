const express = require('express');
const controller = require('../controllers/transactions');
const isAuth = require('../middlewares/isAuth');
const validator = require('../middlewares/validator');

const router = express.Router();

router.use(isAuth);

router
  .route('/')
  .get(validator({ query: 'listTransactions' }), controller.list)
  .post(validator('createTransaction'), controller.create);

router.get('/categories', controller.categories);

router
  .route('/:id')
  .get(validator({ params: 'idParams' }), controller.getById)
  .put(validator({ params: 'idParams', body: 'updateTransaction' }), controller.update)
  .delete(validator({ params: 'idParams' }), controller.remove);

module.exports = router;
