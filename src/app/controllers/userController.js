const userService = require('../services/userService')
const { isValidEmail } = require('../utils/validation')

module.exports = {
    registerUser: async (req, res) => {
        try{
            let {fullName, email} = req.body
            fullName = fullName?.trim()
            email = email?.trim()
            if(!fullName){
                return res.status(400).send({ status: false, message: "fullName is required" })
            }
            if(!email || !isValidEmail(email)){
                return res.status(400).send({ status: false, message: "email is required and should be a valid email" })
            }
            const {status, code, data, message} = await userService.registerUser(fullName, email)
            res.status(code).send({status, ...(data && {data}), ...(message && {message})})
        }catch(error){
            console.error(`Error while register user with this email-${req.body?.email}`, error.message)
            res.status(500).send({ status: false, message: error.message })
        }
    },
    generateOtp: async (req, res) => {
        try{
            let {email} = req.body
            email = email?.trim()
            if(!email || !isValidEmail(email)){
                return res.status(400).send({ status: false, message: "email is required and should be a valid email" })
            }
            const {status, code, message} = await userService.generateOtp(email)
            res.status(code).send({status, message})
        }catch(error){
            console.error(`Error while generating otp with this email-${req.body?.email}`, error.message)
            res.status(500).send({ status: false, message: error.message })
        }
    },
    login: async (req, res) => {
        try{
            let {email, otp} = req.body
            email = email?.trim()
            otp = otp?.trim()
            if(!email || !isValidEmail(email)){
                return res.status(400).send({ status: false, message: "email is required and should be a valid email" })
            }
            if(!otp){
                return res.status(400).send({ status: false, message: "otp is required" })
            }
            const {status, code, token, message} = await userService.login(email, otp)
            res.status(code).send({status, ...(token && {token}), ...(message && {message})})
        }catch(error){
            console.error(`Error while login user with this userId-${req.body?.userId} and otp-${req.body?.otp}`, error.message)
            res.status(500).send({ status: false, message: error.message })
        }
    }
}