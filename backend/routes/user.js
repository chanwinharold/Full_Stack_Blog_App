const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/user")
const auth = require("../middlewares/auth")

// FIX: Add validation middleware to routes
router.post("/register",
    userControllers.registerValidation,
    userControllers.register
)

router.post("/login",
    userControllers.loginValidation,
    userControllers.login
)

// FIX: Add logout route to invalidate tokens
router.post("/logout", userControllers.logout)

// FIX: Get current user info (requires auth)
router.get("/me", auth, userControllers.getCurrentUser)

module.exports = router