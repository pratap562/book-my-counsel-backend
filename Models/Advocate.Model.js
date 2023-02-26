const mongoose = require('mongoose')

const educationSchema = new mongoose.Schema({
    university: {
      type: String,
      required: true
    },
    course: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    }
  });
  
const AdvocateModel = mongoose.model('advocate', mongoose.Schema({
    user_id: { type: String, required: true },
    zoom_id: String,
    name: { type: String, required: true },
    picture: { type: String, required: true },
    document: { type: String, required: true },
    role_title: { type: String, required: true },
    location: { type: String, required: true },
    pricing: { type: Number, required: true },
    total_worked_hour: { type: Number, default:10 },
    short_description: { type: String, required: true },
    long_description: { type: String, required: true },
    total_jobs: { type: Number, default:10},
    fluent_language: { type: Array, required: true },
    conversational_language: { type: Array, required: true },
    skills:{type:Array,required:true},
    education:{type:[educationSchema],required:true},
    stage:{type:Number,default:2}
}))

module.exports = AdvocateModel

// {
//     id 
//     advocate_id
    
// }