const mongoose = require('mongoose')

const AdvocateModel = mongoose.model('advocate', mongoose.Schema({
    user_id: { type: String, require: true },
    zoom_id: { type: String, required: true },
    name: { type: String, required: true },
    picture: { type: String, require: true },
    role_title: { type: String, require: true },
    location: { type: String, require: true },
    pricing: { type: Number, require: true },
    total_Earnings: { type: Number, require: true },
    total_worked_hour: { type: Number, require: true },
    short_description: { type: String, require: true },
    long_description: { type: String, require: true },
    short_description: { type: String, require: true },
    fluent_languate: { type: Array, require: true },
    conversational_languate: { type: Array, require: true }
}))

module.exports = AdvocateModel

// {
//     id 
//     advocate_id
    
// }