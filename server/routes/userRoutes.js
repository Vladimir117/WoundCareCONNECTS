const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.get('/test', (req, res) => {
    res.send("Test: Success");
});
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/submission', userController.submission);

router.get('/submission-list', userController.submissionList);
router.get('/submission-detail/:id', userController.submissionDetail);

router.post('/contact', userController.contactUs);

module.exports = router;
