const mysql = require("mysql2");
require("dotenv").config()

const blog_db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'blog_db',
});

blog_db.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL.');
})

module.exports = blog_db