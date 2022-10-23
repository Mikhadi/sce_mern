const express = require('express')
const router = express.Router()
const post = require('../controllers/post.js')

//All posts page route
router.get('/', post.getAllPosts)

//New post page route
router.post('/', post.addNewPost)

module.exports = router
