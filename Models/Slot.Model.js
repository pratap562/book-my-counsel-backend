const mongoose = require('slot')

const slot = mongoose.model('user', mongoose.Schema({
    advocate_id: { type: String, required: true },
    client_id: { type: String, required: true },
    date: { type: String, required: true },
    canceled: { type: Boolean, default: false }
}))

module.exports = slot