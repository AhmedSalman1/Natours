const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//* Serving static files
app.use(express.static(path.join(__dirname, 'public')));

/*                  1) GLOBAL MIDDLEWARES                  */
//* Implement CORS
app.use(cors());
app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

//* Set Security HTTP headers
// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://js.stripe.com',
    'https://m.stripe.network',
    'https://*.cloudflare.com',
];
const styleSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://fonts.googleapis.com/',
    'https://cdnjs.cloudflare.com/',
];
const connectSrcUrls = [
    'https://unpkg.com',
    'https://tile.openstreetmap.org',
    'https://*.stripe.com',
    'https://bundle.js:*',
    'ws://127.0.0.1:*/',
    'https://router.project-osrm.org',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
            baseUri: ["'self'"],
            fontSrc: ["'self'", ...fontSrcUrls],
            scriptSrc: ["'self'", 'https:', 'http:', 'blob:', ...scriptSrcUrls],
            frameSrc: ["'self'", 'https://js.stripe.com'],
            objectSrc: ["'none'"],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:', 'https://m.stripe.network'],
            childSrc: ["'self'", 'blob:'],
            imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
            formAction: ["'self'"],
            connectSrc: [
                "'self'",
                "'unsafe-inline'",
                'data:',
                'blob:',
                ...connectSrcUrls,
            ],
            upgradeInsecureRequests: [],
        },
    }),
);

//! Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//* Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMS: 60 * 60 * 1000, //* number of requests from the same IP in one hour
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//* Before (Body parser) Stripe function that read Body need it as Stream not as JSON
app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    bookingController.webhookCheckout,
);

//! Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//* Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // filter out all dollar signs and dots

//* Data sanitization against XSS(cross-site scripting attacks)
app.use(xss()); // clean any user input from malicious HTML code

//* Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingQuantity',
            'ratingAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    }),
);

app.use(compression());

//! Test middleware
//* Add timestamp
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});

/*                  3) ROUTES                  */
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// ignore all middlewares and jumping to (err handeling middleware)
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
