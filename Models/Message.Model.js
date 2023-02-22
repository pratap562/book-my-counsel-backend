const mongoose = require('mongoose')

const Message = mongoose.model('message', mongoose.Schema({
    text: { type: String, required: true },
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    timestamp: { type: String, required: true }
}))

module.exports = Message