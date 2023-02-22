const autharize = (permietedRole) => {
    console.log(permietedRole, 'permit')
    return (req, res, next) => {
        console.log(permietedRole);
        const role = req.role
        if (permietedRole.includes(role)) {
            next()
        } else {
            res.send({ 'err': 'not autharize' })
        }
    }
}

module.exports = autharize