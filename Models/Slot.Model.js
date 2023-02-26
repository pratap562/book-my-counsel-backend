const mongoose = require('mongoose')

const slotModel = mongoose.model('slot', mongoose.Schema({
    advocate_id: { type: String, required: true },
    client_id: { type: String, required: true },
    date: { type: String, required: true },
    format_date: Number,
    time: Number,
    canceled: { type: Boolean, default: false }
}))

module.exports = slotModel