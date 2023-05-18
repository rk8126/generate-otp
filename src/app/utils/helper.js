const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');

function generateUserOtp() {
    return otpGenerator.generate(6, {
        digits: true,
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
    });
};

function sendOtp(user) {
    // Create a transporter using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SRC_EMAIL,
            pass: process.env.SRC_EMAIL_PASSWORD
        }
    });

    // Prepare the email message
    const mailOptions = {
        from: process.env.SRC_EMAIL,
        to: user.email,
        subject: 'OTP Verification',
        text: `Your OTP: ${user.otp}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error);
        } else {
            console.log('Email sent:', info.response);
            user.save()
        }
    });

}
module.exports = {
    generateUserOtp,
    sendOtp
}