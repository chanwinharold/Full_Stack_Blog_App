const express = require("express")
const app = express()
const cors = require("cors")

const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/public/uploads')
    },
    filename: function (req, file, cb) {
        const extension  = file.originalname.split(".").at(-1)
        cb(null, "image" + Date.now() +  Math.random() + "." + extension)
    }
})
const upload = multer({ storage: storage  })

const userRoutes = require("./routes/user")
const postRoutes = require("./routes/post")

app.use(cors())
app.use(express.json())

app.post('/upload', upload.single('file'), function (req, res, _) {
    const file = req.file
    res.status(200).json(file.filename)
})

app.use("/auth", userRoutes)
app.use("/posts", postRoutes)
app.use((req, res) => {
    res.status(404).json({message: "Route Introuvable !!!"})
})

module.exports = app