const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const { query } = require("../config/db")

// FIX: Input validation middleware for registration
exports.registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be 3-30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
]

exports.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const { username, email, password } = req.body

    // PostgreSQL: Uses $1, $2 placeholders
    const queryIfUserExists = `
        SELECT *
        FROM Users
        WHERE email = $1 OR username = $2
    `

    try {
        const result = await query(queryIfUserExists, [email, username])
        if (result.rows.length > 0) {
            return res.status(409).json({ message: "User already exists" })
        }

        // FIX: Use bcrypt with saltRounds >= 12
        const saltRounds = 12
        const hash = await bcrypt.hash(password, saltRounds)

        // PostgreSQL: Use RETURNING id to get the inserted user's ID
        const queryCreateNewUser = `
            INSERT INTO Users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username
        `
        await query(queryCreateNewUser, [username, email, hash])

        return res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        console.error('Register error:', error.message)
        return res.status(500).json({ message: "Database error" })
    }
}

// FIX: Input validation for login
exports.loginValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
]

exports.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const { username, password } = req.body

    // PostgreSQL: Uses $1 placeholder
    const queryIfUserExists = `
        SELECT *
        FROM Users
        WHERE username = $1
    `

    try {
        const result = await query(queryIfUserExists, [username])
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const user = result.rows[0]
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // FIX: Generate JWT with shorter expiry (15 min) + include role
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role || 'user'
            },
            process.env.KEY_SECRET,
            {
                expiresIn: '15m',
                algorithm: 'HS256'
            }
        )

        // FIX: Send token as httpOnly, Secure, SameSite=Strict cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        })

        res.status(200).json({
            username: user.username,
            role: user.role || 'user'
        })
    } catch (error) {
        console.error('Login error:', error.message)
        return res.status(500).json({ message: "Database error" })
    }
}

// FIX: Logout - invalidate token by adding to blocklist
exports.logout = (req, res) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]
    if (token) {
        require("../middlewares/auth").addToBlocklist(token)
    }
    res.clearCookie('token')
    res.status(200).json({ message: "Logged out successfully" })
}

// FIX: Get current user info
exports.getCurrentUser = (req, res) => {
    res.status(200).json({
        username: req.auth.username,
        role: req.auth.role
    })
}