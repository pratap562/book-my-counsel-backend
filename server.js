const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
app = express()
// const { httpserver, app } = require('./config/httpConnection')
const user = require('./routes/user.route')
const advrouter = require('./routes/advocate.route')
const connection = require('./config/db')
const authenticate = require('./middleware/Authentication/auth')
const autharize = require('./middleware/Authorization/autharize')
const oauthForSignup = require('./routes/Oauth/oauth.signup.route')
const oauthForLogin = require('./routes/Oauth/oauth.login.route')
const passwordforgot = require('./routes/passwordforgot.route')
require('dotenv').config()
const port = 3200



// let users = { 0: [] }
// app.use(cors({
//     origin: 'https://elaborate-tiramisu-ba3b1a.netlify.app',
//     credentials: true
// }))
// app.use(cors())
app.use(cors({
    origin: process.env.NEXT_URL,
    credentials: true
}));
// httpserver.use(cors)
app.use(express.json())
app.use(cookieParser())
app.use('/auth/google/login', oauthForLogin)
app.use('/auth/google/signup', oauthForSignup)
app.use('/passwordforgot', passwordforgot)

app.get('/', (req, res) => {
    res.send({ 'msg': 'welocme' })
})
app.use('/user', user)
app.use('/lawyer', advrouter)
// app.use('/chat',)

app.get('/islogdin', authenticate, (req, res) => {
    res.send({ 'msg': 'logdin' })
})

app.get('/reports', authenticate, (req, res) => {
    res.send({ 'data': 'reports' })
})


app.get('/alldata', authenticate, autharize(['admin']), (req, res) => {
    res.send({ 'data': 'all-data' })
})


app.listen(port, async () => {
    try {
        await connection
        console.log(`your db is connected to port ${port}`);
        // runsocket()
    } catch (err) {
        console.log('err on connecting db:', err);
    }
})