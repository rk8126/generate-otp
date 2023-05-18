const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.post('/', userController.registerUser)
router.put('/generate-otp', userController.generateOtp)
router.put('/login', userController.login)

module.exports = router