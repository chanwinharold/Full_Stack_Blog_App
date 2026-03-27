const mysql = require("mysql2");

const blog_db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'blog_db',
    port: process.env.DB_PORT || 3306,
});

blog_db.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL.');
})

module.exports = blog_db