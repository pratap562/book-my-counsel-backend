// const passportForSignup = require('passport');
const passportForLogin = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { v4: uuid4 } = require('uuid')
require('dotenv').config()

const mid = (req, res, next) => {
    console.log(req.body);
    console.log("mid");
    console.log("mid");
    console.log("mid");
    console.log("mid");
    console.log("mid");
    console.log("mid");
    console.log("mid");
    // next()
}
passportForLogin.use(mid)
passportForLogin.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: `${process.env.NEXT_URL}/api/auth/google/login/callback`,
    passReqToCallback: true
},
    async function (req, accessToken, refreshToken, profile, cb) {
        /*
         use the profile info (mainly profile id) to check if the user is registerd in ur db
         If yes select the user and pass him to the done callback
         If not create the user and then select him and pass to callback
        */
        console.log('login pe hai laaaaaaaaaaaaa')
        console.log(req.url, 'haa');
        console.log(req.path, 'path');
        console.log(req.body.intent, 'path');
        let data = {
            email: profile._json.email,
            name: profile._json.name,
            picture: profile._json.picture,
            password: uuid4()
        }

        console.log(data)
        return cb(null, data);
    }
));

module.exports = { passportForLogin }