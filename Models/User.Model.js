const mongoose = require('mongoose')

const UserModel = mongoose.model('user', mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    stage: { type: Number, default: 1 }
}))

module.exports = UserModel
