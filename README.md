# generate-otp node js project with mongodb
# user-details
{
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    otp: String,
    otpExpiration: Number,
    isDeleted: {type: Boolean, default: false},
}