const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
app = express()
// const { httpserver, app } = require('./config/httpConnection')
const user = require('./routes/user.route')
const router = require('./routes/Advocates/advocate.route')

const connection = require('./config/db')
const authenticate = require('./middleware/Authentication/auth')
const autharize = require('./middleware/Authorization/autharize')
const oauthForSignup = require('./routes/Oauth/oauth.signup.route')
const oauthForLogin = require('./routes/Oauth/oauth.login.route')
const passwordforgot = require('./routes/passwordforgot.route')
const verify = require('./routes/verify.route')
const slot = require('./routes/Slotes/slote')
const paymentROuter = require('./routes/paymentgateway.route')

const swaggerUI = require("swagger-ui-express");
const fileUpload = require("express-fileupload");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./api.yaml");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
app.use(fileUpload());

require('dotenv').config()
const port = 3200



// let users = { 0: [] }
// app.use(cors({
//     origin: 'https://elaborate-tiramisu-ba3b1a.netlify.app',
//     credentials: true
// }))
// app.use(cors())
app.use(cors({
    origin: 'https://checkout.stripe.com',
    credentials: true
}));
// httpserver.use(cors)
app.use(express.json())
app.use(cookieParser())
app.use('/auth/google/login', oauthForLogin)
app.use('/auth/google/signup', oauthForSignup)
app.use('/passwordforgot', passwordforgot)
app.use('/slotes', slot)
app.use('/advocate/verify', verify)

app.get('/', (req, res) => {
    res.send({ 'msg': 'welocme' })
})
app.use('/user', user)
app.use('/lawyer', router)
app.use(`/create-checkout-session`, paymentROuter)
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