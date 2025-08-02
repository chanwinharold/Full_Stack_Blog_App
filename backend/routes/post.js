const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const postControllers = require("../controllers/post")

router.post("/post/:id", auth, postControllers.createPost)
router.get("/", auth, postControllers.getAllPost)
router.get("/:id", auth, postControllers.getPost)
router.put("/write", auth, postControllers.modifyPost)
router.delete("/delete", auth, postControllers.deletePost)

module.exports = router