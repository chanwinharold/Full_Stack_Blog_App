const jwt = require("jsonwebtoken")
const { query } = require("../config/db")

// FIX: JWT blocklist for logout invalidation (in production, use Redis)
const tokenBlocklist = new Set()

const verifyToken = (token) => {
    if (tokenBlocklist.has(token)) {
        return null
    }

    // FIX: Explicitly verify with HS256 algorithm
    return jwt.verify(token, process.env.KEY_SECRET, {
        algorithms: ['HS256']
    })
}

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ message: "Authentication required" })
        }

        const decodedToken = verifyToken(token)
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or revoked token" })
        }

        // PostgreSQL: $1 placeholder
        const queryGetUsername = `
            SELECT username, role FROM Users WHERE id = $1
        `

        const result = await query(queryGetUsername, [decodedToken.userId])

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "User not found" })
        }

        req.auth = {
            userId: decodedToken.userId,
            role: result.rows[0].role || 'user',
            username: result.rows[0].username
        }
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" })
        }
        console.error('Auth middleware error:', error.message)
        return res.status(500).json({ message: "Authentication failed" })
    }
}

// Export blocklist setters for logout handler
module.exports.addToBlocklist = (token) => {
    tokenBlocklist.add(token)
}

module.exports.removeFromBlocklist = (token) => {
    tokenBlocklist.delete(token)
}