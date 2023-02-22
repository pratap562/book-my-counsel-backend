const mongoose = require('mongoose')

const UserModel = mongoose.model('user', mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    verified: { type: Boolean, default: false }
}))

module.exports = UserModel
