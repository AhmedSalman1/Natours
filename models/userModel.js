const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'You must add name!'],
        },
        email: {
            type: String,
            required: [true, 'You must add email!'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        photo: {
            type: String,
            default: 'default.jpg',
        },
        role: {
            type: String,
            enum: ['user', 'guide', 'lead-guide', 'admin'],
            default: 'user',
        },
        password: {
            type: String,
            // required: [true, 'Please provide a password'],
            minlength: 8,
            select: false,
            validate: {
                validator: function (val) {
                    return this.googleId || val;
                },
            },
        },
        googleId: {
            type: String,
            unique: true,
            select: false,
        },
        passwordConfirm: {
            type: String,
            // required: [true, 'Please confirm your password'],
            required: function () {
                return !this.googleId;
            },
            validate: {
                //! This only works on CREATE and SAVE!
                validator: function (el) {
                    return el === this.password;
                },
                message: 'Password are not the same!',
            },
        },
        passwordChangedAt: {
            type: Date,
            select: false,
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

userSchema.pre('save', async function (next) {
    //* Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //* Hach the password with cost of 12
    //! remember to comment when (delete-import) DB
    this.password = await bcrypt.hash(this.password, 12);

    //! Delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

/*                  Instance Methods                  */
//* Check if the password is correct
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

//* Check if the password was changed after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );

        // console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }

    return false; //* password not changed
};

//* Generate the random reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
