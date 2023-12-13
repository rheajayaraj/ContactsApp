const express = require('express');
const router = express.Router();
const signup = require('../../controllers/users/signupcontroller');
const login = require('../../controllers/users/logincontroller');
const passwordreset = require('../../controllers/users/passwordresetcontroller');
const forgotpassword = require('../../controllers/users/forgotpasswordcontroller');
const userdetails = require('../../controllers/users/userdetailscontroller');
const userupdate = require('../../controllers/users/updateusercontroller');
const deleteuser = require('../../controllers/users/deleteusercontroller');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotpassword);
router.post('/reset', passwordreset);
router.post('/user', userdetails);
router.patch('/userupdate', userupdate);
router.delete('/deleteuser', deleteuser);

module.exports = router;
