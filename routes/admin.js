const express = require('express');
const router = express.Router();
const adminController = require('../controller/admincontroller');
const adminAuth = require('../middleware/adminAuth');

router.get('/login',adminAuth.isLogin ,adminController.Loadlogin);
router.post('/login',adminController.login);
router.get('/dashboard',adminAuth.checkSession,adminController.Loaddashboard);


router.post('/add-user', adminAuth.checkSession, adminController.addUser);
router.post('/edit-user',adminAuth.checkSession,  adminController.editUser);
router.post('/delete-user',adminAuth.checkSession, adminController.deleteUser);
router.get('/logout', adminAuth.checkSession, adminController.logout);


module.exports = router;