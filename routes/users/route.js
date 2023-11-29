const express = require('express');
const router = express.Router();
const signup = require('../../controllers/users/signupcontroller');
const login = require('../../controllers/users/logincontroller');
const passwordreset = require('../../controllers/users/passwordresetcontroller');
const forgotpassword = require('../../controllers/users/forgotpasswordcontroller');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotpassword);
router.post('/reset/:userId', passwordreset);

module.exports = router;
