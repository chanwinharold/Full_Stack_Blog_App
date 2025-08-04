const blog_db = require("../blog_db")

exports.createPost = (req, res) => {

}

exports.getPost = (req, res) => {

}

exports.getAllPost = (req, res) => {
    const query_select_all_posts = req.query.cat ? (`
        SELECT *
        FROM Posts
        WHERE category = ?
    `) : (`
        SELECT *
        FROM Posts
    `)
    blog_db.query(query_select_all_posts, [req.query.cat], (error, data) => {
        if (error) return res.status(500).json(error)
        return res.status(200).json(data)
    })
}

exports.modifyPost = (req, res) => {

}

exports.deletePost = (req, res) => {

}