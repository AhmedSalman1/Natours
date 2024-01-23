const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const AppError = require('../utils/appError');
// const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
    '/',
    // bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewsController.getOverview,
);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/signup', viewsController.getSignupForm);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.get('/forgot-password', viewsController.getForgotPassword);
router.get('/reset-password/:token', viewsController.getResetPassword);

router.post(
    '/submit-user-data',
    authController.protect,
    viewsController.updateUserData,
);

router.all('*', (req, res, next) => {
    next(new AppError(`Page not found!`, 404));
});

module.exports = router;
