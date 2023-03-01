const express = require('express')
const bcrypt = require('bcrypt')
const dotevn = require('dotenv')
const jwt = require('jsonwebtoken')
const generateotp = require('../middleware/Authentication/generateotp')


const user = express.Router()
const UserModel = require('../Models/User.Model')
const redisConnection = require('../config/redis')
const authenticate = require('../middleware/Authentication/auth')
const AdvocateModel = require('../Models/Advocate.Model')
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
    console.log('pasword hashing', password)
    bcrypt.hash(password, 2, async function (err, hash) {
        console.log(hash, 'hash')
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
    console.log(userExist, password, 'h')

    bcrypt.compare(password, userExist[0].password, function (err, result) {
        // result == false
        console.log(err);
        console.log(result);
        if (!result) {
            console.log('err:', err)
            return res.status(401).json({ 'err': 'bad credentials' })
        }
        // result == true
        console.log(userExist[0]._id, 'iiiii');
        console.log(userExist[0]._id.toString(), 'iiiii');
        let token = jwt.sign({ email, id: userExist[0]._id.toString(), role: userExist[0].role }, process.env.SECRETKEY, { expiresIn: 60 * 60 })
        let refresh_token = jwt.sign({ email, role: userExist[0].role }, process.env.REFRESHKEY, { expiresIn: 180 * 180 })
        console.log(token)
        console.log('hell')
        console.log(refresh_token, 'ref');
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.cookie('token', token, { httpOnly: true })
        res.cookie('refresh_token', refresh_token, { httpOnly: true })
        // res.cookie('detail', {role:userExist[0].role,name:userExist[0].name})
        res.cookie('detail', `${userExist[0].role}-${userExist[0].name}`)

        let stage = userExist[0].stage
        if (stage == 1) {
            console.log(1)
            return res.send({ redirect_uri: `/signinsignup/role` })
        } else if (stage == 2) {
            console.log(2)
            return res.send({ redirect_uri: `/advocate/notveryfied` })
        } else if (stage == 3) {
            console.log(3)
            return res.send({ redirect_uri: `/advocate/dashboard` })
        }
        // return res.send({ 'msg': 'signin sucessfull', token, refresh_token })
    });
})


user.get('/updatejwt', authenticate, async (req, res) => {
    console.log('ooeebb')
    const { email } = req.body

    let userExist = await UserModel.find({ email })
    let asprAdvocateDetail = await AdvocateModel.find({ user_id: req.body.user_id })
    console.log(asprAdvocateDetail, 'ii')
    if (asprAdvocateDetail.length == 0) {
        return res.status(422).json({ "msg": "varification fail" })
    }
    // if (userExist.length == 0) {
    //     return res.status(404).json({ 'err': "user don't exist" })
    // }
    console.log(req.cookies);
    console.log(req.cookies.issignup)
    let token = jwt.sign({ email, id: userExist[0]._id.toString(), role: userExist[0].role }, process.env.SECRETKEY, { expiresIn: 60 * 60 })
    let refresh_token = jwt.sign({ email, role: userExist[0].role }, process.env.REFRESHKEY, { expiresIn: 180 * 180 })
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.cookie('token', token, { httpOnly: true })
    res.cookie('refresh_token', refresh_token, { httpOnly: true })
    res.cookie('role', userExist[0].role)

    console.log(token, 'token')
    res.setHeader
    let stage = userExist[0].stage
    if (stage == 1) {
        console.log(1)
        return res.send({ token, refresh_token, redirect_uri: `/signinsignup/role` })
    } else if (stage == 2) {
        console.log(2)
        return res.send({ token, refresh_token, redirect_uri: `/advocate/notveryfied` })
    } else if (stage == 3) {
        console.log(3)
        return res.send({ token, refresh_token, "msg": "verifyed sucessfully" })
    }
})

user.get('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, maxAge: -1 })
    res.cookie('refresh_token', '', { httpOnly: true, maxAge: -1 })
    res.cookie('role', '', { maxAge: -1 })
    res.cookie('detail', '', { maxAge: -1 })
    res.send({ 'msg': "done" })
})

module.exports = user