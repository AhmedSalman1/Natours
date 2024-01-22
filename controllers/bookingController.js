const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsyncError(async (req, res, next) => {
    //* 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    //* 2) Create checkout session
    const product = await stripe.products.create({
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
    });

    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: tour.price * 100,
        currency: 'usd',
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${
            req.params.tourId
        }&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourID,
        mode: 'payment',
        line_items: [
            {
                price: price.id,
                quantity: 1,
            },
        ],
    });

    //* 3) Create session as response
    res.status(200).json({ status: 'success', session });
});

exports.createBookingCheckout = catchAsyncError(async (req, res, next) => {
    //! This is only TEMPORARY, because it's UNSECURE: everyone can make booking without paying
    const { tour, user, price } = req.query;
    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
});

exports.ifBooked = catchAsyncError(async (req, res, next) => {
    const booking = await Booking.find({
        user: req.user.id,
        tour: req.body.tour,
    });
    if (booking.length === 0)
        return next(new AppError('You must by this tour to review it', 401));
    next();
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
