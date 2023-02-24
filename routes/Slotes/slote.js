const express = require('express');
const slot = express.Router();
const autharize = require('../../middleware/Authorization/autharize')
const authenticate = require('../../middleware/Authentication/auth')

slot.post('/add', authenticate, autharize(['advocate']), (req, res) => {
    console.log(req.body)
    res.send({ 'msg': 'hello' })
})

module.exports = slot