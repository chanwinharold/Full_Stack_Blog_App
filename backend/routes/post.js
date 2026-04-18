const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const postControllers = require("../controllers/post")

// FIX: Add validation middleware to routes and fix auth requirement
router.post("/",
    auth,
    postControllers.createPostValidation,
    postControllers.createPost
)

// Public route - get all posts (no auth needed)
router.get("/", postControllers.getAllPost)

// FIX: getPost requires auth in original but maybe should be public
// Keeping original behavior but adding validation
router.get("/:id", auth, postControllers.getPost)

router.put("/:id",
    auth,
    postControllers.modifyPostValidation,
    postControllers.modifyPost
)

router.delete("/:id", auth, postControllers.deletePost)

module.exports = router