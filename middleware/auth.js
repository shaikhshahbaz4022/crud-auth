
const jwt = require("jsonwebtoken")
let secretKey = "keytoken"


function auth(req, res, next) {
    const token = req.headers.authorization.split(" ")[1] // bearer token
    if (token) {
        jwt.verify(token, secretKey, function (err, decode) {
            if (decode) {
                req.body.userID= decode.userID
                // console.log(decode)
                next()
            } else {
                res.status(404).send({ 'msg': "invalid user from middleware auth" })
            }
        })
    } else {
        res.status(404).send({ 'msg': "login first" })

    }


}

module.exports = auth