const blog_db = require("../blog_db")
const bcrypt = require("bcrypt")

exports.register = (req, res) => {
    const query_if_user_exists = (`
        SELECT * 
        FROM Users 
        WHERE email = ? OR username = ?
    `)

    blog_db.query(query_if_user_exists, [req.body.email, req.body.username], (error, data) => {
        if (error) return res.status(404).json(error)
        if (data.length) return res.status(409).json({message: "User already exists !"})

        bcrypt.hash(
            req.body.password,
            10,
            (error, hash) => {
                const query_create_new_user = (`
                    INSERT INTO Users (username, email, password)
                    VALUES (?, ?, ?)
                `)
                blog_db.query(
                    query_create_new_user,
                    [req.body.username, req.body.email, hash],
                    (error, data) => {
                        if (error) return res.status(500).json(error)
                        return res.status(201).json({message: "User created successfully !"})
                    })
            })

    })
}
exports.login = (req, res) => {
    res.status(200).json({message: "Connexion réussie"})
}

exports.logout = (req, res) => {
    res.status(200).json({message: "Déconnexion réussie"})
}