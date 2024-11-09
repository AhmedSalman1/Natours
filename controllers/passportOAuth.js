const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    });
                }

                const token = jwt.sign(
                    { id: user._id },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES_IN,
                    },
                );

                return done(null, token);
                // return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        },
    ),
);

const oAuthenticated = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

const oCallback = passport.authenticate('google', { session: false });

module.exports = { oAuthenticated, oCallback };
