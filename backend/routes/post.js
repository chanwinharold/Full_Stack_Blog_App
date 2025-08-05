const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const postControllers = require("../controllers/post")

router.post("/", auth, postControllers.createPost)
router.get("/", auth, postControllers.getAllPost)
router.get("/:id", auth, postControllers.getPost)
router.put("/:id", auth, postControllers.modifyPost)
router.delete("/:id", auth, postControllers.deletePost)
router.post("/:id", auth, postControllers.addImage )

module.exports = router