const express = require('express')
const router = express.Router()
const post = require('../controllers/post.js')

//All posts page route
router.get('/', post.getAllPosts)

//Post by id
router.get('/:id', post.getPostById)

//New post page route
router.post('/', post.addNewPost)

//Update post route
router.put('/:id', post.updatePost)

module.exports = router
