const userModel = require('../models/userModel')
const { FIVE_MINUTES, ONE_MINUTE } = require('../utils/const')
const { sendOtp, generateUserOtp } = require('../utils/helper')
module.exports = {
    registerUser: async (fullName, email) => {
        const user = await userModel.findOne({email})
        if(user){
            return {status: false, code: 400, message: "This email already exist"}
        }
        const data = await userModel.create({fullName, email})
        return {status: true, code: 201, data}
    },
    generateOtp: async (email) => {
        const user = await userModel.findOne({email})
        if(!user){
            return {status: false, code: 404, message: "User not found with this email"}
        }
        const currentTime = Date.now();
        const isNewOtpRequired = !user.otpGeneratedTime || currentTime - user.otpGeneratedTime > ONE_MINUTE;
        if (!isNewOtpRequired) {
            return {status: true, code: 429, message: "Please wait for 1 minute before generating a new OTP"}
        }
        user.otp = generateUserOtp();
        user.otpExpiration = currentTime + FIVE_MINUTES;
        user.otpGeneratedTime = Date.now()
        sendOtp(user)    
        return {status: true, code: 200, message: "Otp sent successfully"}
    },
    login: async (email, otp) => {
        const user = await userModel.findOne({email})
        if(!user){
            return {status: false, code: 404, message: "User not found with this email"}
        }
        if (user.usedOtps.includes(otp)) {
            return {status: false, code: 403, message: "OTP has already been used please generate another otp"}
        }
        if (user.blockedUntil && user.blockedUntil > Date.now()) {
            return {status: false, code: 403, message: "User account is blocked please try after some time"}
        }
        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            user.invalidOtpCount += 1;
      
            if (user.invalidOtpCount >= 5) {
              user.blockedUntil = Date.now() + 60 * ONE_MINUTE;
              user.invalidOtpCount = 0;
              await user.save();
              return {status: false, code: 403, message: "User account is blocked for 1 hour"}
            }
            await user.save();
            return {status: false, code: 403, message: "Invalid OTP"}
        }
        user.invalidOtpCount = 0;  
        user.usedOtps.push(otp);
        await user.save();
        return {status: true, code: 200, token: user.generateToken()}
    }
}