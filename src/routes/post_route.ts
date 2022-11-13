import express from 'express'
const router = express.Router()
import post from '../controllers/post.js'

//All posts page route
router.get('/', post.getAllPosts)

//Post by id
router.get('/:id', post.getPostById)

//New post page route
router.post('/', post.addNewPost)

//Update post route
router.put('/:id', post.updatePost)

export = router
