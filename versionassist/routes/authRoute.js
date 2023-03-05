const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/auth/google',authController.auth_google);
router.get( '/auth/google/callback', authController.auth_google_callback);
router.get('/logout', authController.logout);
router.get('/auth/google/failure', authController.auth_google_failure);

module.exports = router;