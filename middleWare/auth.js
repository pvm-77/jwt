const jwt = require('jsonwebtoken')

const config = process.env


function verifyToken(req, res, next) {
    const token = req.headers['auth-token'] || req.body.token || req.query.token
    if (!token) return res.status(403).send(' a token is required for authentication')
    try {
        const verified = jwt.verify(token, config.TOKEN_KEY)
        req.user = verified
        next()
    }
    catch (err) {
        res.status(400).send('Invalid Token')
    }


}
module.exports = verifyToken