const express = require('express');
const slot = express.Router();
const autharize = require('../../middleware/Authorization/autharize')
const authenticate = require('../../middleware/Authentication/auth')
const slotModel = require('../../models/Slot.Model')

// const slot = mongoose.model('user', mongoose.Schema({
//     advocate_id: { type: String, required: true },
//     client_id: { type: String, required: true },
//     date: { type: String, required: true },
//     time:{type:String,required:true},
//     canceled: { type: Boolean, default: false }
// }))

slot.post('/add', authenticate, autharize(['advocate']), async (req, res) => {
    console.log(req.body)
    const slots = req.body.slots
    if (req.body.advocateId) {
        slots.forEach((slt, i) => {
            slt.advocate_id = req.body.advocateId
            slt.client_id = 'undefined'
            delete slt.truth;
        })
        console.log(slots)
        let result = await slotModel.insertMany(slots)
        console.log(result)
        return res.status(201).send({ "msg": "sucessfully created your slots" })
    } else {
        return res.status(500).send({ "err": "try after some time" })

    }
    // first
})

const currentDate = new Date();
const dateOptions = { day: '2-digit', month: 'short', year: 'numeric', };
const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };

formattedDate = currentDate.toLocaleDateString('en-US', dateOptions)
    .replace(',', '')
let ar = formattedDate.split(' ')
formattedDate = ar[1] + '-' + ar[0] + '-' + ar[2]
// const formattedTime = currentDate.toLocaleTimeString('en-US', timeOptions);

const formattedTime = currentDate.toLocaleTimeString('en-US', timeOptions);


// user will ask for this
slot.get('/:advocateId', async (req, res) => {
    const { advocateId } = req.params
    console.log(advocateId, 'aid')

    console.log(formattedDate, formattedTime)
    try {
        let result = await slotModel.find({
            $and: [
                { advocate_id: advocateId }, // check if advocateId exists
                { client_id: 'undefined' }, // 
                { date: { $gt: formattedDate } }, // check if the date is greater than the current date
                {
                    $or: [
                        { date: formattedDate, time: { $gt: formattedTime } }, // check if the time is greater than the current time if the date is the same
                        { date: { $gt: formattedDate } } // check if the date is greater than the current date if the time is in the past
                    ]
                }
            ]
        }).sort({ date: 1, time: -1 })

        let lastDate = result[0].date || ''
        let weekSlots = []
        let daySlots = []
        result.forEach((doc) => {
            if (doc.date == lastDate) {
                daySlots.push(doc)
            } else {
                if (daySlots.length >= 1) {
                    weekSlots.push(daySlots)
                }
                lastDate = doc.date
                daySlots = [doc]
            }
        })
        if (daySlots.length >= 1) {
            weekSlots.push(daySlots)
        }
        res.status(200).send({ "data": weekSlots })
    } catch (err) {
        res.status(500).send({ "err": "try after some time" })
        console.log(err)
    }
})

// one advocate will ask for ther slots
// slot.get('/my/all', () => { console.log('hiiiiiiiiiiiiiiiiiiiiii') }, authenticate, autharize(['advocate']), async (req, res) => {
//     const { advocateId } = req.body

//     console.log(formattedDate, formattedTime)
//     try {
//         let result = await slotModel.find({
//             $and: [
//                 { advocate_id: advocateId }, // check if advocateId exists
//                 { date: { $gt: formattedDate } }, // check if the date is greater than the current date
//                 {
//                     $or: [
//                         { date: formattedDate, time: { $gt: formattedTime } }, // check if the time is greater than the current time if the date is the same
//                         { date: { $gt: formattedDate } } // check if the date is greater than the current date if the time is in the past
//                     ]
//                 }
//             ]
//         }).sort({ date: 1, time: -1 })

//         let lastDate = result[0].date || ''
//         let weekSlots = []
//         let daySlots = []
//         result.forEach((doc) => {
//             if (doc.date == lastDate) {
//                 daySlots.push(doc)
//             } else {
//                 if (daySlots.length >= 1) {
//                     weekSlots.push(daySlots)
//                 }
//                 lastDate = doc.date
//                 daySlots = [doc]
//             }
//         })
//         if (daySlots.length >= 1) {
//             weekSlots.push(daySlots)
//         }
//         res.status(200).send({ "data": weekSlots })
//     } catch (err) {
//         res.status(500).send({ "err": "try after some time" })
//         console.log(err)
//     }
// })




slot.patch('/book/:slotId', authenticate, async (req, res) => {
    let { user_id } = req.body
    let { slotId } = req.params
    try {
        let data = await slotModel.updateOne({ _id: slotId }, { $set: { client_id: user_id } })
        return res.status(201).send({ "msg": "slot booked sucessfull" })
    } catch (err) {
        return res.status(500).send({ "err": "try after some time" })
    }
})

module.exports = slot