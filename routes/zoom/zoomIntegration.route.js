const zoomIntegration = require('express').Router()
require('dotenv').config()
const clientId = process.env.ZOOM_CLIENTID;
const clientSecret = process.env.ZOOM_CLIENTSECRET;
const redirectUri = process.env.ZOOM_REDIRECTURI;
const tokenUrl = 'https://zoom.us/oauth/token';

// const requestBody = {
//     'grant_type': 'authorization_code',
//     'code': code,
//     'redirect_uri': redirectUri
// }
zoomIntegration.get('/', (req, res) => {
    console.log(req.query.code);
    // console.log(req.params);
    console.log(req.query.state, 'sdf')
    const code = req.query.code

    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'authorization_code');
    requestBody.append('code', code);
    requestBody.append('redirect_uri', redirectUri);
    console.log(requestBody.toString(), 'lll')

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Basic RXlsUVBxVUZRRnVaSk01c2Q3MXlrdzpLbVcxa2RzS0lYaGJCZ21Oc2dqZDBhUDlZcWpJcG5KZA==`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: requestBody.toString()
    };

    async function fetchData() {
        try {
            const response = await fetch(tokenUrl, requestOptions);
            data = await response.json();
            // Do something with the data
            console.log(data);
            // send to frontend
            // res.cookie('myCookie', 'hello world');
            console.log(req.cookies, 'llllll')
            res.send()
            // res.redirect('https://google.com')
        } catch (err) {
            console.log('err', err);
            res.send({ 'error': 'please try after some time' }).status(500)
        }
    }

    fetchData();
    // res.send()
})

module.exports = { zoomIntegration }