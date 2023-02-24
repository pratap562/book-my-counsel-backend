const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = (req, res, next) => {
    console.log('authentication');
    console.log(req.headers, 'lkj');

    const token = req.cookies?.token
    console.log(req.cookies, 'll')
    console.log(token, token);
    if (token) {
        jwt.verify(token, process.env.SECRETKEY, function (err, decoded) {
            // while err
            if (err) {
                console.log('errorrr');
                return res.status(401).json({ 'msg': 'plg login' })
            }
            // decoded
            // req.role = decoded.role
            console.log(decoded, 'decoded');
            req.body.user_id = decoded.id
            next()
        })
    } else {
        res.status(401).json({ 'msg': 'plg login again' })
    }
}

module.exports = authenticate