const mongoose = require('mongoose')

const timeSchema = new mongoose.Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
    count: { type: Number, required: true },
});



const EventModel = mongoose.model('event', mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    Description: { type: String, required: true },
    eventLink: { type: Sting, required: true },
    eventColor: { type: Sting, required: true },
    eventDateRange: { type: Sting, required: true },
    eventDuration: { type: Number, required: true },
    timing: { type: Object, required: true }
}))

module.exports = { EventModel, timeSchema }
