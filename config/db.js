const mongoose = require('mongoose')

let connection = mongoose.connect(`${process.env.mongoUrl}/test?retryWrites=true`)

module.exports = connection
