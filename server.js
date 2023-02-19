const express = require('express')
const { zoomIntegration } = require('./routes/zoom/zoomIntegration.route')
require('dotenv').config()
const cookieparser = require('cookie-parser')
const port = 3500
const app = express()
app.use(cookieparser())

// app.use(cors())
app.use(express.json())

app.use('/auth/zoom/integration/callback', zoomIntegration)

app.get('/', (req, res) => {
    res.send({ 'msg': 'welcome' })
})

app.listen(port, () => {
    console.log(`your db is connected to port ${port}`);
})