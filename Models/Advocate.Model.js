const mongoose = require('mongoose')

const AdvocateModel = mongoose.model('advocate', mongoose.Schema({
    user_id: { type: String, required: true },
    zoom_id: String,
    name: { type: String, required: true },
    picture: { type: String, required: true },
    role_title: { type: String, required: true },
    location: { type: String, required: true },
    pricing: { type: Number, required: true },
    total_Earnings: { type: Number, required: true },
    total_worked_hour: { type: Number, required: true },
    short_description: { type: String, required: true },
    long_description: { type: String, required: true },
    short_description: { type: String, required: true },
    total_jobs: { type: Number, default:10},
    fluent_languate: { type: Array, required: true },
    conversational_languate: { type: Array, required: true },
    skills:{type:Array,required:true},
    Education:{type:Array,required:true}
}))

module.exports = AdvocateModel

// {
//     id 
//     advocate_id
    
// }