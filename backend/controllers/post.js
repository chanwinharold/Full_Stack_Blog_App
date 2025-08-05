const blog_db = require("../blog_db")

exports.createPost = (req, res) => {

}

exports.getPost = (req, res) => {
    const query_select_one_post = (`
        SELECT username, title, description, Posts.img, Users.img AS userImg, category, date
        FROM Posts
        INNER JOIN Users ON Posts.userId = Users.id
        WHERE Posts.id = ?
    `)
    blog_db.query(query_select_one_post, [req.params.id], (error, data) => {
        if (error) return res.status(500).json(error)
        return res.status(200).json(data[0])
    })
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
    const query_delete_post = (`
        DELETE FROM Posts
            WHERE id = ? AND userId = ?
    `)
    blog_db.query(query_delete_post, [req.params.id, req.auth.userId], (error, data) => {
        if (error) return res.status(403).json({message: "You can only delete your post !"})
        return res.status(200).json({message: 'Suppression du post réussie !'})
    })
}

exports.addImage = (req, res) => {

}