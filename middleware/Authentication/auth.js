const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = (req, res, next) => {
    console.log('authentication');
    console.log(req.headers, 'lkj');
    const token = req.cookies?.token || req.headers.authorization.split(' ')[1]
    console.log(token, token);
    if (token) {
        jwt.verify(token, process.env.SECRETKEY, function (err, decoded) {
            // while err
            if (err) {
                console.log('errorrr');
                return res.status(401).json({ 'msg': 'plg login' })
            }
            // decoded
            req.role = decoded.role
            req.username = decoded.username
            next()
        })
    } else {
        res.status(401).json({ 'msg': 'plg login again' })
    }
}

module.exports = authenticate