const jwt = require('jsonwebtoken')
const AdvocateModel = require('../../Models/Advocate.Model')
require('dotenv').config()

const parseCookie = (req) => {
    if (!req.headers.cookie) {
        return { cookie: "" }
    }
    const cookies = req.headers.cookie.split('; ')
    const cookieMap = {}
    cookies.forEach(cookie => {
        const parts = cookie.split('=')
        cookieMap[parts[0]] = parts[1]
    })
    console.log(cookieMap, 'map')
    return cookieMap
}

const authenticate = (req, res, next) => {
    console.log('authentication');
    console.log(req.headers, 'lkj');
    console.log(req.headers.token, 'header token')
    // let cookiMap = parseCookie(req)

    // const token = req.cookies?.token || req.headers.cookies.token || cookieMap.cookies.token || ''
    const token = req.cookies?.token || req.headers.token
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
            req.body.email = decoded.email
            if (req.role == 'advocate') {
                console.log('yes')
                findAdvocateId = async () => {
                    try {
                        let res = await AdvocateModel.findOne({ user_id: decoded.id })
                        console.log(res)
                        req.body.advocateId = res._id.toString()
                        next()
                    } catch (err) {
                        return res.status(500).send({ "msg": "try after some time" })
                    }
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