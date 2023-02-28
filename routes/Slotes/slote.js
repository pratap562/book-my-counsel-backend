const express = require('express');
const slot = express.Router();
const autharize = require('../../middleware/Authorization/autharize')
const authenticate = require('../../middleware/Authentication/auth')
const slotModel = require('../../Models/Slot.Model');
const UserModel = require('../../Models/User.Model');
const sendEmail = require('../Email/emailTemplate')

const getTimeAndDate = () => {
    const currentDate = new Date();
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric', };
    const timeOptions = { hour: '2-digit', hour12: false };

    let formattedDate = currentDate.toLocaleDateString('en-US', dateOptions)
        .replace(',', '')
    let ar = formattedDate.split(' ')
    formattedDate = ar[1] + '-' + ar[0] + '-' + ar[2]
    // const formattedTime = currentDate.toLocaleTimeString('en-US', timeOptions);

    const formattedTime = currentDate.toLocaleTimeString('en-US', timeOptions);
    return {
        formattedDate, formattedTime
    }
}
const formatDate = (dateString) => {
    // Convert the date string to a Date object
    const date = new Date(dateString);

    // Extract the year, month, and day from the Date object
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Pad the month and day with zeros if they are less than 10
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    // Combine the year, month, and day into a string in the format YYYYMMDD
    const formattedDate = `${year}${formattedMonth}${formattedDay}`;

    return (+formattedDate);
}



const makeDataPerfectForFrontend = (arr) => {

    let lastDate = new Date();
    function getNextDate(days) {
        const currentDate = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        if (days === 0) {
            lastDate = currentDate;
        } else {
            lastDate.setTime(lastDate.getTime() + oneDay);
        }
        const year = lastDate.getFullYear();
        const month = lastDate.toLocaleString('default', { month: 'short' });
        const day = lastDate.getDate();
        let res = `${day.toString().padStart(2, '0')}-${month}-${year}`;
        return res
    }
    let weekArray = new Array(7)
    for (let i = 0; i < 7; i++) {
        weekArray[i] = getNextDate(i)
    }
    let resultArray = new Array(7)
    let count = 0
    let dataInd = 0
    for (let i = 0; i < 7; i++) {
        if (arr[dataInd] == undefined) {
            resultArray[i] = []
            continue
        }
        if (arr[dataInd][0].date == weekArray[count]) {
            resultArray[i] = arr[dataInd]
            dataInd++
            count++
        } else {
            resultArray[i] = []
            count++
        }
        // console.log(resultArray, weekArray, dataInd, count, i)
    }
    // console.log(resultArray, weekArray)
    return resultArray
}

slot.post('/add', authenticate, autharize(['advocate']), async (req, res) => {
    console.log(formatDate('08-Feb-1002'))
    console.log(formatDate('08-May-2024'))
    console.log(formatDate('8-Feb-2024'))
    console.log(formatDate('08-Feb-2028'))
    console.log(formatDate('08-Jan-2024'))
    console.log(req.body, 'bodyyyyyyy')
    const slots = req.body.slots
    if (req.body.advocateId) {
        slots.forEach((slt, i) => {
            slt.advocate_id = req.body.advocateId
            slt.client_id = 'undefined'
            slt.format_date = formatDate(slt.date)
            slt.time = + slt.time.split(':')[0]
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




// user will ask for this
slot.get('/:advocateId', async (req, res) => {
    const { advocateId } = req.params
    console.log(advocateId, 'aid')

    let { formattedDate, formattedTime } = getTimeAndDate()
    formattedDate = formatDate(formattedDate)
    console.log(formattedDate, formattedTime)
    try {
        let result = await slotModel.find({
            format_date: {
                $gt: formattedDate
            },
            advocate_id: advocateId,
            client_id: 'undefined'
        }).sort({ format_date: 1, time: 1 })
        console.log(result, 'rsul')
        if (result.length == 0) {
            return res.send({ "data": [] })
        }

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
        let resultArray = makeDataPerfectForFrontend(weekSlots)
        // console.log(weekSlots)
        res.status(200).send({ "data": resultArray })
    } catch (err) {
        res.status(500).send({ "err": "try after some time" })
        console.log(err)
    }
})

// one advocate will ask for ther slots
slot.get('/my/all', authenticate, autharize(['advocate']), async (req, res) => {
    const { advocateId } = req.body

    let { formattedDate, formattedTime } = getTimeAndDate()
    formattedDate = formatDate(formattedDate)
    console.log(formattedDate, formattedTime, 'timessss')
    console.log(formattedDate, formattedTime)
    try {
        let result = await slotModel.find({
            $and: [
                { advocate_id: advocateId }, // check if advocateId exists
                { format_date: { $gt: formattedDate } }, // check if the date is greater than the current date
                {
                    $or: [
                        { format_date: formattedDate, time: { $gt: formattedTime } }, // check if the time is greater than the current time if the date is the same
                        { format_date: { $gt: formattedDate } } // check if the date is greater than the current date if the time is in the past
                    ]
                }
            ]
        }).sort({ format_date: 1, time: 1 })
        console.log(result, 'result')

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




slot.patch('/book/:slotId', authenticate, async (req, res) => {
    let { user_id } = req.body
    let { slotId } = req.params
    try {
        let data = await slotModel.updateOne({ _id: slotId }, { $set: { client_id: user_id } })
        res.status(201).send({ "msg": "slot booked sucessfull" })
    } catch (err) {
        res.status(500).send({ "err": "try after some time" })
    }
    // { heading, paragraph, link, subject, linkTag, email }
    try {
        let data = await slotModel.findOne({ _id: slotId })
        console.log(data, 'data')
        let advocate_id = data.advocate_id
        let client_id = data.client_id

        let clientData = await UserModel.findOne({ _id: client_id })
        console.log(clientData)

        let heading = 'Slot Booked Sucessfully'
        let paragraph = `hey ${clientData.name} booked a slot with our advocates `
        let linkTag = 'Live Map'
        let link = 'https://googlemap.com'
        let email = clientData.email
        console.log(email, 'em')
        await sendEmail({ heading, paragraph, linkTag, link, email })
    } catch (err) {
        console.log(err, 'err')
    }

})

module.exports = slot