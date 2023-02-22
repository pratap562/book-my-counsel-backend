const express = require('express')
const { zoomIntegration } = require('./routes/zoom/zoomIntegration.route')
require('dotenv').config()
const cookieparser = require('cookie-parser')
const port = process.env.PORT || 3200
const oauthForLogin = require('./routes/Oauth/oauth.login.route')
const oauthForSignup = require('./routes/Oauth/oauth.signup.route')
const connection = require('./config/db')
const user = require('./routes/user.route')
const app = express()
app.use(cookieparser())

// app.use(cors())
app.use(express.json())

app.use('/user', user)
// google Oauth
app.use('/auth/google/login', oauthForLogin)
app.use('/auth/google/signup', oauthForSignup)

app.use('/auth/zoom/integration/callback', zoomIntegration)

app.get('/', (req, res) => {
    res.send({ 'msg': 'welcome' })
})

app.listen(port, async () => {
    try {
        await connection
        console.log(`your db is connected to port ${port}`);
    } catch (err) {
        console.log('err', err)
    }
})