const {EMAIL_REGEX} = require('./const')

const isValidEmail = (email)=> {
    return EMAIL_REGEX.test(email)
}

module.exports = {
    isValidEmail
}