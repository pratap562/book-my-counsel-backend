const { passportForLogin } = require('../../config/google-oauth2')
const oauthForLogin = require('express').Router()
const UserModel = require('../../Models/User.Model')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const setIntent = (req, res, next) => {
    req.body.intent = 'login'
    console.log(req.body.intent, 'set');
    next()
}

oauthForLogin.get('/', setIntent, passportForLogin.authenticate('google', { scope: ['profile', 'email'], callbackURL: `${process.env.NEXT_URL}/api/auth/google/login/callback` }), (req, res, next) => { console.log(req.body, 'xxxxxxxxxxxxxxxxxxxx'); next(); })

oauthForLogin.get('/callback', setIntent, passportForLogin.authenticate('google', { failureRedirect: '/login', session: false, callbackURL: `${process.env.NEXT_URL}/api/auth/google/login/callback` }),
    async function (req, res) {
        //sucessfull authentication, redirect home.
        // let newuser = new UserModel(req.user)
        // await newuser.save()
        console.log('login')
        console.log(req.user, 'user', req.url)
        let body = { email, name, picture, password } = req.user

        let userExist = await UserModel.find({ email })
        console.log(userExist);
        if (userExist.length >= 1) {
            let stage = userExist[0].stage
            // res.cookie('isSignup', 1, { maxAge: 20000, httpOnly: true, secure: true });

            let token = jwt.sign({ email: userExist[0].email, id: userExist[0]._id.toString(), role: userExist[0].role }, process.env.SECRETKEY, { expiresIn: 60 * 60 })
            let refresh_token = jwt.sign({ email: userExist[0].email, id: userExist[0]._id.toString(), role: userExist[0].role }, process.env.REFRESHKEY, { expiresIn: 180 * 180 })

            // res.cookie('justLogdin', true, { maxAge: 1000 * 60 * 60 });
            res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
            res.cookie('refresh_token', refresh_token, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
            // res.cookie('detail', { role: userExist[0].role, name: userExist[0].name })
            res.cookie('detail', `${userExist[0].role}-${userExist[0].name}`)

            // send them to choose role page
            if (stage == 1) {
                return res.redirect(`${process.env.NEXT_URL}/signinsignup/role`)
            } else if (stage == 2) {
                return res.redirect(`${process.env.NEXT_URL}/advocate/notveryfied`)
            } else if (stage == 3) {
                return res.redirect(`${process.env.NEXT_URL}/advocate/dashboard`)
            }

            // return res.redirect(`${process.env.NEXT_URL}signinsignup/role`))
        } else {
            console.log('oyeee');
            res.cookie('userExist', false, { maxAge: 200000000 })
            return res.redirect(`${process.env.NEXT_URL}/signinsignup?#`)
        }



        // res.cookie('isSignup', 1, { maxAge: 20000, httpOnly: true, secure: true });
        // res.redirect(`${process.env.NEXT_URL}/signinsignup`)
        // res.send({ "msg": "hello" })
    })



module.exports = oauthForLogin