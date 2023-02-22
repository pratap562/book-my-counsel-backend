// const { passportForLogin } = require('../config/google-oauth2')
const { passportForSignup } = require('../../config/google-oauth')
const oauthForSignup = require('express').Router()
const UserModel = require('../../Models/User.Model')
require('dotenv').config()

function mid(req, res, next) {
    console.log(req.url);
    console.log(req.url);
    console.log(req.url);
    console.log(req.url);
    console.log(req.url);
    next()
}
const setIntent = (req, res, next) => {
    req.body.intent = 'signup'
    console.log(req.body.intent, 'set');
    next()
}


oauthForSignup.get('/', mid, setIntent, passportForSignup.authenticate('google', { scope: ['profile', 'email'], callbackURL: 'http://localhost:3200/auth/google/signup/callback' }))

oauthForSignup.get('/callback', setIntent, passportForSignup.authenticate('google', { failureRedirect: '/signup', session: false, callbackURL: 'http://localhost:3200/auth/google/signup/callback' }),
    async function (req, res) {
        //sucessfull authentication, redirect home.
        // let newuser = new UserModel(req.user)
        // await newuser.save()
        console.log(req.user, 'user', req.url, 'request urlllllll')
        let body = { email, name, picture, password } = req.user

        // let data = await fetch(`${process.env.OWN_URL}/user/signup`, {
        //     method: "POST",
        //     body: JSON.stringify(body),
        //     headers: { 'Content-Type': 'application/json' }
        // })
        // data = await data.json()
        // console.log(data);

        // if(data.err){

        // }
        console.log('hi')
        let userExist = await UserModel.find({ email })
        console.log('hi')
        if (userExist.length >= 1) {
            console.log('user exist dont need signup');
            res.cookie('userExist', true, { maxAge: 20000 });
            return res.redirect(`${process.env.NEXT_URL}/signinsignup`)
        } else {
            let newUser = new UserModel({ name, email, password })
            try {
                await newUser.save()
                res.cookie('isSignup', 1, { maxAge: 20000 });
                console.log('work done')
                return res.redirect(`${process.env.NEXT_URL}/signinsignup`)
            } catch (err) {
                console.log('err: ', err);
            }
        }





        // res.cookie('isSignup', 1, { maxAge: 20000, httpOnly: true, secure: true });
        // res.redirect(`${process.env.NEXT_URL}/signinsignup`)
        // // res.send({ "msg": "hello" })
    })


module.exports = oauthForSignup
