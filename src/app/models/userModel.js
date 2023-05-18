const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const { EMAIL_REGEX } = require('../utils/const');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: function (str) {
                return EMAIL_REGEX.test(str);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    otp: String,
    otpExpiration: Number,
    invalidOtpCount: {
        type: Number,
        default: 0
    },
    blockedUntil: Number,
    usedOtps: {
        type: [String],
        default: []
    },
    otpGeneratedTime: Number
}, {timestamps: true});

userSchema.methods.generateToken = function () {
    return jwt.sign({
        userId: this._id,
        email: this.email,
    }, process.env.JWT_PRIVATE_KEY);
}

module.exports = mongoose.model('User', userSchema);