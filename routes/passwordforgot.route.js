const passwordforgot = require('express').Router()
const emailTemplate = require('./Email/emailTemplate')
const UserModel = require('../Models/User.Model')
const jwt = require('jsonwebtoken')


passwordforgot.post('/', async (req, res) => {
    const { email } = req.body
    console.log(req.body);
    console.log(email, 'i')
    if (!email || typeof (email) != 'string') {
        return res.status(400).send({ "err": "bad request" })
    }
    let userExist
    try {
        userExist = await UserModel.find({ email })
        console.log(userExist, '1')
    } catch (err) {
        return res.send({ "err:": "please try after some time" }).status(500)
    }
    console.log(userExist, '2')
    if (userExist.length >= 1) {
        const passwordChangeToken = jwt.sign({ email }, process.env.EMAILVARIFICATION, { expiresIn: 60 * 5 })
        const link = `${process.env.EMAILVARIFY_SERVER}/forgotpassword?token=${passwordChangeToken}`
        const heading = 'Reset Your Password'
        const paragraph = 'We have received a request to reset your password please click on the link below to reset your password:'
        const subject = 'Reset Your Password'
        const linkTag = 'Reset'

        emailTemplate({ heading, paragraph, link, subject, email, linkTag })
        return res.redirect('http://localhost:3000/forgotpassword?token=kkkk')
        // return res.send({ 'msg': "sended the link to update your password in your mail" })

    } else {
        return res.send({ "err": "user don't exist" })
    }
})

module.exports = passwordforgot