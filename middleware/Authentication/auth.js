const jwt = require('jsonwebtoken')
const AdvocateModel = require('../../Models/Advocate.Model')
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
            req.role = decoded.role
            req.body.user_id = decoded.id
            console.log(req.role, 'roll')
            console.log(decoded, 'decoded');
            if (req.role == 'advocate') {
                console.log('yes')
                findAdvocateId = async () => {
                    let res = await AdvocateModel.findOne({ user_id: decoded.id })
                    console.log(res)
                    req.body.advocateId = res._id.toString()
                    next()
                }
                findAdvocateId()
            } else {
                console.log('no');
                next()
            }
        })
    } else {
        res.status(401).json({ 'msg': 'plg login again' })
    }
}

module.exports = authenticate