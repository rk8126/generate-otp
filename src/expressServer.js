const app = require('./server').app

app.get('/', (req, res) => res.send("Project generate otp is running Succesfully"));
app.use('/user', require('./app/routes/userRoute'))

module.exports.app = app