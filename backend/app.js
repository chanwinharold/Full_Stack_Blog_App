const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")

const userRoutes = require("./routes/user")
const postRoutes = require("./routes/post")

dotenv.config()

app.use(cors())
app.use(express.json())

app.use("/auth", userRoutes)
app.use("/", postRoutes)
app.use((req, res) => {
    res.status(404).json({message: "Route Introuvable !!!"})
})

module.exports = app