const express = require('express')
const bcrypt = require('bcrypt')
const dotevn = require('dotenv')
const jwt = require('jsonwebtoken')
const generateotp = require('../middleware/Authentication/generateotp')


const user = express.Router()
const UserModel = require('../Models/User.Model')
const redisConnection = require('../config/redis')
const redis = redisConnection()
dotevn.config()

user.post('/signup', async (req, res) => {
    const { email, password, name } = req.body
    if (!email || !password || !name || typeof (email) != 'string' || typeof (name) != 'string' || typeof (password) != 'string') {
        return res.status(400).json({ err: 'bad request' })
    }
    console.log('pass test');
    console.log(UserModel, 'usw');
    let userExist

    try {
        userExist = await UserModel.find({ email })
    } catch (err) {
        console.log('err', err);
        return res.status(500).json({ err: 'try after some time' })
    }
    console.log(userExist);
    if (userExist.length >= 1) {
        return res.status(403).json({ err: 'user allready exist' })
    }

    // password hashing
    console.log('pasword hashing')
    bcrypt.hash(password, 2, async function (err, hash) {
        if (err) {
            return res.status(500).json({ 'err': 'something went wrong try after some time' });
        }
        try {
            uniqueId = await generateotp(email, hash, name)
        } catch (err) {
            console.log('err while generating otp', err)
        }

        res.send({ 'msg': "sended verify link to email will expire in 10 minute", uniqueId })
        console.log('again')
        console.log('bahut pass hai');
        // res.cookie('uniqueId', uniqueId, { maxAge: 599990 * 1000, domain: 'elaborate-tiramisu-ba3b1a.netlify.app', secure: true, sameSite: 'None' })
        // res.cookie('uniqueId', uniqueId, { expire: new Date() + 12000 },)
    });



})


user.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password || typeof (email) != 'string' || typeof (password) != 'string') {
        return res.status(400).json({ err: 'bad request' })
    }
    // console.log('done')
    let userExist = await UserModel.find({ email })
    if (userExist.length == 0) {
        return res.status(404).json({ 'err': "user don't exist" })
    }
    console.log(userExist[0]);

    bcrypt.compare(password, userExist[0].password, function (err, result) {
        // result == false
        if (err) {
            return res.status(401).json({ 'err': 'bad credentials' })
        }
        // result == true
        let token = jwt.sign({ email, username: userExist.username, role: 'user' }, process.env.SECRETKEY, { expiresIn: 60 })
        let refresh_token = jwt.sign({ email, username: userExist.username }, process.env.REFRESHKEY, { expiresIn: 180 * 180 })
        res.cookie('token', token, { httpOnly: true })
        res.cookie('refresh_token', refresh_token, { httpOnly: true })
        return res.send({ 'msg': 'signin sucessfull', token, refresh_token })
    });
})


user.get('/issignup', async (req, res) => {
    console.log(req.cookies);
    console.log(req.cookies.issignup)
})

module.exports = user