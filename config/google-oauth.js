const passportForSignup = require('passport');
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
    next()
}
passportForSignup.use(mid)

passportForSignup.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: `${process.env.NEXT_URL}/api/auth/google/signup/callback`,
    // passReqToCallback: true
},
    async function (req, accessToken, refreshToken, profile, cb) {
        /*
         use the profile info (mainly profile id) to check if the user is registerd in ur db
         If yes select the user and pass him to the done callback
         If not create the user and then select him and pass to callback
        */
        console.log('signup pe hai')
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


module.exports = { passportForSignup }