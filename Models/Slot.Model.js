const mongoose = require('slot')

const UserModel = mongoose.model('user', mongoose.Schema({
    advocate_id: { type: String, required: true },
    client_id: { type: String, required: true },
    canceled: { type: Boolean, default: false }
}))

module.exports = slot