const express = require('express')
const verify = express()
const AdvocateModel = require('../Models/Advocate.Model')
const UserModel = require('../Models/User.Model')
const autharize = require('../middleware/Authorization/autharize')
const authenticate = require('../middleware/Authentication/auth')

verify.get('/pending', authenticate, autharize(['admin']), async (req, res) => {
    // get all the people who need to verify
    let data
    try {
        data = await AdvocateModel.find({ stage: 2 })
        console.log(data)
        return res.status(200).send({ data })
    } catch (err) {
        return res.status(500).send({ "err": "internal server error" })
    }

})

verify.get('/detail/:advocateId', async (req, res) => {
    let data
    const { advocateId } = req.params
    try {
        data = await AdvocateModel.find({ _id: advocateId })
        console.log(data)
        return res.send({ 'data': data })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ 'data': data })
    }
    res.send({ "msg": "hi" })
})


verify.get('/done', authenticate, autharize(['admin']), async (req, res) => {
    // get all the people who are verifyied
    let data
    try {
        data = await AdvocateModel.find({ stage: 3 })
        console.log(data)
        return res.status(200).send({ data })
    } catch (err) {
        return res.status(500).send({ "err": "internal server error" })
    }
})

verify.patch('/:userid', authenticate, autharize(['admin']), async (req, res) => {
    console.log(req.params)
    const userid = req.params.userid
    console.log(userid, 'l');
    let result
    try {
        result = await AdvocateModel.findOneAndUpdate({ user_id: userid }, { stage: 3 })
        console.log(result, 'uper');
    } catch (err) {
        console.log(err);
        return res.status(500).send({ "err": "internal error" })
    }
    try {
        result = await UserModel.findOneAndUpdate({ _id: userid }, { $set: { stage: 3, role: 'advocate' } })
        console.log(result, 'niche')
        return res.status(200).send({ "msg": "sucessful verifieddd" })
    } catch (err) {
        return res.status(500).send({ "err": "internal error" })
    }

})

verify.delete('/:userid', authenticate, autharize(['admin']), async (req, res) => {
    console.log(req.params)
    const userid = req.params.userid
    console.log(userid, 'l');
    let result
    try {
        result = await AdvocateModel.findOneAndDelete({ user_id: userid })
        console.log(result)
        return res.status(200).send({ "msg": "aspire advocate sucessfull removed" })
    } catch (err) {
        return res.status(500).send({ "err": "internal error" })
    }
})

module.exports = verify