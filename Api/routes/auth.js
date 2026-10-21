const express = require('express');
const controller = require('../controllers/auth');
const isAuth = require('../middlewares/isAuth');
const validator = require('../middlewares/validator');

const router = express.Router();

router.post('/login', validator('login'), controller.login);
router.get('/me', isAuth, controller.me);
router.post('/logout', isAuth, controller.logout);

module.exports = router;
