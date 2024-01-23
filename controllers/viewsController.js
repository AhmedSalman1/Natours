const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

exports.getOverview = catchAsyncError(async (req, res, next) => {
    // * 1) Get tour data from collection
    const tours = await Tour.find();

    // * 2) Build template
    // * 3) Render that template using tour data from 1)

    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});

exports.getTour = catchAsyncError(async (req, res, next) => {
    //* 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    //* 2) Build template
    // * 3) Render that template using data from 1)
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200)
        .set(
            'Content-Security-Policy',
            "connect-src 'self' https://cdnjs.cloudflare.com",
        )
        .render('login', {
            title: 'Log into your account',
        });
};

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign up to get started',
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account',
    });
};

exports.getMyTours = catchAsyncError(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours,
    });
});

exports.updateUserData = catchAsyncError(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        },
    );
    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser,
    });
});

exports.getForgotPassword = (req, res) => {
    res.status(200).render('forgotPassword');
};

exports.getResetPassword = (req, res) => {
    res.status(200).render('resetPassword');
};
