/**
 * Data Migration Script: MySQL → PostgreSQL
 * 
 * WARNING: This script migrates existing data from MySQL to PostgreSQL.
 * Run this ONLY after the PostgreSQL schema is in place.
 * 
 * Prerequisites:
 *   1. PostgreSQL schema.sql must be executed first
 *   2. Both MySQL and PostgreSQL must be accessible
 *   3. Environment variables for both databases set
 * 
 * Usage:
 *   node migrate_data.js
 */

require("dotenv").config()
const mysql = require("mysql2/promise")
const { Pool } = require("pg")

// MySQL connection (source)
const mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB || 'blog_db',
    port: process.env.MYSQL_PORT || 3306
})

// PostgreSQL connection (target)
const pgPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'blog_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
})

// Helper to run PostgreSQL query
const pgQuery = async (text, params) => {
    const result = await pgPool.query(text, params)
    return result
}

// Migrate Users table
const migrateUsers = async () => {
    console.log('Migrating Users...')
    
    const [users] = await mysqlPool.query('SELECT * FROM Users')
    console.log(`  Found ${users.length} users in MySQL`)
    
    for (const user of users) {
        await pgQuery(
            `INSERT INTO Users (id, username, email, password, img, role)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO NOTHING`,
            [user.id, user.username, user.email, user.password, user.img, user.role || 'user']
        )
    }
    
    console.log('  Users migrated')
}

// Migrate Posts table
const migratePosts = async () => {
    console.log('Migrating Posts...')
    
    const [posts] = await mysqlPool.query('SELECT * FROM Posts')
    console.log(`  Found ${posts.length} posts in MySQL`)
    
    for (const post of posts) {
        await pgQuery(
            `INSERT INTO Posts (id, title, description, category, img, date, userId)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (id) DO NOTHING`,
            [
                post.id,
                post.title,
                post.description,
                post.category,
                post.img,
                post.date,
                post.userId
            ]
        )
    }
    
    console.log('  Posts migrated')
}

// Reset PostgreSQL sequences after insert
const resetSequences = async () => {
    console.log('Resetting PostgreSQL sequences...')
    
    try {
        // Get max IDs and reset sequences
        const userResult = await pgQuery("SELECT MAX(id) as max_id FROM Users")
        if (userResult.rows[0]?.max_id) {
            await pgQuery(`SELECT setval('users_id_seq', $1)`, [userResult.rows[0].max_id])
            console.log('  Users sequence reset to:', userResult.rows[0].max_id)
        }
        
        const postResult = await pgQuery("SELECT MAX(id) as max_id FROM Posts")
        if (postResult.rows[0]?.max_id) {
            await pgQuery(`SELECT setval('posts_id_seq', $1)`, [postResult.rows[0].max_id])
            console.log('  Posts sequence reset to:', postResult.rows[0].max_id)
        }
    } catch (error) {
        console.error('  Sequence reset warning:', error.message)
    }
}

// Main migration function
const migrate = async () => {
    console.log('\n=== MySQL → PostgreSQL Migration ===\n')
    console.log('Source (MySQL):', process.env.MYSQL_HOST || 'localhost')
    console.log('Target (PostgreSQL):', process.env.DB_HOST || 'localhost', '\n')
    
    try {
        // Test connections
        console.log('Testing connections...')
        const [mysqlTest] = await mysqlPool.query('SELECT 1')
        console.log('  MySQL: connected')
        
        const pgTest = await pgPool.query('SELECT 1')
        console.log('  PostgreSQL: connected\n')
        
        // Migrate in order (respect foreign keys)
        await migrateUsers()
        await migratePosts()
        await resetSequences()
        
        // Verify counts
        console.log('\nVerification:')
        const usersCount = await pgPool.query('SELECT COUNT(*) as count FROM Users')
        console.log(`  Users in PostgreSQL: ${usersCount.rows[0].count}`)
        
        const postsCount = await pgPool.query('SELECT COUNT(*) as count FROM Posts')
        console.log(`  Posts in PostgreSQL: ${postsCount.rows[0].count}`)
        
        console.log('\n=== Migration Complete ===\n')
        
    } catch (error) {
        console.error('\nMigration failed:', error.message)
        process.exit(1)
    } finally {
        // Close connections
        await mysqlPool.end()
        await pgPool.end()
    }
}

// Run if called directly
if (require.main === module) {
    migrate()
}

module.exports = { migrate }