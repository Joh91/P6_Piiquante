/* -- Importations -- */
const express = require('express');
const password = require("../middleware/password")
const userCtrl = require('../controllers/user');

const router = express.Router();
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;