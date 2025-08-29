const jwt = require("jsonwebtoken")
require('dotenv').config()

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decodedToken = jwt.verify(token, process.env.KEY_SECRET)
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        return res.status(500).json(error)
    }
}