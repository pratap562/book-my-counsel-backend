const mongoose = require('mongoose')

const zoomDetail = mongoose.model('zoomDetail', mongoose.Schema({
    advocate_id: { type: String, required: true },
    zoom_id: { type: String, required: true },
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    token_exp: { type: Number, required: true }
}))

module.exports = UserModel