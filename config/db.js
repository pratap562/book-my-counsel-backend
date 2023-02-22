const mongoose = require('mongoose')
require('dotenv').config()

let connection = mongoose.connect(`${process.env.mongoUrl}/main?retryWrites=true&w=majority`)

module.exports = connection
