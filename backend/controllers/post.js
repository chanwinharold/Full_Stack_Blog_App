const sanitizeHtml = require("sanitize-html")
const { body, validationResult } = require("express-validator")
const { query } = require("../config/db")

// FIX: HTML sanitizer to prevent Stored XSS
const sanitizeContent = (dirty) => {
    return sanitizeHtml(dirty, {
        allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code'],
        allowedAttributes: {
            'a': ['href', 'target', 'rel']
        },
        allowedSchemes: ['http', 'https']
    })
}

// FIX: Input validation for post creation
exports.createPostValidation = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be 1-200 characters'),
    body('category')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be 1-50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Category can only contain letters, numbers, and underscores')
]

exports.createPost = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const sanitizedDescription = sanitizeContent(req.body.description || '')

    // PostgreSQL: Uses $1-$6 placeholders, removed id from INSERT (SERIAL handles it)
    const queryAddPost = `
        INSERT INTO Posts (title, description, img, date, userId, category)
        VALUES ($1, $2, $3, $4, $5, $6)
    `

    try {
        await query(queryAddPost, [
            req.body.title,
            sanitizedDescription,
            req.body.img,
            req.body.date,
            req.auth.userId,
            req.body.category
        ])

        return res.status(200).json({ message: "Post added" })
    } catch (error) {
        console.error('CreatePost error:', error.message)
        return res.status(500).json({ message: "Database error" })
    }
}

exports.getPost = async (req, res) => {
    // PostgreSQL: $1 placeholder
    const querySelectOnePost = `
        SELECT Posts.id, username, title, description, Posts.img, Users.img AS "userImg", category, date
        FROM Posts
        INNER JOIN Users ON Posts.userId = Users.id
        WHERE Posts.id = $1
    `

    try {
        const result = await query(querySelectOnePost, [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Post not found" })
        }

        const post = result.rows[0]
        post.description = sanitizeContent(post.description)
        return res.status(200).json(post)
    } catch (error) {
        console.error('GetPost error:', error.message)
        return res.status(500).json({ message: "Database error" })
    }
}

exports.getAllPost = async (req, res) => {
    const category = req.query.cat

    // FIX: Validate category parameter
    if (category && !/^[a-zA-Z0-9_]+$/.test(category)) {
        return res.status(400).json({ message: "Invalid category" })
    }

    // PostgreSQL: Case-insensitive category search using ILIKE
    const querySelectAllPosts = category
        ? `SELECT * FROM Posts WHERE category ILIKE $1`
        : `SELECT * FROM Posts`

    try {
        const result = category
            ? await query(querySelectAllPosts, [category])
            : await query(querySelectAllPosts)

        // FIX: PostgreSQL uses result.rows, sanitize all descriptions
        const sanitizedData = result.rows.map(post => ({
            ...post,
            description: sanitizeContent(post.description)
        }))

        return res.status(200).json(sanitizedData)
    } catch (error) {
        console.error('GetAllPost error:', error.message)
        return res.status(500).json({ message: "Database error" })
    }
}

// FIX: Input validation for post update
exports.modifyPostValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be 1-200 characters'),
    body('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Category can only contain letters, numbers, and underscores')
]

exports.modifyPost = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const postId = parseInt(req.params.id)
    if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" })
    }

    const sanitizedDescription = sanitizeContent(req.body.description || '')

    // PostgreSQL: Uses $1-$6 placeholders
    const queryUpdatePost = `
        UPDATE Posts
            SET title = $1, description = $2, img = $3, category = $4
        WHERE id = $5 AND userId = $6
    `

    try {
        const result = await query(queryUpdatePost, [
            req.body.title,
            sanitizedDescription,
            req.body.img,
            req.body.category,
            postId,
            req.auth.userId
        ])

        // PostgreSQL: Use result.rowCount for affected rows
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Post not found or unauthorized" })
        }

        return res.status(200).json({ message: "Post updated" })
    } catch (error) {
        console.error('ModifyPost error:', error.message)
        return res.status(500).json({ message: "Database error" })
    }
}

exports.deletePost = async (req, res) => {
    const postId = parseInt(req.params.id)
    if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" })
    }

    // PostgreSQL: Uses $1, $2 placeholders
    const queryDeletePost = `
        DELETE FROM Posts
            WHERE id = $1 AND userId = $2
    `

    try {
        const result = await query(queryDeletePost, [postId, req.auth.userId])

        // PostgreSQL: Use result.rowCount
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Post not found or unauthorized" })
        }

        return res.status(200).json({ message: "Post deleted" })
    } catch (error) {
        console.error('DeletePost error:', error.message)
        return res.status(500).json({ message: "Database error" })
    }
}